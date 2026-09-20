package com.convey.service;

import com.convey.dto.CreateStatusRequest;
import com.convey.model.Status;
import com.convey.model.StatusView;
import com.convey.repository.StatusRepository;
import com.convey.repository.StatusViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusService {

    private final StatusRepository statusRepository;
    private final StatusViewRepository statusViewRepository;

    /**
     * Create a new status that expires in 24 hours.
     */
    public Status createStatus(String userId, CreateStatusRequest request) {
        Status status = Status.builder()
                .userId(userId)
                .type(request.getType())
                .content(request.getContent())
                .mediaUrl(request.getMediaUrl())
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();

        return statusRepository.save(status);
    }

    /**
     * Get a user's own statuses.
     */
    public List<Status> getMyStatuses(String userId) {
        return statusRepository.findByUserId(userId);
    }

    /**
     * Get active (non-expired) statuses from a list of contact user IDs.
     */
    public List<Status> getContactStatuses(List<String> contactUserIds) {
        return statusRepository.findByUserIdInAndExpiresAtAfter(contactUserIds, Instant.now());
    }

    /**
     * Record that a user viewed a status.
     */
    public void viewStatus(String statusId, String viewerId) {
        if (!statusViewRepository.existsByStatusIdAndViewerId(statusId, viewerId)) {
            statusViewRepository.save(StatusView.builder()
                    .statusId(statusId)
                    .viewerId(viewerId)
                    .viewedAt(Instant.now())
                    .build());
        }
    }

    /**
     * Get who has viewed a specific status.
     */
    public List<StatusView> getStatusViews(String statusId) {
        return statusViewRepository.findByStatusId(statusId);
    }
}
