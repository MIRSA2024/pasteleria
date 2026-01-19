'use client';

import { useState, useEffect, JSX } from 'react';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      EN_PREPARACION: 'bg-blue-100 text-blue-800',
      POR_ENTREGAR: 'bg-purple-100 text-purple-800',
      EN_CAMINO: 'bg-indigo-100 text-indigo-800',
      ENTREGADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons: Record<OrderStatus, JSX.Element> = {
      PENDIENTE: <Clock className="w-5 h-5" />,
      EN_PREPARACION: <Package className="w-5 h-5" />,
      POR_ENTREGAR: <Package className="w-5 h-5" />,
      EN_CAMINO: <Truck className="w-5 h-5" />,
      ENTREGADO: <CheckCircle className="w-5 h-5" />,
      CANCELADO: <XCircle className="w-5 h-5" />,
    };
    return icons[status] || <Clock className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-600">Realiza tu primer pedido desde el catálogo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Mis Pedidos</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header del pedido */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(order.estado)}`}>
                      {getStatusIcon(order.estado)}
                      <span className="font-semibold">{order.estado.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.fecha)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">S/. {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.items.length} producto(s)</p>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles expandibles */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Información de entrega */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Información de Entrega</h3>
                    <p className="text-gray-600">
                      <strong>Dirección:</strong> {order.direccionEntrega}
                    </p>
                    {order.notas && (
                      <p className="text-gray-600 mt-1">
                        <strong>Notas:</strong> {order.notas}
                      </p>
                    )}
                    {order.deliveryInfo && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                          <strong>Repartidor:</strong> {order.deliveryInfo.nombreDelivery}
                        </p>
                        <p className="text-blue-800">
                          <strong>Teléfono:</strong> {order.deliveryInfo.telefonoDelivery}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items del pedido */}
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
                              Cantidad: {item.cantidad} x S/. {item.precioUnitario.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-gray-800">
                            S/. {item.subtotal.toFixed(2)}
                          </p>
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