'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = window.localStorage.getItem('cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart) as CartItem[];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.producto.id === product.id);

      if (existingItem) {
        // Si el producto ya está en el carrito, actualizar cantidad
        return prevCart.map((item) =>
          item.producto.id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo
        return [...prevCart, { producto: product, cantidad: quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.producto.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.producto.id === productId ? { ...item, cantidad: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
