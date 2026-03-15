package com.example.disease_service.repository;

import com.example.disease_service.entity.DichBenhTrieuChung;
import com.example.disease_service.entity.DichBenhTrieuChungId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DichBenhTrieuChungRepository extends JpaRepository<DichBenhTrieuChung, DichBenhTrieuChungId> {
}