package rateLimiter.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import rateLimiter.dto.ProxyRequest;
import rateLimiter.dto.ThrottleRequest;
import rateLimiter.service.rateLimiterService;
import rateLimiter.service.ThrottlePublisher;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/proxy")
public class proxyController {

    private final RedisTemplate<String, Object> redis;
    private final rateLimiterService rateLimiter;

    private final ThrottlePublisher throttlePublisher;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

    @Value("${proxy.target.url}")
    private String defaultTargetUrl;

    public proxyController(RedisTemplate<String, Object> redis,
            rateLimiterService rateLimiter,
            ThrottlePublisher throttlePublisher) {
        this.redis = redis;
        this.rateLimiter = rateLimiter;
        this.throttlePublisher = throttlePublisher;
    }

    /**
     * Single entry-point for all proxied requests.
     *
     * Client sends:
     * POST /proxy
     * X-API-Key: <your-key>
     * Content-Type: application/json
     *
     * {
     * "path": "/orders", <- required: which endpoint to call
     * "method": "POST", <- optional: HTTP verb (default POST)
     * "data": { "item": "book" } <- optional: payload forwarded to backend
     * }
     */
    @PostMapping
    public ResponseEntity<byte[]> proxy(
            HttpServletRequest servletRequest,
            @RequestBody ProxyRequest req) {

        System.out.println("\n>>> [GATEWAY] Received proxy request for path: " + req.getPath());

        // ── 1. Global rate limit check ──────────────────────────────────────
        if (!rateLimiter.isGlobalAllowed(50)) {
            System.out.println("GLOBAL LIMIT HIT");
            return ResponseEntity.status(503).body("System overloaded. Try later.".getBytes());
        }

        // ── 2. Validate API key ─────────────────────────────────────────────
        String apiKey = servletRequest.getHeader("X-API-Key");
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.status(401).body("Missing X-API-Key header.".getBytes());
        }

        // ── 3. Validate path ────────────────────────────────────────────────
        String path = req.getPath();
        if (path == null || path.isBlank()) {
            return ResponseEntity.status(400).body("Missing 'path' field in request body.".getBytes());
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        // ── 4. Load per-key config from Redis ───────────────────────────────
        String redisKey = "api_key:" + apiKey;
        Map<Object, Object> config = redis.opsForHash().entries(redisKey);
        if (config.isEmpty()) {
            return ResponseEntity.status(401).body("Unknown API key.".getBytes());
        }

        String targetUrl = (String) config.get("targetUrl");
        if (targetUrl == null || targetUrl.isBlank()) {
            targetUrl = defaultTargetUrl;
        }
        targetUrl = targetUrl.trim();

        // ── 5. Determine HTTP method ────────────────────────────────────────
        String method = (req.getMethod() != null && !req.getMethod().isBlank())
                ? req.getMethod().toUpperCase()
                : "POST";

        // ── 6. Serialise the optional data payload to bytes ─────────────────
        byte[] bodyBytes;
        try {
            bodyBytes = (req.getData() != null)
                    ? objectMapper.writeValueAsBytes(req.getData())
                    : new byte[0];
        } catch (Exception e) {
            bodyBytes = new byte[0];
        }

        System.out.println("API Key  : " + apiKey);
        System.out.println("Target   : " + targetUrl + path);
        System.out.println("Method   : " + method);

        // ── 7. Enqueue and return 202 ───────────────────────────────────────
        try {
            long second = System.currentTimeMillis() / 1000;
            String incomingKey = "metrics:incoming:" + apiKey + ":" + second;
            redis.opsForValue().increment(incomingKey);
            redis.expire(incomingKey, java.time.Duration.ofSeconds(15));
            redis.opsForValue().increment("queue_depth:" + apiKey);
        } catch (Exception e) {
            System.err.println("Failed to record metrics in Redis: " + e.getMessage());
        }

        ThrottleRequest msg = new ThrottleRequest(apiKey, method, targetUrl, path, bodyBytes);
        throttlePublisher.publish(msg);

        return ResponseEntity.status(202)
                .body(("Request accepted and queued -> " + method + " " + targetUrl + path).getBytes());
    }
}
