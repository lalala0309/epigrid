package com.epigrid.user_service.repository;

import com.epigrid.user_service.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {
    Optional<VaiTro> findByTenVaiTro(String tenVaiTro);
}
