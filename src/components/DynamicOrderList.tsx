
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Minus, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProducts, Product } from '@/hooks/useProducts';

interface OrderItem {
  product: Product;
  quantity: number;
}

const DynamicOrderList = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useProducts();

  const filteredProducts = products.filter(product => 
    searchQuery.trim() && (
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.salt && product.salt.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const handleAddToOrder = (product: Product, quantity: number = 1) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveFromOrder = (productId: string) => {
    setOrderItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromOrder(productId);
      return;
    }
    setOrderItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Order List Display */}
      {orderItems.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Order ({orderItems.length} items)</CardTitle>
            <Badge variant="secondary">Total: ₹{totalAmount.toFixed(2)}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product.brandName}</div>
                        <div className="text-sm text-gray-600">{item.product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.product.company}</TableCell>
                    <TableCell>₹{item.product.mrp}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>₹{(item.product.mrp * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveFromOrder(item.product.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Expandable Search Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Products to Order</CardTitle>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              <Plus className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : searchQuery.trim() && filteredProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Salt</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.brandName}</div>
                          {product.category && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.company}</TableCell>
                      <TableCell>{product.salt || '-'}</TableCell>
                      <TableCell className="font-semibold">₹{product.mrp}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleAddToOrder(product)}
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : searchQuery.trim() ? (
              <div className="text-center py-4 text-gray-500">No products found</div>
            ) : (
              <div className="text-center py-4 text-gray-500">Enter search terms to find products</div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DynamicOrderList;
