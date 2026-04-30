package com.UserRateLimiter.service;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final StringRedisTemplate redis;
    private final JavaMailSender mailSender;

    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_TTL_MINUTES = 10;

    public OtpService(StringRedisTemplate redis, JavaMailSender mailSender) {
        this.redis = redis;
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {
        String otp = generateOtp();
        redis.opsForValue().set(OTP_PREFIX + email, otp, Duration.ofMinutes(OTP_TTL_MINUTES));
        sendEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        String stored = redis.opsForValue().get(OTP_PREFIX + email);
        if (stored != null && stored.equals(otp)) {
            redis.delete(OTP_PREFIX + email);
            return true;
        }
        return false;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit
        return String.valueOf(code);
    }

    private void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("FlowGate - Your Verification Code");
        message.setText(
                "Hello,\n\n" +
                        "Your FlowGate verification code is:\n\n" +
                        "  " + otp + "\n\n" +
                        "This code expires in " + OTP_TTL_MINUTES + " minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "— The FlowGate Team");
        mailSender.send(message);
    }
}
