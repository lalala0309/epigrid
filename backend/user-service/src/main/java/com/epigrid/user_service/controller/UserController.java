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
                    return dto;
                })
                .toList();
    }

    @GetMapping("/{id}")
    public ManagerResponse getNhanVienById(@PathVariable Integer id) {

        Object[] row = nguoiDungRepository.findNhanVienRawById(id)
                .orElseThrow(() -> new RuntimeException("Không phải nhân viên y tế"));

        ManagerResponse dto = new ManagerResponse();
        dto.setMaNguoiDung((Integer) row[0]);
        dto.setHoTen((String) row[1]);
        dto.setEmail((String) row[2]);
        dto.setTrangThai((String) row[3]);
        dto.setMaNhanVien((String) row[4]);

        return dto;
    }
}
