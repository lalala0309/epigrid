package com.example.area_service.controller;

import com.example.area_service.dto.AreaResponse;
import com.example.area_service.service.AreaService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public List<AreaResponse> getAll() {
        return areaService.getAllAreas();
    }
}