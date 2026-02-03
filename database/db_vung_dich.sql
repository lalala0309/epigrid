CREATE DATABASE db_vung_dich;
USE db_vung_dich;

CREATE TABLE cap_do_vung_dich (
    maCapDo INT AUTO_INCREMENT PRIMARY KEY,
    tenCapDo VARCHAR(50) NOT NULL,
    moTaCapDo TEXT
);

CREATE TABLE vung_dich (
    maVungDich INT AUTO_INCREMENT PRIMARY KEY,
    maDichBenh INT NOT NULL,  -- ID
    maKhuVuc INT NOT NULL,    -- ID
    maCapDo INT NOT NULL,
    ngayBatDau DATE NOT NULL,
    ngayKetThuc DATE,
    trangThai ENUM('DANG_HOAT_DONG','DA_KET_THUC') NOT NULL,
    hinhDang POLYGON SRID 4326 NOT NULL,
    FOREIGN KEY (maCapDo) REFERENCES cap_do_vung_dich(maCapDo),
    SPATIAL INDEX idx_vd_hinh_dang (hinhDang)
);

CREATE TABLE lich_su_vung_dich (
    maLichSu INT AUTO_INCREMENT PRIMARY KEY,
    maVungDich INT NOT NULL,
    hanhDong ENUM(
        'TAO','CAP_NHAT','DOI_CAP_DO','THAY_DOI_HINH_DANG','KET_THUC'
    ) NOT NULL,
    thoiGian DATETIME NOT NULL,
    maNguoiThucHien INT NOT NULL, -- ID người dùng
    ghiChu TEXT,
    FOREIGN KEY (maVungDich) REFERENCES vung_dich(maVungDich)
);
