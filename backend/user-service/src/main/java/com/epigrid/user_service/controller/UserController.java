package com.epigrid.user_service.controller;

import com.epigrid.user_service.dto.*;
import com.epigrid.user_service.service.*;
import lombok.RequiredArgsConstructor;

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
}
