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

        return new AuthResponse(token, user.getVaiTro().getTenVaiTro());
    }
}