package com.epigrid.user_service.service;

import org.locationtech.jts.geom.*;
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

        // update vị trí người dùng sau mỗi lần đăng nhập
        if (request.getLat() != null && request.getLng() != null) {

            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

            Point point = geometryFactory.createPoint(
                    new Coordinate(request.getLng(), request.getLat()));

            user.setViTri(point);
            repo.save(user); // lưu lại
        }
        String token = jwt.generateToken(
                user.getEmail(),
                user.getVaiTro().getTenVaiTro(),
                user.getHoTen());

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