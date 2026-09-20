package com.convey.controller;

import com.convey.dto.SendMessageRequest;
import com.convey.model.Conversation;
import com.convey.model.ConversationMember;
import com.convey.model.Message;
import com.convey.security.UserPrincipal;
import com.convey.service.ChatService;
import com.convey.service.MessageService;
import com.convey.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final MessageService messageService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMyChats(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Conversation> conversations = chatService.getUserConversations(principal.getId());

        List<Map<String, Object>> result = conversations.stream().map(convo -> {
            Map<String, Object> chatInfo = new HashMap<>();
            chatInfo.put("conversation", convo);

            // Get the other participant(s) info
            List<ConversationMember> members = chatService.getConversationMembers(convo.getId());
            List<Map<String, Object>> memberProfiles = members.stream()
                    .filter(m -> !m.getUserId().equals(principal.getId()))
                    .map(m -> {
                        Map<String, Object> profile = new HashMap<>();
                        try {
                            profile.put("user", userService.getProfile(m.getUserId()));
                        } catch (Exception e) {
                            profile.put("userId", m.getUserId());
                        }
                        return profile;
                    })
                    .toList();
            chatInfo.put("participants", memberProfiles);

            return chatInfo;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<Page<Message>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Message> messages = messageService.getMessages(conversationId, page, size);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SendMessageRequest request) {
        Message message = messageService.sendMessage(principal.getId(), request);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/messages/{messageId}/delivered")
    public ResponseEntity<Void> markDelivered(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String messageId) {
        messageService.markDelivered(messageId, principal.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/messages/{messageId}/read")
    public ResponseEntity<Void> markRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String messageId) {
        messageService.markRead(messageId, principal.getId());
        return ResponseEntity.ok().build();
    }
}
