package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nhom_nguy_hiem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhomNguyHiem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maNhom;

    private String tenNhom;

    @Column(columnDefinition = "TEXT")
    private String moTa;
}