package com.example.area_service.controller;

import com.example.area_service.dto.AreaResponse;
import com.example.area_service.dto.ManagerResponse;
import com.example.area_service.service.AreaService;
import com.example.area_service.service.AreaStaffService;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;
    private final AreaStaffService areaStaffService;

    @GetMapping
    public List<AreaResponse> getAll() {
        return areaService.getAllAreas();
    }

    // nhân viên của khu vực
    @GetMapping("/{maKhuVuc}/staff")
    public List<ManagerResponse> getStaffOfArea(@PathVariable Integer maKhuVuc) {
        return areaStaffService.getNhanVienKhuVuc(maKhuVuc);
    }

    // nhân viên chưa phân công
    @GetMapping("/{maKhuVuc}/staff-available")
    public List<ManagerResponse> getAvailableStaff(@PathVariable Integer maKhuVuc) {
        return areaStaffService.getNhanVienChuaPhanCong(maKhuVuc);
    }

    @PostMapping("/{maKhuVuc}/assign-staff")
    public ResponseEntity<?> assignStaff(
            @PathVariable Integer maKhuVuc,
            @RequestBody List<Integer> staffIds) {

        areaService.assignStaff(maKhuVuc, staffIds);
        return ResponseEntity.ok("Assigned successfully");
    }
}