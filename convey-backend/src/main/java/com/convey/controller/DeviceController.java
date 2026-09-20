package com.convey.controller;

import com.convey.security.UserPrincipal;
import com.convey.service.DeviceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<Void> registerDevice(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DeviceRegistrationRequest request) {
        deviceService.registerDevice(principal.getId(), request.getFcmToken(), request.getPlatform());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{fcmToken}")
    public ResponseEntity<Void> unregisterDevice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String fcmToken) {
        deviceService.unregisterDevice(principal.getId(), fcmToken);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class DeviceRegistrationRequest {
        private String fcmToken;
        private String platform;
    }
}
