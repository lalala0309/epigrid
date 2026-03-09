-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_khu_vuc
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
-- Table structure for table `khu_vuc`
--

DROP TABLE IF EXISTS `khu_vuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khu_vuc` (
  `maKhuVuc` int NOT NULL AUTO_INCREMENT,
  `tenKhuVuc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capDo` enum('TINH','HUYEN','XA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `maKhuVucCha` int DEFAULT NULL,
  `nguongCanhBao` int DEFAULT '0',
  `maGADM` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`maKhuVuc`),
  UNIQUE KEY `maGADM` (`maGADM`),
  KEY `fk_khuvuc_cha` (`maKhuVucCha`),
  CONSTRAINT `fk_khuvuc_cha` FOREIGN KEY (`maKhuVucCha`) REFERENCES `khu_vuc` (`maKhuVuc`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11937 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phan_cong_nhan_vien`
--

DROP TABLE IF EXISTS `phan_cong_nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_nhan_vien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maKhuVuc` int NOT NULL,
  `maNguoiDung` int NOT NULL,
  `ngayPhanCong` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pc_khuvuc` (`maKhuVuc`),
  CONSTRAINT `fk_pc_khuvuc` FOREIGN KEY (`maKhuVuc`) REFERENCES `khu_vuc` (`maKhuVuc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-08  0:30:16
