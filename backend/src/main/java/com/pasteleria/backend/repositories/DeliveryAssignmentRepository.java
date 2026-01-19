package com.pasteleria.backend.repositories;

import com.pasteleria.backend.models.DeliveryAssignment;
import com.pasteleria.backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad DeliveryAssignment
 */
@Repository
public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {

    /**
     * Busca una asignación por pedido
     */
    Optional<DeliveryAssignment> findByOrder(Order order);

    /**
     * Verifica si un pedido ya tiene asignación
     */
    Boolean existsByOrder(Order order);
}