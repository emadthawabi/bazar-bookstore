const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const ordersFilePath = path.join(__dirname, "data", "orders.csv");
const CATALOG_SERVICE_URL = "http://catalog:3001";

// TODO: Implement POST /purchase/:id
// This API should:
// 1. Ask catalog service for book info.
// 2. Check if quantity > 0.
// 3. Ask catalog service to decrease quantity.
// 4. Save the order in orders.csv.
// 5. Return success or error message.

app.get("/", (req, res) => {
    res.json({ service: "Order Service", status: "running" });
});

app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});