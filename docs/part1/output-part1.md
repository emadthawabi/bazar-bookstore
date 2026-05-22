# Lab 2 Program Output

---

## System Startup

```bash
docker compose up --build -d
```

Output:

```text
Catalog service running on port 3001
Frontend service running on port 3000
Order service running on port 3002
```

---

## Search Request

Request:

```text
http://localhost:3000/search/distributedsystems
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
http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 5,
  "price": 50
}
```

---

## Purchase Request

Request:

```text
POST http://localhost:3000/purchase/2
```

Returned Result:

```json
{
  "message": "bought book RPCs for Noobs",
  "itemId": 2,
  "price": 50
}
```

---

## Info Request After Purchase

Request:

```text
http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 4,
  "price": 50
}
```

---

## Out Of Stock Test

Repeated Purchase Requests:

```text
POST http://localhost:3000/purchase/2
```

Returned Result:

```json
{
  "message": "bought book RPCs for Noobs",
  "itemId": 2,
  "price": 50
}
```

Returned Result:

```json
{
  "message": "bought book RPCs for Noobs",
  "itemId": 2,
  "price": 50
}
```

Returned Result:

```json
{
  "error": "Book is out of stock"
}
```

Final Info Request:

```text
http://localhost:3000/info/2
```

Returned Result:

```json
{
  "title": "RPCs for Noobs",
  "quantity": 0,
  "price": 50
}
```