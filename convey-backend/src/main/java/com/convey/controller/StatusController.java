package com.convey.controller;

import com.convey.dto.CreateStatusRequest;
import com.convey.model.Status;
import com.convey.model.StatusView;
import com.convey.security.UserPrincipal;
import com.convey.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
@RequiredArgsConstructor
public class StatusController {

    private final StatusService statusService;

    @PostMapping
    public ResponseEntity<Status> createStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateStatusRequest request) {
        Status status = statusService.createStatus(principal.getId(), request);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Status>> getMyStatuses(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<Status> statuses = statusService.getMyStatuses(principal.getId());
        return ResponseEntity.ok(statuses);
    }

    @GetMapping
    public ResponseEntity<List<Status>> getContactStatuses(
            @RequestParam List<String> contactIds) {
        List<Status> statuses = statusService.getContactStatuses(contactIds);
        return ResponseEntity.ok(statuses);
    }

    @PostMapping("/{statusId}/view")
    public ResponseEntity<Void> viewStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String statusId) {
        statusService.viewStatus(statusId, principal.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{statusId}/views")
    public ResponseEntity<List<StatusView>> getStatusViews(@PathVariable String statusId) {
        List<StatusView> views = statusService.getStatusViews(statusId);
        return ResponseEntity.ok(views);
    }
}
