package com.example.disease_service.service;

import com.example.disease_service.dto.AgentResponse;
import com.example.disease_service.entity.LoaiTacNhan;
import com.example.disease_service.entity.TacNhan;
import com.example.disease_service.repository.LoaiTacNhanRepository;
import com.example.disease_service.repository.TacNhanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final TacNhanRepository repository;
    private final LoaiTacNhanRepository loaiTacNhanRepository;

    /*
     * =============================
     * GET AGENTS BY TYPE
     * =============================
     */
    public List<AgentResponse> getAgentsByType(Integer typeId) {

        List<TacNhan> agents = repository.findByLoaiTacNhan_MaLoaiTacNhan(typeId);

        return agents.stream().map(agent -> {
            AgentResponse dto = new AgentResponse();

            dto.setId(agent.getMaTacNhan());
            dto.setName(agent.getTenTacNhan());
            dto.setTypeId(agent.getLoaiTacNhan().getMaLoaiTacNhan());
            dto.setDescription(agent.getMoTa());
            return dto;
        }).collect(Collectors.toList());
    }

    /*
     * =============================
     * CREATE AGENT
     * =============================
     */
    public AgentResponse createAgent(AgentResponse dto) {

        LoaiTacNhan type = loaiTacNhanRepository.findById(dto.getTypeId())
                .orElseThrow(() -> new RuntimeException("Type not found"));

        TacNhan agent = new TacNhan();
        agent.setTenTacNhan(dto.getName());
        agent.setMoTa(dto.getDescription());
        agent.setLoaiTacNhan(type);

        TacNhan saved = repository.save(agent);

        dto.setId(saved.getMaTacNhan());

        return dto;
    }

    /*
     * =============================
     * UPDATE AGENT
     * =============================
     */
    public AgentResponse updateAgent(Integer id, AgentResponse dto) {

        TacNhan agent = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setTenTacNhan(dto.getName());
        agent.setMoTa(dto.getDescription());
        repository.save(agent);

        return dto;
    }

    /*
     * =============================
     * DELETE AGENT
     * =============================
     */
    public void deleteAgent(Integer id) {
        repository.deleteById(id);
    }

}
