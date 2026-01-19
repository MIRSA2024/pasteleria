package com.pasteleria.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de autenticación (login/registro exitoso)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Long userId;
    private String nombre;
    private String email;
    private String rol;

    public AuthResponse(String token, Long userId, String nombre, String email, String rol) {
        this.token = token;
        this.userId = userId;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }
}