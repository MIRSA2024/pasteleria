'use client';

import { useState, useEffect } from 'react';
import { deliveryService } from '@/services/deliveryService';
import { orderService } from '@/services/orderService';
import { Order, User } from '@/types';
import { Truck, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDeliveryPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<number | null>(null);
  const [newDelivery, setNewDelivery] = useState({ nombre: '', email: '', telefono: '', password: '' });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.rol !== 'ADMIN') { router.replace('/catalogo'); return; }
    loadData();
  }, [loading, isAuthenticated, user, router]);

  const loadData = async () => {
    try {
      const [ordersData, personnelData] = await Promise.all([
        orderService.getAllOrders(),
        deliveryService.getDeliveryPersonnel(),
      ]);
      // Filtrar pedidos que pueden ser asignados (PENDIENTE, EN_PREPARACION o POR_ENTREGAR)
      const assignableOrders = ordersData.filter(
        (o) => o.estado === 'PENDIENTE' || o.estado === 'EN_PREPARACION' || o.estado === 'POR_ENTREGAR'
      );
      setOrders(assignableOrders);
      setDeliveryPersonnel(personnelData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedOrder || !selectedDelivery) {
      alert('Selecciona un pedido y un repartidor');
      return;
    }

    try {
      await deliveryService.assignOrderToDelivery(selectedOrder, selectedDelivery);
      alert('Pedido asignado exitosamente');
      setSelectedOrder(null);
      setSelectedDelivery(null);
      loadData();
    } catch (error: unknown) {
      const msg = (typeof error === 'object' && error && 'response' in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(msg || 'Error al asignar pedido');
    }
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Delivery</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pedidos Disponibles */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-800">Pedidos Disponibles</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Selecciona un pedido para asignar a un repartidor
            </p>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay pedidos disponibles para asignar</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedOrder === order.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.nombreCliente}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.direccionEntrega}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">S/. {order.total.toFixed(2)}</p>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                          {order.estado}
                        </span>
                      </div>
                    </div>
                    {order.deliveryInfo && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-800">
                        Ya asignado a: {order.deliveryInfo.nombreDelivery}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Repartidores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <UserCheck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Repartidores Disponibles</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Selecciona un repartidor para asignarle el pedido
            </p>

            {deliveryPersonnel.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay repartidores disponibles</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {deliveryPersonnel.map((delivery) => (
                  <div
                    key={delivery.id}
                    onClick={() => setSelectedDelivery(delivery.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedDelivery === delivery.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{delivery.nombre}</p>
                        <p className="text-sm text-gray-600">{delivery.email}</p>
                        <p className="text-sm text-gray-600">{delivery.telefono}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Crear nuevo repartidor</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newDelivery.nombre}
                  onChange={(e) => setNewDelivery({ ...newDelivery, nombre: e.target.value })}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="email"
                  value={newDelivery.email}
                  onChange={(e) => setNewDelivery({ ...newDelivery, email: e.target.value })}
                  placeholder="Correo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="tel"
                  value={newDelivery.telefono}
                  onChange={(e) => setNewDelivery({ ...newDelivery, telefono: e.target.value })}
                  placeholder="Teléfono"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-400"
                />
                <input
                  type="password"
                  value={newDelivery.password}
                  onChange={(e) => setNewDelivery({ ...newDelivery, password: e.target.value })}
                  placeholder="Contraseña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    const created = await deliveryService.createDeliveryUser(newDelivery);
                    alert(`Repartidor creado: ${created.nombre}`);
                    setNewDelivery({ nombre: '', email: '', telefono: '', password: '' });
                    loadData();
                  } catch (err) {
                    alert('Error al crear repartidor');
                  }
                }}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Crear Repartidor
              </button>
            </div>
          </div>
        </div>

        {/* Botón de Asignación */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Asignación Seleccionada</h3>
              <p className="text-sm text-gray-600">
                {selectedOrder && selectedDelivery
                  ? `Pedido #${selectedOrder} → ${
                      deliveryPersonnel.find((d) => d.id === selectedDelivery)?.nombre
                    }`
                  : 'Selecciona un pedido y un repartidor'}
              </p>
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedOrder || !selectedDelivery}
              className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Asignar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
