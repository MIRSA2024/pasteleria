'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut, User, Package, Cake } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const [logoError, setLogoError] = useState(false);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || 'Pastelería';
  const logoSrc = process.env.NEXT_PUBLIC_LOGO_URL || '/logo.png';

  return (
    <nav className="bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80">
            {logoError ? (
              <Cake className="w-8 h-8" />
            ) : (
              <img
                src={logoSrc}
                alt={brand}
                className="w-10 h-10 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <span className="whitespace-nowrap">{brand}</span>
          </Link>

          {/* Links de navegación */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Links según el rol */}
                {user?.rol === 'CLIENTE' && (
                  <>
                    <Link href="/catalogo" className="hover:text-pink-200 transition">
                      Catálogo
                    </Link>
                    <Link href="/pedidos" className="hover:text-pink-200 transition flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      Mis Pedidos
                    </Link>
                    <Link href="/carrito" className="relative hover:text-pink-200 transition">
                      <ShoppingCart className="w-6 h-6" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {user?.rol === 'ADMIN' && (
                  <>
                    <Link href="/admin/productos" className="hover:text-pink-200 transition">
                      Productos
                    </Link>
                    <Link href="/admin/pedidos" className="hover:text-pink-200 transition">
                      Pedidos
                    </Link>
                    <Link href="/admin/delivery" className="hover:text-pink-200 transition">
                      Delivery
                    </Link>
                  </>
                )}

                {user?.rol === 'DELIVERY' && (
                  <Link href="/delivery" className="hover:text-pink-200 transition">
                    Mis Entregas
                  </Link>
                )}

                {/* Usuario y logout */}
                <div className="flex items-center space-x-4 border-l border-pink-300 pl-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.nombre}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-pink-200 transition">
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
