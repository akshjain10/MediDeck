
import Cart from '@/components/Cart';
import React, { useState } from 'react';
import Header from '@/components/Header';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Clock, Star, ArrowRight, Heart, Users, Award } from 'lucide-react';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import { CartItem } from '@/types/cart';

const Index = () => {
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();
  const { cartItems, setCartItems} = useCartPersistence();

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

  const cartItemsCount = cartItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
      />
      
      <main>
        {/* Enhanced Hero Section */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat min-h-[90vh] flex items-center overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.7)), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop")'
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 text-white relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Trusted by 10,000+ customers
                </div>
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Trusted</span> Medical
                  <br />
                  Supplies Partner
                </h1>
                <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Premium medical equipment and supplies delivered with care, reliability, and excellence. 
                  Experience healthcare supply like never before.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link to="/products">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                    <ShoppingBag className="mr-3 w-5 h-5" />
                    Explore Products
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowEnquiryForm(true)}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-10 py-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="mr-3 w-5 h-5" />
                  Get Custom Quote
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10K+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">5K+</div>
                  <div className="text-sm opacity-80">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <div className="text-sm opacity-80">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Why Choose Us
              </div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Excellence in Healthcare Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We provide comprehensive medical solutions with unwavering commitment to quality, 
                innovation, and service excellence that healthcare professionals trust.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast Delivery</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Express delivery with real-time tracking and temperature-controlled transport 
                    for sensitive medical supplies.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                    <Clock className="w-4 h-4" />
                    Same-day delivery available
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Certified Quality</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    All products are FDA approved and sourced from trusted manufacturers 
                    with rigorous quality control standards.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
                    <Award className="w-4 h-4" />
                    ISO 9001 Certified
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Expert Support</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    24/7 customer support from healthcare professionals who understand 
                    your needs and provide expert guidance.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-purple-600 font-medium">
                    <Heart className="w-4 h-4" />
                    Always here to help
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Healthcare Supply?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who trust us for their medical supply needs. 
                Experience the difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <ShoppingBag className="mr-3 w-5 h-5" />
                    Start Shopping Now
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowEnquiryForm(true)}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="mr-3 w-5 h-5" />
                  Request Demo
                </Button>
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
