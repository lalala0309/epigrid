package com.example.area_service.service;

import com.example.area_service.client.UserServiceClient;
import com.example.area_service.dto.*;
import com.example.area_service.entity.*;
import com.example.area_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AreaStaffService {

        private final PhanCongNhanVienRepository phanCongRepo;
        private final UserServiceClient userServiceClient;
        private final KhuVucRepository khuVucRepository;

        // 1. nhân viên của khu vực
        public List<ManagerResponse> getNhanVienKhuVuc(Integer maKhuVuc) {

                List<PhanCongNhanVien> list = phanCongRepo.findByMaKhuVuc(maKhuVuc);

                Set<Integer> ids = list.stream()
                                .map(PhanCongNhanVien::getMaNguoiDung)
                                .collect(Collectors.toSet());

                return userServiceClient.getNhanVienYTe()
                                .stream()
                                .filter(u -> ids.contains(u.getMaNguoiDung()))
                                .toList();
        }

        public AreaResponse getAreaByStaff(Integer userId) {

                PhanCongNhanVien pc = phanCongRepo.findAll()
                                .stream()
                                .filter(p -> p.getMaNguoiDung().equals(userId))
                                .findFirst()
                                .orElse(null);

                if (pc == null)
                        return null;

                KhuVuc kv = khuVucRepository.findById(pc.getMaKhuVuc())
                                .orElse(null);

                if (kv == null)
                        return null;

                AreaResponse area = new AreaResponse();
                area.setId(kv.getMaKhuVuc());
                area.setName(kv.getTenKhuVuc());
                area.setLevel(kv.getCapDo().name());
                area.setWarningLimit(kv.getNguongCanhBao());
                area.setCurrentValue(0);
                area.setMaGADM(kv.getMaGADM());

                return area;
        }

        // 2. nhân viên chưa phân công
        public List<ManagerResponse> getNhanVienChuaPhanCong(Integer maKhuVuc) {

                Set<Integer> assignedIds = phanCongRepo.findAll()
                                .stream()
                                .map(PhanCongNhanVien::getMaNguoiDung)
                                .collect(Collectors.toSet());

                return userServiceClient.getNhanVienYTe()
                                .stream()
                                .filter(u -> !assignedIds.contains(u.getMaNguoiDung()))
                                .toList();
        }
}