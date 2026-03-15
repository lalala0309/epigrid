package com.example.disease_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransmissionResponse {

    private Integer maDuongLay;

    private String tenDuongLay;

    private String moTa;
}