package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trieu_chung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrieuChung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maTrieuChung;

    private String tenTrieuChung;

    @Column(columnDefinition = "TEXT")
    private String moTa;
}