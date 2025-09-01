// components/ProductImage.tsx
import { useState, useEffect, useRef } from 'react';

interface ProductImageProps {
  productId: string;
  altText: string;
  className?: string;
}

export const ProductImage = ({
  productId,
  altText,
  className = ''
}: ProductImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const currentProductIdRef = useRef<string>('');

  useEffect(() => {
    currentProductIdRef.current = productId;

    if (!productId) {
      setImgSrc('/images/products/default.webp');
      return;
    }

    // Try different image extensions
    const extensions = ['webp', 'png', 'jpg', 'jpeg'];
    let active = true;

    const checkImage = async () => {
      for (const ext of extensions) {
        const src = `/images/products/${productId}.${ext}`;
        try {
          const exists = await imageExists(src);
          if (exists && currentProductIdRef.current === productId) {
            if (active) setImgSrc(src);
            return;
          }
        } catch (error) {
          console.error('Error checking image:', error);
        }
      }
      if (active && currentProductIdRef.current === productId) {
        setImgSrc('/images/products/default.webp');
      }
    };

    checkImage();

    return () => {
      active = false;
      currentProductIdRef.current = '';
    };
  }, [productId]);

  const imageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.onload = img.onerror = null;
        resolve(false);
      }, 1000); // Timeout after 1 second

      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };
      img.src = url;
    });
  };

  return (
    <img
      src={imgSrc}
      alt={altText}
      className={`max-w-full max-h-full object-contain ${className}`}
      loading="lazy"
      onError={() => setImgSrc('/images/products/default.webp')}
    />
  );
};