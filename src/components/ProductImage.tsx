// components/ProductImage.tsx
import { useState, useEffect, useRef } from 'react';

interface ProductImageProps {
  productId: string;
  altText: string;
  className?: string;
  containerClassName?: string;
}

// Preload the default image at module level
const DEFAULT_IMAGE_SRC = '/images/products/default.webp';
const defaultImage = new Image();
defaultImage.src = DEFAULT_IMAGE_SRC;

export const ProductImage = ({
  productId,
  altText,
  className = '',
  containerClassName = ''
}: ProductImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const currentProductIdRef = useRef<string>('');
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const supportedExtensions = ['webp', 'png', 'jpg', 'jpeg'];
  const maxRetries = 2; // Reduced from 3 to speed up fallback

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  const tryLoadImage = async (productId: string, retryCount = 0) => {
    clearRetryTimeout();

    if (!productId || currentProductIdRef.current !== productId) {
      return;
    }

    setIsLoading(true);

    // First try to load the product image
    let foundImage = false;
    for (const extension of supportedExtensions) {
      const testSrc = `/images/products/${productId}.${extension}`;

      try {
        const exists = await checkImageExists(testSrc);
        if (exists && currentProductIdRef.current === productId) {
          setImgSrc(testSrc);
          setIsLoading(false);
          foundImage = true;
          return;
        }
      } catch (error) {
        console.error('Error checking image:', error);
      }
    }

    // If no image found and we still have retries
    if (!foundImage && retryCount < maxRetries && currentProductIdRef.current === productId) {
      retryTimeoutRef.current = setTimeout(
        () => tryLoadImage(productId, retryCount + 1),
        200 * (retryCount + 1) // Reduced delay between retries
      );
      return;
    }

    // If we get here, use the preloaded default image
    if (currentProductIdRef.current === productId) {
      setImgSrc(DEFAULT_IMAGE_SRC);
      setIsLoading(false);
    }
  };

  // Optimized image check with timeout
  const checkImageExists = (src: string): Promise<boolean> => {
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
      img.src = src;
    });
  };

  useEffect(() => {
    currentProductIdRef.current = productId;

    if (!productId) {
      setImgSrc(DEFAULT_IMAGE_SRC);
      setIsLoading(false);
      return;
    }

    setImgSrc('');
    setIsLoading(true);
    tryLoadImage(productId);

    return () => {
      currentProductIdRef.current = '';
      clearRetryTimeout();
    };
  }, [productId]);

  const handleError = () => {
    if (currentProductIdRef.current === productId) {
      setImgSrc(DEFAULT_IMAGE_SRC);
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}

      {imgSrc && (
        <img
          src={imgSrc}
          alt={altText}
          className={`max-w-full max-h-full object-contain ${className} ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-200`} // Reduced transition duration
          loading={imgSrc === DEFAULT_IMAGE_SRC ? 'eager' : 'lazy'} // Eager load default image
          onError={handleError}
        />
      )}
    </div>
  );
};