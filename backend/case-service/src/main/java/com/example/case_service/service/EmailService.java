package com.example.case_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAlert(String toEmail, String hoTen, double lat, double lng) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Cảnh báo dịch bệnh gần bạn");

        msg.setText(
                "Xin chào " + hoTen + ",\n\n" +
                        "Hệ thống phát hiện có ca nhiễm trong bán kính 1km khu vực của bạn.\n" +
                        "Vui lòng hạn chế di chuyển và theo dõi sức khỏe.\n\n" +
                        "EpiGrid System");
        System.out.println(" Gửi mail thành công tới: " + toEmail);
        mailSender.send(msg);
    }
}