
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Copy, Check, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

interface ProductShareProps {
  product: Product;
}

const ProductShare: React.FC<ProductShareProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const productUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `Check out ${product.brandName} by ${product.company} - ₹${product.mrp}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(`${shareText}\n${productUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${whatsappText}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Product: ${product.brandName}`);
    const body = encodeURIComponent(`${shareText}\n\nView product: ${productUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.brandName,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{product.brandName}</h4>
            <p className="text-sm text-gray-600">{product.company} • ₹{product.mrp}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              readOnly
              value={productUrl}
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleEmailShare}
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
          </div>

          {navigator.share && (
            <Button
              onClick={handleNativeShare}
              className="w-full flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>More Options</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductShare;
