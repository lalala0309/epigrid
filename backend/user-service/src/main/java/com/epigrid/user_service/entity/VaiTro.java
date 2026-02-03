package com.epigrid.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "vai_tro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maVaiTro")
    private Integer maVaiTro;

    @Column(name = "tenVaiTro", nullable = false, length = 50)
    private String tenVaiTro;

    // mapping ngược
    @OneToMany(mappedBy = "vaiTro", fetch = FetchType.LAZY)
    private List<NguoiDung> nguoiDungs;
}
