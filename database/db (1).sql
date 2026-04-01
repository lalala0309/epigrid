

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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
e structure for table `nguoi_dung`
--

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
  `nguoiBaoCaoGioiTinh` enum('KHAC','NAM','NU') DEFAULT NULL,
  `nguoiBaoCaoHoTen` varchar(100) DEFAULT NULL,
  `nguoiBaoCaoNgaySinh` date DEFAULT NULL,
  `nguoiBaoCaoSDT` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`maCaBenh`),
  UNIQUE KEY `maBenhNhan` (`maBenhNhan`),
  UNIQUE KEY `idx_cb_ma_benh_nhan` (`maBenhNhan`),
  SPATIAL KEY `idx_cb_vi_tri` (`viTri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`maCaTiepXuc`),
  KEY `fk_ctx_cabenh` (`maCaBenh`),
  SPATIAL KEY `idx_ctx_vi_tri` (`viTri`),
  CONSTRAINT `fk_ctx_cabenh` FOREIGN KEY (`maCaBenh`) REFERENCES `ca_benh` (`maCaBenh`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

