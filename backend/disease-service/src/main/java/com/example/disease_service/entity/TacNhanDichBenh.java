package com.example.disease_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tac_nhan_dich_benh")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(TacNhanDichBenhId.class)
public class TacNhanDichBenh {

    @Id
    private Integer maTacNhan;

    @Id
    private Integer maDichBenh;
}