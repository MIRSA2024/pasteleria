// ============================================
// TIPOS Y INTERFACES DEL SISTEMA
// ============================================

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'CLIENTE' | 'ADMIN' | 'DELIVERY';
  activo: boolean;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  userId: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

export interface CreateDeliveryRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  disponible: boolean;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}

export interface OrderItemRequest {
  productoId: number;
  cantidad: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  direccionEntrega: string;
  notas?: string;
}

export interface OrderItem {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DeliveryInfo {
  deliveryId: number;
  nombreDelivery: string;
  telefonoDelivery: string;
}

export type OrderStatus = 
  | 'PENDIENTE' 
  | 'EN_PREPARACION' 
  | 'POR_ENTREGAR' 
  | 'EN_CAMINO' 
  | 'ENTREGADO' 
  | 'CANCELADO';

export interface Order {
  id: number;
  usuarioId: number;
  nombreCliente: string;
  fecha: string;
  estado: OrderStatus;
  total: number;
  direccionEntrega: string;
  notas?: string;
  items: OrderItem[];
  deliveryInfo?: DeliveryInfo;
}

export interface UpdateStatusRequest {
  estado: OrderStatus;
}
