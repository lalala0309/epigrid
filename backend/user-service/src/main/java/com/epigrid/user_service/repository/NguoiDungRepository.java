package com.epigrid.user_service.repository;

import com.epigrid.user_service.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {

    Optional<NguoiDung> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query(value = """
            SELECT *
            FROM nguoi_dung
            WHERE maVaiTro = 2;
                """, nativeQuery = true)
    List<NguoiDung> findAllNhanVienYTe();
}