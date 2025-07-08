import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import {ProductImage} from '@/components/ProductImage';
import ProductInfo from '@/components/ProductInfo';
import SimilarProducts from '@/components/SimilarProducts';
import Cart, { CartItem } from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Share2 } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import { areProductsSimilar } from '@/utils/stringUtils';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProductDetail = () => {
  const { id } = useParams();
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { products, loading } = useProducts();
  const { cartItems, setCartItems, clearCart } = useCartPersistence();

  const product = products.find(p => p.id === id);

  // Get similar products using 80% matching algorithm
  const similarProducts = products.filter(p =>
    p.id !== product?.id &&
    product &&
    areProductsSimilar(p.name, product.name, 0.8)
  ).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = (platform: string) => {
      if (!product) return;

      const productUrl = `${window.location.origin}/products/${product.id}`;
      const shareText = `Check out ${product.brandName} by ${product.company} - ${product.mrp}₹\n\n${productUrl}`;

      switch (platform) {
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(shareText);
          toast({
            title: "Copied to clipboard",
            description: "Product details have been copied to your clipboard.",
          });
          break;
        default:
          break;
      }

      setShowShareDialog(false);
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          cartItemsCount={0}
          onCartClick={() => {}}
          onSetCartItems={() => {}}
        />
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          cartItemsCount={0}
          onCartClick={() => {}}
          onSetCartItems={() => {}}
        />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = (productToAdd: Product, qty: number = 1) => {
    const existingItem = cartItems.find(item => item.id === productToAdd.id);
    const updatedCartItems = existingItem
      ? cartItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      : [...cartItems, {
          id: productToAdd.id,
          name: productToAdd.brandName,
          company: productToAdd.company,
          mrp: productToAdd.mrp,
          quantity: qty,
          image: productToAdd.image
        }];

    setCartItems(updatedCartItems);
    toast({
      title: "Added to Cart",
      description: `${productToAdd.brandName} has been added to your cart.`,
      duration: 1500,
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setShowCart(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (id: string) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
  };

  const placeOrder = () => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    clearCart();
    setShowCart(false);
    setShowOrderSuccess(true);
  };

  const handleEnquirySubmit = (enquiry: EnquiryData) => {
    let message = "🔍 Product Enquiry\n\n";
    message += `Name: ${enquiry.name}\n`;
    message += `Email: ${enquiry.email}\n`;
    message += `Phone: ${enquiry.phone}\n`;
    message += `Product: ${enquiry.productName}\n`;
    if (enquiry.description) {
      message += `Description: ${enquiry.description}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=919856686156&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    toast({
          title: "Enquiry Sent",
          description: "Your enquiry has been sent via WhatsApp!",
        });
    setShowEnquiryForm(false);
  };

  const cartItemsCount = cartItems.length;

  return (
      <div className="min-h-screen bg-gray-50">
        <Header
          cartItemsCount={cartItemsCount}
          onCartClick={() => setShowCart(true)}
          onSetCartItems={setCartItems}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <Badge variant="secondary">{product.category}</Badge>
            <div
              className="overflow-hidden rounded-lg bg-white p-8 max-w-lg mx-auto flex items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              <ProductImage
                productId={product.id}
                altText={product.brandName}
                className="max-w-full max-h-full object-contain rounded"
                containerClassName="w-full h-full"
              />
            </div>
          </div>
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onEnquiry={() => setShowEnquiryForm(true)}
          />
        </div>

        <SimilarProducts 
          products={similarProducts}
          currentProductName={product.name}
          onAddToCart={addToCart}
        />
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

      {showShareDialog && (
                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button variant="outline" onClick={() => handleShare('whatsapp')}>
                        WhatsApp
                      </Button>
                      <Button variant="outline" onClick={() => handleShare('facebook')}>
                        Facebook
                      </Button>
                      <Button variant="outline" onClick={() => handleShare('twitter')}>
                        Twitter
                      </Button>
                      <Button variant="outline" onClick={() => handleShare('telegram')}>
                        Telegram
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleShare('copy')}
                        className="col-span-2"
                      >
                        Copy Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
    </div>
  );
};

export default ProductDetail;
