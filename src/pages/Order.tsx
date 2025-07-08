import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, MessageCircle } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import Header from '@/components/Header';
import Cart from '@/components/Cart';

const Order = () => {
  const quantityInputRef = useRef<HTMLInputElement | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [showCart, setShowCart] = useState(false);

  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  const { cartItems, setCartItems, clearCart } = useCartPersistence();

  // Debounce search input to update searchQuery
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return [];

      // Split search query into individual words
      const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0);

      return products.filter(product => {
        // Check if all search words are present in any of the search fields (AND condition)
        return searchWords.every(word =>
          product.brandName.toLowerCase().includes(word) ||
          product.company.toLowerCase().includes(word) ||
          product.name.toLowerCase().includes(word) ||
          (product.salt && product.salt.toLowerCase().includes(word))
        );
      });
    }, [products, searchQuery]);

    // Handlers for product search and selection
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      setSelectedProduct(null);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setSearchQuery(searchInput);
      }
    };

    const handleProductSelect = (product: Product) => {
      setSelectedProduct(product);
      setQuantityInput('');
      setSearchInput('');
      setSearchQuery('');
    };

  // Cart Management Functions
  const handleAddSelectedToCart = (product: Product) => {
    const quantity = parseInt(quantityInput || '0');
    if (!quantity || quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a valid quantity.',
        variant: 'destructive',
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
      : [
          ...cartItems,
          {
            id: product.id,
            name: product.brandName,
            company: product.company,
            mrp: product.mrp,
            quantity,
            image: product.image || '',
          },
        ];

    setCartItems(updatedCartItems);
    setQuantityInput('');
    setSelectedProduct(null); // Clear selected product after adding to cart

    toast({
      title: 'Added to Cart',
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
    setShowCart(false); // Close cart modal after successful order
    toast({
      title: 'Order Sent',
      description: 'Your order has been sent via WhatsApp!',
    });
  };

  const placeOrder = () => {
    const WHATSAPP_NUMBER = '919856686156'; // Updated number

    if (cartItems.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Please add items to your cart before placing an order.',
        variant: 'destructive',
      });
      return;
    }

    let message = '🛒 New Order Request\n\n';
    message += '📋Order Details:\n';

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.quantity} pc\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    handleWhatsAppSuccess(); // Call success handler after opening WhatsApp
  };

  const distinctProductCount = cartItems.length;
  const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={distinctProductCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={setCartItems}
      />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Cart Summary Card */}
        {cartItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Cart Summary</CardTitle>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear the cart?')) {
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
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="w-24">Quantity</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="w-full p-3 sm:p-6 flex justify-end">
                <Button
                  onClick={placeOrder}
                  className="w-full sm:w-72 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                  disabled={cartItems.length === 0}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order via WhatsApp</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Search and Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Order Products</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products to order..."
                className="pl-10"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
              />

              {searchQuery.trim() && filteredProducts.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                  {filteredProducts.map(product => (
                    <li
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="font-medium">{product.brandName}</div>
                      <div className="text-sm text-gray-500">
                        {product.company} – ₹{product.mrp}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedProduct && (
              <div className="w-full px-4 py-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity for <span className="font-semibold">{selectedProduct.brandName}</span>
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={quantityInputRef} // Assign ref to the input
                    autoFocus
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter quantity"
                    value={quantityInput}
                    onChange={e => setQuantityInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddSelectedToCart(selectedProduct);
                    }}
                    className="w-full sm:w-32 no-spinner" // 'no-spinner' class likely hides browser's number input arrows
                  />
                  <Button
                    onClick={() => handleAddSelectedToCart(selectedProduct)}
                    className="whitespace-nowrap"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading or Error States */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500 mb-4">Error loading products: {error}</p>
              <p className="text-gray-500">Please try again later.</p>
            </CardContent>
          </Card>
        )}
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