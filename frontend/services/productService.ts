import api from './api';
import { Product } from '@/types';

/**
 * Servicio de productos
 */
export const productService = {
  /**
   * Obtiene todos los productos disponibles (público)
   */
  async getAvailableProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/public/all');
    return response.data;
  },

  /**
   * Obtiene un producto por ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/public/${id}`);
    return response.data;
  },

  /**
   * Obtiene todos los productos (incluye no disponibles) - ADMIN
   */
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/admin/all');
    return response.data;
  },

  /**
   * Crea un nuevo producto - ADMIN
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post<Product>('/products/admin', product);
    return response.data;
  },

  /**
   * Actualiza un producto - ADMIN
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/admin/${id}`, product);
    return response.data;
  },

  /**
   * Elimina un producto - ADMIN
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/admin/${id}`);
  },

  /**
   * Cambia la disponibilidad de un producto - ADMIN
   */
  async toggleAvailability(id: number): Promise<Product> {
    const response = await api.patch<Product>(`/products/admin/${id}/toggle-availability`);
    return response.data;
  },

  /**
   * Busca productos por categoría
   */
  async getProductsByCategory(categoria: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/public/category/${categoria}`);
    return response.data;
  },

  /**
   * Busca productos por nombre
   */
  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/public/search?q=${query}`);
    return response.data;
  },
};