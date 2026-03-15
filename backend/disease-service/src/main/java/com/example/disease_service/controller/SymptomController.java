package com.example.disease_service.controller;

import com.example.disease_service.dto.SymptomResponse;
import com.example.disease_service.service.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases/symptoms")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SymptomController {

    private final SymptomService service;

    @GetMapping
    public List<SymptomResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SymptomResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public SymptomResponse create(@RequestBody SymptomResponse dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public SymptomResponse update(
            @PathVariable Integer id,
            @RequestBody SymptomResponse dto) {

        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}