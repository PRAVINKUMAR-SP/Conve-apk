package com.convey.service;

import com.convey.model.Conversation;
import com.convey.model.ConversationMember;
import com.convey.model.enums.ConversationType;
import com.convey.repository.ConversationMemberRepository;
import com.convey.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;

    /**
     * Get or create a private 1-to-1 conversation between two users.
     */
    public Conversation getOrCreatePrivateConversation(String userId1, String userId2) {
        // Check if a private conversation already exists between these two users
        List<ConversationMember> user1Convos = conversationMemberRepository.findByUserId(userId1);

        for (ConversationMember cm : user1Convos) {
            Optional<Conversation> convo = conversationRepository.findById(cm.getConversationId());
            if (convo.isPresent() && convo.get().getType() == ConversationType.PRIVATE) {
                boolean user2IsMember = conversationMemberRepository
                        .existsByConversationIdAndUserId(cm.getConversationId(), userId2);
                if (user2IsMember) {
                    return convo.get();
                }
            }
        }

        // Create new private conversation
        Conversation conversation = Conversation.builder()
                .type(ConversationType.PRIVATE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        conversation = conversationRepository.save(conversation);

        // Add both members
        conversationMemberRepository.save(ConversationMember.builder()
                .conversationId(conversation.getId())
                .userId(userId1)
                .joinedAt(Instant.now())
                .build());

        conversationMemberRepository.save(ConversationMember.builder()
                .conversationId(conversation.getId())
                .userId(userId2)
                .joinedAt(Instant.now())
                .build());

        return conversation;
    }

    /**
     * Get all conversations for a user, sorted by most recent message.
     */
    public List<Conversation> getUserConversations(String userId) {
        List<ConversationMember> memberships = conversationMemberRepository.findByUserId(userId);
        List<String> conversationIds = memberships.stream()
                .map(ConversationMember::getConversationId)
                .toList();

        return conversationRepository.findAllById(conversationIds).stream()
                .sorted((a, b) -> {
                    Instant aTime = a.getLastMessageAt() != null ? a.getLastMessageAt() : a.getCreatedAt();
                    Instant bTime = b.getLastMessageAt() != null ? b.getLastMessageAt() : b.getCreatedAt();
                    return bTime.compareTo(aTime); // Most recent first
                })
                .toList();
    }

    /**
     * Get other members of a conversation (for displaying contact info in chat).
     */
    public List<ConversationMember> getConversationMembers(String conversationId) {
        return conversationMemberRepository.findByConversationId(conversationId);
    }

    /**
     * Update conversation's last message preview.
     */
    public void updateLastMessage(String conversationId, String lastMessage) {
        conversationRepository.findById(conversationId).ifPresent(convo -> {
            convo.setLastMessage(lastMessage);
            convo.setLastMessageAt(Instant.now());
            convo.setUpdatedAt(Instant.now());
            conversationRepository.save(convo);
        });
    }
}
