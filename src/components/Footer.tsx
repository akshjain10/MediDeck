import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const handleCall = () => {
    window.open('tel:+919856686156', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:info@arihantmedigens.com', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send/?phone=919856686156&text=Hello, I would like to inquire about your products.', '_blank');
  };

  const handleAddress = () => {
    const address = "Arihant Medigens, Healthcare Solutions, India";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/place/Arihant+MediGens/@24.8116366,93.9331241,17z/data=!3m1!4b1!4m6!3m5!1s0x3749271cb310ffef:0xe16e6236035161b6!8m2!3d24.8116366!4d93.935699!16s%2Fg%2F11wx9vh9mk?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D`, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-8">
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
                <span>+91 9856686156</span>
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
                <p>530, Opp. Hotel White Palce</p>
                <p>MG Avenue, Thangal Bazar</p>
                <p>Imphal, Manipur</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2025 Arihant Medigens. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              <Link to="/privacy">Privacy Policy</Link>
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

export default Footer;