package com.example.disease_service.controller;

import com.example.disease_service.dto.AgentTypeResponse;
import com.example.disease_service.entity.LoaiTacNhan;
import com.example.disease_service.service.AgentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases/agent-types")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AgentTypeController {

    private final AgentTypeService service;

    @GetMapping
    public List<AgentTypeResponse> getAll() {
        return service.getAllTypes();
    }

    @PostMapping
    public AgentTypeResponse create(@RequestBody AgentTypeResponse dto) {
        return service.createType(dto);
    }

    @PutMapping("/{id}")
    public AgentTypeResponse update(
            @PathVariable Integer id,
            @RequestBody AgentTypeResponse dto) {
        return service.updateType(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.deleteType(id);
    }
}
