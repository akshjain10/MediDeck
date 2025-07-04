
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductEnquiryProps {
  quantity?: number | '';
  product: Product;
  onSuccess?: () => void;
}

const ProductEnquiry = ({ product, quantity, onSuccess }: ProductEnquiryProps) => {
  const WHATSAPP_NUMBER = "918209703661";

  const sendProductEnquiry = () => {
    // Create enquiry message
    let message = "🔍 Product Enquiry\n\n";
    message += `📦 Product: ${product.brandName}\n`;
    message += `🏢 Company: ${product.company}\n`;
    message += `💰 MRP: ₹${product.mrp}\n`;
    message += `🏷️ Category: ${product.category}\n`;
    if (product.packing) {
      message += `📋 Packing: ${product.packing}\n`;
    }
    if (product.salt) {
      message += `🧪 Salt: ${product.salt}\n`;
    }
    if (quantity && typeof quantity === 'number' && quantity > 0) {
          message += `Requested Quantity: ${quantity} pcs\n`;
    }

    message += `\n📱 Please provide more details about availability and pricing of this product.\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Button
      onClick={sendProductEnquiry}
      variant="outline"
      className="w-full flex items-center justify-center space-x-2 text-green-600 border-green-600 hover:bg-green-50"
    >
      <MessageCircle className="w-4 h-4" />
      <span>Enquire via WhatsApp</span>
    </Button>
  );
};

export default ProductEnquiry;
