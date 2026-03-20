package com.example.disease_service.repository;

import com.example.disease_service.entity.DichBenhDuongLay;
import com.example.disease_service.entity.DichBenhDuongLayId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

import org.springframework.transaction.annotation.Transactional;

public interface DichBenhDuongLayRepository extends JpaRepository<DichBenhDuongLay, DichBenhDuongLayId> {
    List<DichBenhDuongLay> findByMaDichBenh(Integer id);

    @Transactional
    void deleteByMaDichBenh(Integer maDichBenh);
}