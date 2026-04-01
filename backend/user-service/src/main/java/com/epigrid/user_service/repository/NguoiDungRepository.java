package com.epigrid.user_service.repository;

import com.epigrid.user_service.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {

    Optional<NguoiDung> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query(value = """
            SELECT *
            FROM nguoi_dung
            WHERE maVaiTro = 2;
                """, nativeQuery = true)
    List<NguoiDung> findAllNhanVienYTe();

    @Query(value = """
                SELECT nd.maNguoiDung, nd.hoTen, nd.email, nd.trangThai, nvyt.maNhanVien
                FROM nguoi_dung nd
                JOIN nhan_vien_y_te nvyt ON nd.maNguoiDung = nvyt.maNguoiDung
                WHERE nd.maNguoiDung = :id
            """, nativeQuery = true)
    Optional<Object[]> findNhanVienRawById(@Param("id") Integer id);
}