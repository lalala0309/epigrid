package com.example.case_service.service;

import com.example.case_service.dto.*;
import com.example.case_service.entity.CaBenh;
import com.example.case_service.entity.CaTiepXuc;
import com.example.case_service.repository.CaBenhRepository;
import com.example.case_service.repository.CaTiepXucRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaBenhRepository caBenhRepository;
    private final CaTiepXucRepository caTiepXucRepository;

    // SRID 4326 = WGS84 (lat/lng)
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Point toPoint(Double lat, Double lng) {
        if (lat == null || lng == null)
            return null;
        // JTS: x = longitude, y = latitude
        Point p = geometryFactory.createPoint(new Coordinate(lng, lat));
        p.setSRID(4326);
        return p;
    }

    private CaBenhResponse toResponse(CaBenh c) {
        CaBenhResponse r = new CaBenhResponse();
        r.setMaCaBenh(c.getMaCaBenh());
        r.setMaBenhNhan(c.getMaBenhNhan());
        r.setMaDichBenh(c.getMaDichBenh());
        r.setMaKhuVuc(c.getMaKhuVuc());
        r.setHoTen(c.getHoTen());
        r.setSoDienThoai(c.getSoDienThoai());
        r.setNgaySinh(c.getNgaySinh());
        r.setGioiTinh(c.getGioiTinh());
        r.setNguoiBaoCao(c.getNguoiBaoCao());
        r.setNgayPhatHien(c.getNgayPhatHien());
        r.setTinhTrang(c.getTinhTrang());
        if (c.getViTri() != null) {
            r.setLat(c.getViTri().getY());
            r.setLng(c.getViTri().getX());
        }
        // contacts
        List<CaTiepXucResponse> contacts = caTiepXucRepository
                .findByCaBenhMaCaBenh(c.getMaCaBenh())
                .stream().map(this::toContactResponse).toList();
        r.setContacts(contacts);
        return r;
    }

    private CaTiepXucResponse toContactResponse(CaTiepXuc ct) {
        CaTiepXucResponse r = new CaTiepXucResponse();
        r.setMaCaTiepXuc(ct.getMaCaTiepXuc());
        r.setHoTen(ct.getHoTen());
        r.setSoDienThoai(ct.getSoDienThoai());
        r.setNgaySinh(ct.getNgaySinh());
        r.setGioiTinh(ct.getGioiTinh());
        r.setNgayTiepXuc(ct.getNgayTiepXuc());
        r.setNguoiBaoCao(ct.getNguoiBaoCao());
        r.setMucDoNguyCo(ct.getMucDoNguyCo());
        if (ct.getViTri() != null) {
            r.setLat(ct.getViTri().getY());
            r.setLng(ct.getViTri().getX());
        }
        return r;
    }

    // ─── Ca bệnh CRUD ────────────────────────────────────────────────────────

    public List<CaBenhResponse> getAll() {
        return caBenhRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CaBenhResponse getById(Integer id) {
        return toResponse(caBenhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ca bệnh không tồn tại: " + id)));
    }

    @Transactional
    public CaBenhResponse create(CaBenhRequest req) {
        if (req.getMaBenhNhan() != null && caBenhRepository.existsByMaBenhNhan(req.getMaBenhNhan())) {
            throw new RuntimeException("Mã bệnh nhân đã tồn tại: " + req.getMaBenhNhan());
        }

        CaBenh cb = new CaBenh();
        cb.setMaBenhNhan(req.getMaBenhNhan());
        cb.setMaDichBenh(req.getMaDichBenh());
        cb.setMaKhuVuc(req.getMaKhuVuc());
        cb.setHoTen(req.getHoTen());
        cb.setSoDienThoai(req.getSoDienThoai());
        cb.setNgaySinh(req.getNgaySinh());
        cb.setGioiTinh(req.getGioiTinh());
        cb.setNguoiBaoCao(req.getNguoiBaoCao());
        cb.setNgayPhatHien(req.getNgayPhatHien());
        cb.setTinhTrang(req.getTinhTrang() != null ? req.getTinhTrang() : CaBenh.TinhTrang.DANG_MAC);
        cb.setViTri(toPoint(req.getLat(), req.getLng()));

        return toResponse(caBenhRepository.save(cb));
    }

    @Transactional
    public CaBenhResponse update(Integer id, CaBenhRequest req) {
        CaBenh cb = caBenhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ca bệnh không tồn tại: " + id));

        // Kiểm tra mã trùng (trừ chính nó)
        if (req.getMaBenhNhan() != null &&
                !req.getMaBenhNhan().equals(cb.getMaBenhNhan()) &&
                caBenhRepository.existsByMaBenhNhan(req.getMaBenhNhan())) {
            throw new RuntimeException("Mã bệnh nhân đã tồn tại: " + req.getMaBenhNhan());
        }

        cb.setMaBenhNhan(req.getMaBenhNhan());
        cb.setMaDichBenh(req.getMaDichBenh());
        cb.setMaKhuVuc(req.getMaKhuVuc());
        cb.setHoTen(req.getHoTen());
        cb.setSoDienThoai(req.getSoDienThoai());
        cb.setNgaySinh(req.getNgaySinh());
        cb.setGioiTinh(req.getGioiTinh());
        cb.setNguoiBaoCao(req.getNguoiBaoCao());
        cb.setNgayPhatHien(req.getNgayPhatHien());
        cb.setTinhTrang(req.getTinhTrang());
        cb.setViTri(toPoint(req.getLat(), req.getLng()));

        return toResponse(caBenhRepository.save(cb));
    }

    @Transactional
    public void delete(Integer id) {
        caTiepXucRepository.deleteByCaBenhMaCaBenh(id);
        caBenhRepository.deleteById(id);
    }

    // ─── Ca tiếp xúc ─────────────────────────────────────────────────────────

    public List<CaTiepXucResponse> getContacts(Integer maCaBenh) {
        return caTiepXucRepository.findByCaBenhMaCaBenh(maCaBenh)
                .stream().map(this::toContactResponse).toList();
    }

    @Transactional
    public CaTiepXucResponse addContact(Integer maCaBenh, CaTiepXucRequest req) {
        CaBenh caBenh = caBenhRepository.findById(maCaBenh)
                .orElseThrow(() -> new RuntimeException("Ca bệnh không tồn tại: " + maCaBenh));

        CaTiepXuc ct = new CaTiepXuc();
        ct.setCaBenh(caBenh);
        ct.setHoTen(req.getHoTen());
        ct.setSoDienThoai(req.getSoDienThoai());
        ct.setNgaySinh(req.getNgaySinh());
        ct.setGioiTinh(req.getGioiTinh());
        ct.setNgayTiepXuc(req.getNgayTiepXuc());
        ct.setNguoiBaoCao(req.getNguoiBaoCao());
        ct.setMucDoNguyCo(req.getMucDoNguyCo() != null
                ? req.getMucDoNguyCo()
                : CaTiepXuc.MucDoNguyCo.TRUNG_BINH);
        ct.setViTri(toPoint(req.getLat(), req.getLng()));

        return toContactResponse(caTiepXucRepository.save(ct));
    }

    @Transactional
    public void deleteContact(Integer maCaTiepXuc) {
        caTiepXucRepository.deleteById(maCaTiepXuc);
    }

    @Transactional
    public CaTiepXucResponse updateContact(Integer id, CaTiepXucRequest req) {
        CaTiepXuc ct = caTiepXucRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ca tiếp xúc không tồn tại: " + id));

        ct.setHoTen(req.getHoTen());
        ct.setSoDienThoai(req.getSoDienThoai());
        ct.setNgaySinh(req.getNgaySinh());
        ct.setGioiTinh(req.getGioiTinh());
        ct.setNgayTiepXuc(req.getNgayTiepXuc());
        ct.setNguoiBaoCao(req.getNguoiBaoCao());
        ct.setMucDoNguyCo(req.getMucDoNguyCo() != null
                ? req.getMucDoNguyCo()
                : CaTiepXuc.MucDoNguyCo.TRUNG_BINH);
        ct.setViTri(toPoint(req.getLat(), req.getLng()));

        return toContactResponse(caTiepXucRepository.save(ct));
    }
}