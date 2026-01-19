'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      const userData: User = {
        id: response.userId,
        nombre: response.nombre,
        email: response.email,
        rol: response.rol as 'CLIENTE' | 'ADMIN' | 'DELIVERY',
        telefono: '',
        activo: true,
      };
      setUser(userData);

      // Redirigir según el rol
      if (response.rol === 'ADMIN') {
        router.push('/admin/productos');
      } else if (response.rol === 'DELIVERY') {
        router.push('/delivery');
      } else {
        router.push('/catalogo');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      const userData: User = {
        id: response.userId,
        nombre: response.nombre,
        email: response.email,
        rol: response.rol as 'CLIENTE' | 'ADMIN' | 'DELIVERY',
        telefono: data.telefono,
        activo: true,
      };
      setUser(userData);
      router.push('/catalogo');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}