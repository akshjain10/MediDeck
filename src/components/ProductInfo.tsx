
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number | "") => void;
}

const ProductInfo = ({ product, quantity, onQuantityChange }: ProductInfoProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onQuantityChange("");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1) {
        onQuantityChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.brandName}</h1>
        <p className="text-lg text-gray-600 mb-4">{product.name}</p>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {product.company}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {product.packing}
          </Badge>
        </div>
      </div>

      <div className="border-t border-b py-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">
            ₹{product.mrp?.toFixed(2)}
          </span>
          <Badge variant={product.stockAvailable ? "default" : "secondary"}>
            {product.stockAvailable ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-24"
          />
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 gap-2" size="lg">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Category:</span>
            <span>{product.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Salt Composition:</span>
            <span>{product.salt || product.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Manufacturer:</span>
            <span>{product.company}</span>
          </div>
          <div className="flex justify-between">
            <span>Pack Size:</span>
            <span>{product.packing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
