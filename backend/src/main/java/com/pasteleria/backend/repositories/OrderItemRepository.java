package com.pasteleria.backend.repositories;

import com.pasteleria.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad OrderItem
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Los métodos básicos son suficientes por ahora
}