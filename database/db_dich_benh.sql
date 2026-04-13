-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_dich_benh
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
-- Table structure for table `dich_benh`
--

DROP TABLE IF EXISTS `dich_benh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_benh` (
  `maDichBenh` int NOT NULL AUTO_INCREMENT,
  `tenDichBenh` varchar(255) DEFAULT NULL,
  `moTaDichBenh` varchar(255) DEFAULT NULL,
  `maNhom` int DEFAULT NULL,
  PRIMARY KEY (`maDichBenh`),
  KEY `maNhom` (`maNhom`),
  CONSTRAINT `dich_benh_ibfk_1` FOREIGN KEY (`maNhom`) REFERENCES `nhom_nguy_hiem` (`maNhom`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dich_benh_duong_lay`
--

DROP TABLE IF EXISTS `dich_benh_duong_lay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_benh_duong_lay` (
  `maDichBenh` int NOT NULL,
  `maDuongLay` int NOT NULL,
  PRIMARY KEY (`maDichBenh`,`maDuongLay`),
  KEY `maDuongLay` (`maDuongLay`),
  CONSTRAINT `dich_benh_duong_lay_ibfk_1` FOREIGN KEY (`maDichBenh`) REFERENCES `dich_benh` (`maDichBenh`),
  CONSTRAINT `dich_benh_duong_lay_ibfk_2` FOREIGN KEY (`maDuongLay`) REFERENCES `duong_lay` (`maDuongLay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dich_benh_trieu_chung`
--

DROP TABLE IF EXISTS `dich_benh_trieu_chung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_benh_trieu_chung` (
  `maDichBenh` int NOT NULL,
  `maTrieuChung` int NOT NULL,
  PRIMARY KEY (`maDichBenh`,`maTrieuChung`),
  KEY `maTrieuChung` (`maTrieuChung`),
  CONSTRAINT `dich_benh_trieu_chung_ibfk_1` FOREIGN KEY (`maDichBenh`) REFERENCES `dich_benh` (`maDichBenh`),
  CONSTRAINT `dich_benh_trieu_chung_ibfk_2` FOREIGN KEY (`maTrieuChung`) REFERENCES `trieu_chung` (`maTrieuChung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `duong_lay`
--

DROP TABLE IF EXISTS `duong_lay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `duong_lay` (
  `maDuongLay` int NOT NULL AUTO_INCREMENT,
  `tenDuongLay` varchar(255) DEFAULT NULL,
  `moTa` text,
  PRIMARY KEY (`maDuongLay`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loai_tac_nhan`
--

DROP TABLE IF EXISTS `loai_tac_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_tac_nhan` (
  `maLoaiTacNhan` int NOT NULL AUTO_INCREMENT,
  `tenLoaiTacNhan` varchar(255) DEFAULT NULL,
  `moTa` text,
  PRIMARY KEY (`maLoaiTacNhan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nhom_nguy_hiem`
--

DROP TABLE IF EXISTS `nhom_nguy_hiem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhom_nguy_hiem` (
  `maNhom` int NOT NULL AUTO_INCREMENT,
  `tenNhom` varchar(255) DEFAULT NULL,
  `moTa` text,
  PRIMARY KEY (`maNhom`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tac_nhan`
--

DROP TABLE IF EXISTS `tac_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tac_nhan` (
  `maTacNhan` int NOT NULL AUTO_INCREMENT,
  `tenTacNhan` varchar(255) DEFAULT NULL,
  `mota` text,
  `maLoaiTacNhan` int DEFAULT NULL,
  PRIMARY KEY (`maTacNhan`),
  KEY `maLoaiTacNhan` (`maLoaiTacNhan`),
  CONSTRAINT `tac_nhan_ibfk_1` FOREIGN KEY (`maLoaiTacNhan`) REFERENCES `loai_tac_nhan` (`maLoaiTacNhan`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tac_nhan_dich_benh`
--

DROP TABLE IF EXISTS `tac_nhan_dich_benh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tac_nhan_dich_benh` (
  `maTacNhan` int NOT NULL,
  `maDichBenh` int NOT NULL,
  PRIMARY KEY (`maTacNhan`,`maDichBenh`),
  KEY `maDichBenh` (`maDichBenh`),
  CONSTRAINT `tac_nhan_dich_benh_ibfk_1` FOREIGN KEY (`maTacNhan`) REFERENCES `tac_nhan` (`maTacNhan`),
  CONSTRAINT `tac_nhan_dich_benh_ibfk_2` FOREIGN KEY (`maDichBenh`) REFERENCES `dich_benh` (`maDichBenh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trieu_chung`
--

DROP TABLE IF EXISTS `trieu_chung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trieu_chung` (
  `maTrieuChung` int NOT NULL AUTO_INCREMENT,
  `tenTrieuChung` varchar(255) DEFAULT NULL,
  `moTa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`maTrieuChung`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-12  2:44:32
