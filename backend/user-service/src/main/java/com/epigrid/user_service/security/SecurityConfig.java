package com.epigrid.user_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ========================
    // Password Encoder
    // ========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ========================
    // Security Filter Chain
    // ========================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ❌ dùng JWT → không cần CSRF
                .csrf(csrf -> csrf.disable())

                // ✅ bật CORS
                .cors(Customizer.withDefaults())

                // ❌ JWT → không dùng session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ⭐⭐ QUAN TRỌNG NHẤT (fix 403 React preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // login/register public
                        .requestMatchers("/api/auth/**").permitAll()

                        // test: mở toàn bộ (sau này đổi authenticated())
                        .anyRequest().permitAll());

        return http.build();
    }

    // ========================
    // CORS Configuration
    // ========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
