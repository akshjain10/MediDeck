import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Search, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select';

interface Product {
  id: string;
  Name: string;
  Salt: string;
  Company: string;
  Packing: string;
  MRP: number;
  visibility: boolean;
}

interface Props {
  products: Product[];
  onToggleVisibility: (id: string, value: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (ids: string[]) => void;
  updateProduct: (product: Product) => void;
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
}

const AdminProductTable: React.FC<Props> = ({
  products,
  onToggleVisibility,
  onEdit,
  onDelete,
  updateProduct,
  selectedIds,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Product>('Name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      `${p.Name} ${p.Salt} ${p.Company}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredProducts, sortKey, sortDir]);

  const pageCount = Math.ceil(sortedProducts.length / perPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedProducts.slice(start, start + perPage);
  }, [sortedProducts, currentPage, perPage]);

  const isAllSelected = paginatedProducts.every((p) => selectedIds.includes(p.id)) && paginatedProducts.length > 0;

  const toggleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    const ids = paginatedProducts.map(p => p.id);
    if (checked) {
      const newSelected = Array.from(new Set([...selectedIds, ...ids]));
      ids.forEach(id => onSelect(id, true));
    } else {
      ids.forEach(id => onSelect(id, false));
    }
  };

  const handleBulkVisibility = (value: boolean) => {
    selectedIds.forEach(id => onToggleVisibility(id, value));
  };

  const handleBulkDelete = () => {
    onDelete(selectedIds);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <CardTitle>Product Inventory</CardTitle>
          <div className="flex gap-2 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleBulkVisibility(true)}><Eye className="w-4 h-4 mr-1" /> Show</Button>
            <Button onClick={() => handleBulkVisibility(false)} variant="outline"><EyeOff className="w-4 h-4 mr-1" /> Hide</Button>
            <Button onClick={handleBulkDelete} variant="destructive"><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                />
              </TableHead>
              {['Name', 'Salt', 'Company', 'Packing', 'MRP'].map((key) => (
                <TableHead key={key} onClick={() => toggleSort(key as keyof Product)} className="cursor-pointer">
                  {key} {sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </TableHead>
              ))}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(checked) => onSelect(product.id, !!checked)}
                  />
                </TableCell>
                <TableCell>{product.Name}</TableCell>
                <TableCell>{product.Salt}</TableCell>
                <TableCell>{product.Company}</TableCell>
                <TableCell>{product.Packing}</TableCell>
                <TableCell>₹{Number(product.MRP ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.visibility}
                      onCheckedChange={(checked) => onToggleVisibility(product.id, checked)}
                    />
                    <span className="text-sm">
                      {product.visibility ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * perPage + 1, sortedProducts.length)} to {Math.min(currentPage * perPage, sortedProducts.length)} of {sortedProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} size="sm">
              Previous
            </Button>

            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter((page) => {
                if (page === 1 || page === pageCount) return true;
                if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                return false;
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {(index > 0 && page !== array[index - 1] + 1) && <span className="px-1">...</span>}
                  <Button
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    size="sm"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}

            <Button disabled={currentPage === pageCount} onClick={() => setCurrentPage(currentPage + 1)} size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProductTable;
