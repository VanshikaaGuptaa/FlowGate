package com.UserRateLimiter.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.context.SecurityContextHolder;

import com.UserRateLimiter.entity.ApiDefinition;
import com.UserRateLimiter.service.ApiService;
import com.UserRateLimiter.payload.CreateApiRequest;

@RestController
@RequestMapping("/apis")
@CrossOrigin(origins = {"http://localhost:5173",
    "http://localhost:3000",
    "http://flowgate.website",
    "https://flowgate.website",
    "http://www.flowgate.website",
    "https://www.flowgate.website",
    "https://ec2-18-207-124-88.compute-1.amazonaws.com"}, maxAge = 3600)
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @PostMapping
    public ApiDefinition create(@RequestBody CreateApiRequest req) {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return apiService.createApi(
                email,
                req.getName(),
                req.getTargetUrl(),
                req.getCapacity(),
                req.getRefillRate());
    }

    @GetMapping
    public List<Map<String, Object>> list() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return apiService.listApis(email).stream().<Map<String, Object>>map(api -> {

            boolean active = apiService.isApiActive(api.getApiKey());
            boolean rateLimited = apiService.isRateLimited(api.getApiKey());

            String status;
            if (!active) {
                status = "INACTIVE";
            } else if (rateLimited) {
                status = "RATE_LIMITED";
            } else {
                status = "ACTIVE";
            }

            return Map.<String, Object>of(
                    "id", api.getId(),
                    "name", api.getName(),
                    "targetUrl", api.getTargetUrl() != null ? api.getTargetUrl() : "",
                    "apiKey", api.getApiKey(),
                    "capacity", api.getCapacity(),
                    "refillRate", api.getRefillRate(),
                    "status", status);
        }).toList();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        apiService.deleteApi(email, id);
    }
}
