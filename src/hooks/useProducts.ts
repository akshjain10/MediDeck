
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
}

// Simple cache implementation
const cache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Function to clear cache manually
export const clearProductsCache = () => {
  cache.clear();
  console.log('Products cache cleared');
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'products';
    const cached = cache.get(cacheKey);
    
    // Check if we have valid cached data and not forcing refresh
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.data);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching products from database...');
      const { data, error } = await supabase
        .from('Product')
        .select('*');

      if (error) {
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} products from database`);

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
        stockAvailable: item['Stock Available'] || false // Adding stock availability
      }));

      setProducts(transformedProducts);
      
      // Cache the results
      cache.set(cacheKey, {
        data: transformedProducts,
        timestamp: Date.now()
      });

      console.log(`Successfully loaded ${transformedProducts.length} products`);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Force refresh function
  const forceRefresh = useCallback(() => {
    console.log('Force refreshing products...');
    clearProductsCache();
    fetchProducts(true);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    forceRefresh
  };
};
