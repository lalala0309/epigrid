package com.example.case_service.repository;

import com.example.case_service.entity.CaTiepXuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CaTiepXucRepository extends JpaRepository<CaTiepXuc, Integer> {
    List<CaTiepXuc> findByCaBenhMaCaBenh(Integer maCaBenh);

    void deleteByCaBenhMaCaBenh(Integer maCaBenh);

    long countByNgayTiepXuc(LocalDate ngayTiepXuc);
}