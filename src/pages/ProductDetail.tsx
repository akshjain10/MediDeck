import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard, { Product } from '@/components/ProductCard';
import Cart, { CartItem } from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const product = mockProducts.find(p => p.id === id);
  
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

  // Get similar products with the same name but different brands
  const similarProducts = mockProducts.filter(p => 
    p.name === product.name && 
    p.brandName !== product.brandName && 
    p.id !== product.id
  ).slice(0, 4);

  const addToCart = (productToAdd: Product, qty: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, {
        id: productToAdd.id,
        name: productToAdd.brandName,
        company: productToAdd.company,
        mrp: productToAdd.mrp,
        quantity: qty,
        image: productToAdd.image
      }];
    });
    toast({
      title: "Added to Cart",
      description: `${productToAdd.brandName} has been added to your cart.`,
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

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

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onSetCartItems={handleSetCartItems}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-white p-4 max-w-md">
            <img
              src={`https://images.unsplash.com/${product.image}?w=400&h=400&fit=crop`}
              alt={product.brandName}
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.brandName}</h1>
              <p className="text-lg text-gray-600">Name: {product.name}</p>
              <p className="text-lg text-gray-600">by {product.company}</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-blue-600">₹{product.mrp}</p>
              <p className="text-gray-600">Packing: {product.packing}</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• High-quality pharmaceutical product</li>
                  <li>• Certified and tested for safety</li>
                  <li>• Fast and reliable delivery</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  handleAddToCart();
                  setShowCart(true);
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Similar Products with {product.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(similarProduct => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  onAddToCart={(prod) => addToCart(prod, 1)}
                />
              ))}
            </div>
          </section>
        )}
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

export default ProductDetail;
