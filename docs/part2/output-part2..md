# Phase 2 Output Logs

## System Startup

```bash
docker compose up --build -d
```

Running containers:

```text
bazar_frontend
bazar_catalog1
bazar_catalog2
bazar_order1
bazar_order2
```

---

## Frontend Load Balancing - Catalog Replicas

```text
bazar_frontend | Forwarding info request to http://catalog1:3001
bazar_frontend | Forwarding info request to http://catalog2:3001
bazar_frontend | Forwarding search request to http://catalog1:3001
bazar_frontend | Forwarding search request to http://catalog2:3001
```

Observation:  
The frontend alternates catalog requests between `catalog1` and `catalog2`.

---

## Frontend Load Balancing - Order Replicas

```text
bazar_frontend | Forwarding purchase request to http://order1:3002
bazar_frontend | Forwarding purchase request to http://order2:3002
```

Observation:  
Purchase requests are distributed between `order1` and `order2`.

---

## Search Request

Request:

```text
GET http://localhost:3000/search/distributedsystems
```

Returned Result:

```json
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
```

---

## Info Request

Request:

```text
GET http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 3,
  "price": 50
}
```

---

## Frontend Cache Miss

```text
bazar_frontend | Cache MISS for info:2
bazar_frontend | Forwarding info request to http://catalog1:3001
```

Observation:  
The first request was not found in cache, so the frontend forwarded it to a catalog replica.

---

## Frontend Cache Hit

```text
bazar_frontend | Cache HIT for info:2
```

Observation:  
The repeated request was served directly from frontend memory cache.

---

## Purchase Request

Command:

```bash
curl -X POST http://localhost:3000/purchase/2
```

Returned Result:

```json
{
  "message": "bought book RPCs for Noobs",
  "price": 50
}
```

Logs:

```text
bazar_frontend | Forwarding purchase request to http://order1:3002
bazar_frontend | Cache invalidated for info:2
```

---

## Cache Invalidation

```text
bazar_frontend | Cache invalidated for info:2
```

Observation:  
After purchase, the frontend removes the cached value for book `2`.

---

## Cache Miss After Invalidation

Request:

```text
GET http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 1,
  "price": 50
}
```

Logs:

```text
bazar_frontend | Cache MISS for info:2
bazar_frontend | Forwarding info request to http://catalog1:3001
```

Observation:  
After invalidation, the frontend fetched fresh data instead of returning stale cached data.

---

## Catalog Replica Synchronization

Request:

```text
GET http://localhost:3001/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 4,
  "price": 50
}
```

Request:

```text
GET http://localhost:3003/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 4,
  "price": 50
}
```

Observation:  
Both catalog replicas show the same quantity after purchase, so synchronization works.

---

## Out of Stock Test

After repeated purchases:

```bash
curl -X POST http://localhost:3000/purchase/2
```

Returned Result:

```json
{
  "error": "Book is out of stock"
}
```

Final Info Request:

```text
GET http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 0,
  "price": 50
}
```

Observation:  
The system correctly prevents purchasing a book when quantity is zero.