package com.example.disease_service.service;

import com.example.disease_service.dto.AgentTypeResponse;
import com.example.disease_service.entity.LoaiTacNhan;
import com.example.disease_service.repository.LoaiTacNhanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentTypeService {

    private final LoaiTacNhanRepository repository;

    public List<AgentTypeResponse> getAllTypes() {

        List<LoaiTacNhan> types = repository.findAll();

        return types.stream().map(type -> {
            AgentTypeResponse dto = new AgentTypeResponse();
            dto.setId(type.getMaLoaiTacNhan());
            dto.setName(type.getTenLoaiTacNhan());
            dto.setDescription(type.getMoTa());
            return dto;
        }).collect(Collectors.toList());
    }

    /*
     * =============================
     * CREATE TYPE
     * =============================
     */
    public AgentTypeResponse createType(AgentTypeResponse dto) {

        LoaiTacNhan type = new LoaiTacNhan();
        type.setTenLoaiTacNhan(dto.getName());
        type.setMoTa(dto.getDescription());
        LoaiTacNhan saved = repository.save(type);

        dto.setId(saved.getMaLoaiTacNhan());
        return dto;
    }

    /*
     * =============================
     * UPDATE TYPE
     * =============================
     */
    public AgentTypeResponse updateType(Integer id, AgentTypeResponse dto) {

        LoaiTacNhan type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type not found"));

        type.setTenLoaiTacNhan(dto.getName());
        type.setMoTa(dto.getDescription());
        repository.save(type);

        return dto;
    }

    /*
     * =============================
     * DELETE TYPE
     * =============================
     */
    public void deleteType(Integer id) {
        repository.deleteById(id);
    }

}
