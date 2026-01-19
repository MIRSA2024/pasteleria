'use client';

import { useState, useEffect } from 'react';
import { deliveryService } from '@/services/deliveryService';
import { Order, OrderStatus } from '@/types';
import { Truck, MapPin, Phone, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DeliveryPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.rol !== 'DELIVERY') {
      router.replace('/catalogo');
      return;
    }

    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated, user, router]);

  const loadOrders = async () => {
    try {
      const data = await deliveryService.getMyAssignedOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    if (!confirm(`¿Cambiar estado a ${newStatus}?`)) return;

    try {
      await deliveryService.updateDeliveryStatus(orderId, { estado: newStatus });
      alert('Estado actualizado exitosamente');
      loadOrders();
    } catch (error: unknown) {
      const msg = (typeof error === 'object' && error && 'response' in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(msg || 'Error al actualizar estado');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDIENTE: 'bg-yellow-500',
      EN_PREPARACION: 'bg-blue-500',
      POR_ENTREGAR: 'bg-purple-500',
      EN_CAMINO: 'bg-indigo-500',
      ENTREGADO: 'bg-green-500',
      CANCELADO: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.estado !== 'ENTREGADO' && o.estado !== 'CANCELADO');
  const completedOrders = orders.filter((o) => o.estado === 'ENTREGADO');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Entregas</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              <span>Pendientes: {pendingOrders.length}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Completadas: {completedOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Pedidos Pendientes */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Entregas Pendientes</h2>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-indigo-500">
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(order.estado)}`}></div>
                        <div>
                          <p className="font-bold text-xl text-gray-800">Pedido #{order.id}</p>
                          <p className="text-gray-600">{order.nombreCliente}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.fecha)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-pink-600">S/. {order.total.toFixed(2)}</p>
                          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {order.estado.replace('_', ' ')}
                          </span>
                        </div>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      {/* Información del Cliente */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-pink-600" />
                          Dirección de Entrega
                        </h3>
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-gray-800 font-medium">{order.direccionEntrega}</p>
                          {order.notas && (
                            <p className="text-gray-600 mt-2 text-sm">
                              <strong>Notas:</strong> {order.notas}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Productos */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Productos a Entregar</h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center bg-white p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">{item.nombreProducto}</p>
                                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                              </div>
                              <p className="font-bold text-gray-800">S/. {item.subtotal.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex space-x-3">
                        {order.estado === 'POR_ENTREGAR' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'EN_CAMINO')}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
                          >
                            <Truck className="w-5 h-5 mr-2" />
                            Iniciar Entrega
                          </button>
                        )}
                        {order.estado === 'EN_CAMINO' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'ENTREGADO')}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Marcar como Entregado
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pedidos Completados */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Entregas Completadas</h2>
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.nombreCliente}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.fecha)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">✓ ENTREGADO</p>
                      <p className="text-sm text-gray-600">S/. {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin pedidos */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <Truck className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes entregas asignadas</h2>
            <p className="text-gray-600">Cuando te asignen pedidos, aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}
