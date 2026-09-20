package com.convey.controller;

import com.convey.dto.CreateGroupRequest;
import com.convey.model.Group;
import com.convey.model.GroupMember;
import com.convey.security.UserPrincipal;
import com.convey.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<Group> createGroup(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateGroupRequest request) {
        Group group = groupService.createGroup(principal.getId(), request);
        return ResponseEntity.ok(group);
    }

    @GetMapping
    public ResponseEntity<List<Group>> getMyGroups(@AuthenticationPrincipal UserPrincipal principal) {
        List<Group> groups = groupService.getUserGroups(principal.getId());
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMember>> getGroupMembers(@PathVariable String groupId) {
        List<GroupMember> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Void> addMember(
            @PathVariable String groupId,
            @RequestBody Map<String, String> body) {
        groupService.addMember(groupId, body.get("userId"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String groupId,
            @PathVariable String userId) {
        groupService.removeMember(groupId, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable String groupId,
            @RequestBody Map<String, String> updates) {
        Group group = groupService.updateGroup(
                groupId,
                updates.get("name"),
                updates.get("description"),
                updates.get("groupPhotoUrl"));
        return ResponseEntity.ok(group);
    }
}
