package com.example.disease_service.dto;

import lombok.Data;

@Data
public class AgentResponse {

    private Integer id;
    private String name;
    private String description;
    private Integer typeId;

}