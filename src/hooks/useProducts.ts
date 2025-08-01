import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  brandName: string; // This will be mapped from Name field
  name: string; // This will be mapped from Salt field
  company: string;
  packing: string;
  mrp: number;
  image: string;
  category: string;
  salt?: string; // Adding salt property
  stockAvailable?: boolean; // Adding stockAvailable property
  isVisible: boolean;
  newArrivals : boolean// Using visibility column from Product table
}

// Simple cache implementation
const cache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    const cacheKey = 'products';
    const cached = cache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.data);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('visibility', true); // Only fetch visible products

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedProducts: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        brandName: item.Name || '', // Using Name as brandName
        name: item.Salt || '', // Using Salt as name
        company: item.Company || '',
        packing: item.Packing || '',
        mrp: item.MRP || 0,
        image: 'photo-1581091226825-a6a2a5aee158', // Default image
        category: item.Category || 'General',
        salt: item.Salt || '', // Adding salt field
        stockAvailable: item['Stock Available'] || false, // Adding stock availability
        isVisible: item.visibility || false, // Map visibility column to isVisible
        newArrivals: item.newArrivals || false
      }));

      setProducts(transformedProducts);
      
      // Cache the results
      cache.set(cacheKey, {
        data: transformedProducts,
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
