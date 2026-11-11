# 🌉 FlowGate — Smart API Rate Limiter & Gateway

FlowGate is a smart "gatekeeper" for your web services. It makes sure too many requests don't crash your server by putting them in a queue and letting them through at a safe, controlled pace.
Live : https://flowgate.website/
---

## 🤔 What Problem Does It Solve?

Imagine 100 people try to hit your API at once. Without a gatekeeper, your server crashes. FlowGate:
1. **Accepts every request immediately** — returns `202 Accepted` right away
2. **Puts them in a queue** (RabbitMQ) — like a waiting line
3. **Forwards them to your backend slowly and safely** — at exactly the rate you configure

---

## ✨ Key Features

| Feature | What it does |
|---|---|
| 🪣 **Token Bucket Rate Limiting** | Per API key. Tokens refill over time; each request uses one. |
| 🌍 **Global Rate Limiter** | Server-wide cap of 50 req/sec. Returns `503` if the whole system is too busy. |
| 📬 **Async Queue (RabbitMQ)** | Requests are queued and consumed safely in the background. |
| 🔑 **Per-API-Key Control** | Each key has its own `capacity` (burst size) and `refillRate` (tokens/sec). |
| 👤 **User Accounts & JWT Auth** | Users register/login and manage only their own API keys. |
| 📊 **Live Status Dashboard** | See APIs as `ACTIVE`, `RATE_LIMITED`, or `INACTIVE` in real time. |
| 🧹 **Auto Redis Cleanup** | Stale rate-limit state is cleared automatically on startup. |

---

## 🏗️ How It Works

```
[Client]
   │  POST /proxy  +  X-API-Key header  +  JSON body { path, method, data }
   ▼
[FlowGate Gateway :8080]
   ├─ Global rate limit check (50 req/sec) → 503 if over
   ├─ Validate API key (Redis)             → 401 if unknown
   ├─ Push to RabbitMQ queue              → return 202 immediately
   ▼
[ThrottleConsumer Worker]
   ├─ Reads capacity + refillRate from Redis
   ├─ Waits for a token (token bucket, Lua script)
   └─ Forwards real request to backend
   ▼
[Your Backend :9000]
```

---

## 🧩 Project Structure

```
FlowGate/
├── application/          🧠 Gateway (rate limiter + proxy + queue worker)
├── UserRateLimiter/      🎛️  Management API (users + API key CRUD)
├── user-rate-limiter-ui/ 🖥️  React Dashboard
├── demo/                 🏪 Sample backend being protected
└── load_test.py          🧪 Load testing script
```

---

## 🔧 Two Types of Rate Limiting

### 🌍 Global Rate Limiter
- Checks **total** requests per second across all API keys
- Default limit: **50 req/sec**
- If exceeded → `503 Service Unavailable` (before even checking the API key)

### 🪣 Per-Key Token Bucket
- Each API key has its own bucket of tokens
- Each request consumes 1 token; tokens refill at `refillRate` per second
- If bucket is empty, the worker waits until a token is available — no request is dropped

---

## 🛠️ What You Need

| Tool | Purpose |
|---|---|
| **Java 17** | Runs the backend services |
| **Redis** | Stores rate limit state and API key configs |
| **RabbitMQ** | The message queue holding pending requests |
| **Node.js** | Runs the React dashboard (optional) |

---

## 🚀 Getting Started

### 1. Start the Sample Backend
```bash
cd demo
./mvnw.cmd spring-boot:run
# Runs on port 9000
```

### 2. Start the Management API
```bash
cd UserRateLimiter
./mvnw.cmd spring-boot:run
# Runs on port 8081
```

### 3. Start FlowGate Gateway
```bash
cd application
./mvnw.cmd spring-boot:run
# Runs on port 8080
```

### 4. (Optional) Start the Dashboard
```bash
cd user-rate-limiter-ui
npm install && npm run dev
# Opens at http://localhost:5173
```

---

## 🔑 Create Your First API Key

**Register:**
```http
POST http://localhost:8081/auth/register
Content-Type: application/json
{ "email": "you@example.com", "password": "yourpassword" }
```

**Login** (save the returned `token`):
```http
POST http://localhost:8081/auth/login
Content-Type: application/json
{ "email": "you@example.com", "password": "yourpassword" }
```

**Create an API key:**
```http
POST http://localhost:8081/apis
Authorization: Bearer <token>
Content-Type: application/json
{ "name": "My API", "targetUrl": "http://localhost:9000", "capacity": 10, "refillRate": 2 }
```
> Save the `apiKey` from the response!

**Or set one manually in Redis (quick test):**
```bash
hset api_key:MY_KEY capacity 10 refillRate 5 targetUrl http://localhost:9000
```

---

## 📡 Sending Requests Through the Gateway

All requests go to **one single endpoint**: `POST /proxy`

The path and optional payload are sent in the **JSON body** — not in the URL.

### Request format
```http
POST http://localhost:8080/proxy
X-API-Key: <your-api-key>
Content-Type: application/json

{
  "path":   "/orders",
  "method": "POST",
  "data":   { "item": "book", "qty": 2 }
}
```

| Field | Required | Description |
|---|---|---|
| `path` | ✅ Yes | Endpoint to forward to (e.g. `/orders`) |
| `method` | ❌ Optional | HTTP verb — defaults to `POST` |
| `data` | ❌ Optional | Payload forwarded to your backend |

### Response
```
202 Accepted
Request accepted and queued -> POST http://localhost:9000/orders
```

---

## 🧪 Load Testing

### PowerShell (send 20 requests at once)
```powershell
1..20 | ForEach-Object {
    $id = $_
    try {
        $body = @{ path = "/orders"; method = "POST"; data = @{ item = "book"; qty = 2 } } | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri "http://localhost:8080/proxy" `
                                  -Method Post `
                                  -Headers @{"X-API-Key"="<your-api-key>"} `
                                  -Body $body `
                                  -ContentType "application/json"
        Write-Host "Request ${id}: Queued - $resp" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Request ${id}: Failed ($statusCode)" -ForegroundColor Yellow
    }
}
```

### Python
```bash
python load_test.py
```

### What you'll see
- **All requests return `202`** instantly — they are queued, not rejected
- **In the gateway console:** requests forwarded one by one at your configured rate
- **If you send >50 req/sec:** some return `503` from the global limiter

---

## 📡 API Reference

### Gateway — `application` (port 8080)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/proxy` | Send a proxied request. Requires `X-API-Key` header + JSON body with `path`. |
| `POST` | `/rate-limit/check?key=X&capacity=10&refillRate=1` | Manually test if a key is allowed |

### Management API — `UserRateLimiter` (port 8081)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |
| `POST` | `/apis` | Create an API key (JWT required) |
| `GET` | `/apis` | List your API keys with live status (JWT required) |

---

## 📊 API Key Status

| Status | Meaning |
|---|---|
| ✅ `ACTIVE` | Key exists in Redis, not being throttled |
| 🔴 `RATE_LIMITED` | Token bucket empty — requests are waiting |
| ⚫ `INACTIVE` | Key not found in Redis |

---

## 🧹 Clearing State Between Tests

**Redis** (auto-cleared on startup):
```bash
redis-cli --scan --pattern "rate_limit:*" | xargs redis-cli del
redis-cli del global:rps
```

**RabbitMQ queue** — open **http://localhost:15672** → Queues → `throttle.queue.v2` → **Purge Messages**

---

## ⚠️ Common Fixes

| Problem | Fix |
|---|---|
| `Connection refused` | Make sure Redis and RabbitMQ are running |
| `400 Bad Request` from `/proxy` | Missing `path` field in your JSON body |
| `401` on `/proxy` | `X-API-Key` header is missing or not registered in Redis |
| `401` on `/apis` | Missing `Authorization: Bearer <token>` header |
| `503 Service Unavailable` | Hit the global 50 req/sec cap — slow down |
| `404` from demo backend | Make sure demo is running on port 9000 |
