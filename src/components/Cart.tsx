
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus } from 'lucide-react';
import WhatsAppIntegration from '@/components/WhatsAppIntegration';

export interface CartItem {
  id: string;
  name: string;
  company: string;
  mrp: number;
  quantity: number;
  image: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: () => void;
  onClose: () => void;
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onPlaceOrder, onClose }: CartProps) => {
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');

  const handleWhatsAppSuccess = () => {
    onPlaceOrder();
  };

  const handleQuantityEdit = (itemId: string, currentQuantity: number) => {
    setEditingQuantity(itemId);
    setTempQuantity(currentQuantity.toString());
  };

  const handleQuantitySubmit = (itemId: string) => {
    const newQuantity = parseInt(tempQuantity);
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
    setEditingQuantity(null);
  };

  const handleQuantityCancel = () => {
    setEditingQuantity(null);
    setTempQuantity('');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = items.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 pb-3 sm:pb-4 border-b px-3 sm:px-6">
          <div>
            <CardTitle className="text-lg sm:text-xl">Shopping Cart</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-xl hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10">×</Button>
        </CardHeader>
        
        {items.length === 0 ? (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-4 text-4xl">🛒</div>
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-2">Add some products to get started</p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        <img
                          src={`/images/products/${item.id}.webp`}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain rounded-lg bg-gray-50 p-1 sm:p-2"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base leading-tight mb-1">
                          {item.name.length > (window.innerWidth < 640 ? 30 : 50) ? (
                            <span title={item.name}>
                              {item.name.substring(0, window.innerWidth < 640 ? 30 : 50)}...
                            </span>
                          ) : (
                            item.name
                          )}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.company}</p>
                        <p className="text-sm sm:text-lg font-bold text-blue-600">₹{item.mrp}</p>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2 sm:space-y-3 flex-shrink-0">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-50"
                          >
                            <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                          
                          {editingQuantity === item.id ? (
                            <div className="flex items-center space-x-1">
                              <Input
                                type="number"
                                value={tempQuantity}
                                onChange={(e) => setTempQuantity(e.target.value)}
                                className="w-12 sm:w-16 h-6 sm:h-8 text-center text-xs sm:text-sm"
                                min="1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleQuantitySubmit(item.id);
                                  } else if (e.key === 'Escape') {
                                    handleQuantityCancel();
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantitySubmit(item.id)}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-green-600 hover:bg-green-50"
                              >
                                <span className="text-xs">✓</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleQuantityCancel}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                <span className="text-xs">✕</span>
                              </Button>
                            </div>
                          ) : (
                            <span 
                              className="w-8 sm:w-12 h-6 sm:h-8 flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 rounded text-xs sm:text-sm border bg-gray-50 font-medium"
                              onClick={() => handleQuantityEdit(item.id, item.quantity)}
                              title="Click to edit quantity"
                            >
                              {item.quantity}
                            </span>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-50"
                          >
                            <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-600"
                          title="Remove item"
                        >
                          <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/*clearCart && (
                <div className="w-full py-4 px-8 flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to clear the cart?")) {
                        clearCart();
                        toast({
                          title: 'Cart Cleared',
                          description: 'All items removed from cart.',
                          variant: 'destructive',
                        });
                        }
                    }}
                  >
                    Clear Cart
                  </Button>
                </div>
                )*/}
              </ScrollArea>
            </CardContent>
            <div className="border-t bg-gray-50 p-3 sm:p-6 flex-shrink-0">
              <WhatsAppIntegration
                cartItems={items}
                onSuccess={handleWhatsAppSuccess}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Cart;
