-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_ca_benh
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ca_benh`
--

DROP TABLE IF EXISTS `ca_benh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ca_benh` (
  `maCaBenh` int NOT NULL AUTO_INCREMENT,
  `maBenhNhan` varchar(50) NOT NULL,
  `maDichBenh` int NOT NULL,
  `maKhuVuc` int NOT NULL,
  `nguoiBaoCao` int NOT NULL,
  `hoTen` varchar(100) NOT NULL COMMENT 'Họ và tên bệnh nhân',
  `soDienThoai` varchar(15) NOT NULL COMMENT 'Số điện thoại bệnh nhân',
  `ngaySinh` date NOT NULL COMMENT 'Ngày sinh bệnh nhân',
  `gioiTinh` enum('NAM','NU','KHAC') NOT NULL COMMENT 'Giới tính bệnh nhân',
  `ngayPhatHien` date NOT NULL,
  `tinhTrang` enum('DANG_MAC','DA_KHOI','TU_VONG') NOT NULL,
  `viTri` point NOT NULL /*!80003 SRID 4326 */,
  PRIMARY KEY (`maCaBenh`),
  UNIQUE KEY `maBenhNhan` (`maBenhNhan`),
  UNIQUE KEY `idx_cb_ma_benh_nhan` (`maBenhNhan`),
  SPATIAL KEY `idx_cb_vi_tri` (`viTri`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ca_tiep_xuc`
--

DROP TABLE IF EXISTS `ca_tiep_xuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ca_tiep_xuc` (
  `maCaTiepXuc` int NOT NULL AUTO_INCREMENT,
  `maCaBenh` int NOT NULL,
  `hoTen` varchar(100) NOT NULL COMMENT 'Họ và tên người tiếp xúc',
  `soDienThoai` varchar(15) NOT NULL COMMENT 'Số điện thoại người tiếp xúc',
  `ngaySinh` date NOT NULL COMMENT 'Ngày sinh người tiếp xúc',
  `gioiTinh` enum('NAM','NU','KHAC') NOT NULL COMMENT 'Giới tính người tiếp xúc',
  `ngayTiepXuc` date NOT NULL,
  `viTri` point NOT NULL /*!80003 SRID 4326 */,
  `mucDoNguyCo` enum('THAP','TRUNG_BINH','CAO') NOT NULL,
  `nguoiBaoCao` int NOT NULL,
  PRIMARY KEY (`maCaTiepXuc`),
  KEY `fk_ctx_cabenh` (`maCaBenh`),
  SPATIAL KEY `idx_ctx_vi_tri` (`viTri`),
  CONSTRAINT `fk_ctx_cabenh` FOREIGN KEY (`maCaBenh`) REFERENCES `ca_benh` (`maCaBenh`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  1:26:21
