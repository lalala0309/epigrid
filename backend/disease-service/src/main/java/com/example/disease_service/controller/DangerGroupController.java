package com.example.disease_service.controller;

import com.example.disease_service.entity.NhomNguyHiem;
import com.example.disease_service.service.DangerGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diseases/danger-groups")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DangerGroupController {

    private final DangerGroupService service;

    @GetMapping
    public List<NhomNguyHiem> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public NhomNguyHiem getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public NhomNguyHiem create(@RequestBody NhomNguyHiem group) {
        return service.create(group);
    }

    @PutMapping("/{id}")
    public NhomNguyHiem update(
            @PathVariable Integer id,
            @RequestBody NhomNguyHiem group) {
        return service.update(id, group);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}