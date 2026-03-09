package com.example.area_service.repository;

import com.example.area_service.entity.KhuVuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KhuVucRepository extends JpaRepository<KhuVuc, Integer> {

    List<KhuVuc> findByMaKhuVucCha(Integer parentId);

    void deleteByMaKhuVuc(Integer maKhuVuc);
}