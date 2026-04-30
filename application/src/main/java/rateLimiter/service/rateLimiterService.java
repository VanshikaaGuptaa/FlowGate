package rateLimiter.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class rateLimiterService {

    private static final int CAPACITY = 10;
    private static final int REFILL_RATE = 1; // per second

    private final RedisTemplate<String, Object> redisTemplate;
    private final DefaultRedisScript<List> rateLimiterScript;

    public rateLimiterService(RedisTemplate<String, Object> redisTemplate,
            DefaultRedisScript<List> rateLimiterScript) {
        this.redisTemplate = redisTemplate;
        this.rateLimiterScript = rateLimiterScript;
    }

    public boolean isAllowed(String apiKey) {
        return isAllowed(apiKey, CAPACITY, REFILL_RATE);
    }

    public boolean isAllowed(String apiKey, int capacity, int refillRate) {
        List<Long> result = redisTemplate.execute(
                rateLimiterScript,
                Collections.singletonList("rate_limit:" + apiKey),
                String.valueOf(capacity),
                String.valueOf(refillRate),
                String.valueOf(System.currentTimeMillis()));

        // Robust check
        if (result != null && !result.isEmpty()) {
            Object val = result.get(0);
            if (val instanceof Number) {
                return ((Number) val).longValue() == 1L;
            }
        }
        return false;
    }

    public boolean isGlobalAllowed(int maxRequestsPerSecond) {
        String key = "global:rps";

        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1) {
            redisTemplate.expire(key, java.time.Duration.ofSeconds(1));
        }

        return count != null && count <= maxRequestsPerSecond;
    }

}
