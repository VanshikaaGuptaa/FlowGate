package com.UserRateLimiter.websocket;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class MetricsWebSocketHandler extends TextWebSocketHandler {

    private final RedisTemplate<String, String> redisTemplate;
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(4);
    private final Map<String, ScheduledFuture<?>> tasks = new ConcurrentHashMap<>();

    public MetricsWebSocketHandler(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String path = session.getUri().getPath();
        String apiKey = path.substring(path.lastIndexOf('/') + 1);

        System.out.println("WebSocket metrics connection established for API key: " + apiKey);

        ScheduledFuture<?> future = executor.scheduleAtFixedRate(() -> {
            if (!session.isOpen()) {
                cancelTask(session.getId());
                return;
            }

            try {
                long currentSec = System.currentTimeMillis() / 1000;
                long targetSec = currentSec - 1; // completed second

                // Fetch capacity and refillRate
                String capStr = (String) redisTemplate.opsForHash().get("api_key:" + apiKey, "capacity");
                String refillStr = (String) redisTemplate.opsForHash().get("api_key:" + apiKey, "refillRate");

                double capacity = capStr != null ? Double.parseDouble(capStr) : 10.0;
                double refillRate = refillStr != null ? Double.parseDouble(refillStr) : 1.0;

                // Fetch current metrics
                String incomingVal = redisTemplate.opsForValue().get("metrics:incoming:" + apiKey + ":" + targetSec);
                int incoming = incomingVal != null ? Integer.parseInt(incomingVal) : 0;

                String outgoingVal = redisTemplate.opsForValue().get("metrics:outgoing:" + apiKey + ":" + targetSec);
                int outgoing = outgoingVal != null ? Integer.parseInt(outgoingVal) : 0;

                String depthVal = redisTemplate.opsForValue().get("queue_depth:" + apiKey);
                int queueDepth = depthVal != null ? Math.max(0, Integer.parseInt(depthVal)) : 0;

                String tokensVal = (String) redisTemplate.opsForHash().get("rate_limit:" + apiKey, "tokens");
                String lastRefillStr = (String) redisTemplate.opsForHash().get("rate_limit:" + apiKey, "lastRefillTime");

                double tokens;
                if (tokensVal == null || lastRefillStr == null) {
                    tokens = capacity;
                } else {
                    try {
                        double storedTokens = Double.parseDouble(tokensVal);
                        long lastRefillTime = Long.parseLong(lastRefillStr);
                        long now = System.currentTimeMillis();
                        double elapsed = (now - lastRefillTime) / 1000.0;
                        double refill = elapsed * refillRate;
                        tokens = Math.min(capacity, Math.max(0.0, storedTokens + refill));
                    } catch (NumberFormatException e) {
                        tokens = capacity;
                    }
                }

                // Manually construct JSON to avoid Jackson ObjectMapper classpath dependency
                String json = String.format(
                    "{\"timestamp\":%d,\"incoming\":%d,\"outgoing\":%d,\"queueDepth\":%d,\"tokens\":%.2f,\"capacity\":%.2f,\"refillRate\":%.2f}",
                    System.currentTimeMillis(),
                    incoming,
                    outgoing,
                    queueDepth,
                    tokens,
                    capacity,
                    refillRate
                );

                session.sendMessage(new TextMessage(json));

            } catch (Exception e) {
                System.err.println("Error sending metrics to WS client: " + e.getMessage());
            }
        }, 0, 1000, TimeUnit.MILLISECONDS);

        tasks.put(session.getId(), future);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocket metrics connection closed: " + session.getId());
        cancelTask(session.getId());
    }

    private void cancelTask(String sessionId) {
        ScheduledFuture<?> future = tasks.remove(sessionId);
        if (future != null) {
            future.cancel(true);
        }
    }
}
