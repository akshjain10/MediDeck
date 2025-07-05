
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSearchTab from '@/components/ProductSearchTab';
import Cart from '@/components/Cart';
import { CartItem } from '@/types/cart';
import { Product } from '@/hooks/useProducts';

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          brandName: product.brandName,
          company: product.company,
          mrp: product.mrp,
          quantity: 1,
          image: product.image
        }];
      }
    });
  };

  const handleSetCartItems = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={handleCartClick}
        onSetCartItems={handleSetCartItems}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8 rounded-3xl shadow-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-yellow-300">Arihant Medigens</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your trusted partner for quality pharmaceutical products
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg opacity-80 mb-6">
              Discover a wide range of medicines and healthcare products at competitive prices. 
              We ensure quality, authenticity, and timely delivery for all your medical needs.
            </p>
          </div>
        </div>

        {/* Product Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <ProductSearchTab onAddToCart={handleAddToCart} />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality Assured</h3>
            <p className="text-gray-600">All products are sourced from certified manufacturers and undergo strict quality checks.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable delivery service to ensure you get your medicines on time.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Best Prices</h3>
            <p className="text-gray-600">Competitive pricing with regular offers and discounts on all pharmaceutical products.</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Arihant Medigens</h2>
            <p className="text-lg leading-relaxed mb-6 opacity-90">
              With years of experience in the pharmaceutical industry, Arihant Medigens has been a trusted name 
              in providing quality medicines and healthcare products. We are committed to improving healthcare 
              accessibility and ensuring that our customers receive only the best pharmaceutical solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm opacity-80">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">10,000+</div>
                <div className="text-sm opacity-80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">5+</div>
                <div className="text-sm opacity-80">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
};

export default Index;
