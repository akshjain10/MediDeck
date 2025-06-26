
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
  
  const total = items.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shopping Cart</CardTitle>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[400px] px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={`https://images.unsplash.com/${item.image}?w=80&h=80&fit=crop`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {item.name.length > 30 ? (
                            <span title={item.name}>
                              {item.name.substring(0, 30)}...
                            </span>
                          ) : (
                            item.name
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{item.company}</p>
                        <p className="font-bold text-blue-600">₹{item.mrp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        {editingQuantity === item.id ? (
                          <div className="flex items-center space-x-1">
                            <Input
                              type="number"
                              value={tempQuantity}
                              onChange={(e) => setTempQuantity(e.target.value)}
                              className="w-16 h-8 text-center"
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
                              className="h-8 px-2"
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleQuantityCancel}
                              className="h-8 px-2"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <span 
                            className="w-8 text-center cursor-pointer hover:bg-gray-100 rounded px-1"
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
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t pt-4 px-6 pb-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total: ₹{total}</span>
                </div>
                <WhatsAppIntegration 
                  cartItems={items}
                  onSuccess={handleWhatsAppSuccess}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
