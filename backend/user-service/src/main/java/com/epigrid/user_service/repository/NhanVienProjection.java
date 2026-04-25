package com.epigrid.user_service.repository;

/**
 * Projection dùng để map kết quả query nhân viên y tế
 * Spring Data JPA sẽ tự map theo alias trong query
 */
public interface NhanVienProjection {
    Integer getMaNguoiDung();

    String getHoTen();

    String getEmail();

    String getTrangThai();

    String getMaNhanVien();
}