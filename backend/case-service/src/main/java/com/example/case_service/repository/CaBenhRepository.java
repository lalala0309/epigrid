package com.example.case_service.repository;

import com.example.case_service.entity.CaBenh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
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
}