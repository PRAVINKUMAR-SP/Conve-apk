package com.convey.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactCheckRequest {

    @NotEmpty(message = "Phone numbers list cannot be empty")
    private List<String> phoneNumbers;
}
