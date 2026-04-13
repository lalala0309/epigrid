package com.epigrid.user_service.dto;

import lombok.*;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private Double lat;
    private Double lng;

}
