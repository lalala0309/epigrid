package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tac_nhan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TacNhan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maTacNhan;

    private String tenTacNhan;

    @Column(columnDefinition = "TEXT")
    private String moTa;

    @ManyToOne
    @JoinColumn(name = "maLoaiTacNhan")
    private LoaiTacNhan loaiTacNhan;
}