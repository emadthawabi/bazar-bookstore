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

// Simple in-memory cache.
// It will be cleared if the frontend container restarts.
const cache = {};

// Round-robin for catalog replicas
function getNextCatalogReplica() {
    const replica = CATALOG_REPLICAS[catalogIndex];
    catalogIndex = (catalogIndex + 1) % CATALOG_REPLICAS.length;
    return replica;
}

// Round-robin for order replicas
function getNextOrderReplica() {
    const replica = ORDER_REPLICAS[orderIndex];
    orderIndex = (orderIndex + 1) % ORDER_REPLICAS.length;
    return replica;
}

app.get("/", (req, res) => {
    res.json({ service: "Frontend Service", status: "running" });
});

// GET /search/:topic
// Search requests are cached because they are read-only.
app.get("/search/:topic", async (req, res) => {
    try {
        const topic = req.params.topic.toLowerCase();
        const cacheKey = `search:${topic}`;

        if (cache[cacheKey]) {
            console.log(`Cache HIT for ${cacheKey}`);
            return res.json(cache[cacheKey]);
        }

        console.log(`Cache MISS for ${cacheKey}`);

        const catalogUrl = getNextCatalogReplica();
        console.log(`Forwarding search request to ${catalogUrl}`);

        const response = await fetch(`${catalogUrl}/search/${topic}`);
        const data = await response.json();

        if (response.ok) {
            cache[cacheKey] = data;
        }

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to catalog service",
            details: error.message
        });
    }
});

// GET /info/:id
// Info requests are cached because they are read-only.
app.get("/info/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cacheKey = `info:${id}`;

        if (cache[cacheKey]) {
            console.log(`Cache HIT for ${cacheKey}`);
            return res.json(cache[cacheKey]);
        }

        console.log(`Cache MISS for ${cacheKey}`);

        const catalogUrl = getNextCatalogReplica();
        console.log(`Forwarding info request to ${catalogUrl}`);

        const response = await fetch(`${catalogUrl}/info/${id}`);
        const data = await response.json();

        if (response.ok) {
            cache[cacheKey] = data;
        }

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to catalog service",
            details: error.message
        });
    }
});

// POST /purchase/:id
// Purchase is a write operation, so it is not cached.
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

// DELETE /cache/:id
// Removes cached info for one book after purchase/update
app.delete("/cache/:id", (req, res) => {
    const id = req.params.id;

    delete cache[`info:${id}`];

    console.log(`Cache invalidated for info:${id}`);

    res.json({
        message: `Cache invalidated for book ${id}`
    });
});

// DELETE /cache/:id
// Removes cached info for one book after purchase/update
app.delete("/cache/:id", (req, res) => {
    const id = req.params.id;

    delete cache[`info:${id}`];

    console.log(`Cache invalidated for info:${id}`);

    res.json({
        message: `Cache invalidated for book ${id}`
    });
});

app.listen(PORT, () => {
    console.log(`Frontend service running on port ${PORT}`);
});