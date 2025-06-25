
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  brandName: string;
  company: string;
  packing: string;
  mrp: number;
  image: string;
  category: string;
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
        name: item.Name || '',
        brandName: item.Company || '', // Using Company as brandName based on your requirements
        company: item.Company || '',
        packing: item.Packing || '',
        mrp: item.MRP || 0,
        image: 'photo-1581091226825-a6a2a5aee158', // Default image, you can enhance this later
        category: item.Category || 'General'
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
