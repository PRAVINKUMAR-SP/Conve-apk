package com.convey.service;

import com.convey.dto.ContactCheckResponse;
import com.convey.model.User;
import com.convey.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final UserRepository userRepository;

    /**
     * Check which phone numbers from the user's device contacts are registered on Convey.
     * Only sends back registration status and basic profile info — not local contact names.
     */
    public List<ContactCheckResponse> checkContacts(List<String> phoneNumbers) {
        // Normalize phone numbers
        List<String> normalized = phoneNumbers.stream()
                .map(this::normalizePhoneNumber)
                .toList();

        // Find registered users matching these phone numbers
        List<User> registeredUsers = userRepository.findByPhoneNumberIn(normalized);

        // Build a lookup map
        Map<String, User> registeredMap = registeredUsers.stream()
                .collect(Collectors.toMap(User::getPhoneNumber, u -> u));

        // Build response list
        List<ContactCheckResponse> results = new ArrayList<>();
        for (String phone : normalized) {
            User user = registeredMap.get(phone);
            if (user != null) {
                results.add(ContactCheckResponse.builder()
                        .phoneNumber(phone)
                        .registered(true)
                        .userId(user.getId())
                        .name(user.getName())
                        .profilePhotoUrl(user.getProfilePhotoUrl())
                        .about(user.getAbout())
                        .build());
            } else {
                results.add(ContactCheckResponse.builder()
                        .phoneNumber(phone)
                        .registered(false)
                        .build());
            }
        }

        return results;
    }

    private String normalizePhoneNumber(String phone) {
        // Remove spaces, dashes, and ensure + prefix
        String cleaned = phone.replaceAll("[\\s\\-()]", "");
        if (!cleaned.startsWith("+")) {
            cleaned = "+91" + cleaned; // Default to India country code
        }
        return cleaned;
    }
}
