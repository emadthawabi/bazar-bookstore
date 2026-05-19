const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CATALOG_REPLICAS = [
    "http://catalog1:3001",
    "http://catalog2:3001"
];

const ORDER_REPLICAS = [
    "http://order1:3002",
    "http://order2:3002"
];

let catalogIndex = 0;
let orderIndex = 0;

// Round-robin: choose catalog1, then catalog2, then repeat
function getNextCatalogReplica() {
    const replica = CATALOG_REPLICAS[catalogIndex];
    catalogIndex = (catalogIndex + 1) % CATALOG_REPLICAS.length;
    return replica;
}

// Round-robin: choose order1, then order2, then repeat
function getNextOrderReplica() {
    const replica = ORDER_REPLICAS[orderIndex];
    orderIndex = (orderIndex + 1) % ORDER_REPLICAS.length;
    return replica;
}

app.get("/", (req, res) => {
    res.json({ service: "Frontend Service", status: "running" });
});

// GET /search/:topic
// Forwards search requests to catalog replicas using round-robin
app.get("/search/:topic", async (req, res) => {
    try {
        const topic = req.params.topic;
        const catalogUrl = getNextCatalogReplica();

        console.log(`Forwarding search request to ${catalogUrl}`);

        const response = await fetch(`${catalogUrl}/search/${topic}`);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to catalog service",
            details: error.message
        });
    }
});

// GET /info/:id
// Forwards info requests to catalog replicas using round-robin
app.get("/info/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const catalogUrl = getNextCatalogReplica();

        console.log(`Forwarding info request to ${catalogUrl}`);

        const response = await fetch(`${catalogUrl}/info/${id}`);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to catalog service",
            details: error.message
        });
    }
});

// POST /purchase/:id
// Forwards purchase requests to order replicas using round-robin
app.post("/purchase/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const orderUrl = getNextOrderReplica();

        console.log(`Forwarding purchase request to ${orderUrl}`);

        const response = await fetch(`${orderUrl}/purchase/${id}`, {
            method: "POST"
        });

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to order service",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend service running on port ${PORT}`);
});