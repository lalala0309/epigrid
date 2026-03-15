package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dich_benh_trieu_chung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(DichBenhTrieuChungId.class)
public class DichBenhTrieuChung {

    @Id
    private Integer maDichBenh;

    @Id
    private Integer maTrieuChung;
}