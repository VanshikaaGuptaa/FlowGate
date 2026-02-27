# 🌉 FlowGate — Smart API Rate Limiter & Gateway

FlowGate is a **beginner-friendly API gateway** that protects your backend services from being overwhelmed by too many requests. It acts like a smart security guard at the door: it keeps requests in a line and lets them through at a safe, controlled pace.

---

## 🤔 What Problem Does It Solve?

Imagine you have an online shop and suddenly **1,000 people try to place an order at the same time**. Without a gatekeeper, your server would crash. FlowGate:

1. **Accepts every request immediately** — no one gets turned away at the door.
2. **Puts them in a queue** — like a waiting line at a coffee shop.
3. **Forwards them to your backend slowly and safely** — one by one, at the rate you set.

---

## ✨ Key Features

| Feature | What it does |
|---|---|
| 🪣 **Token Bucket Rate Limiting** | Each API key gets a "bucket" of tokens. Each request uses one token. Tokens refill automatically at your chosen rate. |
| 🌍 **Global Rate Limiter** | A server-wide cap (50 req/sec by default). Protects the entire system from total overload, regardless of API key. Returns `503` if the whole system is too busy. |
| 📬 **Async Queue (RabbitMQ)** | Requests are not processed immediately — they are put in a queue and consumed safely in the background. |
| 🔑 **Per-API-Key Control** | Each API key can have its own `capacity` (token bucket size) and `refillRate` (tokens per second). |
| 👤 **User Accounts & JWT Auth** | Users register/login and manage only their own API keys. Secure by design. |
| 📊 **Live Status Dashboard** | See each of your APIs as `ACTIVE`, `RATE_LIMITED`, or `INACTIVE` in real time. |
| ⚙️ **Dynamic Config via Redis** | No code changes needed to update an API's rate limit — just update Redis and it takes effect instantly. |

---

## 🏗️ How the System Works (Step by Step)

```
[Your Client]
     |
     | HTTP Request (with X-API-Key header)
     ▼
[FlowGate Gateway :8080]   ← "application" module
     |
     ├─ Step 1: Global Rate Limiter check (50 req/sec server-wide)
     |           If over limit → return 503 immediately
     |
     ├─ Step 2: Validate API Key (look up in Redis)
     |           If not found → return 401 Unauthorized
     |
     ├─ Step 3: Push request to RabbitMQ queue → return 202 Accepted to client
     |
     ▼
[RabbitMQ Queue]  ← holds all pending requests
     |
     ▼
[ThrottleConsumer Worker]
     |
     ├─ Reads per-key config from Redis (capacity + refillRate)
     ├─ Waits for a token to be available in the token bucket
     └─ Forwards the real HTTP request to your backend
     
     ▼
[Your Backend Service :9000]   ← "demo" module
```

---

## 🧩 Project Structure

```
FlowGate/
├── application/       🧠 The Gateway (rate limiter + proxy + queue worker)
├── UserRateLimiter/   🎛️  Management API (register users, manage API keys)
├── user-rate-limiter-ui/  🖥️  Web Dashboard (React frontend)
├── demo/              🏪 Sample backend (the "shop" being protected)
└── load_test.py       🧪 Load testing script
```

---

## 🔧 Two Types of Rate Limiting Explained

### 1. 🌍 Global Rate Limiter
This is a **system-wide** check that runs **before** anything else. It counts how many total requests the gateway has received in the last second.

- **Default limit:** 50 requests per second (across ALL API keys combined)
- **If exceeded:** Returns `503 Service Unavailable` immediately
- **Purpose:** Prevents the entire server from being taken down by a flood of traffic

### 2. 🪣 Per-Key Token Bucket Rate Limiter
This is a **per API key** check that runs in the background queue worker.

- Each API key has its own **bucket** with a configurable **capacity** (max tokens) and **refill rate** (tokens/sec)
- Each request consumes 1 token
- If the bucket is empty, the worker **waits** (with 100ms retry intervals) until a token is refilled
- This ensures requests are forwarded at exactly the rate you set — not faster

---

## 🛠️ What You Need to Install

| Tool | Why you need it | Download |
|---|---|---|
| **Java 17** | Runs the backend services | [Download](https://adoptium.net/) |
| **Redis** | Stores rate limit state and API key configs | [Download](https://redis.io/download) |
| **RabbitMQ** | The message queue that holds requests | [Download](https://www.rabbitmq.com/download.html) |
| **Node.js** | Runs the React dashboard UI (optional) | [Download](https://nodejs.org/) |

---

## 🚀 Getting Started (Step by Step)

### Step 1: Start Redis and RabbitMQ
Make sure both services are running on their default ports:
- Redis: `localhost:6379`
- RabbitMQ: `localhost:5672`

### Step 2: Start the Sample Backend (the "shop")
```bash
cd demo
./mvnw.cmd spring-boot:run
```
> The demo backend runs on **port 9000**

### Step 3: Start the Management API
```bash
cd UserRateLimiter
./mvnw.cmd spring-boot:run
```
> The management API runs on **port 8081**

### Step 4: Start the Gateway (the main FlowGate)
```bash
cd application
./mvnw.cmd spring-boot:run
```
> The gateway runs on **port 8080** — this is where all client requests go

### Step 5: (Optional) Start the Web Dashboard
```bash
cd user-rate-limiter-ui
npm install
npm run dev
```
> The dashboard runs on **http://localhost:5173**

---

## 🔑 Register and Create Your First API Key

### 1. Register a user account
```bash
POST http://localhost:8081/auth/register
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

### 2. Login and get a JWT token
```bash
POST http://localhost:8081/auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}
```
> Save the `token` from the response — you'll need it next.

### 3. Create a rate-limited API key
```bash
POST http://localhost:8081/apis
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "My API",
  "targetUrl": "http://localhost:9000",
  "capacity": 10,
  "refillRate": 2
}
```
> This creates an API key that allows a **burst of 10 requests**, then **2 requests per second** ongoing.
> The API key is returned in the response — save it!

### 4. Or manually set a key in Redis (quick test)
```bash
hset api_key:MY_TEST_KEY capacity 10 refillRate 5 targetUrl http://localhost:9000
```

---

## 🧪 Testing It

### Option A: PowerShell (send 20 requests at once)
```powershell
1..20 | ForEach-Object {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/proxy/orders" `
                              -Method Post `
                              -Headers @{"X-API-Key"="<your-api-key>"}
    Write-Host "Accepted: $($resp)"
}
```

### Option B: Python load test
```bash
python load_test.py
```

### What you'll see:
- **All 20 requests return `202 Accepted` immediately** — they are queued, not rejected
- **In the gateway console:** You'll see requests being processed one by one at your configured rate (e.g., 2/sec)
- **If you send >50 req/sec total:** You'll see `503` responses from the global limiter

---

## 📡 API Reference

### Gateway Proxy — `application` (port 8080)
| Method | Endpoint | Description |
|---|---|---|
| `ANY` | `/proxy/**` | Forward any request through the rate limiter. Requires `X-API-Key` header. |
| `POST` | `/rate-limit/check?key=X&capacity=10&refillRate=1` | Manually test if a key would be allowed |

### Management API — `UserRateLimiter` (port 8081)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get a JWT token |
| `POST` | `/apis` | Create a new API key (requires JWT) |
| `GET` | `/apis` | List all your API keys with live status (requires JWT) |

---

## 📊 Understanding API Key Status

When you list your APIs (`GET /apis`), each one shows a status:

| Status | Meaning |
|---|---|
| ✅ `ACTIVE` | The API key is configured in Redis and not being throttled |
| 🔴 `RATE_LIMITED` | The token bucket is currently empty — requests are waiting |
| ⚫ `INACTIVE` | The API key is not found in Redis (may have been deleted) |

---

## ⚠️ Common Fixes

| Problem | Fix |
|---|---|
| `Connection refused` | Make sure Redis and RabbitMQ are running |
| `401 Unauthorized` on `/proxy` | Your `X-API-Key` header is missing or not registered in Redis |
| `401 Unauthorized` on `/apis` | You forgot to include the `Authorization: Bearer <token>` header |
| `503 Service Unavailable` | You hit the global rate limit (50 req/sec). Slow down! |
| `404 Not Found` from demo | Make sure you are hitting `/proxy/orders` and the demo is running on port 9000 |
