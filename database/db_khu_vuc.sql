CREATE DATABASE db_khu_vuc;
USE db_khu_vuc;

CREATE TABLE khu_vuc (
    maKhuVuc INT AUTO_INCREMENT PRIMARY KEY,
    tenKhuVuc VARCHAR(100) NOT NULL,
    capDo ENUM('XA','TINH') NOT NULL,
    maKhuVucCha INT,
    nguongCanhBao INT DEFAULT 0,
    hinhDang POLYGON SRID 4326,
    FOREIGN KEY (maKhuVucCha) REFERENCES khu_vuc(maKhuVuc),
    SPATIAL INDEX idx_kv_hinh_dang (hinhDang)
);
