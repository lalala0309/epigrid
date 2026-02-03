CREATE DATABASE db_canh_bao;
USE db_canh_bao;

CREATE TABLE canh_bao (
    maCanhBao INT AUTO_INCREMENT PRIMARY KEY,
    loaiCanhBao ENUM('KHOANG_CACH','VUOT_NGUONG') NOT NULL,
    maDichBenh INT NOT NULL,
    maKhuVuc INT,
    maCaBenh INT,
    thoiGian DATETIME NOT NULL,
    noiDungCanhBao TEXT
);

CREATE TABLE nguoi_nhan_canh_bao (
    maCanhBao INT NOT NULL,
    maNguoiDung INT NOT NULL,
    kieuCanhBao ENUM('EMAIL','GIAO_DIEN') NOT NULL,
    trangThai BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (maCanhBao, maNguoiDung)
);
