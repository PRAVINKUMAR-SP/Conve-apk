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
@Document(collection = "conversation_members")
@CompoundIndex(name = "conv_user_idx", def = "{'conversationId': 1, 'userId': 1}", unique = true)
public class ConversationMember {

    @Id
    private String id;

    private String conversationId;

    private String userId;

    private Instant joinedAt;
}
