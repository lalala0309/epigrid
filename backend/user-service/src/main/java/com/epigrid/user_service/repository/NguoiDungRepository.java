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
                SELECT nd.maNguoiDung,
                       nd.hoTen,
                       nd.email,
                       nd.trangThai,
                       nvyt.maNhanVien
                FROM nguoi_dung nd
                LEFT JOIN nhan_vien_y_te nvyt
                    ON nd.maNguoiDung = nvyt.maNguoiDung
                WHERE nd.maVaiTro = 2
            """, nativeQuery = true)
    List<NhanVienProjection> findAllNhanVienYTe();

    @Query(value = """
                SELECT nd.maNguoiDung as maNguoiDung,
                       nd.hoTen as hoTen,
                       nd.email as email,
                       nd.trangThai as trangThai,
                       nvyt.maNhanVien as maNhanVien
                FROM nguoi_dung nd
                LEFT JOIN nhan_vien_y_te nvyt
                ON nd.maNguoiDung = nvyt.maNguoiDung
                WHERE nd.maNguoiDung = :id
            """, nativeQuery = true)
    Optional<NhanVienProjection> findNhanVienRawById(@Param("id") Integer id);

    @Query(value = """
            SELECT * FROM nguoi_dung
            WHERE viTri IS NOT NULL
            AND maVaiTro = 3
            AND ST_Distance_Sphere(
                viTri,
                ST_SRID(POINT(:lng, :lat), 4326)
            ) <= :radius
            """, nativeQuery = true)
    List<NguoiDung> findUsersNearby(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius);

    long count();
}