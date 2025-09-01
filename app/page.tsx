'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Cart, { CartItem } from '@/components/Cart';
import { useProducts } from '@/hooks/useProducts';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ShoppingBag, Phone, Mail, Clock} from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Sample data for new sections
const discountedProducts = [
  {
    id: '5',
    name: 'Wheelchair (Foldable)',
    originalPrice: 8999,
    discountedPrice: 7499,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format',
    discount: '15% OFF'
  },
  {
    id: '6',
    name: 'First Aid Kit (Deluxe)',
    originalPrice: 1299,
    discountedPrice: 999,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format',
    discount: '25% OFF'
  },
  {
    id: '7',
    name: 'Orthopedic Cervical Collar',
    originalPrice: 799,
    discountedPrice: 599,
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=500&auto=format',
    discount: '30% OFF'
  },
  {
    id: '8',
    name: 'Pulse Oximeter',
    originalPrice: 1499,
    discountedPrice: 1199,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format',
    discount: '20% OFF'
  },
];

const categories = [
  { name: 'Diagnostics', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format' },
  { name: 'Respiratory Care', image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=300&auto=format' },
  { name: 'Mobility Aids', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format' },
  { name: 'First Aid', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format' },
  { name: 'Surgical Supplies', image: 'https://images.unsplash.com/photo-1581595210415-a7c7a7a8f8b3?w=300&auto=format' },
];

const hero = [
  { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop'},
  { url: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=1920&auto=format'},
  { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&auto=format'},
];

const brands = [
  { name: 'Alkem', logo: '/images/icons/alkem.jpg'},
  { name: 'Ranbaxy', logo: '/images/icons/sunpharma.jpg'},
  { name: 'Lupin', logo: '/images/icons/lupin.jpg' },
  { name: 'Dr. Morepen', logo: '/images/icons/drmorepen.jpg' },
  { name: 'Abbott', logo: '/images/icons/abbott.jpg' },
  { name: 'Intas', logo: '/images/icons/intas.jpg' },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const { products } = useProducts();

  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();
  const enquirySectionRef = useRef<HTMLDivElement>(null);

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

  const scrollToEnquiry = () => {
      // Mobile-friendly smooth scroll with timeout
      setTimeout(() => {
        enquirySectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100); // Small delay for mobile menu to close
    };

  useEffect(() => {
    console.log('Products loaded:', products); // Check what products look like
    if (products.length > 0) {
      const arrivals = products.filter(product => product.newArrivals === true);
      console.log('Filtered new arrivals:', arrivals); // Check filtered results
      setNewArrivals(arrivals);
    }
  }, [products]);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const HeroSliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    cssEase: 'linear'
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  const featuresSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  const stepsSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  const newArrivalsSliderSettings = {
      dots: true,
      cssEase: "linear",
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 1500,
      slidesToShow: Math.min(4, newArrivals.length),
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(3, newArrivals.length),
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(2, newArrivals.length),
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onContactClick={scrollToEnquiry}
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={handleSetCartItems}
      />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] sm:h-[100vh]">
          {/* Background Slider */}
          <Slider {...HeroSliderSettings} className="absolute inset-0 z-0">
            {hero.map((image, index) => (
              <div key={index}>
                <div
                  className="h-[80vh] bg-cover bg-center sm:h-[100vh]"
                  style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image.url})` }}
                />
              </div>
            ))}
          </Slider>

          {/* Content Overlay */}
          <div className="relative z-10 flex items-center justify-center h-[80vh] sm:h-[100vh]">
            <div className="container mx-auto px-4 text-white">
              <div className="max-w-3xl bg-black bg-transparent p-8 rounded-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Your Trusted Medical Supplies Partner
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-95 leading-relaxed">
                  Premium medical equipment and supplies with unparalleled care and reliability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Browse Products
                    </Button>
                  </Link>
                  <Button
                    onClick={scrollToEnquiry}
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Request Enquiry
                  </Button>
                </div>
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
                We provide comprehensive medical solutions with a commitment to quality and service excellence.
              </p>
            </div>

            {/* Mobile/Tablet Slider */}
            <div className="lg:hidden">
              <Slider {...featuresSliderSettings}>
                <Card className="text-center p-8 hover:shadow-lg transition-shadow mx-2">
                  <CardContent>
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🚚</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Quick and reliable delivery across the region.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow mx-2">
                  <CardContent>
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Quality Products</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Certified and genuine medical supplies from trusted manufacturers worldwide.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 hover:shadow-lg transition-shadow mx-2">
                  <CardContent>
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">24/7 Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Always available to help with your queries and provide expert guidance.
                    </p>
                  </CardContent>
                </Card>
              </Slider>
            </div>

            {/* Desktop Grid (hidden on mobile) */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Quick and reliable delivery across the region.
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
                    Certified and genuine medical supplies from trusted manufacturers worldwide.
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
                    Always available to help with your queries and provide expert guidance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
                        <section className="py-16 bg-white">
                          <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-12 text-center">New Arrivals</h2>
                            {(newArrivals.length > 4 || window.innerWidth < 768) ? (
                              <Slider {...newArrivalsSliderSettings}>
                                {newArrivals.map(product => (
                                  <div key={product.id} className="px-2">
                                    <ProductCard
                                      product={product}
                                      onAddToCart={() => {}} // Add your addToCart function if needed
                                    />
                                  </div>
                                ))}
                              </Slider>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {newArrivals.map(product => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() => {}} // Add your addToCart function if needed
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </section>
                      )}

        {/* Brands Slider Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Brands</h2>
            <Slider {...sliderSettings}>
              {brands.map((brand, index) => (
                <div key={index} className="px-4">
                  <div className="h-24 flex items-center justify-center p-4 bg-white rounded-lg transition-shadow">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* How to Order Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How to Order</h2>

            {/* Mobile/Tablet Slider */}
            <div className="lg:hidden">
              <Slider {...stepsSliderSettings}>
                <div className="px-2">
                  <div className="text-center bg-white p-6 rounded-lg h-full">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
                    <p className="text-gray-600">Explore our wide range of medical products</p>
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-center bg-white p-6 rounded-lg h-full">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Add to Cart</h3>
                    <p className="text-gray-600">Select items and add them to your shopping cart</p>
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-center bg-white p-6 rounded-lg h-full">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Checkout</h3>
                    <p className="text-gray-600">Click on Send Order to WhatsApp button on the Cart or Order Page</p>
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-center bg-white p-6 rounded-lg h-full">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">4</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Delivery</h3>
                    <p className="text-gray-600">Make Payment and collect your Order</p>
                  </div>
                </div>
              </Slider>
            </div>

            {/* Desktop Grid (hidden on mobile) */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
                <p className="text-gray-600">Explore our wide range of medical products</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Add to Cart</h3>
                <p className="text-gray-600">Select items and add them to your shopping cart</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Checkout</h3>
                <p className="text-gray-600">Click on Send Order to WhatsApp button on the Cart or Order Page</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Delivery</h3>
                <p className="text-gray-600">Make Payment and collect your Order</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Enquiry Form */}
        <section ref={enquirySectionRef} className="py-16 bg-white scroll-mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Have questions or need assistance? Our team is ready to help you with any inquiries about our products and services.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="text-blue-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold">Phone</h3>
                      <p className="text-gray-600">+91 9856686156</p>
                      <p className="text-gray-600">Mon-Sat: 9AM - 7PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="text-blue-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className="text-gray-600">info@arihantmedigens.com</p>
                      <p className="text-gray-600">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="text-blue-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold">Business Hours</h3>
                      <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              <EnquiryForm onSubmit={handleEnquirySubmit} />
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
    </div>
  );
};

export default Index;