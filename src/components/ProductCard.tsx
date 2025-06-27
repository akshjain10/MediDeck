
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
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [tempQuantity, setTempQuantity] = useState('');

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleQuantityEdit = () => {
    setEditingQuantity(true);
    setTempQuantity(quantity.toString());
  };

  const handleQuantitySubmit = () => {
    const newQuantity = parseInt(tempQuantity);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    } else {
      setQuantity(1);
    }
    setEditingQuantity(false);
  };

  const handleQuantityCancel = () => {
    setEditingQuantity(false);
    setTempQuantity('');
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
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
        <div className="overflow-hidden rounded-t-lg h-48 flex items-center justify-center bg-gray-50">
          <img
            src={`/images/products/${product.id}.png`}
            alt={product.brandName}
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
      <CardFooter className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-center space-x-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={decreaseQuantity}
            className="h-8 w-8 p-0"
            disabled={editingQuantity}
          >
            <Minus className="w-3 h-3" />
          </Button>
          {editingQuantity ? (
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={tempQuantity}
                onChange={(e) => setTempQuantity(e.target.value)}
                className="w-16 h-8 text-center text-sm"
                min="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuantitySubmit();
                  } else if (e.key === 'Escape') {
                    handleQuantityCancel();
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuantitySubmit}
                className="h-8 w-8 p-0"
              >
                ✓
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuantityCancel}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
          ) : (
            <span 
              className="w-16 h-8 flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 rounded text-sm border"
              onClick={handleQuantityEdit}
              title="Click to edit quantity"
            >
              {quantity}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={increaseQuantity}
            className="h-8 w-8 p-0"
            disabled={editingQuantity}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={quantity === 0 || editingQuantity}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
