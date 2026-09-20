package com.convey.dto;

import com.convey.model.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStatusRequest {

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    private String content;

    private String mediaUrl;
}
