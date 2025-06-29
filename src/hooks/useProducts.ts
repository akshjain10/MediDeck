
import { useState, useEffect } from 'react';
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

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('Product')
        .select('*');

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
        stockAvailable: item['Stock Available'] || false // Adding stock availability
      }));

      setProducts(transformedProducts);
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};
