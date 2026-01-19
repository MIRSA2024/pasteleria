package com.pasteleria.backend.controllers;

import com.pasteleria.backend.models.User;
import com.pasteleria.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de usuarios
 * Endpoints: /api/usuarios/*
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * GET /api/usuarios
     * Obtiene todos los usuarios (solo ADMIN)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/usuarios/{id}
     * Obtiene un usuario por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/usuarios/rol/{rol}
     * Obtiene usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable String rol) {
        try {
            com.pasteleria.backend.models.Role role = 
                com.pasteleria.backend.models.Role.valueOf(rol.toUpperCase());
            List<User> users = userRepository.findByRol(role);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body("Rol inválido. Valores permitidos: CLIENTE, ADMIN, DELIVERY");
        }
    }
}
