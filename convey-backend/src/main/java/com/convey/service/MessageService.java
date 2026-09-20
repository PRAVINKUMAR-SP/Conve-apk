package com.convey.service;

import com.convey.dto.SendMessageRequest;
import com.convey.model.Message;
import com.convey.model.MessageStatus;
import com.convey.model.enums.MessageDeliveryStatus;
import com.convey.repository.MessageRepository;
import com.convey.repository.MessageStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageStatusRepository messageStatusRepository;
    private final ChatService chatService;

    /**
     * Send a message in a conversation. Creates conversation if needed.
     */
    public Message sendMessage(String senderId, SendMessageRequest request) {
        String conversationId = request.getConversationId();

        // If no conversation ID, create/find one
        if (conversationId == null || conversationId.isBlank()) {
            var conversation = chatService.getOrCreatePrivateConversation(senderId, request.getReceiverId());
            conversationId = conversation.getId();
        }

        // Create and save message
        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .type(request.getType())
                .text(request.getText())
                .mediaUrl(request.getMediaUrl())
                .status(MessageDeliveryStatus.SENT)
                .createdAt(Instant.now())
                .build();

        message = messageRepository.save(message);

        // Update conversation's last message
        String preview = request.getText() != null ? request.getText() : "[" + request.getType().name() + "]";
        chatService.updateLastMessage(conversationId, preview);

        return message;
    }

    /**
     * Get paginated messages for a conversation, newest first.
     */
    public Page<Message> getMessages(String conversationId, int page, int size) {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(
                conversationId, PageRequest.of(page, size));
    }

    /**
     * Mark a message as delivered for a specific user.
     */
    public void markDelivered(String messageId, String userId) {
        if (!messageStatusRepository.findByMessageIdAndUserId(messageId, userId).isPresent()) {
            messageStatusRepository.save(MessageStatus.builder()
                    .messageId(messageId)
                    .userId(userId)
                    .deliveredAt(Instant.now())
                    .build());
        }

        // Update message status if all recipients have received it
        messageRepository.findById(messageId).ifPresent(msg -> {
            msg.setStatus(MessageDeliveryStatus.DELIVERED);
            messageRepository.save(msg);
        });
    }

    /**
     * Mark a message as read by a specific user.
     */
    public void markRead(String messageId, String userId) {
        messageStatusRepository.findByMessageIdAndUserId(messageId, userId)
                .ifPresentOrElse(
                        status -> {
                            status.setReadAt(Instant.now());
                            messageStatusRepository.save(status);
                        },
                        () -> messageStatusRepository.save(MessageStatus.builder()
                                .messageId(messageId)
                                .userId(userId)
                                .deliveredAt(Instant.now())
                                .readAt(Instant.now())
                                .build())
                );

        // Update message status
        messageRepository.findById(messageId).ifPresent(msg -> {
            msg.setStatus(MessageDeliveryStatus.READ);
            messageRepository.save(msg);
        });
    }

    /**
     * Get delivery/read statuses for a message.
     */
    public List<MessageStatus> getMessageStatuses(String messageId) {
        return messageStatusRepository.findByMessageId(messageId);
    }
}
