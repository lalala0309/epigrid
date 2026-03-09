package com.example.area_service.repository;

import com.example.area_service.entity.PhanCongNhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhanCongNhanVienRepository
        extends JpaRepository<PhanCongNhanVien, Integer> {

    List<PhanCongNhanVien> findByMaKhuVuc(Integer maKhuVuc);

    void deleteByMaKhuVuc(Integer maKhuVuc);

    List<PhanCongNhanVien> findAll();
}