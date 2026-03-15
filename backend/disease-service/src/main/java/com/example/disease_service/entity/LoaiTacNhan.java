package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loai_tac_nhan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiTacNhan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maLoaiTacNhan;

    private String tenLoaiTacNhan;

    @Column(columnDefinition = "TEXT")
    private String moTa;
}