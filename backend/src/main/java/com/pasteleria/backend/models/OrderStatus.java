package com.pasteleria.backend.models;

/**
 * Enum que define los posibles estados de un pedido
 */
public enum OrderStatus {
    PENDIENTE,          // Pedido recién creado
    EN_PREPARACION,     // El pedido está siendo preparado
    POR_ENTREGAR,       // Listo para ser entregado
    EN_CAMINO,          // El delivery está en camino
    ENTREGADO,          // Pedido entregado exitosamente
    CANCELADO           // Pedido cancelado
}