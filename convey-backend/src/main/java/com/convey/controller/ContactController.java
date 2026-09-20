package com.convey.controller;

import com.convey.dto.ContactCheckRequest;
import com.convey.dto.ContactCheckResponse;
import com.convey.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/check")
    public ResponseEntity<List<ContactCheckResponse>> checkContacts(
            @Valid @RequestBody ContactCheckRequest request) {
        List<ContactCheckResponse> results = contactService.checkContacts(request.getPhoneNumbers());
        return ResponseEntity.ok(results);
    }
}
