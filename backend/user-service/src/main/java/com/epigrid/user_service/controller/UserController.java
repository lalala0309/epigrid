package com.epigrid.user_service.controller;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.entity.NguoiDung;
import com.epigrid.user_service.repository.NguoiDungRepository;
import com.epigrid.user_service.service.*;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService service;

    @GetMapping
    public List<UserDTO> getAll() {
        return service.getAllUsers();
    }

    private final NguoiDungRepository nguoiDungRepository;

    @GetMapping("/manager")
    public List<ManagerResponse> getNhanVienYTe() {

        return nguoiDungRepository.findAllNhanVienYTe()
                .stream()
                .map(n -> {
                    ManagerResponse dto = new ManagerResponse();
                    dto.setMaNguoiDung(n.getMaNguoiDung());
                    dto.setHoTen(n.getHoTen());
                    dto.setEmail(n.getEmail());
                    dto.setTrangThai(n.getTrangThai());
                    dto.setMaNhanVien(n.getMaNhanVien());
                    return dto;
                })
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNhanVienById(@PathVariable Integer id) {

        return nguoiDungRepository.findNhanVienRawById(id)
                .map(p -> {
                    ManagerResponse dto = new ManagerResponse();
                    dto.setMaNguoiDung(p.getMaNguoiDung());
                    dto.setHoTen(p.getHoTen());
                    dto.setEmail(p.getEmail());
                    dto.setTrangThai(p.getTrangThai());
                    dto.setMaNhanVien(p.getMaNhanVien());
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") double radius) {
        try {
            List<UserDTO> result = service.getNearbyUsers(lat, lng, radius);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/count")
    public long countUsers() {
        return service.countUsers();
    }

    @GetMapping("/count-nvyt")
    public long countNhanVienYTe() {
        return service.countNhanVienYTe();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable Integer id,
            @RequestBody UpdateRoleRequest req) {

        service.updateRole(id, req);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        service.deleteUser(id);
        return ResponseEntity.ok("Xóa thành công");
    }
}
