# 🌉 FlowGate: Easy Rate Limiter

FlowGate is a smart "gatekeeper" for your web services. It makes sure too many people don't crash your server at once by putting them in a queue and letting them through one by one.

## 🌟 How it works (The Simple Version)
Imagine 100 people try to enter a shop at the same time:
1.  **FlowGate** stands at the door.
2.  It gives everyone a "waiting ticket" immediately (**202 Accepted**).
3.  It puts everyone in a line (**RabbitMQ Queue**).
4.  It let's people in only as fast as the shop can handle (**Rate Limiting**).

---

## 🛠 What you need
-   **Java 17** (The engine)
-   **Redis** (The memory - keeps track of how many "tickets" are left)
-   **RabbitMQ** (The waiting room - holds the queue)

---

## 🚀 Getting Started

### 1. Set the Rules (Redis)
You need to tell FlowGate how many requests are allowed. Open your terminal and run:
```bash
# Allow 10 requests total, and add 5 new "tickets" every second
hset api_key:MY_KEY capacity 10 refillRate 5 targetUrl http://localhost:9000
```

### 2. Start the Backend (The Shop)
This is what people are trying to reach.
```bash
cd demo
./mvnw.cmd spring-boot:run
```

### 3. Start FlowGate (The Gatekeeper)
```bash
cd application
./mvnw.cmd spring-boot:run
```

---

## 🧪 Let's Test It!

Open **PowerShell** and run this to send 20 requests at once:

```powershell
1..20 | ForEach-Object {
    try {
        $resp = Invoke-RestMethod -Uri "http://localhost:8080/proxy/orders" `
                                  -Method Post `
                                  -Headers @{"X-API-Key"="MY_KEY"}
        Write-Host "Request SUCCESS!" -ForegroundColor Green
    } catch {
        Write-Host "Request REJECTED (Too fast!)" -ForegroundColor Red
    }
}
```

### What you will see:
-   **In PowerShell:** All requests will say "SUCCESS" because FlowGate accepted them into the queue.
-   **In the Java Console:** You will see the requests being processed **slowly** (5 per second), exactly how you configured it!

---

## 📂 Project Folders
-   📂 `application`: The brain (Gatekeeper).
-   📂 `demo`: The target (The Shop).
-   📂 `UserRateLimiter`: The Dashboard (UI).

## ⚠️ Common Fixes
-   **Connection Error?** Make sure Redis and RabbitMQ are running.
-   **404 Not Found?** Make sure you are hitting `/proxy/orders` (matching the demo app).
