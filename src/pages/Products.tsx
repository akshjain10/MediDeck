
import React, { useState, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Cart, { CartItem } from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Filter } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const Products = React.memo(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();
  const { products, loading, error } = useProducts();

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
        image: product.image
      }];
    });
    toast({
      title: "Added to Cart",
      description: `${product.brandName} has been added to your cart.`,
      duration: 1500,
    });
  }, [toast]);

  const handleSetCartItems = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const placeOrder = useCallback(() => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    setCartItems([]);
    setShowCart(false);
    setShowOrderSuccess(true);
  }, []);

  const handleEnquirySubmit = useCallback((enquiry: EnquiryData) => {
    console.log('Enquiry submitted:', enquiry);
    toast({
      title: "Enquiry Submitted",
      description: "We have received your enquiry and will contact you soon.",
    });
    setShowEnquiryForm(false);
  }, [toast]);

  const cartItemsCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={handleSetCartItems}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Filter - Only show when searching */}
            {searchQuery.trim() && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
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
