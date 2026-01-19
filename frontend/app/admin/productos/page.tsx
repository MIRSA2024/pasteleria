'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminProductosPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
    categoria: '',
    disponible: true,
  });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.rol !== 'ADMIN') { router.replace('/catalogo'); return; }
    loadProducts();
  }, [loading, isAuthenticated, user, router]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        alert('Producto actualizado exitosamente');
      } else {
        await productService.createProduct(formData);
        alert('Producto creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error: unknown) {
      const msg = (typeof error === 'object' && error && 'response' in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(msg || 'Error al guardar producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagenUrl: product.imagenUrl,
      categoria: product.categoria,
      disponible: product.disponible,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        alert('Producto eliminado exitosamente');
        loadProducts();
      } catch (error: unknown) {
        const msg = (typeof error === 'object' && error && 'response' in error)
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
        alert(msg || 'Error al eliminar producto');
      }
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await productService.toggleAvailability(id);
      loadProducts();
    } catch (error) {
      alert('Error al cambiar disponibilidad');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
      categoria: '',
      disponible: true,
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Productos</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600">
                      S/. {product.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(product.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          product.disponible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.disponible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{product.disponible ? 'Sí' : 'No'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center ml-3"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imagenUrl}
                  onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.disponible}
                  onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Disponible</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
