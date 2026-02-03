package com.epigrid.user_service.controller;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        System.out.println("🔥 CONTROLLER HIT");
        return service.login(request);
    }
}