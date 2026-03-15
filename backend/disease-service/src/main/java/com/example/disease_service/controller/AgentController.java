package com.example.disease_service.controller;

import com.example.disease_service.dto.AgentResponse;
import com.example.disease_service.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases/agents")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AgentController {

    private final AgentService service;

    @GetMapping("/type/{typeId}")
    public List<AgentResponse> getByType(@PathVariable Integer typeId) {
        return service.getAgentsByType(typeId);
    }

    @PostMapping
    public AgentResponse create(@RequestBody AgentResponse dto) {
        return service.createAgent(dto);
    }

    @PutMapping("/{id}")
    public AgentResponse update(
            @PathVariable Integer id,
            @RequestBody AgentResponse dto) {
        return service.updateAgent(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.deleteAgent(id);
    }
}
