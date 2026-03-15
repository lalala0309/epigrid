package com.example.disease_service.repository;

import com.example.disease_service.entity.TacNhan;
import com.example.disease_service.entity.TacNhanDichBenh;
import com.example.disease_service.entity.TacNhanDichBenhId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface TacNhanDichBenhRepository extends JpaRepository<TacNhanDichBenh, TacNhanDichBenhId> {
}