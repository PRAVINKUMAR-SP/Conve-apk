package com.convey.model;

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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String phoneNumber;

    private String profilePhotoUrl;

    private String publicKey;

    @Builder.Default
    private String about = "Hey there! I am using Convey";

    @Builder.Default
    private boolean online = false;

    private Instant lastSeen;

    private Instant createdAt;

    private Instant updatedAt;
}
