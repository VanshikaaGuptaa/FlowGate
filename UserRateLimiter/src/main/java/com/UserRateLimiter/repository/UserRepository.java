package com.UserRateLimiter.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.UserRateLimiter.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}



