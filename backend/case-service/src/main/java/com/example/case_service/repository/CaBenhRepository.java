package com.example.case_service.repository;

import com.example.case_service.entity.CaBenh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaBenhRepository extends JpaRepository<CaBenh, Integer> {
  List<CaBenh> findByMaDichBenh(Integer maDichBenh);

  List<CaBenh> findByMaKhuVuc(Integer maKhuVuc);

  boolean existsByMaBenhNhan(String maBenhNhan);

  Optional<CaBenh> findByMaBenhNhan(String maBenhNhan);

  long countByNgayPhatHien(LocalDate ngayPhatHien);

  @Query("""
          SELECT c.maDichBenh, c.ngayPhatHien, COUNT(c)
          FROM CaBenh c
          WHERE c.ngayPhatHien >= :startDate
          GROUP BY c.maDichBenh, c.ngayPhatHien
      """)
  List<Object[]> countCasesGroupByDiseaseAndDate(LocalDate startDate);

  @Query("""
          SELECT c.maDichBenh, COUNT(c)
          FROM CaBenh c
          WHERE c.ngayPhatHien >= :startDate
          GROUP BY c.maDichBenh
      """)
  List<Object[]> countCasesGroupByDisease(LocalDate startDate);

  @Query(value = """
          SELECT cb.maDichBenh, COUNT(*) as total
          FROM ca_benh cb
          WHERE ST_Distance_Sphere(
              cb.viTri,
              ST_SRID(POINT(:lng, :lat), 4326)
          ) <= :radius
          GROUP BY cb.maDichBenh
      """, nativeQuery = true)
  List<Object[]> countCasesNearby(
      @Param("lat") double lat,
      @Param("lng") double lng,
      @Param("radius") double radius);

  long countByNgayPhatHienAndMaKhuVucAndTinhTrang(
      LocalDate date,
      Integer maKhuVuc,
      CaBenh.TinhTrang tinhTrang);

  long countByNgayPhatHienAndMaKhuVucInAndTinhTrang(
      LocalDate date,
      List<Integer> maKhuVuc,
      CaBenh.TinhTrang tinhTrang);

  @Query("""
          SELECT c.ngayPhatHien, c.tinhTrang, COUNT(c)
          FROM CaBenh c
          WHERE c.ngayPhatHien BETWEEN :start AND :end
            AND c.maKhuVuc IN :areaIds
            AND c.maDichBenh = :diseaseId
          GROUP BY c.ngayPhatHien, c.tinhTrang
          ORDER BY c.ngayPhatHien
      """)
  List<Object[]> getChartByDateAndArea(
      @Param("start") LocalDate start,
      @Param("end") LocalDate end,
      @Param("areaIds") List<Integer> areaIds,
      @Param("diseaseId") Integer diseaseId);

  @Query("""
          SELECT c.tinhTrang, COUNT(c)
          FROM CaBenh c
          WHERE c.ngayPhatHien BETWEEN :start AND :end
            AND c.maKhuVuc IN :areaIds
            AND c.maDichBenh = :diseaseId
          GROUP BY c.tinhTrang
      """)
  List<Object[]> countByStatus(
      @Param("start") LocalDate start,
      @Param("end") LocalDate end,
      @Param("areaIds") List<Integer> areaIds,
      @Param("diseaseId") Integer diseaseId);

  @Query("""
          SELECT c
          FROM CaBenh c
          WHERE c.maKhuVuc IN :areaIds
          ORDER BY c.ngayPhatHien DESC
      """)
  List<CaBenh> findByAreaIds(@Param("areaIds") List<Integer> areaIds);

  long countByNgayPhatHienAndMaKhuVucInAndTinhTrangAndMaDichBenh(
      LocalDate date,
      List<Integer> maKhuVuc,
      CaBenh.TinhTrang tinhTrang,
      Integer maDichBenh);

  @Query("""
          SELECT c.maDichBenh, COUNT(c)
          FROM CaBenh c
          WHERE c.maKhuVuc IN :areaIds
          GROUP BY c.maDichBenh
      """)
  List<Object[]> countByDiseaseAndArea(@Param("areaIds") List<Integer> areaIds);

  @Query("""
          SELECT c
          FROM CaBenh c
          WHERE c.maKhuVuc IN :areaIds
            AND c.ngayPhatHien = :today
          ORDER BY c.maCaBenh DESC
      """)
  List<CaBenh> findTodayCasesByAreaIds(
      @Param("areaIds") List<Integer> areaIds,
      @Param("today") LocalDate today);

  boolean existsByNguoiBaoCao(Integer userId);
}
