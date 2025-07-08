
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { admin } from '@/integrations/supabase/admin';

export interface Product {
  id: string;
  Name: string;
  Salt: string;
  Company: string;
  Packing: string;
  MRP: number;
  Category: string;
  visibility: boolean;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await admin
        .from('Product')
        .select('*')
        .order('Name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async ({ originalId, changes }: { originalId: string; changes: Partial<Product> }) => {
    try {
      const { error } = await admin
        .from('Product')
        .update(changes)
        .eq('id', originalId);

      if (error) throw error;
      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const addProduct = async (newProduct: Partial<Product>) => {
    try {
      const { error } = await admin
        .from('Product')
        .insert([newProduct]);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const deleteProducts = async (ids: string[]) => {
    try {
      const { error } = await admin
        .from('Product')
        .delete()
        .in('id', ids);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      throw error;
    }
  };

  const applyVisibilityChanges = async (pendingChanges: Record<string, boolean>) => {
    try {
      const updatePromises = Object.entries(pendingChanges).map(([id, visibility]) =>
        admin
          .from('Product')
          .update({ visibility })
          .eq('id', id)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} products`);
      }
      
      await fetchProducts();
    } catch (error) {
      console.error('Error applying visibility changes:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    updateProduct,
    addProduct,
    deleteProducts,
    applyVisibilityChanges,
    refetch: fetchProducts
  };
};
