package com.UserRateLimiter.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.UserRateLimiter.config.JwtUtil;
import com.UserRateLimiter.entity.User;
import com.UserRateLimiter.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthService(UserRepository userRepo,
            PasswordEncoder encoder,
            JwtUtil jwtUtil,
            OtpService otpService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    /**
     * Step 1: send OTP to email.
     * Throws if the email is already registered.
     */
    public void initiateRegistration(String email) {
        if (userRepo.findByEmail(email).isPresent())
            throw new RuntimeException("Email is already registered");
        otpService.sendOtp(email);
    }

    /**
     * Step 2: verify OTP and create account with the given password.
     * Returns a JWT so the user is immediately logged in after registration.
     */
    public String completeRegistration(String email, String otp, String password) {
        if (userRepo.findByEmail(email).isPresent())
            throw new RuntimeException("Email is already registered");

        if (!otpService.verifyOtp(email, otp))
            throw new RuntimeException("Invalid or expired OTP");

        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        userRepo.save(user);

        return jwtUtil.generateToken(email);
    }

    public String login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        return jwtUtil.generateToken(email);
    }
}
