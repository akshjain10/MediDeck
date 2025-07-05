
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Filter } from 'lucide-react';
import { Product } from '@/hooks/useAdminProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelect: (productId: string, isSelected: boolean) => void;
  onToggleVisibility: (productId: string, isVisible: boolean) => void;
  onEdit: (product: Product) => void;
}

const AdminProductTable = ({
  products,
  selectedIds,
  onSelect,
  onToggleVisibility,
  onEdit
}: AdminProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState<'all' | 'visible' | 'hidden'>('all');

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVisibility =
        filterVisible === 'all' ||
        (filterVisible === 'visible' && product.isVisible) ||
        (filterVisible === 'hidden' && !product.isVisible);

      return matchesSearch && matchesVisibility;
    });
  }, [products, searchTerm, filterVisible]);

  const isAllSelected = useMemo(() => {
    if (filteredProducts.length === 0) return false;
    return filteredProducts.every(p => selectedIds.includes(p.id));
  }, [filteredProducts, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    filteredProducts.forEach(product => onSelect(product.id, checked));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Product Inventory</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px] px-6 py-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold">Brand Name</TableHead>
              <TableHead className="px-6 py-4 font-semibold">Generic Name</TableHead>
              <TableHead className="px-6 py-4 font-semibold">Company</TableHead>
              <TableHead className="px-6 py-4 font-semibold">Packing</TableHead>
              <TableHead className="text-right px-6 py-4 font-semibold">MRP</TableHead>
              <TableHead className="px-6 py-4 font-semibold">Status</TableHead>
              <TableHead className="w-[100px] px-6 py-4 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-400" />
                    <p>No products found</p>
                    {searchTerm && (
                      <p className="text-sm">Try adjusting your search terms</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <TableCell className="px-6 py-4">
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(checked) => onSelect(product.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium px-6 py-4">
                    {product.brandName || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {product.name || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium">{product.company || 'N/A'}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {product.packing || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4 font-medium">
                    ₹{product.mrp ? product.mrp.toFixed(2) : '0.00'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={product.isVisible}
                        onCheckedChange={() => onToggleVisibility(product.id, product.isVisible)}
                      />
                      <Badge 
                        variant={product.isVisible ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 px-2">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          {selectedIds.length > 0 && (
            <span className="font-medium">
              {selectedIds.length} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProductTable;
