package com.pasteleria.backend.dto;

import com.pasteleria.backend.models.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para respuesta de pedido
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long usuarioId;
    private String nombreCliente;
    private LocalDateTime fecha;
    private OrderStatus estado;
    private BigDecimal total;
    private String direccionEntrega;
    private String notas;
    private List<OrderItemResponse> items;
    private DeliveryInfo deliveryInfo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long productoId;
        private String nombreProducto;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryInfo {
        private Long deliveryId;
        private String nombreDelivery;
        private String telefonoDelivery;
    }
}