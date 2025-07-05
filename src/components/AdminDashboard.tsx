import React, { useState, useCallback, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@/components/ui/tabs';
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
  LogOut, Package, Eye, EyeOff, Building, BarChart3, PlusCircle,
  Settings, Users, Activity, Filter, Lock, User as UserIcon
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminProductTable from '@/components/AdminProductTable';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';

const StatCard = ({ title, value, icon, variant }: { title: string; value: number | string; icon: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) => (
  <Card className="h-full">
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

const ProductFormDialog = ({ open, onOpenChange, product, onSave, onAdd }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
  onAdd: (product: Partial<Product>) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the product details below' : 'Fill in the details for the new product'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Name" className="text-right">Name</Label>
            <Input id="Name" name="Name" value={formData.Name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Salt" className="text-right">Salt</Label>
            <Input id="Salt" name="Salt" value={formData.Salt} onChange={handleChange} className="col-span-3 h-20" />
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
          <Button onClick={handleSave}>{product ? 'Save' : 'Add Product'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

const SettingsTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label>Two-Factor Authentication</Label>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Enabled</span>
          </div>
          <Button variant="outline" size="sm">Change</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label>Email Notifications</Label>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>admin@example.com</span>
          </div>
          <Button variant="outline" size="sm">Update</Button>
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
  const { products, loading, applyVisibilityChanges, updateProduct, addProduct, deleteProducts } = useAdminProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [appliedProducts, setAppliedProducts] = useState<Product[]>([]);
  const [pendingVisChanges, setPendingVisChanges] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
              if (!row.Name) {
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

          // Prepare data for insert
          const productsToInsert = csvData.map(row => ({
              id: row.id || undefined, // Let Supabase generate ID if not provided
              Name: row.Name,
              Salt: row.Salt || '',
              Company: row.Company || '',
              Packing: row.Packing || '',
              MRP: parseFloat(row.MRP) || 0,
              Category: row.Category || '',
              visibility: true // Default value
          }));

          // Bypass RLS
          const { error } = await admin
              .from('products')
              .insert(productsToInsert)
              .select();

          if (error) throw error;

          toast({ title: "Success", description: `${productsToInsert.length} products imported` });
      } catch (error) {
          throw error;
      }
  };

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

  const handleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    ); // <-- Added closing parenthesis and semicolon here
  }, []);

  const handleDelete = useCallback(async (ids: string[]) => {
    try {
      await deleteProducts(ids);
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
      toast({ title: "Success", description: "Products deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete products", variant: "destructive" });
    }
  }, [deleteProducts, toast]);

  const handleApplyChanges = async () => {
    try {
      await applyVisibilityChanges(pendingVisChanges);
      setAppliedProducts(localProducts);
      setPendingVisChanges({});
      setIsConfirmOpen(false);
      toast({ title: "Success", description: "Visibility changes applied" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to apply changes", variant: "destructive" });
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
            <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
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
              <StatCard
                title="Total Products"
                value={appliedProducts.length}
                icon={<Package className="h-5 w-5" />}
              />
              <StatCard
                title="Visible"
                value={visibleCount}
                icon={<Eye className="h-5 w-5" />}
                variant="success"
              />
              <StatCard
                title="Hidden"
                value={hiddenCount}
                icon={<EyeOff className="h-5 w-5" />}
                variant="warning"
              />
              <StatCard
                title="Companies"
                value={companyCount}
                icon={<Building className="h-5 w-5" />}
              />
            </div>

            <AdminProductTable
                products={localProducts}
                onToggleVisibility={handleVisibilityToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onExport={handleExport}
                onImport={handleImport}
            />
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

      <AdminDashboardTAB />
    </div>
  );
};

export default AdminDashboard;