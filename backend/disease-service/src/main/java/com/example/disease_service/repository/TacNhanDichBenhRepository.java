package com.example.disease_service.repository;

import com.example.disease_service.entity.TacNhan;
import com.example.disease_service.entity.TacNhanDichBenh;
import com.example.disease_service.entity.TacNhanDichBenhId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

import org.springframework.transaction.annotation.Transactional;

public interface TacNhanDichBenhRepository extends JpaRepository<TacNhanDichBenh, TacNhanDichBenhId> {
    List<TacNhanDichBenh> findByMaDichBenh(Integer id);

    @Transactional
    void deleteByMaDichBenh(Integer maDichBenh);
}