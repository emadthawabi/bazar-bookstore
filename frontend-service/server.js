const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CATALOG_SERVICE_URL = "http://catalog:3001";
const ORDER_SERVICE_URL = "http://order:3002";

// GET /search/:topic
// This API forwards the request to catalog service.
app.get("/search/:topic", async (req, res) => {
    try {
        const topic = req.params.topic;

        const response = await fetch(`${CATALOG_SERVICE_URL}/search/${topic}`);
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
// This API forwards the request to catalog service.
app.get("/info/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const response = await fetch(`${CATALOG_SERVICE_URL}/info/${id}`);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Frontend could not connect to catalog service",
            details: error.message
        });
    }
});



app.get("/", (req, res) => {
    res.json({ service: "Frontend Service", status: "running" });
});

// POST /purchase/:id
// Forward purchase request to order service
app.post("/purchase/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const response = await fetch(`${ORDER_SERVICE_URL}/purchase/${id}`, {
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