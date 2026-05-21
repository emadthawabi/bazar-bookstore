Bazar Bookstore

Distributed online bookstore system built using:

JavaScript
Node.js
Express.js
Docker
Docker Compose
CSV-based storage

The project was implemented as part of a Distributed Systems laboratory project.

Project Overview

Bazar Bookstore is a microservices-based bookstore system composed of multiple independent services communicating through HTTP APIs.

The system supports:

Book searching
Viewing book information
Purchasing books
Replication
Load balancing
Caching
Cache invalidation
Replica synchronization

The system uses Docker containers for deployment and Docker Compose for orchestration.

Technologies Used
Node.js
Express.js
Docker
Docker Compose
CSV file storage
Git & GitHub
Project Structure
bazar-bookstore/
│
├── frontend-service/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── catalog-service/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── data/
│       ├── catalog1.csv
│       └── catalog2.csv
│
├── order-service/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── data/
│       ├── orders1.csv
│       └── orders2.csv
│
├── docs/
│   ├── document.pdf
│   ├── output.txt
│   └── performance-results.txt
│
├── docker-compose.yml
├── README.md
└── .gitignore
System Architecture
Frontend Service

Port:

3000

Responsibilities:

Receives client requests
Performs load balancing
Handles caching
Invalidates stale cache entries
Forwards requests to replicas
Catalog Service

Replicas:

catalog1 → port 3001
catalog2 → port 3003

Responsibilities:

Store books
Handle search requests
Handle info requests
Synchronize updates between replicas

CSV files:

catalog1.csv
catalog2.csv
Order Service

Replicas:

order1 → port 3002
order2 → port 3004

Responsibilities:

Handle purchase requests
Save orders
Update catalog quantity
Trigger cache invalidation

CSV files:

orders1.csv
orders2.csv
Features
Book Search

Users can search books by topic.

Example:

GET /search/distributedsystems
Book Information

Users can retrieve detailed information about a book.

Example:

GET /info/2
Purchase Books

Users can purchase books.

Example:

POST /purchase/2
Replication

The project uses replicated catalog and order services:

catalog1 / catalog2
order1 / order2

Each replica uses separate CSV storage files.

Load Balancing

Frontend implements round-robin load balancing.

Example:

Request 1 → catalog1
Request 2 → catalog2
Request 3 → catalog1

The same strategy is used for order replicas.

Caching

Frontend caches:

GET /info/:id
GET /search/:topic

This improves performance for repeated read requests.

Cache Invalidation

After a purchase operation:

POST /purchase/:id

the frontend invalidates stale cached data to ensure updated quantities are returned.

Replica Synchronization

When one catalog replica is updated, the second replica is automatically synchronized.

This keeps:

catalog1.csv
catalog2.csv

consistent.

Docker Deployment

The entire system runs using Docker Compose.

Running the Project
Requirements

Install:

Docker
Docker Compose
Start the System
docker compose up --build -d
Stop the System
docker compose down
API Endpoints
Search Books
GET /search/:topic

Example:

http://localhost:3000/search/distributedsystems
Book Information
GET /info/:id

Example:

http://localhost:3000/info/2
Purchase Book
POST /purchase/:id

Example:

curl -X POST http://localhost:3000/purchase/2
Ports
Service	Port
Frontend	3000
Catalog Replica 1	3001
Catalog Replica 2	3003
Order Replica 1	3002
Order Replica 2	3004
Performance Results

Performance measurements are available in:

docs/performance-results.txt

The experiments show that caching significantly improves repeated read request performance.

Example Workflow
Search Books
GET /search/distributedsystems

Result:

[
  {
    "id": 1,
    "title": "How to get a good grade in DOS in 40 minutes a day"
  },
  {
    "id": 2,
    "title": "RPCs for Noobs"
  }
]
Purchase Book
POST /purchase/2

Result:

{
  "message": "bought book RPCs for Noobs",
  "price": 50
}
Authors
Emad Thawabi
AbdAlruhman Atout
