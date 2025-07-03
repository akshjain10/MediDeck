
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';
import { 
  Search, 
  Upload, 
  Download, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [visibilityStates, setVisibilityStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchVisibilityStates();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Product')
        .select('*');

      if (error) throw error;

      const transformedProducts: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        brandName: item.Name || '',
        name: item.Salt || '',
        company: item.Company || '',
        packing: item.Packing || '',
        mrp: item.MRP || 0,
        image: '',
        category: item.Category || 'General',
        salt: item.Salt || '',
        stockAvailable: item['Stock Available'] || false
      }));

      setProducts(transformedProducts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVisibilityStates = async () => {
    try {
      const { data, error } = await supabase
        .from('product_visibility')
        .select('product_id, is_visible');

      if (error) throw error;

      const visibilityMap: Record<string, boolean> = {};
      data?.forEach(item => {
        visibilityMap[item.product_id] = item.is_visible;
      });
      setVisibilityStates(visibilityMap);
    } catch (error) {
      console.error('Failed to fetch visibility states:', error);
    }
  };

  const toggleProductVisibility = async (productId: string) => {
    const currentVisibility = visibilityStates[productId] ?? true;
    const newVisibility = !currentVisibility;

    try {
      const { error } = await supabase
        .from('product_visibility')
        .upsert({
          product_id: productId,
          is_visible: newVisibility,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setVisibilityStates(prev => ({
        ...prev,
        [productId]: newVisibility
      }));

      toast({
        title: "Success",
        description: `Product ${newVisibility ? 'shown' : 'hidden'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product visibility",
        variant: "destructive",
      });
    }
  };

  const handleBulkVisibilityToggle = async (visible: boolean) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select products to update",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = selectedProducts.map(productId => ({
        product_id: productId,
        is_visible: visible,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('product_visibility')
        .upsert(updates);

      if (error) throw error;

      // Update local state
      const newVisibilityStates = { ...visibilityStates };
      selectedProducts.forEach(id => {
        newVisibilityStates[id] = visible;
      });
      setVisibilityStates(newVisibilityStates);
      setSelectedProducts([]);

      toast({
        title: "Success",
        description: `${selectedProducts.length} products ${visible ? 'shown' : 'hidden'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product visibility",
        variant: "destructive",
      });
    }
  };

  const handleCSVExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Brand Name', 'Company', 'Salt', 'Category', 'Packing', 'MRP', 'Stock Available', 'Visible'].join(','),
      ...products.map(product => [
        product.id,
        `"${product.name}"`,
        `"${product.brandName}"`,
        `"${product.company}"`,
        `"${product.salt}"`,
        `"${product.category}"`,
        `"${product.packing}"`,
        product.mrp,
        product.stockAvailable,
        visibilityStates[product.id] ?? true
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const filteredProducts = products.filter(product =>
    product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCSVExport} variant="outline" className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </Button>
                    <Button className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Import CSV</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedProducts.length > 0 && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">
                        {selectedProducts.length} products selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleBulkVisibilityToggle(true)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Show All</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkVisibilityToggle(false)}
                          className="flex items-center space-x-1"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide All</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts(filteredProducts.map(p => p.id));
                              } else {
                                setSelectedProducts([]);
                              }
                            }}
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, product.id]);
                                } else {
                                  setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.brandName}</div>
                              <div className="text-sm text-gray-500">{product.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{product.company}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell>₹{product.mrp}</TableCell>
                          <TableCell>
                            <Badge variant={product.stockAvailable ? "default" : "destructive"}>
                              {product.stockAvailable ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={visibilityStates[product.id] ?? true}
                              onCheckedChange={() => toggleProductVisibility(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{products.length}</div>
                      <p className="text-gray-600">Total Products</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {Object.values(visibilityStates).filter(Boolean).length}
                      </div>
                      <p className="text-gray-600">Visible Products</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {products.filter(p => p.stockAvailable).length}
                      </div>
                      <p className="text-gray-600">In Stock</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
