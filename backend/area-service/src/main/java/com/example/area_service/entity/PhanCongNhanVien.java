package com.example.area_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "phan_cong_nhan_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhanCongNhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer maKhuVuc;

    private Integer maNguoiDung;

    private LocalDateTime ngayPhanCong;
}