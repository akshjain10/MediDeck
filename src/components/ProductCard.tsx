
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-t-lg h-32">
          <img
            src={`https://images.unsplash.com/${product.image}?w=150&h=150&fit=crop`}
            alt={product.brandName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="flex-1 p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.brandName}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-1"></p>
        <p className="text-sm text-gray-600 mb-1">{product.name}</p>
        <p className="text-sm text-gray-600 mb-1">Company: {product.company}</p>
        <p className="text-sm text-gray-600 mb-2">Packing: {product.packing}</p>
        <p className="text-xl font-bold text-blue-600">MRP ₹{product.mrp}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
