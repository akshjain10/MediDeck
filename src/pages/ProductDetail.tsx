import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductImage from '@/components/ProductImage';
import ProductInfo from '@/components/ProductInfo';
import SimilarProducts from '@/components/SimilarProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartItem } from '@/types/cart';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          brandName: product.brandName,
          company: product.company,
          mrp: product.mrp,
          quantity: quantity,
          image: product.image
        }];
      }
    });
    setIsCartOpen(true);
  };

  const handleSetCartItems = (items: CartItem[]) => {
    setCartItems(items);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
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

  const handleQuantityChange = (newQuantity: number | "") => {
    if (newQuantity === "") {
      setQuantity(1);
    } else {
      setQuantity(Number(newQuantity));
    }
  };

  if (loading) {
    return <div className="text-center">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={handleCartClick}
        onSetCartItems={handleSetCartItems}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ProductImage product={product} />
            <ProductInfo 
              product={product}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>
          
          <SimilarProducts 
            products={products}
            currentProductName={product.name}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <Footer />
      
      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
};

export default ProductDetail;
