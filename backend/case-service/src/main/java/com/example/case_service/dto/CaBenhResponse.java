package com.example.case_service.dto;

import com.example.case_service.entity.CaBenh;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CaBenhResponse {

    private Integer maCaBenh;
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

    private LocalDate ngayPhatHien;
    private CaBenh.TinhTrang tinhTrang;

    private Double lat;
    private Double lng;

    private List<CaTiepXucResponse> contacts;
}