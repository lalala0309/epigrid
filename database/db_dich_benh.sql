CREATE DATABASE db_dich_benh;
USE db_dich_benh;

CREATE TABLE loai_dich_benh (
    maLoaiDichBenh INT AUTO_INCREMENT PRIMARY KEY,
    tenLoaiDichBenh VARCHAR(100) NOT NULL,
    moTaLoaiDichBenh TEXT
);

CREATE TABLE dich_benh (
    maDichBenh INT AUTO_INCREMENT PRIMARY KEY,
    tenDichBenh VARCHAR(100) NOT NULL,
    moTaDichBenh TEXT,
    maLoaiDichBenh INT,
    FOREIGN KEY (maLoaiDichBenh)
        REFERENCES loai_dich_benh(maLoaiDichBenh)
);
