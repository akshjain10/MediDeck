import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  brandName: string;
  name: string;
  company: string;
  packing: string;
  mrp: number;
  image?: string;
  category: string;
  salt?: string;
  stockAvailable: boolean;
  isVisible: boolean;
  newArrivals: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    const cacheKey = 'products';
    const cached = cache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setProducts(result.data);
      
      // Cache the results
      cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now()
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};