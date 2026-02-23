package com.epigrid.user_service.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String hoTen;
    private String email;
    private String password;
}
