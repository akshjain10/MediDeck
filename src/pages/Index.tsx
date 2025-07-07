import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Cart from '@/components/Cart';
import { CartItem } from '@/types/cart';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { products, loading, error } = useProducts();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        brandName: product.brandName,
        mrp: product.mrp,
        quantity: 1,
        image: product.image
      }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(products);
    }
  }, [searchTerm, products]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto py-4 px-5 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Arihant Medigens
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button onClick={() => setShowCart(true)} variant="outline">
              View Cart ({cartItems.length})
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-primary-foreground py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Arihant Medigens
          </h1>
          <p className="text-lg text-gray-600">
            Your trusted source for quality medicines and healthcare products.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-12 px-5">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`images/products/${product.id}.webp`}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.brandName}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-xl">₹{product.mrp}</span>
                  <Button onClick={() => addToCart(product)} variant="outline">Add to Cart</Button>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-secondary-foreground border-secondary text-xs">
                    {product.category}
                  </Badge>
                </div>
                <Link to={`/product/${product.id}`} className="block mt-4 text-sm text-primary hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Cart
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onClose={() => setShowCart(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
