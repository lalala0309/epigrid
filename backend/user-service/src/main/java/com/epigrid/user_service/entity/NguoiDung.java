package com.epigrid.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maNguoiDung")
    private Integer maNguoiDung;

    @Column(name = "hoTen", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maVaiTro", nullable = false)
    private VaiTro vaiTro;

    @Column(name = "viTri", columnDefinition = "POINT", nullable = true)
    private Point viTri;

    private String trangThai;
}
