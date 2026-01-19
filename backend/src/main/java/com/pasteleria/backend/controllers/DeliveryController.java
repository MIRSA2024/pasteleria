package com.pasteleria.backend.controllers;

import com.pasteleria.backend.dto.OrderResponse;
import com.pasteleria.backend.dto.UpdateStatusRequest;
import com.pasteleria.backend.models.User;
import com.pasteleria.backend.services.DeliveryService;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de delivery
 * Endpoints: /api/delivery/*
 */
@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * GET /api/delivery/my-orders
     * Obtiene los pedidos asignados al delivery actual
     */
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<List<OrderResponse>> getMyAssignedOrders() {
        List<OrderResponse> orders = deliveryService.getMyAssignedOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * PATCH /api/delivery/orders/{id}/status
     * Actualiza el estado de un pedido (EN_CAMINO o ENTREGADO)
     */
    @PatchMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('DELIVERY')")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        try {
            OrderResponse order = deliveryService.updateDeliveryStatus(id, request.getEstado());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/delivery/admin/personnel
     * Obtiene todos los repartidores disponibles - Solo ADMIN
     */
    @GetMapping("/admin/personnel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getDeliveryPersonnel() {
        List<User> deliveryUsers = deliveryService.getAvailableDeliveryPersonnel();
        return ResponseEntity.ok(deliveryUsers);
    }

    /**
     * POST /api/delivery/admin/create-user
     * Crea un nuevo usuario repartidor - Solo ADMIN
     */
    @PostMapping("/admin/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDeliveryUser(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String telefono,
            @RequestParam String password
    ) {
        try {
            User u = deliveryService.createDeliveryUser(nombre, email, telefono, password, passwordEncoder);
            return ResponseEntity.status(201).body(u);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * POST /api/delivery/admin/assign
     * Asigna un pedido a un repartidor - Solo ADMIN
     */
    @PostMapping("/admin/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignOrderToDelivery(
            @RequestParam Long orderId,
            @RequestParam Long deliveryId) {
        try {
            OrderResponse order = deliveryService.assignOrderToDelivery(orderId, deliveryId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/delivery/admin/all-assignments
     * Obtiene todos los pedidos con sus asignaciones - Solo ADMIN
     */
    @GetMapping("/admin/all-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrdersWithDelivery() {
        List<OrderResponse> orders = deliveryService.getAllOrdersWithDelivery();
        return ResponseEntity.ok(orders);
    }

    // Clase interna para respuestas de error
    private static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        @SuppressWarnings("unused")
        public String getMessage() { return message; }
    }
}
