package com.epigrid.user_service.service;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.entity.*;
import com.epigrid.user_service.repository.*;
import com.epigrid.user_service.security.*;
import lombok.*;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final NguoiDungRepository repo;
    private final VaiTroRepository vaiTroRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        NguoiDung user = repo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email không tồn tại"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai mật khẩu");
        }

        String token = jwt.generateToken(
                user.getEmail(),
                user.getVaiTro().getTenVaiTro());

        return new AuthResponse(token, user.getVaiTro().getTenVaiTro(), user.getMaNguoiDung());
    }

    /* ================= REGISTER (THÊM MỚI) ================= */
    public void register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (repo.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        VaiTro role = vaiTroRepo.findByTenVaiTro("USER")
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Role USER chưa tồn tại"));

        NguoiDung user = NguoiDung.builder()
                .hoTen(request.getHoTen().trim())
                .email(email)
                .password(encoder.encode(request.getPassword()))
                .vaiTro(role)
                .viTri(null) // chưa cần vị trí
                .build();

        repo.save(user);
    }
}