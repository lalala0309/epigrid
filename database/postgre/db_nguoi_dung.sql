-- ================================
-- Tạo extension PostGIS
-- ================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ================================
-- Xoá bảng nếu đã tồn tại
-- ================================
DROP TABLE IF EXISTS nguoi_dung CASCADE;
DROP TABLE IF EXISTS vai_tro CASCADE;

-- ================================
-- Tạo bảng vai_tro
-- ================================
CREATE TABLE vai_tro (
    maVaiTro SERIAL PRIMARY KEY,
    tenVaiTro VARCHAR(50) NOT NULL
);

-- ================================
-- Tạo bảng nguoi_dung
-- ================================
CREATE TABLE nguoi_dung (
    maNguoiDung SERIAL PRIMARY KEY,
    maVaiTro INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hoTen VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    viTri geometry(Point, 4326),
    trangThai VARCHAR(255),
    CONSTRAINT fk_vai_tro
        FOREIGN KEY (maVaiTro)
        REFERENCES vai_tro(maVaiTro)
        ON DELETE CASCADE
);

-- ================================
-- Insert dữ liệu vai_tro
-- ================================
INSERT INTO vai_tro (maVaiTro, tenVaiTro) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'USER');

-- ================================
-- Insert dữ liệu nguoi_dung
-- ================================
INSERT INTO nguoi_dung 
(maNguoiDung, maVaiTro, email, hoTen, password, viTri, trangThai)
VALUES
(1, 1, 'admin@gmail.com', 'Admin System',
'$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
ST_SetSRID(ST_MakePoint(106.700000, 10.780000), 4326),
'ACTIVE'),

(2, 2, 'manager@gmail.com', 'Manager',
'$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
ST_SetSRID(ST_MakePoint(106.705000, 10.785000), 4326),
'ACTIVE'),

(3, 3, 'user@gmail.com', 'User',
'$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
ST_SetSRID(ST_MakePoint(106.710000, 10.790000), 4326),
'ACTIVE'),

(4, 3, 'lalala0309@gmail.com', 'Nguyễn Tấn Kiệt',
'$2a$10$qzlcG/TR1ml8ZiC2eQKMmOOjQvXQSB/eo4vJNhlx9pJQK/.QUZ.KO',
NULL,
'ACTIVE');

-- ================================
-- Reset sequence về đúng giá trị
-- ================================
SELECT setval(pg_get_serial_sequence('vai_tro','maVaiTro'), 3, true);
SELECT setval(pg_get_serial_sequence('nguoi_dung','maNguoiDung'), 4, true);
