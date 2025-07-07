import { useState, useEffect } from 'react';

interface ProductImageProps {
  productId: string;
  altText: string;
  className?: string;
}

export const ProductImage = ({ productId, altText, className = '' }: ProductImageProps) => {
  const [currentImageSrc, setCurrentImageSrc] = useState('');

  // Supported image extensions in order of preference
  const supportedExtensions = ['webp', 'png', 'jpg', 'jpeg'];

  useEffect(() => {
    const tryExtensions = async () => {
      for (const extension of supportedExtensions) {
        const testSrc = `/images/products/${productId}.${extension}`;
        const exists = await checkImageExists(testSrc);
        if (exists) {
          setCurrentImageSrc(testSrc);
          return;
        }
      }
      // If none found, use default
      setCurrentImageSrc('/images/products/default.webp');
    };

    tryExtensions();
  }, [productId]);

  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  return (
    <img
      src={currentImageSrc}
      alt={altText}
      className={`${className}`}
      loading="lazy"
      onError={() => setCurrentImageSrc('/images/products/default.webp')}
    />
  );
};