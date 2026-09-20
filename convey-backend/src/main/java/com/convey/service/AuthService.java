package com.convey.service;

import com.convey.dto.AuthResponse;
import com.convey.dto.LoginRequest;
import com.convey.dto.RegisterRequest;
import com.convey.model.User;
import com.convey.repository.UserRepository;
import com.convey.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        // Check if phone number already registered
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .profilePhotoUrl(request.getProfilePhotoUrl())
                .publicKey(request.getPublicKey())
                .about("Hey there! I am using Convey")
                .online(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        user = userRepository.save(user);

        // Generate JWT
        String token = jwtTokenProvider.generateToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .newUser(true)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Phone number not registered"));

        // Update online status and public key
        user.setOnline(true);
        user.setLastSeen(null);
        if (request.getPublicKey() != null) {
            user.setPublicKey(request.getPublicKey());
        }
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Generate JWT
        String token = jwtTokenProvider.generateToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .newUser(false)
                .build();
    }
}
