# Bazar Bookstore

Distributed online bookstore system built using:

- JavaScript
- Node.js
- Express.js
- Docker
- Docker Compose
- CSV-based storage

The project was implemented as part of a Distributed Systems laboratory project.

---

# Project Overview

Bazar Bookstore is a microservices-based bookstore system composed of multiple independent services communicating through HTTP APIs.

The system supports:

- Book searching
- Viewing book information
- Purchasing books
- Replication
- Load balancing
- Caching
- Cache invalidation
- Replica synchronization

The system uses Docker containers for deployment and Docker Compose for orchestration.

---

# Technologies Used

- Node.js
- Express.js
- Docker
- Docker Compose
- CSV file storage
- Git & GitHub

---

# Project Structure

```text
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
```

---

# System Architecture

## Frontend Service

Port:

```text
3000
```

Responsibilities:

- Receives client requests
- Performs load balancing
- Handles caching
- Invalidates stale cache entries
- Forwards requests to replicas

---

## Catalog Service

Replicas:

```text
catalog1 → port 3001
catalog2 → port 3003
```

Responsibilities:

- Store books
- Handle search requests
- Handle info requests
- Synchronize updates between replicas

CSV files:

```text
catalog1.csv
catalog2.csv
```

---

## Order Service

Replicas:

```text
order1 → port 3002
order2 → port 3004
```

Responsibilities:

- Handle purchase requests
- Save orders
- Update catalog quantity
- Trigger cache invalidation

CSV files:

```text
orders1.csv
orders2.csv
```

---

# Features

## Replication

The project uses replicated catalog and order services:

```text
catalog1 / catalog2
order1 / order2
```

Each replica uses separate CSV storage files.

---

## Load Balancing

Frontend implements round-robin load balancing.

Example:

```text
Request 1 → catalog1
Request 2 → catalog2
Request 3 → catalog1
```

---

## Caching

Frontend caches:

```text
GET /info/:id
GET /search/:topic
```

This improves performance for repeated read requests.

---

## Cache Invalidation

After a purchase operation:

```text
POST /purchase/:id
```

the frontend invalidates stale cached data.

---

## Replica Synchronization

When one catalog replica is updated, the second replica is automatically synchronized.

This keeps:

```text
catalog1.csv
catalog2.csv
```

consistent.

---

# Docker Deployment

The entire system runs using Docker Compose.

---

# Running the Project

## Requirements

Install:

- Docker
- Docker Compose

---

## Start the System

```bash
docker compose up --build -d
```

---

## Stop the System

```bash
docker compose down
```

---

# API Endpoints

## Search Books

```http
GET /search/:topic
```

Example:

```text
http://localhost:3000/search/distributedsystems
```

---

## Book Information

```http
GET /info/:id
```

Example:

```text
http://localhost:3000/info/2
```

---

## Purchase Book

```http
POST /purchase/:id
```

Example:

```bash
curl -X POST http://localhost:3000/purchase/2
```

---

# Ports

| Service | Port |
|---|---|
| Frontend | 3000 |
| Catalog Replica 1 | 3001 |
| Catalog Replica 2 | 3003 |
| Order Replica 1 | 3002 |
| Order Replica 2 | 3004 |

---

# Performance Results

Performance measurements are available in:

```text
docs/performance-results.txt
```

---

# Authors

- Emad Thawabi
- Atout
