package com.example.disease_service.repository;

import com.example.disease_service.entity.TacNhan;
import com.example.disease_service.entity.TacNhanDichBenh;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;;

public interface TacNhanRepository extends JpaRepository<TacNhan, Integer> {
    List<TacNhan> findByLoaiTacNhan_MaLoaiTacNhan(Integer typeId);

}