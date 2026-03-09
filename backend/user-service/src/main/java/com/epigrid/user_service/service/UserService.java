package com.epigrid.user_service.service;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.entity.*;
import com.epigrid.user_service.repository.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final NguoiDungRepository repo;

    // Lấy tất cả user
    public List<UserDTO> getAllUsers() {

        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // Lấy danh sách nhân viên y tế
    public List<ManagerResponse> getNhanVienYTe() {
        var list = repo.findAllNhanVienYTe();

        System.out.println("Nhan vien y te: " + list.size());

        return repo.findAllNhanVienYTe() // sửa ở đây
                .stream()
                .map(n -> {
                    ManagerResponse dto = new ManagerResponse();
                    dto.setMaNguoiDung(n.getMaNguoiDung());
                    dto.setHoTen(n.getHoTen());
                    dto.setEmail(n.getEmail());
                    dto.setTrangThai(n.getTrangThai());
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
}