'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPedidosPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.rol !== 'ADMIN') { router.replace('/catalogo'); return; }
    loadOrders();
  }, [loading, isAuthenticated, user, router]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { estado: newStatus });
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
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Pedidos</h1>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO'] as OrderStatus[]).map((status) => (
            <div key={status} className="bg-white rounded-lg shadow p-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mb-2`}></div>
              <p className="text-2xl font-bold text-gray-800">
                {orders.filter((o) => o.estado === status).length}
              </p>
              <p className="text-sm text-gray-600">{status.replace('_', ' ')}</p>
            </div>
          ))}
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(order.estado)}`}></div>
                    <div>
                      <p className="font-bold text-gray-800">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.nombreCliente}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.fecha)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-pink-600">S/. {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
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
                  {/* Estado */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cambiar Estado
                    </label>
                    <select
                      value={order.estado}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                      <option value="POR_ENTREGAR">POR ENTREGAR</option>
                      <option value="EN_CAMINO">EN CAMINO</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>

                  {/* Información */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Información del Cliente</h3>
                      <p className="text-gray-600">
                        <strong>Nombre:</strong> {order.nombreCliente}
                      </p>
                      <p className="text-gray-600">
                        <strong>Dirección:</strong> {order.direccionEntrega}
                      </p>
                      {order.notas && (
                        <p className="text-gray-600">
                          <strong>Notas:</strong> {order.notas}
                        </p>
                      )}
                    </div>
                    {order.deliveryInfo && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Información del Delivery</h3>
                        <p className="text-gray-600">
                          <strong>Repartidor:</strong> {order.deliveryInfo.nombreDelivery}
                        </p>
                        <p className="text-gray-600">
                          <strong>Teléfono:</strong> {order.deliveryInfo.telefonoDelivery}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Productos</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-white p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{item.nombreProducto}</p>
                            <p className="text-sm text-gray-600">
                              {item.cantidad} x S/. {item.precioUnitario.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-gray-800">S/. {item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
