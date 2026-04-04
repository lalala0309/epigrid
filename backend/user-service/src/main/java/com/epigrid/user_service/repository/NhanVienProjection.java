package com.epigrid.user_service.repository;

/**
 * Projection dùng để map kết quả query nhân viên y tế
 * Spring Data JPA sẽ tự map theo alias trong query
 */
public interface NhanVienProjection {

    /**
     * Mã người dùng
     */
    Integer getMaNguoiDung();

    /**
     * Họ tên
     */
    String getHoTen();

    /**
     * Email
     */
    String getEmail();

    /**
     * Trạng thái
     */
    String getTrangThai();

    /**
     * Mã nhân viên y tế (có thể null nếu user không phải NVYT)
     */
    String getMaNhanVien();
}