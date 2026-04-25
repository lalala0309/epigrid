package com.example.case_service.dto;

import lombok.*;
import java.time.LocalDate;

@Data
public class CaseHistoryDTO {
    private String caseId;
    private String staffId;
    private String staffName;
    private String date;
    private String type;
    private String disease;
}