package com.convey.controller;

import com.convey.dto.UserProfileResponse;
import com.convey.security.UserPrincipal;
import com.convey.service.FileStorageService;
import com.convey.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> updates) {
        UserProfileResponse profile = userService.updateProfile(
                principal.getId(),
                updates.get("name"),
                updates.get("about"),
                updates.get("profilePhotoUrl"),
                updates.get("publicKey"));
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile-photo")
    public ResponseEntity<Map<String, String>> uploadProfilePhoto(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("file") MultipartFile file) {
        String photoUrl = fileStorageService.storeFile(file);
        userService.updateProfile(principal.getId(), null, null, photoUrl, null);
        return ResponseEntity.ok(Map.of("profilePhotoUrl", photoUrl));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String userId) {
        UserProfileResponse profile = userService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
