package com.example.disease_service.controller;

import com.example.disease_service.dto.DiseaseRequest;
import com.example.disease_service.dto.DiseaseResponse;
import com.example.disease_service.entity.DichBenh;
import com.example.disease_service.service.DiseaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases")
@RequiredArgsConstructor
@CrossOrigin
public class DiseaseController {

    private final DiseaseService diseaseService;

    @GetMapping
    public List<DiseaseResponse> getAll() {
        return diseaseService.getAllFull();
    }

    @GetMapping("/{id}")
    public DichBenh getById(@PathVariable Integer id) {
        return diseaseService.getById(id);
    }

    @PostMapping
    public DichBenh create(@RequestBody DiseaseRequest request) {
        return diseaseService.create(request);
    }

    @PutMapping("/{id}")
    public DichBenh update(@PathVariable Integer id,
            @RequestBody DiseaseRequest request) {
        return diseaseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        diseaseService.delete(id);
    }
}