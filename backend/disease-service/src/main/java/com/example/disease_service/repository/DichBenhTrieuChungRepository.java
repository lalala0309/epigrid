package com.example.disease_service.repository;

import com.example.disease_service.entity.DichBenhTrieuChung;
import com.example.disease_service.entity.DichBenhTrieuChungId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

public interface DichBenhTrieuChungRepository extends JpaRepository<DichBenhTrieuChung, DichBenhTrieuChungId> {
    List<DichBenhTrieuChung> findByMaDichBenh(Integer maDichBenh);

    @Transactional
    void deleteByMaDichBenh(Integer maDichBenh);
}