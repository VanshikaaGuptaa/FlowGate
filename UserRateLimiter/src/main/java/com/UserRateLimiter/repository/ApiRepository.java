package com.UserRateLimiter.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.UserRateLimiter.entity.ApiDefinition;
import com.UserRateLimiter.entity.User;

public interface ApiRepository extends JpaRepository<ApiDefinition, Long> {
    List<ApiDefinition> findByUser(User user);
}


