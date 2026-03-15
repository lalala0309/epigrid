package com.example.disease_service.repository;

import com.example.disease_service.entity.DichBenhDuongLay;
import com.example.disease_service.entity.DichBenhDuongLayId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DichBenhDuongLayRepository extends JpaRepository<DichBenhDuongLay, DichBenhDuongLayId> {
}