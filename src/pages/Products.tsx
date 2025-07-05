import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Filter } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import { CartItem } from '@/types/cart';

const Products = React.memo(() => {
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();
  const { products, loading, error } = useProducts();
  const { cartItems, setCartItems, clearCart } = useCartPersistence();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Handle enter key press for immediate search
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  }, [searchInput]);

  // Memoize categories to prevent recalculation
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];
    return uniqueCategories;
  }, [products]);

  // Optimize search with debounced filtering
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => {
      const matchesSearch = product.brandName.toLowerCase().includes(query) ||
                           product.company.toLowerCase().includes(query) ||
                           product.name.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
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
          brandName: product.brandName,
          company: product.company,
          mrp: product.mrp,
          quantity: quantity,
          image: product.image
        }];

    setCartItems(updatedCartItems);
    toast({
      title: "Added to Cart",
      description: `${product.brandName} has been added to your cart.`,
      duration: 1500,
    });
  }, [cartItems, setCartItems, toast]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      const updatedCartItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCartItems);
      return;
    }
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
  }, [cartItems, setCartItems]);

  const removeFromCart = useCallback((id: string) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
  }, [cartItems, setCartItems]);

  const placeOrder = useCallback(() => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    clearCart();
    setShowCart(false);
    setShowOrderSuccess(true);
  }, [clearCart]);

  const handleEnquirySubmit = useCallback((enquiry: EnquiryData) => {
    console.log('Enquiry submitted:', enquiry);
    toast({
      title: "Enquiry Submitted",
      description: "We have received your enquiry and will contact you soon.",
    });
    setShowEnquiryForm(false);
  }, [toast]);

  const cartItemsCount = cartItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={setCartItems}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">
                      <div className="container mx-auto">
                        <div className="flex justify-center sm:justify-start">
                          <h2 className="text-lg font-semibold text-gray-800">Explore Products</h2>
                          </div>
                      </div>
                      </CardTitle>
                    </CardHeader>
        </Card>

        <div className="mb-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>

            {/* Category Filter */}
            {searchQuery.trim() && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36 sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>


        {/* Results count - Only show when searching */}
        {searchQuery.trim() && filteredProducts.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <section>
          {loading ? (
            <Card className="p-8 text-center">
              <CardContent>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-red-500 mb-4">Error loading products: {error}</p>
                <p className="text-gray-500">Please try again later.</p>
              </CardContent>
            </Card>
          ) : !searchQuery.trim() ? (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="mb-4 text-4xl">🔍</div>
                <p className="text-gray-500 mb-4 text-lg">Start searching to discover products</p>
                <p className="text-sm text-gray-400">Type in the search box above to find medicines and healthcare products</p>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="mb-4 text-4xl">📦</div>
                <p className="text-gray-500 mb-4 text-lg">No products found</p>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your search terms or category filter</p>
                <Button onClick={() => setShowEnquiryForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  Request This Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showCart && (
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onPlaceOrder={placeOrder}
          onClose={() => setShowCart(false)}
        />
      )}

      {showOrderSuccess && (
        <OrderSuccess
          orderNumber={orderNumber}
          onClose={() => setShowOrderSuccess(false)}
        />
      )}

      {showEnquiryForm && (
        <EnquiryForm
          onClose={() => setShowEnquiryForm(false)}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </div>
  );
});

Products.displayName = 'Products';

export default Products;
