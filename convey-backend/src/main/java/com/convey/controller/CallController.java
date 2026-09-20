package com.convey.controller;

import com.convey.model.Call;
import com.convey.model.enums.CallStatus;
import com.convey.model.enums.CallType;
import com.convey.repository.CallRepository;
import com.convey.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calls")
@RequiredArgsConstructor
public class CallController {

    private final CallRepository callRepository;

    @GetMapping
    public ResponseEntity<List<Call>> getCallHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Call> calls = callRepository.findByCallerIdOrReceiverIdOrderByCreatedAtDesc(
                principal.getId(), principal.getId());
        return ResponseEntity.ok(calls);
    }

    @PostMapping
    public ResponseEntity<Call> initiateCall(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> body) {
        Call call = Call.builder()
                .callerId(principal.getId())
                .receiverId(body.get("receiverId"))
                .type(CallType.valueOf(body.getOrDefault("type", "VOICE")))
                .status(CallStatus.RINGING)
                .createdAt(Instant.now())
                .build();

        call = callRepository.save(call);
        return ResponseEntity.ok(call);
    }

    @PutMapping("/{callId}/status")
    public ResponseEntity<Call> updateCallStatus(
            @PathVariable String callId,
            @RequestBody Map<String, String> body) {
        Call call = callRepository.findById(callId)
                .orElseThrow(() -> new RuntimeException("Call not found"));

        CallStatus status = CallStatus.valueOf(body.get("status"));
        call.setStatus(status);

        if (status == CallStatus.ONGOING) {
            call.setStartedAt(Instant.now());
        } else if (status == CallStatus.ENDED) {
            call.setEndedAt(Instant.now());
            if (call.getStartedAt() != null) {
                call.setDurationSeconds(
                        call.getEndedAt().getEpochSecond() - call.getStartedAt().getEpochSecond());
            }
        }

        call = callRepository.save(call);
        return ResponseEntity.ok(call);
    }
}
