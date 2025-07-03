
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ProductImage from '@/components/ProductImage';
import ProductInfo from '@/components/ProductInfo';
import SimilarProducts from '@/components/SimilarProducts';
import Cart from '@/components/Cart';
import { useCartPersistence } from '@/hooks/useCartPersistence';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);

  const {
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useCartPersistence();

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!loading && !product) {
      navigate('/products');
    }
  }, [product, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartItemsCount={cartItems.length} onCartClick={() => setShowCart(true)} onSetCartItems={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.brandName,
      company: product.company,
      mrp: product.mrp,
      image: product.image || ''
    }, quantity);

    toast({
      title: "Added to Cart",
      description: `${product.brandName} (${quantity} pcs) added to cart.`,
      duration: 1500,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setShowCart(true);
  };

  const handleEnquiry = () => {
    toast({
      title: "Enquiry Sent",
      description: "Your enquiry has been sent successfully!",
      duration: 2000,
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cartItems.length} 
        onCartClick={() => setShowCart(true)} 
        onSetCartItems={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImage product={product} />
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onEnquiry={handleEnquiry}
          />
        </div>
        
        <SimilarProducts currentProduct={product} />
      </main>

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

export default ProductDetail;
