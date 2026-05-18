package com.UserRateLimiter.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.UserRateLimiter.entity.ApiDefinition;
import com.UserRateLimiter.entity.User;
import com.UserRateLimiter.repository.ApiRepository;
import com.UserRateLimiter.repository.UserRepository;

@Service
public class ApiService {

    private final ApiRepository apiRepo;
    private final UserRepository userRepo;
    private final StringRedisTemplate redis;

    public ApiService(ApiRepository apiRepo,
            UserRepository userRepo,
            StringRedisTemplate redis) {
        this.apiRepo = apiRepo;
        this.userRepo = userRepo;
        this.redis = redis;
    }

    public ApiDefinition createApi(
            String email,
            String name,
            String targetUrl,
            double capacity,
            double refillRate) {

        User user = userRepo.findByEmail(email).orElseThrow();

        ApiDefinition api = new ApiDefinition();
        api.setName(name);
        api.setApiKey(UUID.randomUUID().toString());
        api.setTargetUrl(targetUrl);
        api.setCapacity(capacity);
        api.setRefillRate(refillRate);
        api.setUser(user);

        apiRepo.save(api);

        // Write to Redis so the proxy service can look up this key
        String key = "api_key:" + api.getApiKey();
        redis.opsForHash().put(key, "capacity", String.valueOf(capacity));
        redis.opsForHash().put(key, "refillRate", String.valueOf(refillRate));
        if (targetUrl != null && !targetUrl.isBlank()) {
            redis.opsForHash().put(key, "targetUrl", targetUrl);
        }

        return api;
    }

    public List<ApiDefinition> listApis(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return apiRepo.findByUser(user);
    }

    public boolean isApiActive(String apiKey) {
        return Boolean.TRUE.equals(redis.hasKey("api_key:" + apiKey));
    }

    public boolean isRateLimited(String apiKey) {
        return Boolean.TRUE.equals(redis.hasKey("throttle:" + apiKey));
    }
}
