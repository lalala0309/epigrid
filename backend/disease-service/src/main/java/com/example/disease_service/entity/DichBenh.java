package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dich_benh")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DichBenh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDichBenh;

    private String tenDichBenh;

    private String moTaDichBenh;

    private Integer maNhom;
}