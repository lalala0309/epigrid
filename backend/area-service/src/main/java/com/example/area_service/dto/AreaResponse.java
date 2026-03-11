package com.example.area_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class AreaResponse {
    private Integer id;
    private String name;
    private String level;
    private Integer warningLimit;
    private Integer currentValue;
    private String maGADM;
    private List<AreaResponse> children;
}