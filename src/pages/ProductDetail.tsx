
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import { CartItem } from '@/types/cart';
import Header from '@/components/Header';
import ProductImage from '@/components/ProductImage';
import ProductInfo from '@/components/ProductInfo';
import SimilarProducts from '@/components/SimilarProducts';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { cartItems, setCartItems } = useCartPersistence();
  const [quantity, setQuantity] = useState<number>(1);
  const [showCart, setShowCart] = useState(false);

  const product = products.find(p => p.id === id);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        brandName: product.brandName,
        company: product.company,
        mrp: product.mrp,
        quantity: quantity,
        image: product.image,
      };
      setCartItems([...cartItems, newCartItem]);
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemsCount={cartItems.length}
          onCartClick={() => setShowCart(true)}
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemsCount={cartItems.length}
          onCartClick={() => setShowCart(true)}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cartItems.length}
        onCartClick={() => setShowCart(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImage product={product} />
          <ProductInfo
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={addToCart}
          />
        </div>

        <SimilarProducts
          products={products}
          currentProductName={product.name}
          onAddToCart={addToCart}
        />
      </main>

      <Footer />

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
        />
      )}
    </div>
  );
};

export default ProductDetail;
