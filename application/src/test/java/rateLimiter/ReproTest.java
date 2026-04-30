package rateLimiter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import rateLimiter.service.rateLimiterService;

@SpringBootTest
class ReproTest {

    @Autowired
    private rateLimiterService rateLimiter;

    @Test
    void testIsAllowed() {
        System.out.println("Starting testIsAllowed");
        String apiKey = "repro_test_key";
        // capacity 10, rate 1
        boolean allowed = rateLimiter.isAllowed(apiKey, 10, 1);
        System.out.println("Is Allowed result: " + allowed);
        // Assert true? Or just print.
        // If my fix works, this should print "Is Allowed result: true" (initially)
        if (!allowed) {
            throw new RuntimeException("Initial request should be allowed!");
        }
    }
}
