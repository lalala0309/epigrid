package com.epigrid.user_service.service;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.entity.*;
import com.epigrid.user_service.repository.*;
import com.epigrid.user_service.security.*;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final NguoiDungRepository repo;

    public List<UserDTO> getAllUsers() {

        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

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
