package rateLimiter.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import java.util.Map;
import rateLimiter.config.RabbitConfig;

@Component
public class ThrottlePublisher {

    private final RabbitTemplate rabbitTemplate;

    public ThrottlePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(rateLimiter.dto.ThrottleRequest payload) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY,
                payload);
    }
}
