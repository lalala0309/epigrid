package com.example.disease_service.service;

import com.example.disease_service.dto.*;
import com.example.disease_service.entity.DuongLay;
import com.example.disease_service.repository.DuongLayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransmissionService {

    private final DuongLayRepository repository;

    public List<TransmissionResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TransmissionResponse getById(Integer id) {

        DuongLay dl = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đường lây"));

        return toDTO(dl);
    }

    public TransmissionResponse create(TransmissionResponse dto) {

        DuongLay entity = DuongLay.builder()
                .tenDuongLay(dto.getTenDuongLay())
                .moTa(dto.getMoTa())
                .build();

        return toDTO(repository.save(entity));
    }

    public TransmissionResponse update(Integer id, TransmissionResponse dto) {

        DuongLay entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đường lây"));

        entity.setTenDuongLay(dto.getTenDuongLay());
        entity.setMoTa(dto.getMoTa());

        return toDTO(repository.save(entity));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    private TransmissionResponse toDTO(DuongLay entity) {

        return TransmissionResponse.builder()
                .maDuongLay(entity.getMaDuongLay())
                .tenDuongLay(entity.getTenDuongLay())
                .moTa(entity.getMoTa())
                .build();
    }
}