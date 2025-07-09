import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs';
import ProductFormDialog from '@/components/ProductFormDialog'
import { bulkUploadImagesToGithub } from '@/utils/imageUpload';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {admin} from '@/integrations/supabase/admin';
import { downloadCSV, readCSV } from '@/utils/csvUtils';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Upload, CheckCircle, Download, LogOut, Package, Eye, EyeOff, Building, BarChart3, PlusCircle,
  Settings, Users, Activity
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminProductTable from '@/components/AdminProductTable';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';

interface PendingChanges {
  visibility?: boolean;
  newArrivals?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  variant,
  active = false
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
  active?: boolean;
}) => (
  <Card className={`h-full ${active ? 'border-2 border-primary' : ''}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={variant === 'success' ? 'text-green-500' : variant === 'warning' ? 'text-orange-500' : 'text-primary'}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);



const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Views"
        value="12,345"
        icon={<Activity className="h-5 w-5" />}
      />
      <StatCard
        title="Conversion Rate"
        value="23.5%"
        icon={<BarChart3 className="h-5 w-5" />}
      />
      <StatCard
        title="Top Product"
        value="Paracetamol"
        icon={<Package className="h-5 w-5" />}
      />
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center">
        <div className="text-gray-400">Sales chart visualization</div>
      </CardContent>
    </Card>
  </div>
);

  const SettingsTab = () => {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_FILES = 50;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

    const cleanFileName = (fileName: string) => {
      return fileName
        .replace(/\.[^/.]+$/, "") // Remove extension
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-") // Replace special chars with hyphens
        .replace(/-+/g, "-") // Collapse multiple hyphens
        .replace(/^-+|-+$/g, "") // Trim hyphens from ends
        .substring(0, 50); // Limit length
    };

    const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Validate files
      const validFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE
      );

      if (validFiles.length === 0) {
        toast({
          title: "No Valid Files",
          description: "No valid image files found for upload",
          variant: "destructive"
        });
        return;
      }

      const uploadToast = toast({
        title: "Starting Bulk Upload",
        description: `Preparing to upload ${validFiles.length} images`,
        duration: Infinity // Keep toast open during upload
      });

      try {
        const imagesToUpload = validFiles.map(file => ({
          file,
          name: cleanFileName(file.name)
        }));

        const { success, failures } = await bulkUploadImagesToGithub({
          images: imagesToUpload,
          repo: import.meta.env.VITE_GITHUB_REPO,
          owner: import.meta.env.VITE_GITHUB_OWNER,
          branch: 'main'
        });

        uploadToast.update({
          id: uploadToast.id,
          title: "Bulk Upload Complete",
          description: `Successfully uploaded ${success.length}/${validFiles.length} images`,
          variant: failures.length > 0 ? "destructive" : "default",
          duration: 5000
        });

        if (failures.length > 0) {
          console.error("Failed uploads:", failures);
          toast({
            title: "Some Uploads Failed",
            description: `${failures.length} images failed to upload. Please check the console for details.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        uploadToast.update({
          id: uploadToast.id,
          title: "Bulk Upload Failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };


  const uploadSingleImage = async (file: File): Promise<void> => {
    try {
      const imageName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const cleanId = imageName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);

      await uploadImageToGithub({
        image: file,
        imageName: cleanId,
        repo: import.meta.env.VITE_GITHUB_REPO,
        owner: import.meta.env.VITE_GITHUB_OWNER,
        branch: 'main'
      });

    } catch (error) {
      throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  const handleDownloadTemplate = () => {
      const headers = ['id', 'Name', 'Salt', 'Company', 'Packing', 'MRP', 'Category'];
      const data = [{
        id: 'optional',
        Name: 'required',
        Salt: 'optional',
        Company: 'optional',
        Packing: 'optional',
        MRP: '0.00',
        Category: 'optional'
      }];
      downloadCSV(data, headers, 'product_template.csv');
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <Label>CSV Template</Label>
            <div className="text-sm text-muted-foreground">
              Download template for bulk imports
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate} className="gap-1">
              <Download className="w-4 h-4" /> Download Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <Label>Bulk Image Upload</Label>
                      <div className="text-sm text-muted-foreground">
                        Upload multiple product images (max {MAX_FILES}, 5MB each)
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleBulkImageUpload}
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="bulk-image-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-1"
                        >
                          <Upload className="w-4 h-4" /> Upload Images
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <Label>Default Items Per Page</Label>
            <Select defaultValue="25">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
                <SelectItem value="100">100 items</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UsersTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Management</CardTitle>
      <CardDescription>Manage system users and permissions</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Admin User</TableCell>
            <TableCell>admin@example.com</TableCell>
            <TableCell>Administrator</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">Edit</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Manager</TableCell>
            <TableCell>manager@example.com</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">Edit</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const AdminDashboardTAB = () => {
  const { products, loading, applyVisibilityChanges, updateProduct, addProduct, deleteProducts, applyNewArrivalsChanges } = useAdminProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [appliedProducts, setAppliedProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [pendingVisChanges, setPendingVisChanges] = useState<Record<string, PendingChanges>>({});

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

  const { toast } = useToast();

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
              id: row.id || generateId(), // Let Supabase generate ID if not provided
              Name: row.Name,
              Salt: row.Salt || '',
              Company: row.Company || '',
              Packing: row.Packing || '',
              MRP: parseFloat(row.MRP) || 0,
              Category: row.Category || '',
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

      // Update local state
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const pendingChangeCount = Object.keys(pendingVisChanges).length;
  const visibleCount = appliedProducts.filter(p => p.visibility).length;
  const hiddenCount = appliedProducts.length - visibleCount;
  const companyCount = new Set(appliedProducts.map(p => p.Company)).size;

  return (
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

              {/* Companies Button (optional) */}
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
  );
};

const AdminDashboard = ({ adminName, onLogout }: { adminName: string; onLogout: () => void }) => {
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

      <AdminDashboardTAB />
    </div>
  );
};

export default AdminDashboard;