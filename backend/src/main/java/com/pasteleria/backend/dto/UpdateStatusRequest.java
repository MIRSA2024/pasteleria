package com.pasteleria.backend.dto;

import com.pasteleria.backend.models.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar el estado de un pedido
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {

    @NotNull(message = "El estado es obligatorio")
    private OrderStatus estado;
}