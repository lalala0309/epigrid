package com.example.case_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDate;

@Entity
@Table(name = "ca_benh")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaBenh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maCaBenh;

    @Column(nullable = false, unique = true, length = 50)
    private String maBenhNhan;

    private Integer maDichBenh;
    private Integer maKhuVuc;
    private Integer nguoiBaoCao;

    // Bệnh nhân
    @Column(nullable = false, length = 100)
    private String hoTen;

    @Column(nullable = false, length = 15)
    private String soDienThoai;

    @Column(nullable = false)
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GioiTinh gioiTinh;

    @Column(nullable = false)
    private LocalDate ngayPhatHien;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TinhTrang tinhTrang;

    @Column(columnDefinition = "POINT SRID 4326")
    private Point viTri;

    public enum TinhTrang {
        DANG_MAC, DA_KHOI, TU_VONG
    }

    public enum GioiTinh {
        NAM, NU, KHAC
    }
}