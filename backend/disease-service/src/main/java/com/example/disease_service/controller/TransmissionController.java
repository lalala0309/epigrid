package com.example.disease_service.controller;

import com.example.disease_service.dto.*;
import com.example.disease_service.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases/transmissions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TransmissionController {

    private final TransmissionService service;

    @GetMapping
    public List<TransmissionResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TransmissionResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public TransmissionResponse create(@RequestBody TransmissionResponse dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public TransmissionResponse update(@PathVariable Integer id,
            @RequestBody TransmissionResponse dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}