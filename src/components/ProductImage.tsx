
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductImageProps {
  product: {
    image: string;
    brandName: string;
    category: string;
  };
}

const ProductImage = ({ product }: ProductImageProps) => {
  return (
    <div className="space-y-4">
      <Badge variant="secondary">{product.category}</Badge>
      <div className="aspect-square overflow-hidden rounded-lg bg-white p-4 max-w-sm">
        <img
          src={`https://images.unsplash.com/${product.image}?w=200&h=200&fit=crop`}
          alt={product.brandName}
          className="w-full h-full object-cover rounded"
        />
      </div>
    </div>
  );
};

export default ProductImage;
