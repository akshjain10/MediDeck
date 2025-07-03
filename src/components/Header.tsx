
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Home, Package, Phone, ShoppingBag, Menu, X } from 'lucide-react';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSetCartItems: (items: CartItem[]) => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const { toast } = useToast();

  const handleContactClick = () => {
    setShowEnquiryForm(true);
  };

  const handleEnquirySubmit = (enquiry: EnquiryData) => {
    let message = "🔍 General Enquiry\n\n";
    message += `Name: ${enquiry.name}\n`;
    message += `Email: ${enquiry.email}\n`;
    message += `Phone: ${enquiry.phone}\n`;
    if (enquiry.productName) {
      message += `Product: ${enquiry.productName}\n`;
    }
    if (enquiry.description) {
      message += `Description: ${enquiry.description}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=918209703661&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast({
      title: "Enquiry Sent",
      description: "Your enquiry has been sent via WhatsApp!",
    });
    setShowEnquiryForm(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <img src="/logo-am.png" alt="arihant Logo" className="h-12 w-auto"/>
                <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Arihant Medigens</h1>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/products" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </Link>
                <Link 
                  to="/order" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order</span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleContactClick}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              <Button
                variant="outline"
                onClick={onCartClick}
                className="relative flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                onClick={toggleMobileMenu}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-2 pt-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/products" 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </Link>
                <Link 
                  to="/order" 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order</span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleContactClick();
                    closeMobileMenu();
                  }}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors justify-start"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <EnquiryForm
          onClose={() => setShowEnquiryForm(false)}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </>
  );
};

export default Header;
