package com.convey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String name;
    private String phoneNumber;
    private String profilePhotoUrl;
    private String publicKey;
    private String about;
    private boolean online;
    private String lastSeen;
}
