package com.convey.websocket;

import com.convey.dto.SendMessageRequest;
import com.convey.model.Message;
import com.convey.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handle incoming chat messages via WebSocket.
     * Client sends to: /app/chat.send
     * Server forwards to: /queue/messages (user-specific)
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Received WebSocket message without authenticated principal");
            return;
        }

        String senderId = principal.getName();
        Message saved = messageService.sendMessage(senderId, request);

        // Send to the receiver's personal queue
        messagingTemplate.convertAndSendToUser(
                request.getReceiverId(),
                "/queue/messages",
                saved
        );

        // Also send back to sender for confirmation
        messagingTemplate.convertAndSendToUser(
                senderId,
                "/queue/messages",
                saved
        );

        log.debug("Message sent via WebSocket: {} -> {}", senderId, request.getReceiverId());
    }

    /**
     * Handle typing indicators.
     * Client sends to: /app/chat.typing
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload java.util.Map<String, String> payload, Principal principal) {
        if (principal == null) return;

        String senderId = principal.getName();
        String receiverId = payload.get("receiverId");
        String conversationId = payload.get("conversationId");

        messagingTemplate.convertAndSendToUser(
                receiverId,
                "/queue/typing",
                java.util.Map.of(
                        "senderId", senderId,
                        "conversationId", conversationId != null ? conversationId : ""
                )
        );
    }
}
