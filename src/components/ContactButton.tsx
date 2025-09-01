
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const ContactButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCall = () => {
    window.open('tel:+919856686156', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send/?phone=919856686156&text=Hello, I would like to inquire about your products.', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-3">
        {/* Expanded buttons */}
        {isExpanded && (
          <>
            <Button
              onClick={handleCall}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg animate-in slide-in-from-bottom-5 duration-300"
              size="sm"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg animate-in slide-in-from-bottom-5 duration-300"
              size="sm"
            >
            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Main toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 rotate-[360deg] ${
            isExpanded
              ? 'bg-purple-400 hover:bg-purple-400'
              : 'bg-purple-400 hover:bg-purple-400'
          }`}
        >
          {isExpanded ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Phone className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactButton;