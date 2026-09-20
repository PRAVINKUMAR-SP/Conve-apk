package com.convey.service;

import com.convey.dto.UserProfileResponse;
import com.convey.model.User;
import com.convey.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileResponse getProfile(String userId) {
        User user = getUserById(userId);
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .publicKey(user.getPublicKey())
                .about(user.getAbout())
                .online(user.isOnline())
                .lastSeen(user.getLastSeen() != null ? user.getLastSeen().toString() : null)
                .build();
    }

    public UserProfileResponse updateProfile(String userId, String name, String about, String profilePhotoUrl, String publicKey) {
        User user = getUserById(userId);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (about != null) {
            user.setAbout(about);
        }
        if (profilePhotoUrl != null) {
            user.setProfilePhotoUrl(profilePhotoUrl);
        }
        if (publicKey != null) {
            user.setPublicKey(publicKey);
        }

        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        return getProfile(userId);
    }

    public void setOnlineStatus(String userId, boolean online) {
        User user = getUserById(userId);
        user.setOnline(online);
        if (!online) {
            user.setLastSeen(Instant.now());
        } else {
            user.setLastSeen(null);
        }
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }
}
