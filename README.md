# FlowGate: Asynchronous Rate Limiter Proxy

FlowGate is a high-performance, asynchronous API proxy designed to buffer burst traffic and enforce strict rate limits on backend services. It uses a **Producer-Consumer** architecture with **RabbitMQ** for buffering and **Redis (Lua Scripts)** for distributed token bucket rate limiting.

## 🚀 Architecture

1.  **Ingestion Layer (`proxyController`)**:
    -   Receives incoming HTTP requests.
    -   Immediately acknowledges with `202 Accepted`.
    -   Publishes the request metadata (method, URL, headers, body) to a RabbitMQ queue.
    -   **Scaling**: Can handle massive bursts of traffic without overwhelming the backend.

2.  **Processing Layer (`ThrottleConsumer`)**:
    -   Consumes messages from the queue.
    -   **Throttling**: Checks Redis for available tokens for the specific API Key.
    -   **Backoff**: If no tokens are available, it **blocks/waits** until the bucket refills.
    -   **Forwarding**: Once allowed, forwards the request to the target backend service.

3.  **Backend (`demo`)**:
    -   The protected upstream service (e.g., Order System).

## 🛠 Prerequisites

-   **Java 17+**
-   **Redis server** (running on `localhost:6379`)
-   **RabbitMQ server** (running on `localhost:5672`)
-   **Maven** (optional, wrapper included)

## 📦 Project Structure

-   `application/`: The main Rate Limiter Proxy service (Spring Boot WebFlux).
-   `demo/`: A sample backend service to test against.
-   `load_test.py`: Python script to simulate concurrent traffic.

## ⚙️ Setup & Configuration

### 1. Start Infrastructure
Ensure Redis and RabbitMQ are running locally.

### 2. Configure Rate Limits (Redis)
You must define rate limits for your API keys in Redis using Hash maps.

**Example**: API Key `test_api_key_1` with capacity 10 and refill rate 1 token/minute.

```bash
# Using redis-cli
HSET api_key:test_api_key_1 capacity 10
HSET api_key:test_api_key_1 refillRate 5
HSET api_key:test_api_key_1 targetUrl http://localhost:9000
```
*   `capacity`: Max burst size.
*   `refillRate`: Tokens added per minute.
*   `targetUrl`: The backend service URL for this key.

### 3. Start the Backend Service (`demo`)
Runs on port **9000**.
```bash
cd demo
.\mvnw.cmd spring-boot:run
```

### 4. Start the Rate Limiter Proxy (`application`)
Runs on port **8080**.
```bash
cd application
.\mvnw.cmd spring-boot:run
```

## 🧪 Testing

### Using `load_test.py`
We have provided a Python script to verify the behavior. It sends 20 concurrent requests.
You should see:
-   Immediate `202 Accepted` for all requests.
-   The `application` logs will show requests being processed at the defined rate (e.g., 5 per minute).

```bash
python load_test.py
```

### Using Postman
1.  **Method**: `POST` (or GET, PUT, etc.)
2.  **URL**: `http://localhost:8080/proxy/orders` (Proxies to `http://localhost:9000/orders`)
3.  **Headers**:
    -   `X-API-Key`: `test_api_key_1`
    -   `Content-Type`: `application/json` (optional)
4.  **Body**: Any JSON body (will be forwarded).

**Response**:
-   **Status**: `202 Accepted`
-   **Body**: `Request accepted and queued`

## 🔍 Behavior Observation
-   Use `docker stats` or Resource Monitor to watch RabbitMQ queue size grow during bursts.
-   Watch the console logs of `application` to see the "Processing..." messages tick by at the rate limit speed.

## ⚠️ Troubleshooting
-   **Redis Connection Refused**: Ensure Redis is running on port 6379.
-   **RabbitMQ Connection Refused**: Ensure RabbitMQ is running on port 5672.
-   **"Scaling Error: No config found"**: Make sure you added the Redis Hash for your API key.
