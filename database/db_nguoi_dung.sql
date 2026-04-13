

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `maNguoiDung` int NOT NULL AUTO_INCREMENT,
  `maVaiTro` int NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `hoTen` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `viTri` point DEFAULT NULL,
  `trangThai` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`maNguoiDung`),
  UNIQUE KEY `UKmajqh5g4djy2tp3p9dvr64brp` (`email`),
  KEY `FK564xtp8gen4cht7nyr8pv2nv0` (`maVaiTro`),
  CONSTRAINT `FK564xtp8gen4cht7nyr8pv2nv0` FOREIGN KEY (`maVaiTro`) REFERENCES `vai_tro` (`maVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nhan_vien_y_te`
--

DROP TABLE IF EXISTS `nhan_vien_y_te`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien_y_te` (
  `maNhanVien` varchar(255) NOT NULL,
  `maNguoiDung` int NOT NULL,
  PRIMARY KEY (`maNhanVien`),
  KEY `maNguoiDung` (`maNguoiDung`),
  CONSTRAINT `nhan_vien_y_te_ibfk_1` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoi_dung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vai_tro`
--

DROP TABLE IF EXISTS `vai_tro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vai_tro` (
  `maVaiTro` int NOT NULL AUTO_INCREMENT,
  `tenVaiTro` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

