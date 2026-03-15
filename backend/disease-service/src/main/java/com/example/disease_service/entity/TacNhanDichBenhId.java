package com.example.disease_service.entity;

import java.io.Serializable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TacNhanDichBenhId implements Serializable {

    private Integer maTacNhan;
    private Integer maDichBenh;
}