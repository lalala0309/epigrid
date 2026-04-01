package com.example.case_service.dto;

import com.example.case_service.entity.CaBenh;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CaBenhRequest {

    private String maBenhNhan;
    private Integer maDichBenh;
    private Integer maKhuVuc;

    // Bệnh nhân
    private String hoTen;
    private String soDienThoai;
    private LocalDate ngaySinh;
    private CaBenh.GioiTinh gioiTinh;

    // Người ghi nhận
    private Integer nguoiBaoCao;
    private String nguoiBaoCaoHoTen;
    private String nguoiBaoCaoSDT;
    private LocalDate nguoiBaoCaoNgaySinh;
    private CaBenh.GioiTinh nguoiBaoCaoGioiTinh;

    private LocalDate ngayPhatHien;
    private CaBenh.TinhTrang tinhTrang;

    // Tọa độ
    private Double lat;
    private Double lng;
}