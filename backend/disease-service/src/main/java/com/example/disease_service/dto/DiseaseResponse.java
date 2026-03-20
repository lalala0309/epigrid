package com.example.disease_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class DiseaseResponse {

    private Integer id;
    private String name;
    private String desc;
    private String dangerLevel;
    private Integer dangerGroupId;

    private List<String> symptoms;
    private List<String> agents;
    private List<String> transmission;
}