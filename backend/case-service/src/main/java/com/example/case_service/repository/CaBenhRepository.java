package com.example.case_service.repository;

import com.example.case_service.entity.CaBenh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaBenhRepository extends JpaRepository<CaBenh, Integer> {
    List<CaBenh> findByMaDichBenh(Integer maDichBenh);
    List<CaBenh> findByMaKhuVuc(Integer maKhuVuc);
    boolean existsByMaBenhNhan(String maBenhNhan);
    Optional<CaBenh> findByMaBenhNhan(String maBenhNhan);
}