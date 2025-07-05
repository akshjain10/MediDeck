
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';

interface ProductStats {
  total_products: number;
  visible_products: number;
  hidden_products: number;
  company_stats: Array<{ company: string; count: number }>;
  category_stats: Array<{ category: string; count: number }>;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Product')
        .select(`
          *,
          product_visibility (
            is_visible
          )
        `);

      if (error) throw error;

      const transformedProducts: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        brandName: item.Name || '',
        name: item.Salt || '',
        company: item.Company || '',
        packing: item.Packing || '',
        mrp: item.MRP || 0,
        image: 'photo-1581091226825-a6a2a5aee158',
        category: item.Category || 'General',
        salt: item.Salt || '',
        stockAvailable: item['Stock Available'] || false,
        isVisible: item.product_visibility?.[0]?.is_visible ?? true
      }));

      setProducts(transformedProducts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_product_statistics');
      if (error) throw error;
      setStats(data as unknown as ProductStats);
    } catch (error: any) {
      toast({
        title: "Error fetching statistics",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const toggleProductVisibility = async (productId: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('product_visibility')
        .upsert({
          product_id: productId,
          is_visible: !isVisible,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchProducts();
      await fetchStats();
      
      toast({
        title: "Product Updated",
        description: `Product ${!isVisible ? 'shown' : 'hidden'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (productId: string, updates: Partial<any>) => {
    try {
      const { error } = await supabase
        .from('Product')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;

      await fetchProducts();
      
      toast({
        title: "Product Updated",
        description: "Product details updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);

  return {
    products,
    stats,
    loading,
    toggleProductVisibility,
    updateProduct,
    refetch: () => {
      fetchProducts();
      fetchStats();
    }
  };
};
