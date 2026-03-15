package com.example.disease_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DangerGroupResponse {
    private Integer maNhom;
    private String tenNhom;
    private String moTa;
}
