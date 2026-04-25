package com.example.case_service.dto;

import lombok.Data;

@Data
public class ManagerResponse {
    private Integer maNguoiDung;
    private String maNhanVien;
    private String hoTen;
    private String email;
    private String trangThai;
}