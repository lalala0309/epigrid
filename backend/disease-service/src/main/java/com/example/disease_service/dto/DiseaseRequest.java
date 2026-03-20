package com.example.disease_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class DiseaseRequest {

    private String name;
    private String desc;
    private Integer dangerGroupId;

    private List<Integer> symptomIds;
    private List<Integer> agentIds;
    private List<Integer> transmissionIds;
}