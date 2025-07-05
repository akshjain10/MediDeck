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

    const updateProduct = async (product: Product) => {
        try {
            const { error } = await admin.from('Product').update(product).eq('id', product.id);
            if (error) throw error;
            await fetchProducts();
            toast({ title: "Product Updated", description: "Product details saved successfully." });
        } catch (error: any) {
            toast({ title: "Error updating product", description: error.message, variant: "destructive" });
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

    return { products, loading, fetchProducts, applyVisibilityChanges, updateProduct, addProduct };
};

