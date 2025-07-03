
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const EnhancedFooter = () => {
  const handleCall = () => {
    window.open('tel:+918209703661', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:info@arihantmedigens.com', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send/?phone=918209703661&text=Hello, I would like to inquire about your products.', '_blank');
  };

  const handleAddress = () => {
    const address = "Arihant Medigens, Healthcare Solutions, India";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo-am.png" alt="Arihant Medigens" className="h-8" />
              <h3 className="text-xl font-bold">Arihant Medigens</h3>
            </div>
            <p className="text-gray-300">
              Your trusted partner for quality healthcare products and pharmaceutical solutions.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={handleCall}
              >
                <Phone className="w-5 h-5" />
                <span>+91 8209703661</span>
              </div>
              
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </div>
              
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={handleEmail}
              >
                <Mail className="w-5 h-5" />
                <span>info@arihantmedigens.com</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Address</h4>
            <div 
              className="flex items-start space-x-3 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={handleAddress}
            >
              <MapPin className="w-5 h-5 mt-0.5" />
              <div>
                <p>Arihant Medigens</p>
                <p>Healthcare Solutions</p>
                <p>India</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 Arihant Medigens. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
