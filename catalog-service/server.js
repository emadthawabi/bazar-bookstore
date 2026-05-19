const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const catalogFileName = process.env.CATALOG_FILE || "catalog.csv";
const catalogFilePath = path.join(__dirname, "data", catalogFileName);

// This function reads catalog.csv and converts it to an array of book objects
function readCatalog() {
    const data = fs.readFileSync(catalogFilePath, "utf8").trim();

    const lines = data.split("\n");
    const books = [];

    // Start from index 1 because index 0 is the header
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",");

        books.push({
            id: Number(columns[0]),
            title: columns[1],
            topic: columns[2],
            quantity: Number(columns[3]),
            price: Number(columns[4])
        });
    }

    return books;
}

// This function writes the updated books array back to catalog.csv
function writeCatalog(books) {
    let csv = "id,title,topic,quantity,price\n";

    for (const book of books) {
        csv += `${book.id},${book.title},${book.topic},${book.quantity},${book.price}\n`;
    }

    fs.writeFileSync(catalogFilePath, csv);
}

// Test route to check if catalog service is running
app.get("/", (req, res) => {
    res.json({ service: "Catalog Service", status: "running" });
});

// GET /search/:topic
// Example: /search/distributed systems
// Returns all books that belong to the given topic
app.get("/search/:topic", (req, res) => {
    const topic = req.params.topic.toLowerCase();
    const books = readCatalog();

    const result = books
        .filter(book => book.topic.toLowerCase() === topic)
        .map(book => ({
            id: book.id,
            title: book.title
        }));

    res.json(result);
});


// GET /info/:id
// Example: /info/2
// Returns full details of one book
app.get("/info/:id", (req, res) => {
    const id = Number(req.params.id);
    const books = readCatalog();

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    res.json({
        title: book.title,
        quantity: book.quantity,
        price: book.price
    });
});

// PUT /update/:id
// Updates book quantity or price in catalog.csv
app.put("/update/:id", (req, res) => {
    const id = Number(req.params.id);
    const books = readCatalog();

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    // Update price if sent in request body
    if (req.body.price !== undefined) {
        book.price = Number(req.body.price);
    }

    // Update quantity directly if sent
    if (req.body.quantity !== undefined) {
        book.quantity = Number(req.body.quantity);
    }

    // Increase or decrease quantity using quantityDelta
    if (req.body.quantityDelta !== undefined) {
        book.quantity += Number(req.body.quantityDelta);
    }

    if (book.quantity < 0) {
        return res.status(400).json({
            error: "Quantity cannot be negative"
        });
    }

    writeCatalog(books);

    res.json({
        message: "Book updated successfully",
        book: book
    });
});



app.listen(PORT, () => {
    console.log(`Catalog service running on port ${PORT}`);
});