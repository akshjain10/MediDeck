import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import ProductEnquiry from '@/components/ProductEnquiry';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
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
  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setQuantity(Math.max(1, numValue));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{product.brandName}</h2>
      <p className="text-gray-600">{product.company}</p>
      <p className="text-gray-500">Category: {product.category}</p>
      {product.salt && <p className="text-gray-500">Salt: {product.salt}</p>}
      {product.packing && <p className="text-gray-500">Packing: {product.packing}</p>}
      <div className="flex items-center space-x-3">
        <span className="text-xl font-semibold">₹{product.mrp}</span>
        {product.stockAvailable && (
          <span className="text-sm text-green-600">In Stock</span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            className="w-20 text-center"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button className="w-full" onClick={onAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="secondary" className="w-full" onClick={onBuyNow}>
          <Zap className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </div>

      <ProductEnquiry product={product} quantity={quantity} />
      <Button variant="link" onClick={onEnquiry} className="w-full">
        Request a Call Back
      </Button>
    </div>
  );
};

export default ProductInfo;
