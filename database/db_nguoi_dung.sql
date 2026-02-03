CREATE DATABASE db_nguoi_dung;
USE db_nguoi_dung;

CREATE TABLE vai_tro (
    maVaiTro INT AUTO_INCREMENT PRIMARY KEY,
    tenVaiTro VARCHAR(50) NOT NULL
);

CREATE TABLE nguoi_dung (
    maNguoiDung INT AUTO_INCREMENT PRIMARY KEY,
    hoTen VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    maVaiTro INT NOT NULL,
    viTri POINT NOT NULL,
    FOREIGN KEY (maVaiTro) REFERENCES vai_tro(maVaiTro),
    SPATIAL INDEX idx_nd_vi_tri (viTri)
) ENGINE=InnoDB;

INSERT INTO vai_tro VALUES
(1,'ADMIN'),
(2,'MANAGER'),
(3,'USER');

USE db_nguoi_dung;

INSERT INTO nguoi_dung (hoTen, email, password, maVaiTro, viTri)
VALUES
('Admin System',
 'admin@gmail.com',
 '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
 1,
 POINT(106.7000, 10.7769)),

('Manager',
 'manager@gmail.com',
 '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
 2,
 POINT(106.7010, 10.7775)),

('User',
 'user@gmail.com',
 '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq',
 3,
 POINT(106.7020, 10.7780));
