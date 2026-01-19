package com.pasteleria.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para crear un nuevo pedido
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotEmpty(message = "El pedido debe tener al menos un producto")
    private List<OrderItemRequest> items;

    @NotBlank(message = "La dirección de entrega es obligatoria")
    private String direccionEntrega;

    private String notas;

    /**
     * DTO interno para items del pedido
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        private Long productoId;
        private Integer cantidad;
    }
}