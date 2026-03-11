CREATE DATABASE db_dich_benh;
USE db_dich_benh;

CREATE TABLE loai_tac_nhan (
    maLoaiTacNhan INT AUTO_INCREMENT PRIMARY KEY,
    tenLoaiTacNhan VARCHAR(100) NOT NULL,
    moTa TEXT
);

CREATE TABLE tac_nhan (
    maTacNhan INT AUTO_INCREMENT PRIMARY KEY,
    tenTacNhan VARCHAR(150) NOT NULL,
    moTa TEXT,
    maLoaiTacNhan INT,
    FOREIGN KEY (maLoaiTacNhan)
        REFERENCES loai_tac_nhan(maLoaiTacNhan)
);

CREATE TABLE nhom_nguy_hiem (
    maNhom INT AUTO_INCREMENT PRIMARY KEY,
    tenNhom VARCHAR(10) NOT NULL,
    moTa TEXT
);

CREATE TABLE dich_benh (
    maDichBenh INT AUTO_INCREMENT PRIMARY KEY,
    tenDichBenh VARCHAR(150) NOT NULL,
    moTaDichBenh TEXT,
    maNhom INT,
    FOREIGN KEY (maNhom)
        REFERENCES nhom_nguy_hiem(maNhom)
);

CREATE TABLE tac_nhan_dich_benh (
    maTacNhan INT,
    maDichBenh INT,
    PRIMARY KEY (maTacNhan, maDichBenh),
    FOREIGN KEY (maTacNhan) REFERENCES tac_nhan(maTacNhan),
    FOREIGN KEY (maDichBenh) REFERENCES dich_benh(maDichBenh)
);

CREATE TABLE dich_benh_trieu_chung (
    maDichBenh INT,
    maTrieuChung INT,
    PRIMARY KEY (maDichBenh, maTrieuChung),
    FOREIGN KEY (maDichBenh) REFERENCES dich_benh(maDichBenh),
    FOREIGN KEY (maTrieuChung) REFERENCES trieu_chung(maTrieuChung)
);

CREATE TABLE trieu_chung (
    maTrieuChung INT AUTO_INCREMENT PRIMARY KEY,
    tenTrieuChung VARCHAR(150) NOT NULL,
    moTa TEXT
); 

CREATE TABLE duong_lay (
    maDuongLay INT AUTO_INCREMENT PRIMARY KEY,
    tenDuongLay VARCHAR(150) NOT NULL,
    moTa TEXT
);

CREATE TABLE dich_benh_duong_lay (
    maDichBenh INT,
    maDuongLay INT,
    PRIMARY KEY (maDichBenh, maDuongLay),
    FOREIGN KEY (maDichBenh) REFERENCES dich_benh(maDichBenh),
    FOREIGN KEY (maDuongLay) REFERENCES duong_lay(maDuongLay)
);
