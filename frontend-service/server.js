const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CATALOG_SERVICE_URL = "http://catalog:3001";
const ORDER_SERVICE_URL = "http://order:3002";

// TODO: Implement GET /search/:topic
// This API should forward the request to catalog service.

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