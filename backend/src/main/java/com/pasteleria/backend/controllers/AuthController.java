package com.pasteleria.backend.controllers;

import com.pasteleria.backend.dto.AuthResponse;
import com.pasteleria.backend.dto.LoginRequest;
import com.pasteleria.backend.dto.RegisterRequest;
import com.pasteleria.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticación
 * Endpoints: /api/auth/*
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Inicia sesión
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciales inválidas"));
        }
    }

    /**
     * GET /api/auth/me
     * Obtiene información del usuario actual
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("No autenticado"));

                    
        }
    }
    
    @PostMapping("/dev/reset-admin")
    public ResponseEntity<?> resetAdmin() {
        try {
            var user = authService.resetAdminPassword();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/dev/reset-delivery")
    public ResponseEntity<?> resetDelivery() {
        try {
            var user = authService.resetDeliveryPassword();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
@GetMapping("/ping")
public ResponseEntity<String> ping() {
    return ResponseEntity.ok("API pública funcionando");
}

    /**
     * Clase interna para respuestas de error
     */
    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        @SuppressWarnings("unused")
        public String getMessage() {
            return message;
        }

        @SuppressWarnings("unused")
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
