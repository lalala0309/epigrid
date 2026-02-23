package com.epigrid.user_service.dto;

import lombok.Data;

import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class UserDTO {

    private Integer maNguoiDung;
    private String hoTen;
    private String email;
    private Integer maVaiTro;
    private String tenVaiTro;
    private String viTri;
    private String status; // frontend đang dùng status → giữ nguyên
}
