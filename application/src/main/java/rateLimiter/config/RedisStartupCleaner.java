package rateLimiter.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Clears stale rate-limit state from Redis every time the application starts.
 *
 * Keys deleted:
 * rate_limit:* — per-key token bucket states
 * throttle:* — throttle flags set by the consumer
 * global:rps — global requests-per-second counter
 *
 * Keys NOT touched:
 * api_key:* — API configurations (kept so registered keys still work)
 */
@Component
public class RedisStartupCleaner implements ApplicationRunner {

    private final RedisTemplate<String, Object> redis;

    public RedisStartupCleaner(RedisTemplate<String, Object> redis) {
        this.redis = redis;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("[STARTUP] Clearing stale rate-limit state from Redis...");

        deletePattern("rate_limit:*");
        deletePattern("throttle:*");
        deletePattern("queue_depth:*");
        deletePattern("metrics:incoming:*");
        deletePattern("metrics:outgoing:*");
        redis.delete("global:rps");

        System.out.println("[STARTUP] Redis rate-limit state cleared. Ready.");
    }

    private void deletePattern(String pattern) {
        Set<String> keys = redis.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
            System.out.println("[STARTUP]  Deleted " + keys.size() + " keys matching: " + pattern);
        }
    }
}
