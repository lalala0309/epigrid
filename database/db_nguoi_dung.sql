-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 15, 2026 lúc 02:16 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_nguoi_dung`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `maNguoiDung` int(11) NOT NULL,
  `maVaiTro` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hoTen` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `viTri` point DEFAULT NULL,
  `trangThai` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`maNguoiDung`, `maVaiTro`, `email`, `hoTen`, `password`, `viTri`, `trangThai`) VALUES
(1, 1, 'admin@gmail.com', 'Admin System', '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq', 0x000000000101000000cdccccccccac5a40598638d6c58d2540, 'ACTIVE'),
(2, 2, 'manager@gmail.com', 'Manager', '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq', 0x000000000101000000be9f1a2fddac5a40ae47e17a148e2540, 'ACTIVE'),
(3, 3, 'user@gmail.com', 'User', '$2a$10$iD4Ji48ZiGnlERoSjCiJB.r2vqrl3sNwWCdYAWZylR4mvGVL2FdNq', 0x000000000101000000b0726891edac5a4075931804568e2540, 'ACTIVE'),
(4, 3, 'lalala0309@gmail.com', 'Nguyễn Tấn Kiệt', '$2a$10$qzlcG/TR1ml8ZiC2eQKMmOOjQvXQSB/eo4vJNhlx9pJQK/.QUZ.KO', NULL, 'ACTIVE');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vai_tro`
--

CREATE TABLE `vai_tro` (
  `maVaiTro` int(11) NOT NULL,
  `tenVaiTro` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vai_tro`
--

INSERT INTO `vai_tro` (`maVaiTro`, `tenVaiTro`) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'USER');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`maNguoiDung`),
  ADD UNIQUE KEY `UKmajqh5g4djy2tp3p9dvr64brp` (`email`),
  ADD KEY `FK564xtp8gen4cht7nyr8pv2nv0` (`maVaiTro`);

--
-- Chỉ mục cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  ADD PRIMARY KEY (`maVaiTro`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `maNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  MODIFY `maVaiTro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD CONSTRAINT `FK564xtp8gen4cht7nyr8pv2nv0` FOREIGN KEY (`maVaiTro`) REFERENCES `vai_tro` (`maVaiTro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
