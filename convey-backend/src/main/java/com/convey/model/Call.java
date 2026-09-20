package com.convey.model;

import com.convey.model.enums.CallStatus;
import com.convey.model.enums.CallType;
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
@Document(collection = "calls")
public class Call {

    @Id
    private String id;

    @Indexed
    private String callerId;

    @Indexed
    private String receiverId;

    private CallType type;

    @Builder.Default
    private CallStatus status = CallStatus.RINGING;

    private Instant startedAt;

    private Instant endedAt;

    private Long durationSeconds;

    private Instant createdAt;
}
