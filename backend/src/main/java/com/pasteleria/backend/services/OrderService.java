package com.pasteleria.backend.services;

import com.pasteleria.backend.dto.OrderRequest;
import com.pasteleria.backend.dto.OrderResponse;
import com.pasteleria.backend.models.*;
import com.pasteleria.backend.repositories.OrderRepository;
import com.pasteleria.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de pedidos
 * Maneja la lógica de negocio relacionada con pedidos
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    /**
     * Crea un nuevo pedido
     */
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User currentUser = authService.getCurrentUser();

        // Crear el pedido
        Order order = new Order();
        order.setUsuario(currentUser);
        order.setDireccionEntrega(request.getDireccionEntrega());
        order.setNotas(request.getNotas());
        order.setEstado(OrderStatus.PENDIENTE);

        // Calcular total y agregar items
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (!product.getDisponible()) {
                throw new RuntimeException("El producto " + product.getNombre() + " no está disponible");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProducto(product);
            orderItem.setCantidad(itemRequest.getCantidad());
            orderItem.setPrecioUnitario(product.getPrecio());
            orderItem.setSubtotal(product.getPrecio().multiply(BigDecimal.valueOf(itemRequest.getCantidad())));

            order.addItem(orderItem);
            total = total.add(orderItem.getSubtotal());
        }

        order.setTotal(total);

        // Guardar pedido
        Order savedOrder = orderRepository.save(order);

        return convertToOrderResponse(savedOrder);
    }

    /**
     * Obtiene todos los pedidos de un usuario
     */
    public List<OrderResponse> getOrdersByUser() {
        User currentUser = authService.getCurrentUser();
        List<Order> orders = orderRepository.findByUsuarioOrderByFechaDesc(currentUser);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los pedidos (Solo ADMIN)
     */
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByFechaDesc();
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un pedido por ID
     */
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        // Verificar que el usuario actual pueda ver este pedido
        User currentUser = authService.getCurrentUser();
        if (currentUser.getRol() == Role.CLIENTE && !order.getUsuario().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No tienes permiso para ver este pedido");
        }

        return convertToOrderResponse(order);
    }

    /**
     * Actualiza el estado de un pedido
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar transiciones de estado
        validateStatusTransition(order.getEstado(), newStatus);

        order.setEstado(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return convertToOrderResponse(updatedOrder);
    }

    /**
     * Obtiene pedidos por estado
     */
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByEstadoOrderByFechaDesc(status);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Valida que la transición de estado sea válida
     */
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Lógica de validación de transiciones
        if (currentStatus == OrderStatus.ENTREGADO || currentStatus == OrderStatus.CANCELADO) {
            throw new RuntimeException("No se puede cambiar el estado de un pedido finalizado");
        }
        // Se pueden agregar más validaciones según las reglas de negocio
    }

    /**
     * Convierte una entidad Order a OrderResponse DTO
     */
    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUsuarioId(order.getUsuario().getId());
        response.setNombreCliente(order.getUsuario().getNombre());
        response.setFecha(order.getFecha());
        response.setEstado(order.getEstado());
        response.setTotal(order.getTotal());
        response.setDireccionEntrega(order.getDireccionEntrega());
        response.setNotas(order.getNotas());

        // Convertir items
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderResponse.OrderItemResponse(
                        item.getId(),
                        item.getProducto().getId(),
                        item.getProducto().getNombre(),
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());
        response.setItems(items);

        // Información de delivery si existe
        if (order.getDeliveryAssignment() != null) {
            User delivery = order.getDeliveryAssignment().getDelivery();
            OrderResponse.DeliveryInfo deliveryInfo = new OrderResponse.DeliveryInfo(
                    delivery.getId(),
                    delivery.getNombre(),
                    delivery.getTelefono()
            );
            response.setDeliveryInfo(deliveryInfo);
        }

        return response;
    }
}