
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showFullName, setShowFullName] = useState(false);
  const [showFullBrandName, setShowFullBrandName] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity(0);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setQuantity(numValue);
      }
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === 0) {
      setQuantity(1);
    }
  };

  const getDisplayName = (text: string, maxLength: number, showFull: boolean, setShowFull: (show: boolean) => void) => {
    if (text.length <= maxLength || showFull) {
      return text;
    }
    
    // Check if text would exceed 2 lines (approximately 80 characters for 2 lines)
    const twoLineLimit = 80;
    if (text.length <= twoLineLimit) {
      return text;
    }
    
    // Find the last complete word before maxLength
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
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block" onClick={() => window.scrollTo(0, 0)}>
        <div className="overflow-hidden rounded-t-lg h-32">
          <img
            src={`/images/products/${product.id}.png`}
            //{`https://images.unsplash.com/${product.image}?w=150&h=150&fit=crop`}
            alt={product.brandName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
      <CardFooter className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-center space-x-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            value={quantity === 0 ? '' : quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            className="w-16 h-8 text-center text-sm"
            min="1"
            placeholder="1"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={quantity === 0}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
