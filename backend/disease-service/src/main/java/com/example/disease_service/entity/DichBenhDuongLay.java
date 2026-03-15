package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dich_benh_duong_lay")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(DichBenhDuongLayId.class)
public class DichBenhDuongLay {

    @Id
    private Integer maDichBenh;

    @Id
    private Integer maDuongLay;
}