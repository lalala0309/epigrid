package com.example.area_service.service;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import com.example.area_service.entity.*;
import com.example.area_service.repository.*;
import com.example.area_service.dto.AreaResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final KhuVucRepository repository;
    private final PhanCongNhanVienRepository phanCongNhanVienRepository;
    @Value("${geojson.path}")
    private String geoPath;

    public List<AreaResponse> getAllAreas() {

        List<KhuVuc> all = repository.findAll();

        Map<Integer, AreaResponse> map = new HashMap<>();

        for (KhuVuc kv : all) {

            AreaResponse dto = new AreaResponse();
            dto.setId(kv.getMaKhuVuc());
            dto.setName(kv.getTenKhuVuc());
            dto.setLevel(kv.getCapDo().name());
            dto.setWarningLimit(kv.getNguongCanhBao());
            dto.setCurrentValue(0);
            dto.setMaGADM(kv.getMaGADM());// load theo maGADM
            dto.setChildren(new ArrayList<>());

            map.put(kv.getMaKhuVuc(), dto);
        }

        List<AreaResponse> roots = new ArrayList<>();

        for (KhuVuc kv : all) {

            AreaResponse current = map.get(kv.getMaKhuVuc());

            if (kv.getMaKhuVucCha() == null) {
                roots.add(current);
            } else {
                AreaResponse parent = map.get(kv.getMaKhuVucCha());
                if (parent != null) {
                    parent.getChildren().add(current);
                }
            }
        }

        return roots;
    }

    private String loadGeo(String maGADM) {

        if (maGADM == null)
            return null;

        try {
            Path path = Paths.get(geoPath + "/" + maGADM + ".json");

            if (!Files.exists(path))
                return null;

            return Files.readString(path);
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public void assignStaff(Integer areaId, List<Integer> staffIds) {

        // Xóa phân công cũ
        phanCongNhanVienRepository.deleteByMaKhuVuc(areaId);

        // Thêm phân công mới
        for (Integer staffId : staffIds) {
            PhanCongNhanVien pc = new PhanCongNhanVien();
            pc.setMaKhuVuc(areaId);
            pc.setMaNguoiDung(staffId);
            phanCongNhanVienRepository.save(pc);
        }
    }
}