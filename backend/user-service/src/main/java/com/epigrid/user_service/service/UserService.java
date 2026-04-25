package com.epigrid.user_service.service;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.entity.*;
import com.epigrid.user_service.repository.*;
import com.epigrid.user_service.config.*;
import lombok.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final NguoiDungRepository repo;
    private final NhanVienYTeRepository nvytRepo;
    private final VaiTroRepository vaiTroRepo;

    private final RestTemplate restTemplate;

    // Lấy tất cả user
    public List<UserDTO> getAllUsers() {

        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // Lấy danh sách nhân viên y tế
    public List<ManagerResponse> getNhanVienYTe() {
        return repo.findAllNhanVienYTe()
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

    // Convert entity -> DTO
    private UserDTO toDTO(NguoiDung u) {

        var p = u.getViTri();
        String viTri = null;

        if (p != null) {
            viTri = p.getY() + ", " + p.getX();
        }

        return new UserDTO(
                u.getMaNguoiDung(),
                u.getHoTen(),
                u.getEmail(),
                u.getVaiTro().getMaVaiTro(),
                u.getVaiTro().getTenVaiTro(),
                viTri,
                u.getTrangThai());
    }

    public List<UserDTO> getNearbyUsers(double lat, double lng, double radius) {

        List<NguoiDung> users = repo.findUsersNearby(lat, lng, radius);

        return users.stream().map(u -> new UserDTO(
                u.getMaNguoiDung(),
                u.getHoTen(),
                u.getEmail())).toList();
    }

    public long countUsers() {
        return repo.count();
    }

    public long countNhanVienYTe() {
        return nvytRepo.count();
    }

    @Transactional
    public void updateRole(Integer userId, UpdateRoleRequest req) {

        NguoiDung user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Integer oldRole = user.getVaiTro().getMaVaiTro();
        Integer newRole = req.getMaVaiTro();

        VaiTro role = vaiTroRepo.findById(newRole)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        user.setVaiTro(role);

        // ===== CASE 1: lên MANAGER =====
        if (newRole == 2) {
            if (req.getMaNhanVien() == null || req.getMaNhanVien().isEmpty()) {
                throw new RuntimeException("Phải nhập mã nhân viên y tế");
            }

            NhanVienYTe nv = new NhanVienYTe();
            nv.setMaNhanVien(req.getMaNhanVien());
            nv.setNguoiDung(user);

            nvytRepo.save(nv);
        }

        // ===== CASE 2: từ MANAGER xuống USER =====
        if (oldRole == 2 && newRole != 2) {
            nvytRepo.findAll().stream()
                    .filter(nv -> nv.getNguoiDung().getMaNguoiDung().equals(userId))
                    .findFirst()
                    .ifPresent(nvytRepo::delete);
        }

        repo.save(user);
    }

    public void deleteUser(Integer userId) {

        // gọi case-service
        Boolean usedInCase = restTemplate.getForObject(
                "http://localhost:8084/api/cases/check-user/" + userId,
                Boolean.class);

        // gọi area-service
        Boolean usedInArea = restTemplate.getForObject(
                "http://localhost:8082/api/areas/check-user/" + userId,
                Boolean.class);

        if (Boolean.TRUE.equals(usedInCase) || Boolean.TRUE.equals(usedInArea)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User đã được sử dụng, không thể xoá");
        }

        Optional<NhanVienYTe> nv = nvytRepo.findByNguoiDung_MaNguoiDung(userId);
        nv.ifPresent(nvytRepo::delete);

        repo.deleteById(userId);
    }
}