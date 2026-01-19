import api from './api';
import { Order, OrderRequest, UpdateStatusRequest } from '@/types';

/**
 * Servicio de pedidos
 */
export const orderService = {
  /**
   * Crea un nuevo pedido - CLIENTE
   */
  async createOrder(order: OrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', order);
    return response.data;
  },

  /**
   * Obtiene los pedidos del usuario actual - CLIENTE
   */
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/my-orders');
    return response.data;
  },

  /**
   * Obtiene un pedido por ID
   */
  async getOrderById(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Obtiene todos los pedidos - ADMIN
   */
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/admin/all');
    return response.data;
  },

  /**
   * Actualiza el estado de un pedido - ADMIN
   */
  async updateOrderStatus(id: number, status: UpdateStatusRequest): Promise<Order> {
    const response = await api.patch<Order>(`/orders/admin/${id}/status`, status);
    return response.data;
  },
};