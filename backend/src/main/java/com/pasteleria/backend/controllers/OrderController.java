package com.pasteleria.backend.controllers;

import com.pasteleria.backend.dto.OrderRequest;
import com.pasteleria.backend.dto.OrderResponse;
import com.pasteleria.backend.dto.UpdateStatusRequest;
import com.pasteleria.backend.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de pedidos
 * Endpoints: /api/orders/*
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * POST /api/orders
     * Crea un nuevo pedido - CLIENTE
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            OrderResponse order = orderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/orders/my-orders
     * Obtiene los pedidos del usuario actual - CLIENTE
     */
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        List<OrderResponse> orders = orderService.getOrdersByUser();
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/orders/{id}
     * Obtiene un pedido por ID - CLIENTE/ADMIN
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            OrderResponse order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/orders/admin/all
     * Obtiene todos los pedidos - Solo ADMIN
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * PATCH /api/orders/admin/{id}/status
     * Actualiza el estado de un pedido - Solo ADMIN
     */
    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        try {
            OrderResponse order = orderService.updateOrderStatus(id, request.getEstado());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Clase interna para respuestas de error
    private static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        @SuppressWarnings("unused")
        public String getMessage() { return message; }
    }
}