
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

  const totalAmount = items.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 pb-4 border-b">
          <div>
            <CardTitle className="text-xl">Shopping Cart</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-xl hover:bg-gray-100">×</Button>
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
                <div className="space-y-3 p-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        <img
                          src={`/images/products/${item.id}.png`}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base leading-tight mb-1">
                          {item.name.length > 50 ? (
                            <span title={item.name}>
                              {item.name.substring(0, 50)}...
                            </span>
                          ) : (
                            item.name
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">{item.company}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-blue-600">₹{item.mrp}</p>
                          <p className="text-sm text-gray-500">
                            Subtotal: ₹{(item.mrp * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          {editingQuantity === item.id ? (
                            <div className="flex items-center space-x-1">
                              <Input
                                type="number"
                                value={tempQuantity}
                                onChange={(e) => setTempQuantity(e.target.value)}
                                className="w-16 h-8 text-center text-sm"
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
                                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleQuantityCancel}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <span 
                              className="w-12 h-8 flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 rounded text-sm border bg-gray-50 font-medium"
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
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0 hover:bg-red-600"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="border-t bg-gray-50 p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Items: {totalItems}</p>
                  <p className="text-xl font-bold text-gray-900">Total: ₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
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
