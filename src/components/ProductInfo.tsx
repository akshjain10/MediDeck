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
  quantity: number | ''; // Allow quantity to be an empty string
  setQuantity: (quantity: number | '') => void; // Update setQuantity type
  onAddToCart: () => void;
  onBuyNow: () => void; // This prop is not used in the provided code
  onEnquiry: () => void;
}

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart, onBuyNow, onEnquiry }: ProductInfoProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value === '' ? '' : parseInt(value, 10));
    }
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
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {product.brandName}</p>
                <p><span className="font-medium">Company:</span> {product.company}</p>
                {product.packing && (
                  <p><span className="font-medium">Packing:</span> {product.packing}</p>
                )}
                {product.salt && (
                  <p><span className="font-medium">Salt:</span> {product.salt}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-gray-700 mb-2">MRP</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{product.mrp}
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Quantity</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={quantity} // Now can be number or ''
                  onChange={handleQuantityChange}
                  onKeyDown={handleQuantityKeyDown}
                  className="w-16 h-8 no-spinner"
                />
              </div>
            </div>

          </div>

          <div className="space-y-4">
            <div className="pt-2">
              <Button
                onClick={onAddToCart}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </Button>
            </div>

            <div className="pt-2">
              <ProductEnquiry
                quantity={quantity}
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