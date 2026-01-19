package com.pasteleria.backend.repositories;

import com.pasteleria.backend.models.Role;
import com.pasteleria.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por email
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email dado
     */
    Boolean existsByEmail(String email);

    /**
     * Busca usuarios por rol
     */
    List<User> findByRol(Role rol);

    /**
     * Busca usuarios activos por rol
     */
    List<User> findByRolAndActivoTrue(Role rol);
}