package com.convey.service;

import com.convey.model.Device;
import com.convey.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public void registerDevice(String userId, String fcmToken, String platform) {
        Optional<Device> existing = deviceRepository.findByUserIdAndFcmToken(userId, fcmToken);
        if (existing.isEmpty()) {
            Device device = Device.builder()
                    .userId(userId)
                    .fcmToken(fcmToken)
                    .platform(platform)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            deviceRepository.save(device);
            log.info("Registered new device for user: {}", userId);
        } else {
            Device device = existing.get();
            device.setUpdatedAt(Instant.now());
            deviceRepository.save(device);
        }
    }

    public void unregisterDevice(String userId, String fcmToken) {
        deviceRepository.deleteByUserIdAndFcmToken(userId, fcmToken);
        log.info("Unregistered device for user: {}", userId);
    }
}
