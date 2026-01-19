package com.pasteleria.backend.services;

import com.pasteleria.backend.dto.AuthResponse;
import com.pasteleria.backend.dto.LoginRequest;
import com.pasteleria.backend.dto.RegisterRequest;
import com.pasteleria.backend.models.Role;
import com.pasteleria.backend.models.User;
import com.pasteleria.backend.repositories.UserRepository;
import com.pasteleria.backend.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de autenticación
 * Maneja registro, login y validación de usuarios
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    /**
     * Registra un nuevo usuario
     */
    @Transactional
public AuthResponse register(RegisterRequest request) {
    // Verificar si el email ya existe
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("El email ya está registrado");
    }

    // Crear nuevo usuario
    User user = new User();
    user.setNombre(request.getNombre());
    user.setEmail(request.getEmail());
    user.setTelefono(request.getTelefono());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    
    // Asignar rol (por defecto CLIENTE si no viene)
    String rolStr = request.getRol();
    if (rolStr == null || rolStr.isBlank()) {
        user.setRol(Role.CLIENTE);
    } else {
        try {
            user.setRol(Role.valueOf(rolStr.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido. Use: ADMIN, DELIVERY o CLIENTE.");
        }
    }

    user.setActivo(true);

    // Guardar usuario
    User savedUser = userRepository.save(user);

    // Generar token
    String token = jwtProvider.generateTokenFromUsername(savedUser.getEmail());

    // Retornar respuesta
    return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getNombre(),
            savedUser.getEmail(),
            savedUser.getRol().name()
    );
}


    /**
     * Inicia sesión de un usuario
     */
    public AuthResponse login(LoginRequest request) {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar token
        String token = jwtProvider.generateToken(authentication);

        // Obtener usuario
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Retornar respuesta
        return new AuthResponse(
                token,
                user.getId(),
                user.getNombre(),
                user.getEmail(),
                user.getRol().name()
        );
    }

    /**
     * Obtiene el usuario autenticado actual
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public User resetAdminPassword() {
        User user = userRepository.findByEmail("admin@pasteleria.com")
                .orElseThrow(() -> new RuntimeException("Usuario admin no encontrado"));
        user.setPassword(passwordEncoder.encode("admin123"));
        user.setRol(Role.ADMIN);
        user.setActivo(true);
        return userRepository.save(user);
    }

    @Transactional
    public User resetDeliveryPassword() {
        User user = userRepository.findByEmail("delivery@pasteleria.com")
                .orElseThrow(() -> new RuntimeException("Usuario delivery no encontrado"));
        user.setPassword(passwordEncoder.encode("delivery123"));
        user.setRol(Role.DELIVERY);
        user.setActivo(true);
        return userRepository.save(user);
    }
}
