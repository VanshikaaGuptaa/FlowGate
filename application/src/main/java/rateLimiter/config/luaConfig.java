package rateLimiter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.util.List;

@Configuration
public class luaConfig {

    @Bean
    public DefaultRedisScript<List> rateLimiterScript() {
        DefaultRedisScript<List> script = new DefaultRedisScript<>();
        script.setResultType(List.class);

        script.setScriptText("""
                    -- KEYS[1] = rate limit key
                    -- ARGV[1] = capacity
                    -- ARGV[2] = refill rate (per second)
                    -- ARGV[3] = current time millis

                    local key = KEYS[1]
                    local capacity = tonumber(ARGV[1])
                    local refillRate = tonumber(ARGV[2])
                    local now = tonumber(ARGV[3])

                    local data = redis.call("HMGET", key, "tokens", "lastRefillTime")

                    local tokens = tonumber(data[1])
                    local lastRefillTime = tonumber(data[2])

                    if tokens == nil then
                        tokens = capacity
                        lastRefillTime = now
                    end

                    local elapsed = (now - lastRefillTime) / 1000
                    local refill = elapsed * refillRate
                    tokens = math.min(capacity, tokens + refill)

                    local allowed = 0
                    if tokens >= 1 then
                        tokens = tokens - 1
                        allowed = 1
                    end

                    redis.call("HMSET", key,
                        "tokens", tokens,
                        "lastRefillTime", now
                    )

                    redis.call("EXPIRE", key, 3600)

                    return { allowed, tokens }
                """);

        return script;
    }
}
