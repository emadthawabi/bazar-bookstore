const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const catalogFilePath = path.join(__dirname, "data", "catalog.csv");

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


// TODO: Implement GET /info/:id
// This API should read catalog.csv and return details of one book.

// TODO: Implement PUT /update/:id
// This API should update quantity or price in catalog.csv.

app.listen(PORT, () => {
    console.log(`Catalog service running on port ${PORT}`);
});