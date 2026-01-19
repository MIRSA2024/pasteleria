'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Cake, ShoppingBag, Truck, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirigir según el rol
      if (user.rol === 'ADMIN') {
        router.push('/admin/productos');
      } else if (user.rol === 'DELIVERY') {
        router.push('/delivery');
      } else {
        router.push('/catalogo');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Cake className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Bienvenido a Nuestra Pastelería</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Deliciosos pasteles, cupcakes y postres artesanales hechos con amor. 
            Ordena online y recibe en la puerta de tu casa.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition text-lg"
            >
              Comenzar Ahora
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition text-lg"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Fácil de Ordenar</h3>
              <p className="text-gray-600">
                Sistema intuitivo para realizar tus pedidos en pocos clics. 
                Navega nuestro catálogo y elige tus favoritos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Delivery Rápido</h3>
              <p className="text-gray-600">
                Entrega en tiempo récord. Rastrea tu pedido en tiempo real 
                y recibe tus productos frescos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Calidad Premium</h3>
              <p className="text-gray-600">
                Productos artesanales con ingredientes de primera calidad. 
                Sabores únicos que te encantarán.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            ¿Listo para endulzar tu día?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea tu cuenta ahora y disfruta de nuestros deliciosos productos
          </p>
          <Link
            href="/register"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition text-lg inline-block"
          >
            Registrarse Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}