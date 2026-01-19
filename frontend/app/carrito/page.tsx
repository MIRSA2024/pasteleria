'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { Trash2, Plus, Minus, ShoppingCart, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!direccion.trim()) {
      alert('Por favor ingresa una dirección de entrega');
      return;
    }

    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const orderRequest = {
        items: cart.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
        direccionEntrega: direccion,
        notas: notas || undefined,
      };

      await orderService.createOrder(orderRequest);
      clearCart();
      alert('¡Pedido realizado exitosamente!');
      router.push('/pedidos');
    } catch (error: unknown) {
      const msg = (typeof error === 'object' && error && 'response' in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(msg || 'Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos desde nuestro catálogo</p>
          <button
            onClick={() => router.push('/catalogo')}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Carrito de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.producto.id}
                className="bg-white rounded-xl shadow-md p-4 flex gap-4"
              >
                {/* Imagen */}
                <div className="relative w-24 h-24 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  {item.producto.imagenUrl ? (
                    <Image
                      src={item.producto.imagenUrl}
                      alt={item.producto.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.producto.descripcion}</p>
                  <p className="text-pink-600 font-bold text-lg">
                    S/. {item.producto.precio.toFixed(2)}
                  </p>
                </div>

                {/* Cantidad y Acciones */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.producto.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                      className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-bold text-gray-800">
                    S/. {(item.producto.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

              {/* Dirección */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Dirección de Entrega *
                </label>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ej: Av. Principal 123, Lima"
                  required
                />
              </div>

              {/* Notas */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows={2}
                  placeholder="Instrucciones adicionales..."
                />
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">S/. {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total:</span>
                  <span className="text-pink-600">S/. {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Botón de Checkout */}
              <button
                onClick={handleCheckout}
                disabled={loading || !direccion.trim()}
                className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
