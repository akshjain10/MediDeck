
import React from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';

interface SimilarProductsProps {
  products: Product[];
  currentProductName: string;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const SimilarProducts = ({ products, currentProductName, onAddToCart }: SimilarProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Similar Products with {currentProductName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(prod, qty = 1) => onAddToCart(prod, qty)}
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
