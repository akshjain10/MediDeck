import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, ShoppingCart } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import Header from '@/components/Header';
import { CartItem } from '@/components/Cart';
import Cart from '@/components/Cart';

const Order = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  const { cartItems, setCartItems, clearCart } = useCartPersistence();

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

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, product: Product) => {
    if (e.key === 'Enter') {
      addToCart(product);
    }
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    const updatedCartItems = existingItem
      ? cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cartItems, {
          id: product.id,
          name: product.brandName,
          company: product.company,
          mrp: product.mrp,
          quantity: quantity,
          image: product.image || ''
        }];

    setCartItems(updatedCartItems);

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

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (productId: string) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCartItems);
  };

  const handleWhatsAppSuccess = () => {
    clearCart();
    setShowCart(false);
    toast({
      title: "Order Sent",
      description: "Your order has been sent via WhatsApp!",
    });
  };

  const placeOrder = () => {
    handleWhatsAppSuccess();
  };

  // Count distinct products in cart
  const distinctProductCount = cartItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={distinctProductCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={setCartItems}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products to order..."
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

          {/* Products Table */}
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
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[product.id] || ''}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            onKeyDown={(e) => handleQuantityKeyDown(e, product)}
                            className="w-20 h-8"
                          />
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
      </main>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onPlaceOrder={placeOrder}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default Order;
