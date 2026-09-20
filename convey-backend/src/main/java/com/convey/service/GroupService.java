package com.convey.service;

import com.convey.dto.CreateGroupRequest;
import com.convey.model.*;
import com.convey.model.enums.ConversationType;
import com.convey.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;

    /**
     * Create a new group with the creator as ADMIN and specified members.
     * Also creates a GROUP conversation for messaging.
     */
    public Group createGroup(String creatorId, CreateGroupRequest request) {
        // Create the group
        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .groupPhotoUrl(request.getGroupPhotoUrl())
                .createdBy(creatorId)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        group = groupRepository.save(group);

        // Add creator as ADMIN
        groupMemberRepository.save(GroupMember.builder()
                .groupId(group.getId())
                .userId(creatorId)
                .role("ADMIN")
                .joinedAt(Instant.now())
                .build());

        // Add other members
        for (String memberId : request.getMemberIds()) {
            if (!memberId.equals(creatorId)) {
                groupMemberRepository.save(GroupMember.builder()
                        .groupId(group.getId())
                        .userId(memberId)
                        .role("MEMBER")
                        .joinedAt(Instant.now())
                        .build());
            }
        }

        // Create a GROUP conversation linked to this group
        Conversation conversation = Conversation.builder()
                .type(ConversationType.GROUP)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        conversation = conversationRepository.save(conversation);

        // Add all members to the conversation
        List<String> allMembers = new java.util.ArrayList<>(request.getMemberIds());
        if (!allMembers.contains(creatorId)) {
            allMembers.add(creatorId);
        }

        for (String memberId : allMembers) {
            conversationMemberRepository.save(ConversationMember.builder()
                    .conversationId(conversation.getId())
                    .userId(memberId)
                    .joinedAt(Instant.now())
                    .build());
        }

        return group;
    }

    /**
     * Get all groups the user is a member of.
     */
    public List<Group> getUserGroups(String userId) {
        List<GroupMember> memberships = groupMemberRepository.findByUserId(userId);
        List<String> groupIds = memberships.stream()
                .map(GroupMember::getGroupId)
                .toList();
        return groupRepository.findAllById(groupIds);
    }

    /**
     * Get members of a group.
     */
    public List<GroupMember> getGroupMembers(String groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }

    /**
     * Add a member to a group (only if not already a member).
     */
    public void addMember(String groupId, String userId) {
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            groupMemberRepository.save(GroupMember.builder()
                    .groupId(groupId)
                    .userId(userId)
                    .role("MEMBER")
                    .joinedAt(Instant.now())
                    .build());
        }
    }

    /**
     * Remove a member from a group.
     */
    public void removeMember(String groupId, String userId) {
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
    }

    /**
     * Update group info (name, description, photo).
     */
    public Group updateGroup(String groupId, String name, String description, String groupPhotoUrl) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (name != null && !name.isBlank()) group.setName(name);
        if (description != null) group.setDescription(description);
        if (groupPhotoUrl != null) group.setGroupPhotoUrl(groupPhotoUrl);

        group.setUpdatedAt(Instant.now());
        return groupRepository.save(group);
    }
}
