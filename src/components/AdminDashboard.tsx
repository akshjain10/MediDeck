import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  LogOut,
  Package,
  Eye,
  EyeOff,
  Building,
  BarChart3,
  PlusCircle,
  Settings,
  Users,
  Activity
} from 'lucide-react';
import AdminProductTable from './AdminProductTable';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const AdminDashboard = ({ adminName, onLogout }: { adminName: string; onLogout: () => void }) => {
  const { products, stats, loading, toggleProductVisibility, updateProduct } = useAdminProducts();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Memoized data
  const visibleProductsCount = useMemo(() =>
    products.filter(p => p.isVisible).length, [products]);

  const hiddenProductsCount = useMemo(() =>
    products.length - visibleProductsCount, [products, visibleProductsCount]);

  // Handlers
  const handleProductSelection = useCallback((productId: string, isSelected: boolean) => {
    setSelectedProductIds(prev =>
      isSelected ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  }, []);

  const handleBulkVisibilityToggle = useCallback((makeVisible: boolean) => {
    selectedProductIds.forEach(id => toggleProductVisibility(id, makeVisible));
    setSelectedProductIds([]);
  }, [selectedProductIds, toggleProductVisibility]);

  const handleEditProduct = useCallback((product: Product) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  }, []);

  const handleSaveProduct = useCallback(async (updatedProduct: Product) => {
    await updateProduct(updatedProduct.id, updatedProduct);
    setIsEditDialogOpen(false);
  }, [updateProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="h-12 w-12 text-primary animate-spin" />
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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

      {/* Main Content */}
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Products"
                value={products.length}
                icon={<Package className="h-5 w-5" />}
                trend="up"
              />
              <StatCard
                title="Visible"
                value={visibleProductsCount}
                icon={<Eye className="h-5 w-5 text-green-500" />}
                variant="success"
              />
              <StatCard
                title="Hidden"
                value={hiddenProductsCount}
                icon={<EyeOff className="h-5 w-5 text-orange-500" />}
                variant="warning"
              />
              <StatCard
                title="Companies"
                value={stats?.company_stats?.length || 0}
                icon={<Building className="h-5 w-5 text-blue-500" />}
              />
            </div>

            {/* Bulk Actions */}
            {selectedProductIds.length > 0 && (
              <div className="bg-primary/10 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedProductIds.length} selected
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {selectedProductIds.length === products.length ? 'All products' : 'Selected products'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkVisibilityToggle(false)}
                  >
                    <EyeOff className="h-4 w-4 mr-2" /> Hide
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkVisibilityToggle(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Show
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <AdminProductTable
              products={products}
              selectedIds={selectedProductIds}
              onSelect={handleProductSelection}
              onToggleVisibility={toggleProductVisibility}
              onEdit={handleEditProduct}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Product Distribution
                  </CardTitle>
                  <CardDescription>By company and category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {stats?.company_stats?.slice(0, 5).map(company => (
                    <div key={company.company} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{company.company}</span>
                        <span className="text-gray-500">{company.count} products</span>
                      </div>
                      <Progress value={(company.count / products.length) * 100} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Additional analytics cards... */}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Product Dialog */}
      <ProductEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={currentProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, variant = 'default', trend }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
  trend?: 'up' | 'down';
}) => {
  const variantClasses = {
    default: 'bg-white',
    success: 'bg-green-50',
    warning: 'bg-orange-50'
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            {trend === 'up' ? '↑ 12% from last month' : '↓ 8% from last month'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const ProductEditDialog = ({ open, onOpenChange, product, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    setEditedProduct(product ? { ...product } : null);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditedProduct(prev => ({
      ...prev!,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (checked: boolean, field: string) => {
    setEditedProduct(prev => ({
      ...prev!,
      [field]: checked
    }));
  };

  if (!editedProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Product ID Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              Product Code
            </Label>
            <Input
              id="id"
              name="id"
              value={editedProduct.id}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Brand Name Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brandName" className="text-right">
              Brand Name
            </Label>
            <Input
              id="brandName"
              name="brandName"
              value={editedProduct.brandName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Generic Name Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Generic Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Company Field - Removed Badge styling */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              name="company"
              value={editedProduct.company}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Packing Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="packing" className="text-right">
              Packing
            </Label>
            <Input
              id="packing"
              name="packing"
              value={editedProduct.packing}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* MRP Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mrp" className="text-right">
              MRP (₹)
            </Label>
            <Input
              id="mrp"
              name="mrp"
              type="number"
              value={editedProduct.mrp}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Category Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isVisible" className="text-right">
              Visibility
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="isVisible"
                checked={editedProduct.isVisible}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked as boolean, 'isVisible')
                }
              />
              <label htmlFor="isVisible" className="text-sm font-medium leading-none">
                {editedProduct.isVisible ? 'Visible to customers' : 'Hidden from customers'}
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedProduct)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;