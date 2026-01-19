package com.pasteleria.backend.repositories;

import com.pasteleria.backend.models.Order;
import com.pasteleria.backend.models.OrderStatus;
import com.pasteleria.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Order
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Busca pedidos por usuario
     */
    List<Order> findByUsuarioOrderByFechaDesc(User usuario);

    /**
     * Busca pedidos por estado
     */
    List<Order> findByEstadoOrderByFechaDesc(OrderStatus estado);

    /**
     * Busca pedidos por usuario y estado
     */
    List<Order> findByUsuarioAndEstadoOrderByFechaDesc(User usuario, OrderStatus estado);

    /**
     * Obtiene todos los pedidos ordenados por fecha descendente
     */
    List<Order> findAllByOrderByFechaDesc();

    /**
     * Busca pedidos asignados a un delivery específico
     */
    @Query("SELECT o FROM Order o JOIN o.deliveryAssignment da WHERE da.delivery.id = :deliveryId")
    List<Order> findByDeliveryId(Long deliveryId);
}