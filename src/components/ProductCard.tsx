import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/hooks/useProducts';
import { ProductImage } from './ProductImage'; // Import the new component

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const [showFullName, setShowFullName] = useState(false);
  const [showFullBrandName, setShowFullBrandName] = useState(false);

  const getDisplayName = useCallback((text: string, maxLength: number, showFull: boolean, setShowFull: (show: boolean) => void) => {
    if (text.length <= maxLength || showFull) {
      return text;
    }
    
    const twoLineLimit = 80;
    if (text.length <= twoLineLimit) {
      return text;
    }
    
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    const cutPoint = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
    
    return (
      <>
        {text.substring(0, cutPoint)}{' '}
        <Link
          to={`/product/${product.id}`}
          onClick={() => window.scrollTo(0, 0)}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Read More
        </Link>
      </>
    );
  }, [product.id]);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block" onClick={() => window.scrollTo(0, 0)}>
        <div className="overflow-hidden rounded-t-lg h-48 flex items-center justify-center bg-gray-50">
          <ProductImage 
            productId={product.id} 
            altText={product.brandName}
            className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="flex-1 p-4">
        <Link to={`/product/${product.id}`} onClick={() => window.scrollTo(0, 0)}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors" title={product.brandName}>
            {getDisplayName(product.brandName, 40, showFullBrandName, setShowFullBrandName)}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-1" title={product.name}>
          {getDisplayName(product.name, 50, showFullName, setShowFullName)}
        </p>
        <p className="text-sm text-gray-600 mb-1">Company: {product.company}</p>
        <p className="text-sm text-gray-600 mb-2">Packing: {product.packing}</p>
        <p className="text-xl font-bold text-blue-600">MRP ₹{product.mrp}</p>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;