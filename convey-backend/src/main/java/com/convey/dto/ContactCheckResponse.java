package com.convey.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactCheckResponse {

    private String phoneNumber;
    private boolean registered;
    private String userId;
    private String name;
    private String profilePhotoUrl;
    private String about;
}
