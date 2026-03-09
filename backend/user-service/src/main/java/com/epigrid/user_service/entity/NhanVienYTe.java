package com.epigrid.user_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nhan_vien_y_te")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanVienYTe {

    @Id
    @Column(name = "maNhanVien")
    private String maNhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDung", nullable = false)
    private NguoiDung nguoiDung;

}