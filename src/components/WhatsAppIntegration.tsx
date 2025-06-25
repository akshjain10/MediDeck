
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { CartItem } from '@/components/Cart';

interface WhatsAppIntegrationProps {
  cartItems: CartItem[];
  onSuccess: () => void;
}

const WhatsAppIntegration = ({ cartItems, onSuccess }: WhatsAppIntegrationProps) => {
  const WHATSAPP_NUMBER = "919876543210"; // Replace with actual WhatsApp number

  const sendToWhatsApp = () => {
    if (cartItems.length === 0) return;

    // Create message content
    let message = "🛒 *New Order Request from MediCare Plus*\n\n";
    message += "📋 *Order Details:*\n";
    
    let total = 0;
    cartItems.forEach((item, index) => {
      const itemTotal = item.mrp * item.quantity;
      total += itemTotal;
      message += `${index + 1}. ${item.name}\n`;
      message += `   Company: ${item.company}\n`;
      message += `   Price: ₹${item.mrp} x ${item.quantity} = ₹${itemTotal}\n\n`;
    });

    message += `💰 *Total Amount: ₹${total}*\n\n`;
    message += "📞 Please confirm this order and provide delivery details.\n";
    message += `🕒 Order Time: ${new Date().toLocaleString()}`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Call success callback
    onSuccess();
  };

  return (
    <Button
      onClick={sendToWhatsApp}
      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
      disabled={cartItems.length === 0}
    >
      <MessageCircle className="w-5 h-5" />
      <span>Send Order via WhatsApp</span>
    </Button>
  );
};

export default WhatsAppIntegration;
