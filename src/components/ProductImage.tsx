
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductImageProps {
  product: {
    id: string;
    image: string;
    brandName: string;
    category: string;
  };
}

const ProductImage = ({ product }: ProductImageProps) => {
  return (
    <div className="space-y-4">
      <Badge variant="secondary">{product.category}</Badge>
      <div className="overflow-hidden rounded-lg bg-white p-8 max-w-lg mx-auto flex items-center justify-center" style={{ minHeight: '400px' }}>
        <img
          src={`/images/products/${product.id}.webp`}
          alt={product.brandName}
          className="max-w-full max-h-full object-contain rounded"
        />
      </div>
    </div>
  );
};

export default ProductImage;
