package com.example.disease_service.entity;

import java.io.Serializable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DichBenhTrieuChungId implements Serializable {

    private Integer maDichBenh;
    private Integer maTrieuChung;
}