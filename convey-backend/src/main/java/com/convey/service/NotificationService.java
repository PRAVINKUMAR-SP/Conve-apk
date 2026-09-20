package com.convey.service;

import com.convey.model.Notification;
import com.convey.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final com.convey.repository.DeviceRepository deviceRepository;

    /**
     * Create a notification record and attempt FCM push delivery.
     */
    public Notification createNotification(String userId, String messageId, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .messageId(messageId)
                .type(type)
                .read(false)
                .createdAt(Instant.now())
                .build();

        notification = notificationRepository.save(notification);

        sendFcmPush(userId, type, messageId);

        return notification;
    }

    /**
     * Get unread notifications for a user.
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }

    /**
     * Mark a notification as read.
     */
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    /**
     * Get unread notification count.
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    private void sendFcmPush(String userId, String type, String messageId) {
        log.info("FCM push notification queued for user={} type={} messageId={}", userId, type, messageId);
        
        // Find all devices for this user
        var devices = deviceRepository.findByUserId(userId);
        
        for (var device : devices) {
            if (device.getFcmToken() != null && !device.getFcmToken().isEmpty()) {
                try {
                    com.google.firebase.messaging.Message fcmMessage = com.google.firebase.messaging.Message.builder()
                            .setToken(device.getFcmToken())
                            .putData("type", type)
                            .putData("messageId", messageId)
                            .setNotification(com.google.firebase.messaging.Notification.builder()
                                    .setTitle("New Message")
                                    .setBody("You have a new message on Convey")
                                    .build())
                            .build();

                    String response = com.google.firebase.messaging.FirebaseMessaging.getInstance().send(fcmMessage);
                    log.info("Successfully sent FCM message: " + response);
                } catch (Exception e) {
                    log.error("Failed to send FCM message to device {}", device.getId(), e);
                }
            }
        }
    }
}
