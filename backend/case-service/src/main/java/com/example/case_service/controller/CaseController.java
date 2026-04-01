package com.example.case_service.controller;

import com.example.case_service.dto.*;
import com.example.case_service.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CaseController {

    private final CaseService caseService;

    @GetMapping
    public ResponseEntity<List<CaBenhResponse>> getAll() {
        return ResponseEntity.ok(caseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaBenhResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(caseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CaBenhResponse> create(@RequestBody CaBenhRequest request) {
        return ResponseEntity.ok(caseService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaBenhResponse> update(
            @PathVariable Integer id,
            @RequestBody CaBenhRequest request) {
        return ResponseEntity.ok(caseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        caseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Ca tiếp xúc ─────────────────────────────────────────────────────────

    @GetMapping("/{id}/contacts")
    public ResponseEntity<List<CaTiepXucResponse>> getContacts(@PathVariable Integer id) {
        return ResponseEntity.ok(caseService.getContacts(id));
    }

    @PostMapping("/{id}/contacts")
    public ResponseEntity<CaTiepXucResponse> addContact(
            @PathVariable Integer id,
            @RequestBody CaTiepXucRequest request) {
        return ResponseEntity.ok(caseService.addContact(id, request));
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer contactId) {
        caseService.deleteContact(contactId);
        return ResponseEntity.noContent().build();
    }
}