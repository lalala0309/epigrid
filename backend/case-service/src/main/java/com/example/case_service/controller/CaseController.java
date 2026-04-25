package com.example.case_service.controller;

import com.example.case_service.dto.*;
import com.example.case_service.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

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

    @PutMapping("/contacts/{contactId}")
    public ResponseEntity<CaTiepXucResponse> updateContact(
            @PathVariable Integer contactId,
            @RequestBody CaTiepXucRequest request) {
        return ResponseEntity.ok(caseService.updateContact(contactId, request));
    }

    @GetMapping("/count-case-today")
    public long countToday() {
        return caseService.countCaBenhHomNay();
    }

    @GetMapping("/contacts/count-contact-today")
    public long countContactToday() {
        return caseService.countCaTiepXucHomNay();
    }

    @GetMapping("/chart/top-diseases")
    public ResponseEntity<?> getChart(@RequestParam int days) {
        return ResponseEntity.ok(caseService.getTopDiseaseChart(days));
    }

    @GetMapping("/chart/disease-pie")
    public ResponseEntity<?> getPieChart(@RequestParam int days) {
        return ResponseEntity.ok(caseService.getDiseasePieChart(days));
    }

    @GetMapping("/nearby-summary")
    public List<Map<String, Object>> getNearbySummary(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") double radius) {
        return caseService.getNearbySummary(lat, lng, radius);
    }

    @GetMapping("/stats/today")
    public ResponseEntity<?> getTodayStats(
            @RequestParam Integer maKhuVuc,
            @RequestParam Integer diseaseId) {

        return ResponseEntity.ok(
                caseService.getTodayStatsByArea(maKhuVuc, diseaseId));
    }

    @GetMapping("/chart/line")
    public ResponseEntity<?> getLineChart(
            @RequestParam Integer maKhuVuc,
            @RequestParam Integer diseaseId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(
                caseService.getLineChart(
                        maKhuVuc,
                        diseaseId,
                        LocalDate.parse(startDate),
                        LocalDate.parse(endDate)));
    }

    @GetMapping("/chart/status-pie")
    public ResponseEntity<?> getStatusPie(
            @RequestParam Integer maKhuVuc,
            @RequestParam Integer diseaseId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(
                caseService.getPieChartByStatus(
                        maKhuVuc,
                        diseaseId,
                        LocalDate.parse(startDate),
                        LocalDate.parse(endDate)));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam Integer maKhuVuc) {
        return ResponseEntity.ok(
                caseService.getCaseHistoryByArea(maKhuVuc));
    }

    @GetMapping("/disease-stats")
    public ResponseEntity<?> getDiseaseStats(
            @RequestParam Integer maKhuVuc) {

        return ResponseEntity.ok(
                caseService.getDiseaseStatsByArea(maKhuVuc));
    }

    @GetMapping("/today-cases")
    public ResponseEntity<?> getTodayCases(
            @RequestParam Integer maKhuVuc) {
        return ResponseEntity.ok(
                caseService.getTodayCasesByArea(maKhuVuc));
    }

    @GetMapping("/check-user/{userId}")
    public boolean checkUserUsed(@PathVariable Integer userId) {
        return caseService.isUserUsed(userId);
    }
}