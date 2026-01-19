import api from './api';
import { Order, UpdateStatusRequest, User, CreateDeliveryRequest } from '@/types';

/**
 * Servicio de delivery
 */
export const deliveryService = {
  /**
   * Obtiene los pedidos asignados al delivery actual
   */
  async getMyAssignedOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/delivery/my-orders');
    return response.data;
  },

  /**
   * Actualiza el estado de un pedido - DELIVERY
   */
  async updateDeliveryStatus(id: number, status: UpdateStatusRequest): Promise<Order> {
    const response = await api.patch<Order>(`/delivery/orders/${id}/status`, status);
    return response.data;
  },

  /**
   * Obtiene todos los repartidores - ADMIN
   */
  async getDeliveryPersonnel(): Promise<User[]> {
    const response = await api.get<User[]>('/delivery/admin/personnel');
    return response.data;
  },

  /**
   * Asigna un pedido a un repartidor - ADMIN
   */
  async assignOrderToDelivery(orderId: number, deliveryId: number): Promise<Order> {
    const response = await api.post<Order>('/delivery/admin/assign', null, {
      params: { orderId, deliveryId },
    });
    return response.data;
  },

  /**
   * Obtiene todos los pedidos con asignaciones - ADMIN
   */
  async getAllOrdersWithDelivery(): Promise<Order[]> {
    const response = await api.get<Order[]>('/delivery/admin/all-assignments');
    return response.data;
  },

  /**
   * Crea un nuevo repartidor - ADMIN
   */
  async createDeliveryUser(payload: CreateDeliveryRequest): Promise<User> {
    const response = await api.post<User>('/delivery/admin/create-user', null, {
      params: payload,
    });
    return response.data;
  },
};
