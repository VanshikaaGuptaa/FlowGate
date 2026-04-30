package com.example.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;


@RestController
public class TestBackendController {

    @PostMapping("/orders")
    public Map<String, String> orders() {

        System.out.println(
            "[BACKEND] /orders received at " +
            LocalDateTime.now() +
            " | Thread: " +
            Thread.currentThread().getName()
        );

        return Map.of("status", "order created");
    }

    @PostMapping("/payments")
    public Map<String, String> payments() {

        System.out.println(
            "[BACKEND] /payments received at " +
            LocalDateTime.now() +
            " | Thread: " +
            Thread.currentThread().getName()
        );

        return Map.of("status", "payment created");
    }
}
