
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Save, X } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface AdminProductTableProps {
  products: (Product & { isVisible?: boolean })[];
  onToggleVisibility: (productId: string, isVisible: boolean) => void;
  onUpdateProduct: (productId: string, updates: any) => void;
}

const AdminProductTable = ({ products, onToggleVisibility, onUpdateProduct }: AdminProductTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const filteredProducts = products.filter(product =>
    product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product: Product & { isVisible?: boolean }) => {
    setEditingProduct(product.id);
    setEditData({
      Name: product.brandName,
      Salt: product.name,
      Company: product.company,
      Packing: product.packing,
      MRP: product.mrp,
      Category: product.category
    });
  };

  const handleSave = async (productId: string) => {
    await onUpdateProduct(productId, editData);
    setEditingProduct(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setEditData({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Brand Name</th>
                <th className="text-left p-2">Salt/Name</th>
                <th className="text-left p-2">Company</th>
                <th className="text-left p-2">Packing</th>
                <th className="text-left p-2">MRP</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Visible</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        value={editData.Name || ''}
                        onChange={(e) => setEditData({ ...editData, Name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.brandName
                    )}
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        value={editData.Salt || ''}
                        onChange={(e) => setEditData({ ...editData, Salt: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        value={editData.Company || ''}
                        onChange={(e) => setEditData({ ...editData, Company: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.company
                    )}
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        value={editData.Packing || ''}
                        onChange={(e) => setEditData({ ...editData, Packing: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.packing
                    )}
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        type="number"
                        value={editData.MRP || ''}
                        onChange={(e) => setEditData({ ...editData, MRP: parseFloat(e.target.value) || 0 })}
                        className="w-full"
                      />
                    ) : (
                      `₹${product.mrp}`
                    )}
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <Input
                        value={editData.Category || ''}
                        onChange={(e) => setEditData({ ...editData, Category: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                  </td>
                  <td className="p-2">
                    <Switch
                      checked={product.isVisible ?? true}
                      onCheckedChange={() => onToggleVisibility(product.id, product.isVisible ?? true)}
                      disabled={editingProduct === product.id}
                    />
                  </td>
                  <td className="p-2">
                    {editingProduct === product.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleSave(product.id)}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProductTable;
