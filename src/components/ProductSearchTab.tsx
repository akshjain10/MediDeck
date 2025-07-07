
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { useProducts} from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const ProductSearchTab = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error } = useProducts();
  const { toast } = useToast();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Handle enter key press for immediate search
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
    }
  }, [searchInput]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.brandName.toLowerCase().includes(query) ||
      product.company.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      (product.salt && product.salt.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          
          {searchQuery.trim() && filteredProducts.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">Error loading products: {error}</p>
            <p className="text-gray-500">Please try again later.</p>
          </CardContent>
        </Card>
      ) : !searchQuery.trim() ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="text-gray-500 mb-4 text-lg">Start searching to discover products</p>
            <p className="text-sm text-gray-400">Type in the search box above to find medicines and healthcare products</p>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">📦</div>
            <p className="text-gray-500 mb-4 text-lg">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Salt</TableHead>
                  <TableHead>MRP</TableHead>
                  {/* <TableHead>Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.brandName}</div>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.company}</TableCell>
                    <TableCell>{product.salt || '-'}</TableCell>
                    <TableCell className="font-semibold">₹{product.mrp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default ProductSearchTab;
