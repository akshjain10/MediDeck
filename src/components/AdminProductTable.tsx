import React, { useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Search, Edit, Eye, EyeOff, Trash2, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Product {
    id: string;
    Name: string;
    Salt: string;
    Company: string;
    Packing: string;
    MRP: number;
    Category?: string;
    visibility: boolean;
    newArrivals: boolean;
}

interface Props {
    products: Product[];
    pendingChanges: Record<string, boolean>;
    onToggleNewArrivals: (id: string, value: boolean) => void;
    onToggleVisibility: (id: string, value: boolean) => void;
    onEdit: (product: Product) => void;
    onDelete: (ids: string[]) => void;
    selectedIds: string[];
    onSelect: (id: string, checked: boolean) => void;
    onExport: () => void;
    onImport: (file: File) => Promise<void>;
}

const AdminProductTable: React.FC<Props> = ({
    products,
    pendingChanges,
    onToggleNewArrivals,
    onToggleVisibility,
    onEdit,
    onDelete,
    selectedIds,
    onSelect,
    onExport,
    onImport
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortKey, setSortKey] = React.useState<keyof Product>('Name');
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(25);
    const [importFile, setImportFile] = React.useState<File | null>(null);
    const { toast } = useToast();

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            `${p.Name} ${p.Salt} ${p.Company} ${p.Packing}`.toLowerCase().includes(searchTerm.toLowerCase())
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

    const isAllSelected = paginatedProducts.length > 0 &&
                         paginatedProducts.every(p => selectedIds.includes(p.id));

    const toggleSort = (key: keyof Product) => {
        if (sortKey === key) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            const newSelectedIds = paginatedProducts.map(p => p.id);
            newSelectedIds.forEach(id => {
                if (!selectedIds.includes(id)) {
                    onSelect(id, true);
                }
            });
        } else {
            paginatedProducts.forEach(p => {
                if (selectedIds.includes(p.id)) {
                    onSelect(p.id, false);
                }
            });
        }
    };

    const handleBulkVisibility = (value: boolean) => {
        selectedIds.forEach(id => onToggleVisibility(id, value));
    };

    const handleBulkDelete = () => {
        onDelete(selectedIds);
    };

    const handleImport = async () => {
        if (!importFile) {
            toast({
                title: "Error",
                description: "Please select a file first",
                variant: "destructive"
            });
            return;
        }
        try {
            await onImport(importFile);
            setImportFile(null);
        } catch (error) {
            toast({
                title: "Import Failed",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <CardTitle>Product Inventory</CardTitle>
                    <div className="flex gap-2 items-center">
                        <div className="relative md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={String(perPage)}
                            onValueChange={(v) => {
                                setPerPage(Number(v));
                                setCurrentPage(1);
                            }}
                        >
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

                <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                    {selectedIds.length > 0 && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleBulkVisibility(true)}
                                className="gap-1"
                            >
                                <Eye className="w-4 h-4" /> Show
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkVisibility(false)}
                                className="gap-1"
                            >
                                <EyeOff className="w-4 h-4" /> Hide
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                className="gap-1"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                            <span className="ml-2 text-sm text-muted-foreground self-center">
                                {selectedIds.length} selected
                            </span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onExport}
                            className="gap-1"
                        >
                            <Download className="w-4 h-4" /> Export
                        </Button>
                        <div className="flex gap-2">
                            <Input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                className="w-full min-w-[300px] text-right"
                            />
                            <Button
                                variant="outline"
                                onClick={handleImport}
                                className="gap-1"
                                disabled={!importFile}
                            >
                                <Upload className="w-4 h-4" /> Import
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            {['Name', 'Salt', 'Company', 'Packing', 'MRP'].map((key) => (
                                <TableHead
                                    key={key}
                                    onClick={() => toggleSort(key as keyof Product)}
                                    className="cursor-pointer hover:bg-accent"
                                >
                                    <div className="flex items-center">
                                        {key}
                                        {sortKey === key && (
                                            <span className="ml-1">
                                                {sortDir === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead>Status</TableHead>
                            <TableHead>New Arrival</TableHead>
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
                                <TableCell>₹{product.MRP?.toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={product.visibility}
                                      onCheckedChange={(checked) => onToggleVisibility(product.id, checked)}
                                      className={`data-[state=checked]:bg-green-500 ${
                                        product.id in pendingChanges ? 'ring-2 ring-yellow-400' : ''
                                      }`}
                                    />
                                    <span className={`text-sm font-medium ${
                                      product.visibility ? 'text-green-600' : 'text-gray-500'
                                    } ${
                                      product.id in pendingChanges ? 'font-bold' : ''
                                    }`}>
                                      {product.visibility ? (
                                        <span className="flex items-center gap-1">
                                          <Eye className="h-4 w-4" /> Visible
                                          {product.id in pendingChanges && ' (Pending)'}
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <EyeOff className="h-4 w-4" /> Hidden
                                          {product.id in pendingChanges && ' (Pending)'}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={product.newArrivals}
                                                        onCheckedChange={(checked) => onToggleNewArrivals(product.id, checked)}
                                                        className={`data-[state=checked]:bg-blue-500 ${
                                                            product.id in pendingChanges ? 'ring-2 ring-yellow-400' : ''
                                                        }`}
                                                    />
                                                    <span className={`text-sm font-medium ${
                                                        product.newArrivals ? 'text-blue-600' : 'text-gray-500'
                                                    } ${
                                                        product.id in pendingChanges ? 'font-bold' : ''
                                                    }`}>
                                                        {product.newArrivals ? 'New' : 'Regular'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                <TableCell>
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
                        ))}
                    </TableBody>
                </Table>

                {pageCount > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * perPage + 1, sortedProducts.length)} to{' '}
                            {Math.min(currentPage * perPage, sortedProducts.length)} of {sortedProducts.length} products
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                size="sm"
                            >
                                Previous
                            </Button>

                            {Array.from({ length: pageCount }, (_, i) => i + 1)
                                .filter((page) => {
                                    if (page === 1 || page === pageCount) return true;
                                    if (Math.abs(page - currentPage) <= 2) return true;
                                    return false;
                                })
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && page - array[index - 1] > 1 && (
                                            <span className="px-2">...</span>
                                        )}
                                        <Button
                                            variant={page === currentPage ? 'default' : 'outline'}
                                            onClick={() => setCurrentPage(page)}
                                            size="sm"
                                        >
                                            {page}
                                        </Button>
                                    </React.Fragment>
                                ))}

                            <Button
                                variant="outline"
                                disabled={currentPage === pageCount}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AdminProductTable;