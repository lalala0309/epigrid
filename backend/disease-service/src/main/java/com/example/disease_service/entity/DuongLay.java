package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "duong_lay")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DuongLay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDuongLay;

    private String tenDuongLay;

    @Column(columnDefinition = "TEXT")
    private String moTa;
}