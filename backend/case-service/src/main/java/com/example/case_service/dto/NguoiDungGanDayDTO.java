package com.example.case_service.dto;

import com.example.case_service.entity.CaBenh;
import com.example.case_service.entity.CaTiepXuc;
import lombok.*;
import java.time.LocalDate;

@Data
public class NguoiDungGanDayDTO {

    private Integer maNguoiDung;
    private String email;
    private String hoTen;
}
