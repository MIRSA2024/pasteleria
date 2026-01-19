package com.pasteleria.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Spring Boot
 * Sistema de Pastelería - Backend
 */
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("==============================================");
        System.out.println("🎂 Backend de Pastelería iniciado exitosamente");
        System.out.println("📍 Servidor: http://localhost:8080");
        System.out.println("📚 API Docs: http://localhost:8080/api");
        System.out.println("==============================================");
    }
}