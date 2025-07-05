
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
        .select('*'); // Fetch all products for admin

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
        isVisible: item.visibility || false // Use visibility column directly
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
      // Calculate stats directly from Product table
      const { data: allProducts, error: productsError } = await supabase
        .from('Product')
        .select('*');

      if (productsError) throw productsError;

      const totalProducts = allProducts?.length || 0;
      const visibleProducts = allProducts?.filter(p => p.visibility === true).length || 0;
      const hiddenProducts = totalProducts - visibleProducts;

      // Get company stats
      const companyStats = allProducts?.reduce((acc: any, product: any) => {
        const company = product.Company || 'Unknown';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      }, {}) || {};

      const companyStatsArray = Object.entries(companyStats)
        .map(([company, count]) => ({ company, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get category stats
      const categoryStats = allProducts?.reduce((acc: any, product: any) => {
        const category = product.Category || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const categoryStatsArray = Object.entries(categoryStats)
        .map(([category, count]) => ({ category, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setStats({
        total_products: totalProducts,
        visible_products: visibleProducts,
        hidden_products: hiddenProducts,
        company_stats: companyStatsArray,
        category_stats: categoryStatsArray
      });
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
        .from('Product')
        .update({ visibility: !isVisible }) // Toggle the visibility column
        .eq('id', productId);

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
      // Map the Product interface fields back to database columns
      const dbUpdates: any = {};
      
      if (updates.brandName !== undefined) dbUpdates.Name = updates.brandName;
      if (updates.name !== undefined) dbUpdates.Salt = updates.name;
      if (updates.company !== undefined) dbUpdates.Company = updates.company;
      if (updates.packing !== undefined) dbUpdates.Packing = updates.packing;
      if (updates.mrp !== undefined) dbUpdates.MRP = updates.mrp;
      if (updates.category !== undefined) dbUpdates.Category = updates.category;
      if (updates.isVisible !== undefined) dbUpdates.visibility = updates.isVisible;

      const { error } = await supabase
        .from('Product')
        .update(dbUpdates)
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
