package com.convey.model;

import com.convey.model.enums.MessageDeliveryStatus;
import com.convey.model.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @Indexed
    private String conversationId;

    private String senderId;

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    private String text;

    private String mediaUrl;

    @Builder.Default
    private MessageDeliveryStatus status = MessageDeliveryStatus.SENT;

    private Instant createdAt;
}
