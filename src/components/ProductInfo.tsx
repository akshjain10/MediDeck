
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import ProductShare from './ProductShare';

interface ProductInfoProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (onAddToCart && quantity > 0) {
      onAddToCart(product, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.brandName} added to cart`,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddToCart();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.brandName}
                </h1>
                <p className="text-lg text-gray-600 mb-3">{product.name}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {product.company}
                  </Badge>
                  {product.category && (
                    <Badge variant="outline" className="text-sm">
                      {product.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <ProductShare product={product} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{product.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing:</span>
                    <span className="font-medium">{product.packing}</span>
                  </div>
                  {product.salt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salt/Composition:</span>
                      <span className="font-medium">{product.salt}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  MRP ₹{product.mrp}
                </div>
                
                {onAddToCart && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Quantity:
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        onKeyDown={handleKeyDown}
                        className="w-24 h-10"
                      />
                    </div>
                    
                    <Button
                      onClick={handleAddToCart}
                      className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                      disabled={quantity <= 0}
                    >
                      Add to Cart - ₹{(product.mrp * quantity).toFixed(2)}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {product.stockAvailable !== undefined && (
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${product.stockAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${product.stockAvailable ? 'text-green-700' : 'text-red-700'}`}>
                    {product.stockAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfo;
