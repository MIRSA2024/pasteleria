package com.pasteleria.backend.services;

import com.pasteleria.backend.models.User;
import com.pasteleria.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio personalizado para cargar usuarios
 * Implementa UserDetailsService requerido por Spring Security
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Carga un usuario por su email (username)
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        
        return user;
    }

    /**
     * Carga un usuario por su ID
     */
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> 
                    new UsernameNotFoundException("Usuario no encontrado con id: " + id));
        
        return user;
    }
}