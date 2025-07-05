
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import Header from '@/components/Header';
import ProductImage from '@/components/ProductImage';
import ProductInfo from '@/components/ProductInfo';
import SimilarProducts from '@/components/SimilarProducts';
import ProductEnquiry from '@/components/ProductEnquiry';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState<number | ''>(1);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [products, id]);

  const handleQuantityChange = (newQuantity: number | '') => {
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const similarProducts = products
    .filter(p => p.id !== product.id && (p.company === product.company || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <ProductImage product={product} />
          <ProductInfo 
            product={product} 
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        <div className="mb-12">
          <ProductEnquiry product={product} />
        </div>

        {similarProducts.length > 0 && (
          <SimilarProducts 
            products={similarProducts} 
            currentProductName={product.brandName}
            onAddToCart={() => console.log('Add to cart')}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
