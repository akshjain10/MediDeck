
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { products, loading } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productVisibility, setProductVisibility] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Initialize visibility state
  React.useEffect(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    products.forEach(product => {
      initialVisibility[product.id] = true; // Default to visible
    });
    setProductVisibility(initialVisibility);
  }, [products]);

  const handleVisibilityToggle = (productId: string, visible: boolean) => {
    setProductVisibility(prev => ({
      ...prev,
      [productId]: visible
    }));
    
    toast({
      title: "Product Visibility Updated",
      description: `Product is now ${visible ? 'visible' : 'hidden'} to the public`,
    });
  };

  const handleBulkVisibilityToggle = (visible: boolean) => {
    const updatedVisibility: { [key: string]: boolean } = {};
    selectedProducts.forEach(productId => {
      updatedVisibility[productId] = visible;
    });
    setProductVisibility(prev => ({ ...prev, ...updatedVisibility }));
    
    toast({
      title: "Bulk Update Complete",
      description: `${selectedProducts.length} products updated`,
    });
    setSelectedProducts([]);
  };

  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "CSV Upload",
        description: "CSV upload functionality will be implemented",
      });
    }
  };

  const handleCSVDownload = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Company', 'Salt', 'MRP', 'Category', 'Packing', 'Visible'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.id,
        `"${product.brandName}"`,
        `"${product.company}"`,
        `"${product.salt || ''}"`,
        product.mrp,
        `"${product.category || ''}"`,
        `"${product.packing}"`,
        productVisibility[product.id] ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Downloaded",
      description: "Product data has been exported to CSV",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage products and control public visibility</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Product Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Product Visibility Control</span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSelectAll} variant="outline">
                    {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedProducts.length > 0 && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleBulkVisibilityToggle(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Show Selected ({selectedProducts.length})
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleBulkVisibilityToggle(false)}
                        variant="destructive"
                      >
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hide Selected ({selectedProducts.length})
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 50).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.brandName}</div>
                          <div className="text-sm text-gray-600">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.company}</TableCell>
                      <TableCell>₹{product.mrp}</TableCell>
                      <TableCell>
                        {product.category && (
                          <Badge variant="secondary">{product.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={productVisibility[product.id] ?? true}
                          onCheckedChange={(checked) => handleVisibilityToggle(product.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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
              {products.length > 50 && (
                <p className="text-sm text-gray-500 mt-4">
                  Showing first 50 products. Use search/filters for more specific results.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Product Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Import Products</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="csv-upload">Upload CSV File</Label>
                      <Input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="mt-2"
                      />
                    </div>
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Products
                    </Button>
                    <p className="text-sm text-gray-600">
                      Upload a CSV file with product data to bulk import products.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Products</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={handleCSVDownload} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV Template
                    </Button>
                    <p className="text-sm text-gray-600">
                      Download current product data as CSV file for editing or backup.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input id="product-name" placeholder="Enter product name" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Enter company name" />
                    </div>
                    <div>
                      <Label htmlFor="mrp">MRP</Label>
                      <Input id="mrp" type="number" placeholder="Enter MRP" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" placeholder="Enter category" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="salt">Salt/Composition</Label>
                      <Input id="salt" placeholder="Enter salt composition" />
                    </div>
                  </div>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{products.length}</div>
                <p className="text-sm text-gray-600">Products in database</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visible Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Object.values(productVisibility).filter(v => v).length}
                </div>
                <p className="text-sm text-gray-600">Visible to public</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hidden Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {Object.values(productVisibility).filter(v => !v).length}
                </div>
                <p className="text-sm text-gray-600">Hidden from public</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...new Set(products.map(p => p.company))]
                  .slice(0, 10)
                  .map(company => {
                    const count = products.filter(p => p.company === company).length;
                    const percentage = (count / products.length) * 100;
                    return (
                      <div key={company} className="flex items-center justify-between">
                        <span className="text-sm">{company}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
