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
@Document(collection = "group_members")
@CompoundIndex(name = "group_user_idx", def = "{'groupId': 1, 'userId': 1}", unique = true)
public class GroupMember {

    @Id
    private String id;

    private String groupId;

    private String userId;

    @Builder.Default
    private String role = "MEMBER"; // ADMIN or MEMBER

    private Instant joinedAt;
}
