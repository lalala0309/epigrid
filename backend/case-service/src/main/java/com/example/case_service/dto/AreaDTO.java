package com.example.case_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class AreaDTO {

    private Integer id;
    private String name;
    private String level;
    private List<AreaDTO> children;

}