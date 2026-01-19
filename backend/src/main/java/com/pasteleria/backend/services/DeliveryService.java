package com.pasteleria.backend.services;

import com.pasteleria.backend.dto.OrderResponse;
import com.pasteleria.backend.models.*;
import com.pasteleria.backend.repositories.DeliveryAssignmentRepository;
import com.pasteleria.backend.repositories.OrderRepository;
import com.pasteleria.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Servicio de delivery
 * Maneja la asignación y seguimiento de entregas
 */
@Service
public class DeliveryService {

    @Autowired
    private DeliveryAssignmentRepository deliveryAssignmentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private OrderService orderService;

    /**
     * Asigna un pedido a un repartidor (Solo ADMIN)
     */
    @Transactional
    public OrderResponse assignOrderToDelivery(Long orderId, Long deliveryId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        User delivery = userRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Repartidor no encontrado"));

        if (delivery.getRol() != Role.DELIVERY) {
            throw new RuntimeException("El usuario no es un repartidor");
        }

        // Verificar si ya tiene asignación
        if (deliveryAssignmentRepository.existsByOrder(order)) {
            throw new RuntimeException("El pedido ya está asignado a un repartidor");
        }

        // Crear asignación
        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setOrder(order);
        assignment.setDelivery(delivery);
        assignment.setFechaAsignacion(LocalDateTime.now());

        deliveryAssignmentRepository.save(assignment);

        // Actualizar estado del pedido a POR_ENTREGAR
        order.setEstado(OrderStatus.POR_ENTREGAR);
        orderRepository.save(order);

        return orderService.getOrderById(orderId);
    }

    /**
     * Obtiene todos los repartidores disponibles (Solo ADMIN)
     */
    public List<User> getAvailableDeliveryPersonnel() {
        return userRepository.findByRolAndActivoTrue(Role.DELIVERY);
    }

    /**
     * Obtiene los pedidos asignados al delivery actual
     */
    public List<OrderResponse> getMyAssignedOrders() {
        User currentDelivery = authService.getCurrentUser();
        
        if (currentDelivery.getRol() != Role.DELIVERY) {
            throw new RuntimeException("Usuario no es un repartidor");
        }

        List<Order> orders = orderRepository.findByDeliveryId(currentDelivery.getId());
        
        return orders.stream()
                .map(order -> orderService.getOrderById(order.getId()))
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el estado de un pedido (Solo DELIVERY asignado)
     */
    @Transactional
    public OrderResponse updateDeliveryStatus(Long orderId, OrderStatus newStatus) {
        User currentDelivery = authService.getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Verificar que este delivery está asignado a este pedido
        if (order.getDeliveryAssignment() == null ||
                !order.getDeliveryAssignment().getDelivery().getId().equals(currentDelivery.getId())) {
            throw new RuntimeException("No tienes permiso para actualizar este pedido");
        }

        // Solo permitir transiciones a EN_CAMINO y ENTREGADO
        if (newStatus != OrderStatus.EN_CAMINO && newStatus != OrderStatus.ENTREGADO) {
            throw new RuntimeException("Estado no válido para delivery");
        }

        order.setEstado(newStatus);

        // Si se marca como entregado, registrar la fecha de entrega
        if (newStatus == OrderStatus.ENTREGADO) {
            DeliveryAssignment assignment = order.getDeliveryAssignment();
            assignment.setFechaEntrega(LocalDateTime.now());
            deliveryAssignmentRepository.save(assignment);
        }

        orderRepository.save(order);

        return orderService.getOrderById(orderId);
    }

    /**
     * Obtiene todos los pedidos con sus asignaciones (Solo ADMIN)
     */
    public List<OrderResponse> getAllOrdersWithDelivery() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> orderService.getOrderById(order.getId()))
                .collect(Collectors.toList());
    }
    /**
     * Crea un usuario repartidor (Solo ADMIN)
     */
    @Transactional
    public User createDeliveryUser(String nombre, String email, String telefono, String rawPassword, PasswordEncoder encoder) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está registrado");
        }

        User u = new User();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setTelefono(telefono);
        u.setPassword(encoder.encode(rawPassword));
        u.setRol(Role.DELIVERY);
        u.setActivo(true);
        return userRepository.save(u);
    }
}
