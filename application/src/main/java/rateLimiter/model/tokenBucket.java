package rateLimiter.model;

public class tokenBucket {

    private final int capacity;
    private final int refillRatePerSecond;

    private double tokens;
    private long lastRefillTimestamp;

    public tokenBucket(int capacity, int refillRatePerSecond) {
        this.capacity = capacity;
        this.refillRatePerSecond = refillRatePerSecond;
        this.tokens = capacity;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    public synchronized boolean allowRequest() {
        refill();

        if (tokens >= 1) {
            tokens -= 1;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.currentTimeMillis();
        double secondsPassed = (now - lastRefillTimestamp) / 1000.0;

        double tokensToAdd = secondsPassed * refillRatePerSecond;
        tokens = Math.min(capacity, tokens + tokensToAdd);

        lastRefillTimestamp = now;
    }

    public double getTokens() {
        return tokens;
    }
}
