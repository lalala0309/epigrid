package com.example.case_service.dto;

import com.example.case_service.entity.CaBenh;
import com.example.case_service.entity.CaTiepXuc;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CaTiepXucResponse {
    private Integer maCaTiepXuc;
    private String hoTen;
    private String soDienThoai;
    private LocalDate ngaySinh;
    private CaBenh.GioiTinh gioiTinh;
    private LocalDate ngayTiepXuc;
    private Integer nguoiBaoCao;
    private CaTiepXuc.MucDoNguyCo mucDoNguyCo;
    private Double lat;
    private Double lng;
}