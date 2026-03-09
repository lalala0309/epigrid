package com.example.area_service.service;

import com.example.area_service.client.UserServiceClient;
import com.example.area_service.dto.ManagerResponse;
import com.example.area_service.entity.PhanCongNhanVien;
import com.example.area_service.repository.PhanCongNhanVienRepository;
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