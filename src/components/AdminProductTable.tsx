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
    <Card className="border-none shadow-sm">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle>Product Inventory</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Generic Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Packing</TableHead>
              <TableHead className="text-right">MRP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(checked) => onSelect(product.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.brandName}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{product.company}</span>
                    </TableCell>
                  </TableCell>
                  <TableCell>{product.packing}</TableCell>
                  <TableCell className="text-right">₹{product.mrp.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isVisible}
                        onCheckedChange={(checked) => onToggleVisibility(product.id, checked)}
                      />
                      <span className="text-sm">
                        {product.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminProductTable;