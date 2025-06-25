
import React, { useState } from 'react';
import Header from '@/components/Header';
import Cart, { CartItem } from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Phone, Mail } from 'lucide-react';

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();

  const handleSetCartItems = (items: CartItem[]) => {
    setCartItems(items);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const placeOrder = () => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    setCartItems([]);
    setShowCart(false);
    setShowOrderSuccess(true);
  };

  const handleEnquirySubmit = (enquiry: EnquiryData) => {
    console.log('Enquiry submitted:', enquiry);
    toast({
      title: "Enquiry Submitted",
      description: "We have received your enquiry and will contact you soon.",
    });
    setShowEnquiryForm(false);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={handleSetCartItems}
      />
      
      <main>
        {/* Hero Section with Background */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] flex items-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop")'
          }}
        >
          <div className="container mx-auto px-4 text-white">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Your Trusted Medical Supplies Partner
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Quality medical equipment and supplies delivered to your doorstep with care and reliability
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                    <ShoppingBag className="mr-2" />
                    Browse Products
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowEnquiryForm(true)}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white text-white hover:bg-white/20 text-lg px-8 py-4"
                >
                  Request Enquiry
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide comprehensive medical solutions with a commitment to quality and service excellence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Quick and reliable delivery to your location with real-time tracking and updates
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Quality Products</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Certified and genuine medical supplies from trusted manufacturers worldwide
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">24/7 Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Always available to help with your queries and provide expert guidance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <span className="text-lg">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <span className="text-lg">info@medicareplus.com</span>
              </div>
            </div>
          </div>
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
};

export default Index;
