const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const catalogFilePath = path.join(__dirname, "data", "catalog.csv");

// TODO: Implement GET /search/:topic
// This API should read catalog.csv and return books matching the topic.

// TODO: Implement GET /info/:id
// This API should read catalog.csv and return details of one book.

// TODO: Implement PUT /update/:id
// This API should update quantity or price in catalog.csv.

app.get("/", (req, res) => {
    res.json({ service: "Catalog Service", status: "running" });
});

app.listen(PORT, () => {
    console.log(`Catalog service running on port ${PORT}`);
});