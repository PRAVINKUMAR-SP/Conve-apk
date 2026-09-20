package com.convey.dto;

import com.convey.model.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "Receiver ID is required")
    private String receiverId;

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    private String text;

    private String mediaUrl;

    // For creating a new conversation if one doesn't exist
    private String conversationId;
}
