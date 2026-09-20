package com.convey.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "message_status")
@CompoundIndex(name = "msg_user_idx", def = "{'messageId': 1, 'userId': 1}", unique = true)
public class MessageStatus {

    @Id
    private String id;

    private String messageId;

    private String userId;

    private Instant deliveredAt;

    private Instant readAt;
}
