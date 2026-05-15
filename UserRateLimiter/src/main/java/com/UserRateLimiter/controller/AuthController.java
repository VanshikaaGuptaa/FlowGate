package com.UserRateLimiter.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.UserRateLimiter.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173",
    "http://flowgate.website",
    "https://flowgate.website",
    "http://www.flowgate.website",
    "https://www.flowgate.website",
    "https://ec2-18-207-124-88.compute-1.amazonaws.com/"}, maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Step 1 of registration: send OTP to the provided email.
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/register/initiate")
    public ResponseEntity<Map<String, String>> initiateRegistration(@RequestBody Map<String, String> req) {
        try {
            authService.initiateRegistration(req.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP sent to " + req.get("email")));
        } catch (MailException e) {
            // SMTP / mail config error — not a client mistake
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error",
                            "Failed to send OTP email. Check server mail config. Detail: " + e.getMessage()));
        } catch (RuntimeException e) {
            // Business logic error (e.g. email already registered)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Step 2 of registration: verify OTP and create the account.
     * Body: { "email": "...", "otp": "123456", "password": "..." }
     * Returns a JWT token on success so the user is immediately logged in.
     */
    @PostMapping("/register/verify")
    public ResponseEntity<Map<String, String>> completeRegistration(@RequestBody Map<String, String> req) {
        try {
            String token = authService.completeRegistration(
                    req.get("email"),
                    req.get("otp"),
                    req.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> req) {
        try {
            String token = authService.login(req.get("email"), req.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
}
