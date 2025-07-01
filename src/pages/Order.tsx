
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { CartItem } from '@/components/Cart';
import WhatsAppIntegration from '@/components/WhatsAppIntegration';

const Order = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { products, loading, error } = useProducts();
  const { toast } = useToast();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Handle enter key press for immediate search
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  }, [searchInput]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.brandName.toLowerCase().includes(query) ||
      product.company.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      (product.salt && product.salt.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity <= 0) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.brandName,
        company: product.company,
        mrp: product.mrp,
        quantity: quantity,
        image: product.image || ''
      }];
    });

    setQuantities(prev => ({
      ...prev,
      [product.id]: 0
    }));

    toast({
      title: "Added to Cart",
      description: `${product.brandName} (${quantity} pcs) added to cart.`,
      duration: 1500,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleWhatsAppSuccess = () => {
    setCartItems([]);
    toast({
      title: "Order Sent",
      description: "Your order has been sent via WhatsApp!",
    });
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => {}}
        onSetCartItems={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Products Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Search Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search products... (Press Enter to search)"
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                
                {searchQuery.trim() && filteredProducts.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading products...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-red-500 mb-4">Error loading products: {error}</p>
                  <p className="text-gray-500">Please try again later.</p>
                </CardContent>
              </Card>
            ) : !searchQuery.trim() ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 text-4xl">🔍</div>
                  <p className="text-gray-500 mb-4 text-lg">Start searching to discover products</p>
                  <p className="text-sm text-gray-400">Type in the search box above to find medicines and healthcare products</p>
                </CardContent>
              </Card>
            ) : filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 text-4xl">📦</div>
                  <p className="text-gray-500 mb-4 text-lg">No products found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Salt</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Quantity</TableHead>
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
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {quantities[product.id] || 1}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="flex items-center space-x-1"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Add</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cart Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({cartItemsCount})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="mb-4 text-4xl">🛒</div>
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-2">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-1">{item.company}</p>
                            <p className="text-sm font-bold text-blue-600">₹{item.mrp} × {item.quantity}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <WhatsAppIntegration 
                        cartItems={cartItems}
                        onSuccess={handleWhatsAppSuccess}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Order;
