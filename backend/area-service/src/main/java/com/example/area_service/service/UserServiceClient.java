
package com.example.area_service.client;

import com.example.area_service.dto.ManagerResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String URL = "http://localhost:8081/api/users/manager";

    public List<ManagerResponse> getNhanVienYTe() {

        try {

            ManagerResponse[] arr = restTemplate.getForObject(URL, ManagerResponse[].class);

            if (arr == null) {
                return List.of();
            }

            return Arrays.asList(arr);

        } catch (Exception e) {

            System.out.println("Lỗi gọi user-service: " + e.getMessage());

            return List.of();
        }
    }
}