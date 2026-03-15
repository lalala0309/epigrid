package com.example.disease_service.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SymptomResponse {

    private Integer id;
    private String name;
    private String description;

}