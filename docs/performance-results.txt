Lab 2 Performance Results

Experiment 1: Info Request Cache Performance

Cache miss / without cache:
Command:
time curl http://localhost:3000/info/2

Result:
{"title":"RPCs for Noobs","quantity":3,"price":50}

Response time:
0.048s total

Cache hit / with cache:
Command:
time curl http://localhost:3000/info/2

Result:
{"title":"RPCs for Noobs","quantity":3,"price":50}

Response time:
0.007s total

Observation:
The cached info request was faster because the frontend returned the result from memory instead of forwarding the request to a catalog replica.


Experiment 2: Search Request Cache Performance

Cache miss / without cache:
Command:
time curl http://localhost:3000/search/distributedsystems

Result:
[
  {"id":1,"title":"How to get a good grade in DOS in 40 minutes a day"},
  {"id":2,"title":"RPCs for Noobs"}
]

Response time:
0.061s total

Cache hit / with cache:
Command:
time curl http://localhost:3000/search/distributedsystems

Result:
[
  {"id":1,"title":"How to get a good grade in DOS in 40 minutes a day"},
  {"id":2,"title":"RPCs for Noobs"}
]

Response time:
0.008s total

Observation:
The second search request was served from cache and was faster.


Experiment 3: Purchase Request with Consistency

Command:
time curl -X POST http://localhost:3000/purchase/2

Result:
{"message":"bought book RPCs for Noobs","price":50}

Response time:
0.033s total

Observation:
Purchase requests are write operations, so they are not cached. The request goes through the frontend to an order replica, then updates the catalog and invalidates stale cached data.


Experiment 4: Cache Invalidation After Purchase

Steps:
1. Info request before purchase:
curl http://localhost:3000/info/2

Result:
{"title":"RPCs for Noobs","quantity":2,"price":50}

2. Repeated info request:
curl http://localhost:3000/info/2

Result:
{"title":"RPCs for Noobs","quantity":2,"price":50}

3. Purchase request:
curl -X POST http://localhost:3000/purchase/2

Result:
{"message":"bought book RPCs for Noobs","price":50}

4. Info request after purchase:
time curl http://localhost:3000/info/2

Result:
{"title":"RPCs for Noobs","quantity":1,"price":50}

Response time:
0.011s total

Observation:
After the purchase, the frontend cache was invalidated. The next info request returned the updated quantity 1 instead of the old cached quantity 2. This shows that stale-cache prevention works.


Summary Table

Scenario                              Response Time
Info request cache miss                0.048s
Info request cache hit                 0.007s
Search request cache miss              0.061s
Search request cache hit               0.008s
Purchase with consistency              0.033s
Info request after invalidation         0.011s

Conclusion:
Caching improved repeated read requests. The info request improved from 0.048s to 0.007s, and the search request improved from 0.061s to 0.008s. Purchase requests are slower than cached reads because they require order processing, catalog update, cache invalidation, and replica consistency.