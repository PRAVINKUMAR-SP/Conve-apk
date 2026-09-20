package com.convey.websocket;

import com.convey.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("WebSocket connected: sessionId={}", sessionId);

        // TODO: Extract userId from JWT in connect headers and set online status
        // String userId = extractUserIdFromHeaders(headerAccessor);
        // if (userId != null) {
        //     userService.setOnlineStatus(userId, true);
        // }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("WebSocket disconnected: sessionId={}", sessionId);

        // TODO: Set user offline and update lastSeen
        // String userId = extractUserIdFromHeaders(headerAccessor);
        // if (userId != null) {
        //     userService.setOnlineStatus(userId, false);
        // }
    }
}
