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

// TODO: Implement GET /info/:id
// This API should forward the request to catalog service.

// TODO: Implement POST /purchase/:id
// This API should forward the request to order service.

app.get("/", (req, res) => {
    res.json({ service: "Frontend Service", status: "running" });
});

app.listen(PORT, () => {
    console.log(`Frontend service running on port ${PORT}`);
});