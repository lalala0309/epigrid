package com.example.disease_service.service;

import com.example.disease_service.dto.DiseaseRequest;
import com.example.disease_service.dto.DiseaseResponse;
import com.example.disease_service.entity.DichBenh;
import com.example.disease_service.entity.DichBenhDuongLay;
import com.example.disease_service.entity.DichBenhTrieuChung;
import com.example.disease_service.entity.TacNhanDichBenh;
import com.example.disease_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiseaseService {

    private final DichBenhRepository dichBenhRepository;
    private final TacNhanDichBenhRepository tacNhanDichBenhRepository;
    private final DichBenhTrieuChungRepository dichBenhTrieuChungRepository;
    private final DichBenhDuongLayRepository dichBenhDuongLayRepository;
    private final TrieuChungRepository trieuChungRepository;
    private final TacNhanRepository tacNhanRepository;
    private final DuongLayRepository duongLayRepository;
    private final NhomNguyHiemRepository nhomNguyHiemRepository;

    public List<DichBenh> getAll() {
        return dichBenhRepository.findAll();
    }

    public DichBenh getById(Integer id) {
        return dichBenhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease not found"));
    }

    @Transactional
    public DichBenh create(DiseaseRequest request) {

        DichBenh disease = new DichBenh();
        disease.setTenDichBenh(request.getName());
        disease.setMoTaDichBenh(request.getDesc());
        disease.setMaNhom(request.getDangerGroupId());

        DichBenh saved = dichBenhRepository.save(disease);

        // lưu agents
        for (Integer agentId : request.getAgentIds()) {
            tacNhanDichBenhRepository.save(
                    new TacNhanDichBenh(agentId, saved.getMaDichBenh()));
        }

        // lưu symptoms
        for (Integer sId : request.getSymptomIds()) {
            dichBenhTrieuChungRepository.save(
                    new DichBenhTrieuChung(saved.getMaDichBenh(), sId));
        }

        // lưu transmission
        for (Integer tId : request.getTransmissionIds()) {
            dichBenhDuongLayRepository.save(
                    new DichBenhDuongLay(saved.getMaDichBenh(), tId));
        }

        return saved;
    }

    @Transactional
    public DichBenh update(Integer id, DiseaseRequest request) {
        DichBenh disease = getById(id);

        disease.setTenDichBenh(request.getName());
        disease.setMoTaDichBenh(request.getDesc());
        disease.setMaNhom(request.getDangerGroupId());
        dichBenhRepository.save(disease);

        // Xoá quan hệ cũ
        dichBenhTrieuChungRepository.deleteByMaDichBenh(id);
        tacNhanDichBenhRepository.deleteByMaDichBenh(id);
        dichBenhDuongLayRepository.deleteByMaDichBenh(id);

        // Lưu quan hệ mới
        for (Integer agentId : request.getAgentIds()) {
            tacNhanDichBenhRepository.save(new TacNhanDichBenh(agentId, id));
        }
        for (Integer sId : request.getSymptomIds()) {
            dichBenhTrieuChungRepository.save(new DichBenhTrieuChung(id, sId));
        }
        for (Integer tId : request.getTransmissionIds()) {
            dichBenhDuongLayRepository.save(new DichBenhDuongLay(id, tId));
        }

        return disease;
    }

    @Transactional
    public void delete(Integer id) {
        // Xoá quan hệ trước
        dichBenhTrieuChungRepository.deleteByMaDichBenh(id);
        tacNhanDichBenhRepository.deleteByMaDichBenh(id);
        dichBenhDuongLayRepository.deleteByMaDichBenh(id);

        // Xoá bệnh sau
        dichBenhRepository.deleteById(id);
    }

    public List<DiseaseResponse> getAllFull() {
        return dichBenhRepository.findAll().stream().map(d -> {

            DiseaseResponse res = new DiseaseResponse();
            res.setId(d.getMaDichBenh());
            res.setName(d.getTenDichBenh());
            res.setDesc(d.getMoTaDichBenh());
            res.setDangerGroupId(d.getMaNhom()); // ← thêm field này

            // Tên nhóm nguy hiểm
            if (d.getMaNhom() != null) {
                nhomNguyHiemRepository.findById(d.getMaNhom())
                        .ifPresent(n -> res.setDangerLevel(n.getTenNhom()));
            }

            // Triệu chứng — lấy tên thật
            List<String> symptoms = dichBenhTrieuChungRepository
                    .findByMaDichBenh(d.getMaDichBenh())
                    .stream()
                    .map(s -> trieuChungRepository.findById(s.getMaTrieuChung())
                            .map(tc -> tc.getTenTrieuChung())
                            .orElse("ID:" + s.getMaTrieuChung()))
                    .toList();

            // Tác nhân — lấy tên thật
            List<String> agents = tacNhanDichBenhRepository
                    .findByMaDichBenh(d.getMaDichBenh())
                    .stream()
                    .map(a -> tacNhanRepository.findById(a.getMaTacNhan())
                            .map(tn -> tn.getTenTacNhan())
                            .orElse("ID:" + a.getMaTacNhan()))
                    .toList();

            // Đường lây — lấy tên thật
            List<String> trans = dichBenhDuongLayRepository
                    .findByMaDichBenh(d.getMaDichBenh())
                    .stream()
                    .map(t -> duongLayRepository.findById(t.getMaDuongLay())
                            .map(dl -> dl.getTenDuongLay())
                            .orElse("ID:" + t.getMaDuongLay()))
                    .toList();

            res.setSymptoms(symptoms);
            res.setAgents(agents);
            res.setTransmission(trans);
            return res;
        }).toList();
    }
}