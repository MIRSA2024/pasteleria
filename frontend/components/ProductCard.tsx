'use client';

import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gray-200">
        {product.imagenUrl ? (
          <Image
            src={product.imagenUrl}
            alt={product.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
        
        {/* Badge de categoría */}
        <div className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.categoria}
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {product.nombre}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
          {product.descripcion}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-600">
            S/. {product.precio.toFixed(2)}
          </span>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.disponible}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              product.disponible
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.disponible ? 'Agregar' : 'Agotado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}