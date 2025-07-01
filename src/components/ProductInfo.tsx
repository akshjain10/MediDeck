
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import ProductEnquiry from '@/components/ProductEnquiry';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onEnquiry: () => void;
}

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart, onBuyNow, onEnquiry }: ProductInfoProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddToCart();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {product.brandName}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{product.company}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {product.category}
          </Badge>
          {product.salt && (
            <Badge variant="outline" className="text-sm">
              {product.salt}
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {product.name}</p>
                <p><span className="font-medium">Company:</span> {product.company}</p>
                {product.packing && (
                  <p><span className="font-medium">Packing:</span> {product.packing}</p>
                )}
                {product.salt && (
                  <p><span className="font-medium">Salt:</span> {product.salt}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="font-semibold text-gray-700 mb-2">MRP</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{product.mrp}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onKeyDown={handleQuantityKeyDown}
                min="1"
                className="w-20 text-center"
                placeholder="1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={onAddToCart}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </Button>
            </div>

            <div className="pt-2">
              <ProductEnquiry 
                product={product}
                onSuccess={onEnquiry}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfo;
