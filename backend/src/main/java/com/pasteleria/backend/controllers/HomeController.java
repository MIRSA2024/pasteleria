package com.pasteleria.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "✅ Backend de Pastelería - API funcionando correctamente");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());
        response.put("endpoints", Map.of(
            "auth", Map.of(
                "login", "/api/auth/login",
                "register", "/api/auth/register"
            ),
            "recursos", Map.of(
                "productos", "/api/productos",
                "pedidos", "/api/pedidos",
                "usuarios", "/api/usuarios",
                "delivery", "/api/delivery"
            ),
            "base_datos", Map.of(
                "h2_console", "/h2-console",
                "jdbc_url", "jdbc:h2:mem:pasteleria_db"
            )
        ));
        response.put("nota", "Los endpoints de recursos requieren autenticación JWT");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
}
