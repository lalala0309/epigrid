package com.example.area_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;

@Entity
@Table(name = "khu_vuc")
@Getter
@Setter
public class KhuVuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maKhuVuc;

    private String tenKhuVuc;

    @Enumerated(EnumType.STRING)
    private CapDo capDo;

    private Integer maKhuVucCha;

    private Integer nguongCanhBao;

    @Column(unique = true)
    private String maGADM;
}