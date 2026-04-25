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
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaBenhRepository caBenhRepository;
    private final CaTiepXucRepository caTiepXucRepository;
    private final RestTemplate restTemplate;
    private final EmailService emailService;

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

    // Ca bệnh CRUD

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
        CaBenh saved = caBenhRepository.save(cb);

        if (saved.getViTri() != null && saved.getTinhTrang() == CaBenh.TinhTrang.DANG_MAC) {

            double lat = saved.getViTri().getY();
            double lng = saved.getViTri().getX();

            String url = "http://localhost:8081/api/users/nearby?lat="
                    + lat + "&lng=" + lng + "&radius=1000";
            System.out.println(">>> Gọi URL: " + url);

            try {
                NguoiDungGanDayDTO[] users = restTemplate.getForObject(url, NguoiDungGanDayDTO[].class);
                System.out.println(">>> Số user gần đó: " + (users != null ? users.length : 0));
                if (users != null) {
                    for (NguoiDungGanDayDTO u : users) {

                        // tránh gửi cho chính người báo cáo
                        if (u.getMaNguoiDung().equals(saved.getNguoiBaoCao()))
                            continue;

                        emailService.sendAlert(u.getEmail(), u.getHoTen(), lat, lng);
                    }
                }

            } catch (Exception e) {
                System.out.println("Lỗi gọi user-service: " + e.getMessage());
            }
        }

        return toResponse(saved);
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

    // Ca tiếp xúc
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

    public long countCaBenhHomNay() {
        return caBenhRepository.countByNgayPhatHien(LocalDate.now());
    }

    public long countCaTiepXucHomNay() {
        return caTiepXucRepository.countByNgayTiepXuc(
                LocalDate.now());
    }

    public List<Map<String, Object>> getTopDiseaseChart(int days) {

        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        List<Object[]> raw = caBenhRepository
                .countCasesGroupByDiseaseAndDate(startDate);

        // diseaseId -> total count
        Map<Integer, Long> totalByDisease = new HashMap<>();

        for (Object[] row : raw) {
            Integer diseaseId = (Integer) row[0];
            Long count = (Long) row[2];
            totalByDisease.put(diseaseId,
                    totalByDisease.getOrDefault(diseaseId, 0L) + count);
        }

        // Lấy TOP 4 disease
        List<Integer> top4 = totalByDisease.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(4)
                .map(Map.Entry::getKey)
                .toList();

        // Gọi disease-service lấy tên
        String url = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(url, DiseaseDTO[].class);

        Map<Integer, String> diseaseNameMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        // Map: date -> data
        Map<LocalDate, Map<String, Object>> result = new TreeMap<>();

        for (Object[] row : raw) {
            Integer diseaseId = (Integer) row[0];
            LocalDate date = (LocalDate) row[1];
            Long count = (Long) row[2];

            if (!top4.contains(diseaseId))
                continue;

            String name = diseaseNameMap.getOrDefault(diseaseId, "Unknown");

            result.putIfAbsent(date, new HashMap<>());
            result.get(date).put("date", date.toString());
            result.get(date).put(name, count);
        }

        List<Map<String, Object>> finalResult = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            LocalDate d = startDate.plusDays(i);

            Map<String, Object> row = result.getOrDefault(d, new HashMap<>());
            row.put("date", d.toString());

            // fill tất cả disease = 0 nếu chưa có
            for (Integer id : top4) {
                String name = diseaseNameMap.getOrDefault(id, "Unknown");
                row.putIfAbsent(name, 0);
            }
            finalResult.add(row);
        }

        return finalResult;
    }

    public List<Map<String, Object>> getDiseasePieChart(int days) {

        LocalDate startDate = LocalDate.now().minusDays(days - 1);

        List<Object[]> raw = caBenhRepository
                .countCasesGroupByDisease(startDate);

        String url = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(url, DiseaseDTO[].class);

        Map<Integer, String> diseaseNameMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        List<Map<String, Object>> temp = new ArrayList<>();

        for (Object[] row : raw) {
            Integer diseaseId = (Integer) row[0];
            Long count = (Long) row[1];

            Map<String, Object> item = new HashMap<>();
            item.put("id", diseaseId);
            item.put("name", diseaseNameMap.getOrDefault(diseaseId, "Unknown"));
            item.put("value", count);

            temp.add(item);
        }
        temp.sort((a, b) -> Long.compare((Long) b.get("value"), (Long) a.get("value")));

        int TOP = 4;
        List<Map<String, Object>> result = new ArrayList<>();

        long otherTotal = 0;

        for (int i = 0; i < temp.size(); i++) {
            if (i < TOP) {
                result.add(temp.get(i));
            } else {
                otherTotal += (Long) temp.get(i).get("value");
            }
        }

        if (otherTotal > 0) {
            Map<String, Object> other = new HashMap<>();
            other.put("name", "Khác");
            other.put("value", otherTotal);
            result.add(other);
        }

        return result;
    }

    public List<Map<String, Object>> getNearbySummary(double lat, double lng, double radius) {

        List<Object[]> raw = caBenhRepository.countCasesNearby(lat, lng, radius);
        String url = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(url, DiseaseDTO[].class);

        Map<Integer, String> diseaseMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : raw) {
            Integer diseaseId = (Integer) row[0];
            Long count = ((Number) row[1]).longValue();

            Map<String, Object> item = new HashMap<>();
            item.put("name", diseaseMap.getOrDefault(diseaseId, "Unknown"));
            item.put("cases", count);

            result.add(item);
        }

        return result;
    }

    private List<Integer> getAllChildAreaIds(Integer rootId) {

        String url = "http://localhost:8082/api/areas";
        AreaDTO[] roots = restTemplate.getForObject(url, AreaDTO[].class);

        List<Integer> result = new ArrayList<>();

        for (AreaDTO root : roots) {
            collectIds(root, rootId, result);
        }

        return result;
    }

    private boolean collectIds(AreaDTO node, Integer targetId, List<Integer> result) {

        if (node.getId().equals(targetId)) {
            collectAll(node, result);
            return true;
        }

        if (node.getChildren() != null) {
            for (AreaDTO child : node.getChildren()) {
                if (collectIds(child, targetId, result)) {
                    return true;
                }
            }
        }

        return false;
    }

    private void collectAll(AreaDTO node, List<Integer> result) {
        result.add(node.getId());

        if (node.getChildren() != null) {
            for (AreaDTO child : node.getChildren()) {
                collectAll(child, result);
            }
        }
    }

    public Map<String, Long> getTodayStatsByArea(Integer maKhuVuc, Integer diseaseId) {

        LocalDate today = LocalDate.now();

        List<Integer> ids = getAllChildAreaIds(maKhuVuc);

        System.out.println(">>> Area IDs tìm được: " + ids);
        System.out.println(">>> diseaseId: " + diseaseId);
        System.out.println(">>> today: " + today);

        long dangMac = caBenhRepository
                .countByNgayPhatHienAndMaKhuVucInAndTinhTrangAndMaDichBenh(
                        today, ids, CaBenh.TinhTrang.DANG_MAC, diseaseId);

        long daKhoi = caBenhRepository
                .countByNgayPhatHienAndMaKhuVucInAndTinhTrangAndMaDichBenh(
                        today, ids, CaBenh.TinhTrang.DA_KHOI, diseaseId);

        long tuVong = caBenhRepository
                .countByNgayPhatHienAndMaKhuVucInAndTinhTrangAndMaDichBenh(
                        today, ids, CaBenh.TinhTrang.TU_VONG, diseaseId);

        Map<String, Long> result = new HashMap<>();
        result.put("newCases", dangMac);
        result.put("recovered", daKhoi);
        result.put("deaths", tuVong);

        return result;
    }

    public List<Map<String, Object>> getLineChart(
            Integer maKhuVuc,
            Integer diseaseId,
            LocalDate start,
            LocalDate end) {
        List<Integer> areaIds = getAllChildAreaIds(maKhuVuc);

        List<Object[]> raw = caBenhRepository.getChartByDateAndArea(
                start, end, areaIds, diseaseId);

        // Map date -> data
        Map<LocalDate, Map<String, Object>> map = new TreeMap<>();

        for (Object[] row : raw) {
            LocalDate date = (LocalDate) row[0];
            CaBenh.TinhTrang status = (CaBenh.TinhTrang) row[1];
            Long count = (Long) row[2];

            map.putIfAbsent(date, new HashMap<>());
            Map<String, Object> item = map.get(date);

            item.put("date", date.toString());

            switch (status) {
                case DANG_MAC -> item.put("cases", count);
                case DA_KHOI -> item.put("recovered", count);
                case TU_VONG -> item.put("deaths", count);
            }
        }

        // fill thiếu ngày + thiếu field
        List<Map<String, Object>> result = new ArrayList<>();

        LocalDate current = start;
        while (!current.isAfter(end)) {

            Map<String, Object> row = map.getOrDefault(current, new HashMap<>());

            row.put("date", current.toString());
            row.putIfAbsent("cases", 0);
            row.putIfAbsent("recovered", 0);
            row.putIfAbsent("deaths", 0);

            result.add(row);

            current = current.plusDays(1);
        }

        return result;
    }

    public List<Map<String, Object>> getPieChartByStatus(
            Integer maKhuVuc,
            Integer diseaseId,
            LocalDate start,
            LocalDate end) {
        List<Integer> areaIds = getAllChildAreaIds(maKhuVuc);

        List<Object[]> raw = caBenhRepository.countByStatus(
                start, end, areaIds, diseaseId);

        long dangMac = 0;
        long daKhoi = 0;
        long tuVong = 0;

        for (Object[] row : raw) {
            CaBenh.TinhTrang status = (CaBenh.TinhTrang) row[0];
            Long count = (Long) row[1];

            switch (status) {
                case DANG_MAC -> dangMac = count;
                case DA_KHOI -> daKhoi = count;
                case TU_VONG -> tuVong = count;
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        result.add(Map.of(
                "name", "Đang điều trị",
                "value", dangMac,
                "color", "#2563eb"));

        result.add(Map.of(
                "name", "Đã hồi phục",
                "value", daKhoi,
                "color", "#059669"));

        result.add(Map.of(
                "name", "Tử vong",
                "value", tuVong,
                "color", "#dc2626"));

        return result;
    }

    public List<CaseHistoryDTO> getCaseHistoryByArea(Integer maKhuVuc) {

        List<Integer> areaIds = getAllChildAreaIds(maKhuVuc);

        List<CaBenh> cases = caBenhRepository.findByAreaIds(areaIds);

        // gọi disease-service
        String diseaseUrl = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(diseaseUrl, DiseaseDTO[].class);

        Map<Integer, String> diseaseMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        // gọi user-service (NVYT)
        String userUrl = "http://localhost:8081/api/users/manager";
        ManagerResponse[] users = restTemplate.getForObject(userUrl, ManagerResponse[].class);

        Map<Integer, ManagerResponse> userMap = Arrays.stream(users)
                .collect(Collectors.toMap(ManagerResponse::getMaNguoiDung, u -> u));

        List<CaseHistoryDTO> result = new ArrayList<>();

        for (CaBenh c : cases) {

            CaseHistoryDTO dto = new CaseHistoryDTO();

            dto.setCaseId(c.getMaBenhNhan());
            dto.setDate(c.getNgayPhatHien().toString());
            dto.setType("Ca nhiễm");

            // disease
            dto.setDisease(diseaseMap.getOrDefault(c.getMaDichBenh(), "Unknown"));

            // user
            ManagerResponse user = userMap.get(c.getNguoiBaoCao());

            if (user != null) {
                dto.setStaffName(user.getHoTen());
                dto.setStaffId(user.getMaNhanVien());
            } else {
                dto.setStaffName("Không rõ");
                dto.setStaffId("N/A");
            }

            result.add(dto);
        }

        return result;
    }

    public List<Map<String, Object>> getDiseaseStatsByArea(Integer maKhuVuc) {

        List<Integer> areaIds = getAllChildAreaIds(maKhuVuc);

        List<Object[]> raw = caBenhRepository.countByDiseaseAndArea(areaIds);

        // gọi disease-service
        String url = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(url, DiseaseDTO[].class);

        Map<Integer, String> diseaseMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : raw) {
            Integer diseaseId = (Integer) row[0];
            Long count = (Long) row[1];

            Map<String, Object> item = new HashMap<>();
            item.put("name", diseaseMap.getOrDefault(diseaseId, "Unknown"));
            item.put("cases", count);

            result.add(item);
        }

        return result;
    }

    public List<Map<String, Object>> getTodayCasesByArea(Integer maKhuVuc) {

        List<Integer> areaIds = getAllChildAreaIds(maKhuVuc);

        List<CaBenh> cases = caBenhRepository.findTodayCasesByAreaIds(
                areaIds, LocalDate.now());

        // Gọi disease-service lấy tên bệnh
        String url = "http://localhost:8083/api/diseases";
        DiseaseDTO[] diseases = restTemplate.getForObject(url, DiseaseDTO[].class);

        Map<Integer, String> diseaseMap = Arrays.stream(diseases)
                .collect(Collectors.toMap(DiseaseDTO::getId, DiseaseDTO::getName));

        List<Map<String, Object>> result = new ArrayList<>();

        for (CaBenh c : cases) {
            Map<String, Object> item = new HashMap<>();
            item.put("maBenhNhan", c.getMaBenhNhan());
            item.put("hoTen", c.getHoTen());
            item.put("disease", diseaseMap.getOrDefault(c.getMaDichBenh(), "Unknown"));
            item.put("tinhTrang", c.getTinhTrang().name());
            item.put("ngayPhatHien", c.getNgayPhatHien().toString());
            result.add(item);
        }

        return result;
    }

    public boolean isUserUsed(Integer userId) {
        return caBenhRepository.existsByNguoiBaoCao(userId)
                || caTiepXucRepository.existsByNguoiBaoCao(userId);
    }
}