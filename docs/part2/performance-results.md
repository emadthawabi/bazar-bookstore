# Phase 2 Performance Results

## Method

All tests were run through the frontend service:

```text
http://localhost:3000
```

Docker Compose was running all services:

```text
frontend
catalog1
catalog2
order1
order2
```

Response times were measured using `curl` and the terminal `time` command.

---

## Results Table

| Experiment | Command | Response Time |
|---|---|---:|
| Info request cache miss | `time curl http://localhost:3000/info/2` | 0.048s |
| Info request cache hit | `time curl http://localhost:3000/info/2` | 0.007s |
| Search request cache miss | `time curl http://localhost:3000/search/distributedsystems` | 0.061s |
| Search request cache hit | `time curl http://localhost:3000/search/distributedsystems` | 0.008s |
| Purchase with consistency | `time curl -X POST http://localhost:3000/purchase/2` | 0.033s |
| Info request after cache invalidation | `time curl http://localhost:3000/info/2` | 0.011s |
| Catalog replica 1 info request | `time curl http://localhost:3001/info/2` | 0.010s |
| Catalog replica 2 info request | `time curl http://localhost:3003/info/2` | 0.012s |
| Search through frontend with load balancing | `time curl http://localhost:3000/search/distributedsystems` | 0.061s |
| Cache invalidation operation | `DELETE /cache/2` | lightweight operation |

---

## Cache Performance

| Scenario | Before Cache | After Cache |
|---|---:|---:|
| Info request | 0.048s | 0.007s |
| Search request | 0.061s | 0.008s |

---

## Consistency Performance

| Scenario | Response Time |
|---|---:|
| Purchase with catalog update and cache invalidation | 0.033s |
| Info request after invalidation | 0.011s |

---

## Brief Explanation

The tests were performed through the frontend service. Read requests such as `/info/:id` and `/search/:topic` were faster after caching because the frontend returned the saved result from memory instead of contacting a catalog replica again.

Purchase requests are slower than cached reads because they require more work: the frontend forwards the request to an order replica, the order service checks the catalog, updates stock, invalidates the frontend cache, and keeps catalog replicas consistent.

The cache invalidation test showed that stale data was not returned after a purchase. After buying a book, the cache entry was removed and the next `/info/:id` request fetched the updated quantity from the catalog replica.

---

## Conclusion

Caching improved repeated read requests. The info request improved from `0.048s` to `0.007s`, and the search request improved from `0.061s` to `0.008s`. The system also maintained consistency between catalog replicas and prevented stale cached values after purchases.