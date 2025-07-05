import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    LogOut, Package, Eye, EyeOff, Building, BarChart3, PlusCircle, Settings, Users, Activity, Search, Edit, Filter, Lock, User as UserIcon
} from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import AdminProductTable from '@/components/AdminProductTable';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

// --- Hooks ---

// Merged and optimized hook for handling all admin product logic


const useAdminAuth = () => {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // In a real app, you would fetch the admin's name from your 'admin_users' table
                setAdmin({ id: session.user.id, email: session.user.email || '', name: 'Admin' });
            }
        };
        checkUser();
    }, []);


    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.user) {
                setAdmin({ id: data.user.id, email: data.user.email || '', name: 'Admin' }); // Fetch name from DB
                toast({ title: "Login Successful", description: `Welcome back!` });
            }
        } catch (error: any) {
            toast({ title: "Login Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setAdmin(null);
        toast({ title: "Logged Out" });
    };

    return { admin, login, logout, loading };
};


// --- Components ---

const ProductFormDialog = ({ open, onOpenChange, product, onSave, onAdd }: any) => {
    const [formData, setFormData] = useState<Partial<Product>>({});

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            // Reset for new product
            setFormData({
                Name: '', Salt: '', Company: '', Packing: '', MRP: 0, Category: '', visibility: true
            });
        }
    }, [product, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSave = () => {
        if (product) {
            onSave(formData);
        } else {
            onAdd(formData);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Name" className="text-right">Name</Label>
                        <Input id="Name" name="Name" value={formData.Name} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Salt" className="text-right">Salt</Label>
                        <Input id="Salt" name="Salt" value={formData.Salt} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Company" className="text-right">Company</Label>
                        <Input id="Company" name="Company" value={formData.Company} onChange={handleChange} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Packing" className="text-right">Packing</Label>
                        <Input id="Packing" name="Packing" value={formData.Packing} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="MRP" className="text-right">MRP</Label>
                        <Input id="MRP" name="MRP" type="number" value={formData.MRP} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Category" className="text-right">Category</Label>
                        <Input id="Category" name="Category" value={formData.Category} onChange={handleChange} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const AdminDashboardTAB = () => {
    const { products, loading, applyVisibilityChanges, updateProduct, addProduct } = useAdminProducts();
        const [localProducts, setLocalProducts] = useState<Product[]>([]);
        const [pendingVisChanges, setPendingVisChanges] = useState<Record<string, boolean>>({});
        const [isFormOpen, setIsFormOpen] = useState(false);
        const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
        const [isConfirmOpen, setIsConfirmOpen] = useState(false);

        useEffect(() => {
            setLocalProducts(products);
        }, [products]);

       const handleVisibilityToggle = useCallback((productId: string, isVisible: boolean) => {
         setLocalProducts(current => {
           const index = current.findIndex(p => p.id === productId);
           if (index === -1) return current;

           const updated = [...current];
           updated[index] = { ...updated[index], visibility: isVisible };
           return updated;
         });

         setPendingVisChanges(prev => {
           const updated = { ...prev };
           updated[productId] = isVisible;
           return updated;
         });
       }, []);


        const handleApplyChanges = async () => {
            await applyVisibilityChanges(pendingVisChanges);
            setPendingVisChanges({});
            setIsConfirmOpen(false);
        };

        const handleDiscardChanges = () => {
            setLocalProducts(products); // Revert to original state from hook
            setPendingVisChanges({});
        };

        const handleEdit = (product: Product) => {
            setCurrentProduct(product);
            setIsFormOpen(true);
        };

        const handleAddNew = () => {
            setCurrentProduct(null);
            setIsFormOpen(true);
        };

        if (loading) return <div>Loading...</div>;

        const pendingChangeCount = Object.keys(pendingVisChanges).length;

        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <main className="max-w-7xl mx-auto px-6 py-8">
                 <Tabs defaultValue="products" className="space-y-6">
                          <div className="flex justify-between items-center">
                            <TabsList className="grid grid-cols-3 w-[400px]">
                              <TabsTrigger value="products" className="gap-2">
                                <Package className="h-4 w-4" /> Products
                              </TabsTrigger>
                              <TabsTrigger value="analytics" className="gap-2">
                                <BarChart3 className="h-4 w-4" /> Analytics
                              </TabsTrigger>
                              <TabsTrigger value="settings" className="gap-2">
                                <Settings className="h-4 w-4" /> Settings
                              </TabsTrigger>
                            </TabsList>

                            <div className="flex gap-2">
                              <Button variant="outline" className="gap-2">
                                <Users className="h-4 w-4" /> Manage Users
                              </Button>
                              <Button className="gap-2">
                                <PlusCircle className="h-4 w-4" /> Add Product
                              </Button>
                            </div>
                          </div>
                    <TabsContent value="products" className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  <StatCard
                                    title="Total Products"
                                    value={products.length}
                                    icon={<Package className="h-5 w-5" />}
                                    trend="up"
                                  />
                                  <StatCard
                                    title="Visible"
                                    value="0"
                                    icon={<Eye className="h-5 w-5 text-green-500" />}
                                    variant="success"
                                  />
                                  <StatCard
                                    title="Hidden"
                                    value="0"
                                    icon={<EyeOff className="h-5 w-5 text-orange-500" />}
                                    variant="warning"
                                  />
                                  <StatCard
                                    title="Companies"
                                    value="0"
                                    icon={<Building className="h-5 w-5 text-blue-500" />}
                                  />
                                </div>
                                </TabsContent>


</Tabs>
                    <AdminProductTable products={localProducts} onToggleVisibility={handleVisibilityToggle} onEdit={handleEdit} selectedIds={[]} onSelect={() => {}} />
                </main>

                {pendingChangeCount > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg flex justify-center items-center gap-4">
                        <p className="font-semibold text-gray-700">{pendingChangeCount} pending change{pendingChangeCount > 1 ? 's' : ''}</p>
                        <Button variant="outline" onClick={handleDiscardChanges}>Discard</Button>
                        <Button onClick={() => setIsConfirmOpen(true)}>Apply Changes</Button>
                    </div>
                )}

                <ProductFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} product={currentProduct} onSave={updateProduct} onAdd={addProduct} />

                <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                            <AlertDialogDescription>
                                You are about to update the visibility for {pendingChangeCount} product(s). This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApplyChanges}>Apply</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
};

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

// --- Main App Component ---
const AdminDashboard = ({ adminName, onLogout }: { adminName: string; onLogout: () => void }) => {
//     const { admin, login, logout, loading } = useAdminAuth();
//
//     if (!admin) {
//         return <AdminLogin onLogin={login} loading={loading} />;
//     }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

              <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Building className="h-8 w-8 text-primary" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">PharmaAdmin</h1>
                      <p className="text-sm text-gray-600">
                        Welcome back, <span className="font-medium text-primary">{adminName}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </header>

   <AdminDashboardTAB />;
   </div>
   );
};

export default AdminDashboard;
