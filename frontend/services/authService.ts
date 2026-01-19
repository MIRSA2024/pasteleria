import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Inicia sesión
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Guardar token y datos del usuario
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify({
        id: response.data.userId,
        nombre: response.data.nombre,
        email: response.data.email,
        rol: response.data.rol,
      }));
    }
    
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Guardar token y datos del usuario
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify({
        id: response.data.userId,
        nombre: response.data.nombre,
        email: response.data.email,
        rol: response.data.rol,
      }));
    }
    
    return response.data;
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Obtiene el usuario actual del localStorage
   */
  getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  },

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  },
};
