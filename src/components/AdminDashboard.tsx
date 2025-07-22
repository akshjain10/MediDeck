// components/admin/AdminDashboard.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs';
import ProductFormDialog from '@/components/ProductFormDialog';
import {admin} from '@/integrations/supabase/admin';
import { downloadCSV, readCSV } from '@/utils/csvUtils';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  CheckCircle, LogOut, Package, Eye, EyeOff, Building,
  BarChart3, PlusCircle, Settings, Users
} from 'lucide-react';
import { Table } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AdminProductTable from '@/components/AdminProductTable';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';
import StatCard from '@/components/admin/StatCard';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import UsersTab from '@/components/admin/UsersTab';

interface PendingChanges {
  visibility?: boolean;
  newArrivals?: boolean;
}

interface AdminDashboardProps {
  adminName: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminName, onLogout }) => {
  const { products, loading, applyVisibilityChanges, updateProduct, addProduct, deleteProducts, applyNewArrivalsChanges } = useAdminProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [appliedProducts, setAppliedProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden' | 'newArrivals'>('all');
  const [pendingVisChanges, setPendingVisChanges] = useState<Record<string, PendingChanges>>({});
  const { toast } = useToast();

  // Update filteredProducts to account for pending changes
  const filteredProducts = useMemo(() => {
    let products = appliedProducts;

    if (filter === 'visible') products = appliedProducts.filter(p => p.visibility);
    if (filter === 'hidden') products = appliedProducts.filter(p => !p.visibility);
    if (filter === 'newArrivals') products = appliedProducts.filter(p => p.newArrivals);

    return products.map(product => ({
      ...product,
      visibility: pendingVisChanges[product.id]?.visibility ?? product.visibility,
      newArrivals: pendingVisChanges[product.id]?.newArrivals ?? product.newArrivals
    }));
  }, [appliedProducts, filter, pendingVisChanges]);

  const selectedProducts = useMemo(() => {
    return localProducts.filter(product => selectedIds.includes(product.id));
  }, [localProducts, selectedIds]);

  useEffect(() => {
    setLocalProducts(products);
    setAppliedProducts(products);
  }, [products]);

  const handleExport = async () => {
    try {
      const headers = ['id', 'Name', 'Salt', 'Company', 'Packing', 'MRP', 'Category'];
      const data = appliedProducts.map(p => ({
        id: p.id,
        Name: p.Name,
        Salt: p.Salt,
        Company: p.Company,
        Packing: p.Packing,
        MRP: p.MRP,
        Category: p.Category || ''
      }));
      downloadCSV(data, headers, 'products_export.csv');
      toast({ title: "Success", description: "Export started" });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleImport = async (file: File) => {
        try {
            const { data: csvData, errors } = await readCSV(file);
            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }

            // Validate data
            const validationErrors: string[] = [];
            const existingIds = new Set(products.map(p => p.id));
            const newIds = new Set<string>();

            csvData.forEach((row, index) => {
                if (!row.Name || row.Name==="required") {
                    validationErrors.push(`Row ${index + 1}: Name is required`);
                }
                if (row.id) {
                    if (existingIds.has(row.id)) {
                        validationErrors.push(`Row ${index + 1}: ID ${row.id} already exists`);
                    }
                    if (newIds.has(row.id)) {
                        validationErrors.push(`Row ${index + 1}: Duplicate ID ${row.id} in import file`);
                    }
                    newIds.add(row.id);
                }
            });

            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join('\n'));
            }

            const generateId = () => {
                 return Math.random().toString(36).substring(2, 10);
            };

            // Prepare data for insert
            const productsToInsert = csvData.map(row => ({
                id: row.id ?? generateId(), // Let Supabase generate ID if not provided
                Name: row.Name,
                Salt: row.Salt ?? '',
                Company: row.Company ?? '',
                Packing: row.Packing ?? '',
                MRP: parseFloat(row.MRP) ?? 0,
                Category: row.Category ?? '',
                Division: row.Division ?? '',
                visibility: true,// Default value
                newArrivals: false
            }));

            // Bypass RLS
            const { error } = await admin
                .from('Product')
                .insert(productsToInsert)
                .select();

            if (error) throw error;

            toast({ title: "Success", description: `${productsToInsert.length} products imported` });
        } catch (error) {
            throw error;
        }
    };

    const handleNewArrivalsToggle = useCallback((productId: string, newArrivals: boolean) => {
      setPendingVisChanges(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          newArrivals
        }
      }));
    }, []);

    const handleVisibilityToggle = useCallback((productId: string, isVisible: boolean) => {
      setPendingVisChanges(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          visibility: isVisible
        }
      }));
    }, [])

    const handleSelect = useCallback((id: string, checked: boolean) => {
      setSelectedIds(prev =>
        checked ? [...prev, id] : prev.filter(item => item !== id)
      ); // <-- Added closing parenthesis and semicolon here
    }, []);

    const handleDelete = useCallback(async (ids: string[]) => {
      console.log('DELETE INITIATED - IDs:', ids); // Add this line
      try {
        await deleteProducts(ids);
        console.log('DELETE SUCCESSFUL'); // Add this line
        setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
        toast({ title: "Success", description: "Products deleted successfully" });
      } catch (error) {
        console.error('DELETE ERROR:', error); // Add this line
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete products",
          variant: "destructive"
        });
      }
    }, [deleteProducts, toast]);

    const handleApplyChanges = async () => {
      try {
        // Separate visibility and new arrival changes
        const visibilityChanges: Record<string, boolean> = {};
        const newArrivalChanges: Record<string, boolean> = {};

        Object.entries(pendingVisChanges).forEach(([id, changes]) => {
          if (changes.visibility !== undefined) {
            visibilityChanges[id] = changes.visibility;
          }
          if (changes.newArrivals !== undefined) {
            newArrivalChanges[id] = changes.newArrivals;
          }
        });

        // Apply changes in parallel if both exist
        const changePromises = [];

        if (Object.keys(visibilityChanges).length > 0) {
          changePromises.push(applyVisibilityChanges(visibilityChanges));
        }

        if (Object.keys(newArrivalChanges).length > 0) {
          changePromises.push(applyNewArrivalsChanges(newArrivalChanges));
        }

        await Promise.all(changePromises);

        setAppliedProducts(localProducts);
        setPendingVisChanges({});
        setIsConfirmOpen(false);

        toast({
          title: "Success",
          description: `Applied ${changePromises.length} type(s) of changes`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to apply some changes",
          variant: "destructive"
        });
      }
    };

    const handleDiscardChanges = () => {
      setLocalProducts(appliedProducts);
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

  const pendingChangeCount = Object.keys(pendingVisChanges).length;
  const visibleCount = appliedProducts.filter(p => p.visibility).length;
  const hiddenCount = appliedProducts.length - visibleCount;
  const companyCount = new Set(appliedProducts.map(p => p.Company)).size;

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Arihant Medigens</h1>
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

      <div className="min-h-screen bg-gray-50 pb-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="products" className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                        <TabsTrigger value="products" className="gap-2">
                          <Package className="h-4 w-4" /> Products
                        </TabsTrigger>
                        <TabsTrigger value="selected" className="gap-2" disabled={selectedIds.length === 0}>
                          <CheckCircle className="h-4 w-4" /> Selected ({selectedIds.length})
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                          <BarChart3 className="h-4 w-4" /> Analytics
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                          <Settings className="h-4 w-4" /> Settings
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 w-1/2 sm:w-auto">
                          <Users className="h-4 w-4" /> Manage Users
                        </Button>
                        <Button onClick={handleAddNew} className="gap-2 w-1/2 sm:w-auto">
                          <PlusCircle className="h-4 w-4" /> Add Product
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="products" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Total Products Button */}
                        <Button
                          variant="ghost"
                          className="h-full p-0"
                          onClick={() => setFilter('all')}
                        >
                          <StatCard
                            title="Total Products"
                            value={appliedProducts.length}
                            icon={<Package className="h-5 w-5" />}
                            active={filter === 'all'}  // Highlight if active
                          />
                        </Button>

                        {/* Visible Button */}
                        <Button
                          variant="ghost"
                          className="h-full p-0"
                          onClick={() => setFilter('visible')}
                        >
                          <StatCard
                            title="Visible"
                            value={visibleCount}
                            icon={<Eye className="h-5 w-5" />}
                            variant="success"
                            active={filter === 'visible'}  // Highlight if active
                          />
                        </Button>

                        {/* Hidden Button */}
                        <Button
                          variant="ghost"
                          className="h-full p-0"
                          onClick={() => setFilter('hidden')}
                        >
                          <StatCard
                            title="Hidden"
                            value={hiddenCount}
                            icon={<EyeOff className="h-5 w-5" />}
                            variant="warning"
                            active={filter === 'hidden'}  // Highlight if active
                          />
                        </Button>

                         <Button
                                variant="ghost"
                                className="h-full p-0"
                                onClick={() => setFilter('newArrivals')}
                            >
                                <StatCard
                                    title="New Arrivals"
                                    value={appliedProducts.filter(p => p.newArrivals).length}
                                    icon={<PlusCircle className="h-5 w-5" />}
                                    variant="default"
                                    active={filter === 'newArrivals'}
                                />
                            </Button>
                      </div>
                      <AdminProductTable
                        products={filteredProducts}
                        onToggleNewArrivals={handleNewArrivalsToggle}
                        onToggleVisibility={handleVisibilityToggle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        pendingChanges={pendingVisChanges}
                        onExport={handleExport}
                        onImport={handleImport}
                        onSave={async ({ originalId, changes }) => {
                          await updateProduct({ originalId, changes });
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="selected">
                      <Card>
                        <CardHeader>
                          <CardTitle>Selected Products ({selectedIds.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                          <AdminProductTable
                                          products={selectedProducts}
                                          onToggleNewArrivals={handleNewArrivalsToggle}
                                          onToggleVisibility={handleVisibilityToggle}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          selectedIds={selectedIds}
                                          onSelect={handleSelect}
                                          pendingChanges={pendingVisChanges}
                                          onExport={() => {
                                                             // Optional: Export only selected products
                                                             const headers = ['id', 'Name', 'Salt', 'Company', 'Packing', 'MRP', 'Category'];
                                                             const data = selectedProducts.map(p => ({
                                                               id: p.id,
                                                               Name: p.Name,
                                                               Salt: p.Salt,
                                                               Company: p.Company,
                                                               Packing: p.Packing,
                                                               MRP: p.MRP,
                                                               Category: p.Category || ''
                                                             }));
                                                             downloadCSV(data, headers, 'selected_products_export.csv');
                                                           }}
                                          onImport={handleImport}
                                          onSave={async ({ originalId, changes }) => {
                                              await updateProduct({ originalId, changes });
                                            }}
                                      />
                          </Table>

                      </CardContent>
                     </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                      <AnalyticsTab />
                    </TabsContent>

                    <TabsContent value="settings">
                      <SettingsTab />
                    </TabsContent>
          </Tabs>
        </main>

        {pendingChangeCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg flex justify-center items-center gap-4">
            <p className="font-semibold text-gray-700">{pendingChangeCount} pending change{pendingChangeCount > 1 ? 's' : ''}</p>
            <Button variant="outline" onClick={handleDiscardChanges}>Discard</Button>
            <Button onClick={() => setIsConfirmOpen(true)}>Apply Changes</Button>
          </div>
        )}

        <ProductFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          product={currentProduct}
          onSave={updateProduct}
          onAdd={addProduct}
        />

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
    </div>
  );
};

export default AdminDashboard;
