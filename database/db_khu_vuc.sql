CREATE DATABASE db_khu_vuc
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_khu_vuc;

CREATE TABLE khu_vuc (
    maKhuVuc INT AUTO_INCREMENT PRIMARY KEY,
    tenKhuVuc VARCHAR(150) NOT NULL,
    capDo ENUM('TINH','HUYEN','XA') NOT NULL,
    maKhuVucCha INT NULL,
    nguongCanhBao INT DEFAULT 0,
    CONSTRAINT fk_khuvuc_cha
        FOREIGN KEY (maKhuVucCha)
        REFERENCES khu_vuc(maKhuVuc)
        ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE khu_vuc 
ADD COLUMN maGADM VARCHAR(20) UNIQUE;