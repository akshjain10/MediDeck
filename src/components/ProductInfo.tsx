
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Plus, Minus } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onEnquiry: () => void;
}

const ProductInfo = ({ 
  product, 
  quantity, 
  setQuantity, 
  onAddToCart, 
  onBuyNow, 
  onEnquiry 
}: ProductInfoProps) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {product.brandName}
        </h1>
      </div>
      <div>
        <p className="text-lg text-gray-600">
          {product.name}
        </p>
      </div>
      <div>
        <p className="text-lg text-gray-600">by {product.company}</p>
      </div>
      <div>
        <p className="text-2xl">Packing: {product.packing}</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-blue-600">MRP ₹{product.mrp}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Product Details</h3>
          <ul className="space-y-1 text-gray-600">
            <li>• High-quality pharmaceutical product</li>
            <li>• Certified and tested for safety</li>
            <li>• Fast and reliable delivery</li>
            <li>• 24/7 customer support</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Quantity:</label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
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
              variant="outline" 
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button 
          onClick={onAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          size="lg"
          disabled={quantity === 0}
        >
          Add to Cart
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={onBuyNow}
          disabled={quantity === 0}
        >
          Buy Now
        </Button>
      </div>

      <div className="pt-4">
        <Button
          onClick={onEnquiry}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Product Enquiry</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
