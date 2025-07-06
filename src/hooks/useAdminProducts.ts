import { useState, useEffect, useCallback } from 'react';
import { admin } from '@/integrations/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';

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
    const { toast } = useToast();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await admin.from('Product').select('*');
            if (error) throw error;
            const sanitizedProducts = (data || []).map(p => ({
                ...p,
                MRP: p.MRP === null || p.MRP === undefined ? 0 : p.MRP,
            }));
            setProducts(sanitizedProducts);
        } catch (error: any) {
            toast({ title: "Error fetching products", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const applyVisibilityChanges = async (changes: Record<string, boolean>) => {
        try {
            const updates = Object.entries(changes).map(([id, visibility]) =>
                admin.from('Product').update({ visibility }).eq('id', id)
            );
            const results = await Promise.all(updates);
            const error = results.find(res => res.error);
            if (error) throw error.error;

            await fetchProducts();
            toast({ title: "Success", description: `Visibility updated for ${Object.keys(changes).length} product(s).` });
        } catch (error: any) {
            toast({ title: "Error applying changes", description: error.message, variant: "destructive" });
        }
    };

    // Update the updateProduct function signature
    const updateProduct = async (params: {
      originalId: string;
      changes: Partial<Product>;
    }) => {
      const { originalId, changes } = params;

      try {
        // If ID is being changed
        if (changes.id && changes.id !== originalId) {
          // 1. Check if new ID already exists
          const { data: existing } = await admin
            .from('Product') // Changed from 'products' to 'Product' to match your table name
            .select('id')
            .eq('id', changes.id)
            .maybeSingle();

          if (existing) {
            throw new Error(`Product with ID ${changes.id} already exists`);
          }

          // 2. Create new record with updated ID
          const { error: createError } = await admin
            .from('Product')
            .insert({
              ...changes,
              id: changes.id
            });

          if (createError) throw createError;

          // 3. Delete old record
          const { error: deleteError } = await admin
            .from('Product')
            .delete()
            .eq('id', originalId);

          if (deleteError) throw deleteError;
        } else {
          // Normal update if ID isn't changing
          const { error: updateError } = await admin
            .from('Product')
            .update(changes)
            .eq('id', originalId);

          if (updateError) throw updateError;
        }

        await fetchProducts();
        toast({ title: "Success", description: "Product updated successfully" });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update product",
          variant: "destructive"
        });
        throw error;
      }
    };

    const deleteProducts = async (ids: string[]) => {
      console.log('Attempting to delete products:', ids);
      try {
        const { error } = await admin
          .from('Product')
          .delete()
          .in('id', ids);

        if (error) {
          console.error('Deletion error:', error);
          throw error;
        }
        console.log('Successfully deleted products');
        await fetchProducts();
      } catch (error) {
        console.error('Full deletion error:', error);
        throw error;
      }
    };

    const addProduct = async (newProduct: Omit<Product, 'id' | 'visibility'>) => {
        try {
            const productWithDefaults = {
                ...newProduct,
                id: Math.random().toString(36).substr(2, 9),
                visibility: true,
            };
            const { error } = await admin.from('Product').insert([productWithDefaults]);
            if (error) throw error;
            await fetchProducts();
            toast({ title: "Product Added", description: "New product has been added successfully." });
        } catch (error: any) {
            toast({ title: "Error adding product", description: error.message, variant: "destructive" });
        }
    };

    return { products, loading, fetchProducts, applyVisibilityChanges, updateProduct, addProduct, deleteProducts};
};

