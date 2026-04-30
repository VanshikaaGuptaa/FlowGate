package rateLimiter.controller;

import rateLimiter.service.rateLimiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/rate-limit")
public class rateLimiterController {

    private final rateLimiterService rateLimiterService;

    public rateLimiterController(rateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> check(
            @RequestParam String key,
            @RequestParam(defaultValue = "10") int capacity,
            @RequestParam(defaultValue = "1") int refillRate) {

        boolean allowed = rateLimiterService.isAllowed(key, capacity, refillRate);

        Map<String, Object> response = new HashMap<>();
        response.put("allowed", allowed);

        return ResponseEntity.ok(response);
    }
}
