
import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart';
import WhatsAppIntegration from '@/components/WhatsAppIntegration';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder?: () => void; // Made optional since some places might not use it
}

const Cart = ({ items, onClose, onUpdateQuantity, onRemoveItem, onPlaceOrder }: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);

  const handleOrderSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.brandName}</h3>
                    <p className="text-sm text-gray-600">{item.company}</p>
                    <p className="text-sm font-medium">₹{item.mrp}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold mb-3">
                  <span>Total: ₹{total.toFixed(2)}</span>
                </div>
                
                {onPlaceOrder ? (
                  <Button className="w-full mb-3" onClick={onPlaceOrder}>
                    Proceed to Checkout
                  </Button>
                ) : (
                  <WhatsAppIntegration 
                    cartItems={items} 
                    onSuccess={handleOrderSuccess}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
