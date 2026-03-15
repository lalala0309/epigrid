package com.example.disease_service.service;

import com.example.disease_service.entity.NhomNguyHiem;
import com.example.disease_service.repository.NhomNguyHiemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DangerGroupService {

    private final NhomNguyHiemRepository repository;

    public List<NhomNguyHiem> getAll() {
        return repository.findAll();
    }

    public NhomNguyHiem getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danger group not found"));
    }

    public NhomNguyHiem create(NhomNguyHiem group) {
        return repository.save(group);
    }

    public NhomNguyHiem update(Integer id, NhomNguyHiem data) {

        NhomNguyHiem group = getById(id);

        group.setTenNhom(data.getTenNhom());
        group.setMoTa(data.getMoTa());

        return repository.save(group);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}