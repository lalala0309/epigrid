package com.epigrid.user_service.dto;

import lombok.*;

@Data
public class UpdateRoleRequest {
    private Integer maVaiTro;
    private String maNhanVien; // chỉ dùng khi là MANAGER
}