package com.example.case_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDate;

@Entity
@Table(name = "ca_tiep_xuc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaTiepXuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maCaTiepXuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maCaBenh")
    private CaBenh caBenh;

    // Người tiếp xúc
    @Column(nullable = false, length = 100)
    private String hoTen;

    @Column(nullable = false, length = 15)
    private String soDienThoai;

    @Column(nullable = false)
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaBenh.GioiTinh gioiTinh;

    @Column(name = "nguoiBaoCao", nullable = false)
    private Integer nguoiBaoCao;

    @Column(nullable = false)
    private LocalDate ngayTiepXuc;

    @Column(columnDefinition = "POINT SRID 4326")
    private Point viTri;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MucDoNguyCo mucDoNguyCo;

    public enum MucDoNguyCo {
        THAP, TRUNG_BINH, CAO
    }
}