CREATE DATABASE db_ca_benh;
USE db_ca_benh;

CREATE TABLE ca_benh (
    maCaBenh INT AUTO_INCREMENT PRIMARY KEY,
    maDichBenh INT NOT NULL,   -- ID từ db_dich_benh
    maKhuVuc INT NOT NULL,     -- ID từ db_khu_vuc
    nguoiBaoCao INT NOT NULL,  -- ID từ db_nguoi_dung
    ngayPhatHien DATE NOT NULL,
    tinhTrang ENUM('DANG_MAC','DA_KHOI','TU_VONG') NOT NULL,
    viTri POINT SRID 4326 NOT NULL,
    SPATIAL INDEX idx_cb_vi_tri (viTri)
);

CREATE TABLE ca_tiep_xuc (
    maCaTiepXuc INT AUTO_INCREMENT PRIMARY KEY,
    maCaBenh INT NOT NULL,
    ngayTiepXuc DATE NOT NULL,
    viTri POINT SRID 4326,
    mucDoNguyCo ENUM('THAP','TRUNG_BINH','CAO') NOT NULL,
    FOREIGN KEY (maCaBenh) REFERENCES ca_benh(maCaBenh),
    SPATIAL INDEX idx_ctx_vi_tri (viTri)
);
