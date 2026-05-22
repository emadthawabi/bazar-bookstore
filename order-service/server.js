const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const FRONTEND_SERVICE_URL = process.env.FRONTEND_SERVICE_URL || "http://frontend:3000";
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || "http://catalog1:3001";

const ORDER_SYNC_URL = process.env.ORDER_SYNC_URL || "";

const ordersFileName = process.env.ORDERS_FILE || "orders.csv";
const ordersFilePath = path.join(__dirname, "data", ordersFileName);

// Returns the next order id
function getNextOrderId() {
    const data = fs.readFileSync(ordersFilePath, "utf8").trim();
    const lines = data.split("\n");

    if (lines.length === 1) {
        return 1;
    }

    const lastLine = lines[lines.length - 1];
    const lastOrderId = Number(lastLine.split(",")[0]);

    return lastOrderId + 1;
}

// Saves a new order in this replica CSV file
function saveOrder(itemId, title, price) {
    const orderId = getNextOrderId();
    const date = new Date().toISOString();

    const newOrder = `${orderId},${itemId},${title},${price},${date}\n`;

    fs.appendFileSync(ordersFilePath, newOrder);

    return {
        orderId,
        itemId,
        title,
        price,
        date
    };
}

// Saves an order that came from the other replica
function saveSyncedOrder(order) {
    const newOrder = `${order.orderId},${order.itemId},${order.title},${order.price},${order.date}\n`;

    fs.appendFileSync(ordersFilePath, newOrder);
}

app.get("/", (req, res) => {
    res.json({ service: "Order Service", status: "running" });
});

// POST /purchase/:id
// Buys a book if quantity is available
app.post("/purchase/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Ask catalog service for book info
        const infoResponse = await fetch(`${CATALOG_SERVICE_URL}/info/${id}`);

        if (!infoResponse.ok) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        const book = await infoResponse.json();

        // Check stock
        if (book.quantity <= 0) {
            return res.status(400).json({
                error: "Book is out of stock"
            });
        }

        // Invalidate frontend cache before updating catalog
        await fetch(`${FRONTEND_SERVICE_URL}/cache/${id}`, {
            method: "DELETE"
        });

        // Decrease quantity by 1
        await fetch(`${CATALOG_SERVICE_URL}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantityDelta: -1
            })
        });

        // Save order locally
        const savedOrder = saveOrder(id, book.title, book.price);

        // Sync order to the other order replica
        if (ORDER_SYNC_URL) {
            await fetch(`${ORDER_SYNC_URL}/sync-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(savedOrder)
            });
        }

        res.json({
            message: `bought book ${book.title}`,
            price: book.price
        });

    } catch (error) {
        res.status(500).json({
            error: "Purchase failed",
            details: error.message
        });
    }
});

// POST /sync-order
// Receives an order from the other order replica and saves it
app.post("/sync-order", (req, res) => {
    try {
        saveSyncedOrder(req.body);

        res.json({
            message: "Order synced successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Order sync failed",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});