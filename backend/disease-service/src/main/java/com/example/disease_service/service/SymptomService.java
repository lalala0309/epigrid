package com.example.disease_service.service;

import com.example.disease_service.dto.SymptomResponse;
import com.example.disease_service.entity.TrieuChung;
import com.example.disease_service.repository.TrieuChungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SymptomService {

    private final TrieuChungRepository repository;

    /*
     * ======================
     * GET ALL
     * ======================
     */
    public List<SymptomResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /*
     * ======================
     * GET BY ID
     * ======================
     */
    public SymptomResponse getById(Integer id) {

        TrieuChung entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));

        return toResponse(entity);
    }

    /*
     * ======================
     * CREATE
     * ======================
     */
    public SymptomResponse create(SymptomResponse dto) {

        TrieuChung entity = TrieuChung.builder()
                .tenTrieuChung(dto.getName())
                .moTa(dto.getDescription())
                .build();

        TrieuChung saved = repository.save(entity);

        return toResponse(saved);
    }

    /*
     * ======================
     * UPDATE
     * ======================
     */
    public SymptomResponse update(Integer id, SymptomResponse dto) {

        TrieuChung entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Symptom not found"));

        entity.setTenTrieuChung(dto.getName());
        entity.setMoTa(dto.getDescription());

        TrieuChung saved = repository.save(entity);

        return toResponse(saved);
    }

    /*
     * ======================
     * DELETE
     * ======================
     */
    public void delete(Integer id) {

        repository.deleteById(id);
    }

    /*
     * ======================
     * MAPPING
     * ======================
     */
    private SymptomResponse toResponse(TrieuChung entity) {

        return SymptomResponse.builder()
                .id(entity.getMaTrieuChung())
                .name(entity.getTenTrieuChung())
                .description(entity.getMoTa())
                .build();
    }
}