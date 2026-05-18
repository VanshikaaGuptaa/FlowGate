package rateLimiter.consumer;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.http.HttpMethod;
import rateLimiter.config.RabbitConfig;
import rateLimiter.dto.ThrottleRequest;
import rateLimiter.service.rateLimiterService;

@Component
public class ThrottleConsumer {

    private final WebClient webClient;
    private final rateLimiterService rateLimiter;
    private final RedisTemplate<String, Object> redis;

    public ThrottleConsumer(WebClient webClient, rateLimiterService rateLimiter, RedisTemplate<String, Object> redis) {
        this.webClient = webClient;
        this.rateLimiter = rateLimiter;
        this.redis = redis;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void consume(ThrottleRequest msg) {
        try {
            String apiKey = msg.getApiKey();
            String redisKey = "api_key:" + apiKey;

            Map<Object, Object> config = redis.opsForHash().entries(redisKey);
            if (config.isEmpty()) {
                System.err.println("Scaling Error: No config found for API key: " + apiKey);
                // Decide whether to process or drop. Dropping for now to avoid loops.
                return;
            }

            Object capObj = config.get("capacity");
            Object rateObj = config.get("refillRate");

            if (capObj == null || rateObj == null) {
                System.err.println("Scaling Error: Missing capacity/refillRate for API key: " + apiKey);
                
                return;
            }

            double capacity = Double.parseDouble(capObj.toString());
            double refillRate = Double.parseDouble(rateObj.toString());

            // Wait until token is available
            boolean allowed = rateLimiter.isAllowed(apiKey, capacity, refillRate);
            if (!allowed) {
                System.out.println("[" + LocalDateTime.now() + "] Bucket empty. Waiting...");
                while (!rateLimiter.isAllowed(apiKey, capacity, refillRate)) {
                    try {
                        Thread.sleep(100); // backoff
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                }
            }

            String url = msg.getTargetUrl() + msg.getPath();

            webClient.method(HttpMethod.valueOf(msg.getMethod()))
                    .uri(url)
                    .bodyValue(msg.getBody())
                    .retrieve()
                    .toBodilessEntity()
                    .block(); // ensures order

           System.out.println("[" + LocalDateTime.now() + "] Processed: " + url);
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
            // In a real app, might want to throw AmqpRejectAndDontRequeueException or
            // similar
            // to avoid infinite retry loops depending on the error type.
        }
    }
}
