package com.convey.model;

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
@Document(collection = "statuses")
public class Status {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    private String content;   // text content or caption

    private String mediaUrl;  // for IMAGE/VIDEO statuses

    private Instant createdAt;

    private Instant expiresAt; // auto-expire after 24 hours
}
