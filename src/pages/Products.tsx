import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import OrderSuccess from '@/components/OrderSuccess';
import EnquiryForm, { EnquiryData } from '@/components/EnquiryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Filter, X } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Filters {
  categories: string[];
  companies: string[];
  priceRange: [number, number];
}

const Products = React.memo(() => {
  // State management
  const [uiState, setUiState] = useState({
    showCart: false,
    showOrderSuccess: false,
    showEnquiryForm: false,
    showFilters: false,
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Hooks
  const { toast } = useToast();
  const { products, loading, error } = useProducts();
  const { cartItems, setCartItems, clearCart } = useCartPersistence();

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    companies: [],
    priceRange: [0, 1000]
  });

  // Derived state
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = products.map(p => p.mrp);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Effects
  useEffect(() => {
    if (products.length > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [products, minPrice, maxPrice]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Memoized data
  const allCategories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const allCompanies = useMemo(() => ['All', ...new Set(products.map(p => p.company))], [products]);

  const filteredProducts = useMemo(() => {
    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const [minPrice, maxPrice] = filters.priceRange;

    // Filter products first
    const filtered = products.filter(product => {
      const matchesSearch = searchWords.length === 0 || searchWords.every(word =>
        product.brandName.toLowerCase().includes(word) ||
        product.company.toLowerCase().includes(word) ||
        product.name.toLowerCase().includes(word)
      );

      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.includes('All') ||
        filters.categories.includes(product.category);

      const matchesCompany = filters.companies.length === 0 ||
        filters.companies.includes('All') ||
        filters.companies.includes(product.company);

      const matchesPrice = product.mrp >= minPrice && product.mrp <= maxPrice;

      return matchesSearch && matchesCategory && matchesCompany && matchesPrice;
    });

    return [...filtered].sort((a, b) => a.brandName.localeCompare(b.brandName));
  }, [products, searchQuery, filters]);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Helper functions
  const toggleFilter = useCallback((type: 'categories' | 'companies', value: string, allValues: string[]) => {
    setFilters(prev => {
      if (value === 'All') {
        const newValues = prev[type].length === allValues.length - 1
          ? []
          : allValues.filter(v => v !== 'All');
        return { ...prev, [type]: newValues };
      } else {
        const newValues = prev[type].includes(value)
          ? prev[type].filter(v => v !== value)
          : [...prev[type], value];

        const allSpecificSelected = allValues
          .filter(v => v !== 'All')
          .every(v => newValues.includes(v));

        return {
          ...prev,
          [type]: allSpecificSelected
            ? [...newValues, 'All']
            : newValues.filter(v => v !== 'All')
        };
      }
    });
    setCurrentPage(1);
  }, []);

  const toggleCategory = useCallback(
    (category: string) => toggleFilter('categories', category, allCategories),
    [toggleFilter, allCategories]
  );

  const toggleCompany = useCallback(
    (company: string) => toggleFilter('companies', company, allCompanies),
    [toggleFilter, allCompanies]
  );

  const handlePriceChange = useCallback((value: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      categories: [],
      companies: [],
      priceRange: [minPrice, maxPrice]
    });
    setCurrentPage(1);
  }, [minPrice, maxPrice]);

  // Cart related functions
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    const updatedCartItems = existingItem
      ? cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cartItems, {
          id: product.id,
          name: product.brandName,
          company: product.company,
          mrp: product.mrp,
          quantity: quantity,
          image: product.image
        }];

    setCartItems(updatedCartItems);
    toast({
      title: "Added to Cart",
      description: `${product.brandName} has been added to your cart.`,
      duration: 1500,
    });
  }, [cartItems, setCartItems, toast]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  }, [cartItems, setCartItems]);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  }, [cartItems, setCartItems]);

  const placeOrder = useCallback(() => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    clearCart();
    setUiState(prev => ({ ...prev, showCart: false, showOrderSuccess: true }));
  }, [clearCart]);

  const handleEnquirySubmit = useCallback((enquiry: EnquiryData) => {
    console.log('Enquiry submitted:', enquiry);
    toast({
      title: "Enquiry Submitted",
      description: "We have received your enquiry and will contact you soon.",
    });
    setUiState(prev => ({ ...prev, showEnquiryForm: false }));
  }, [toast]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }
  }, [searchInput]);

  // UI Components
  const FilterCheckbox = ({ type, value, label, checked, onChange }: {
    type: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`${type}-${value}`}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={`${type}-${value}`}>{label}</label>
    </div>
  );

  const PriceRangeFilter = () => (
    <div>
      <h3 className="font-medium mb-2">Price Range</h3>
      <div className="space-y-3">
        <Slider
          min={minPrice}
          max={maxPrice}
          step={Math.max(1, Math.floor((maxPrice - minPrice) / 100))}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="w-full"
          minStepsBetweenThumbs={1}
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  const FiltersSidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <Card className={mobile ? "p-4 lg:hidden" : "hidden lg:block w-64 shrink-0"}>
      {mobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUiState(prev => ({ ...prev, showFilters: false }))}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!mobile && <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>}
      <CardContent className="space-y-6">
        {/* Categories Filter */}
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {['All', ...allCategories.filter(c => c !== 'All')].map(category => (
              <FilterCheckbox
                key={category}
                type={mobile ? 'mob-cat' : 'cat'}
                value={category}
                label={category}
                checked={filters.categories.includes(category) ||
                        (category === 'All' && filters.categories.length === allCategories.length - 1)}
                onChange={() => toggleCategory(category)}
              />
            ))}
          </div>
        </div>

        {/* Companies Filter */}
        <div>
          <h3 className="font-medium mb-2">Companies</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allCompanies.map(company => (
              <FilterCheckbox
                key={company}
                type={mobile ? 'mob-comp' : 'comp'}
                value={company}
                label={company}
                checked={filters.companies.includes(company) ||
                        (company === 'All' && filters.companies.length === allCompanies.length - 1)}
                onChange={() => toggleCompany(company)}
              />
            ))}
          </div>
        </div>

        <PriceRangeFilter />

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );

  const PaginationControls = () => (
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const SearchResults = () => {
    if (loading) {
      return (
        <Card className="p-8 text-center">
          <CardContent>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </CardContent>
        </Card>
      );
    }
    if (error) {
      return (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-red-500 mb-4">Error loading products: {error}</p>
            <p className="text-gray-500">Please try again later.</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <>
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="mb-4 text-4xl">📦</div>
              <p className="text-gray-500 mb-4 text-lg">No products match your filters</p>
              <p className="text-sm text-gray-400 mb-4">Try adjusting your filters</p>
              <Button
                onClick={() => setUiState(prev => ({ ...prev, showEnquiryForm: true }))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Request Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.length}
        onCartClick={() => setUiState(prev => ({ ...prev, showCart: true }))}
        onSetCartItems={setCartItems}
      />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <div className="container mx-auto">
                <div className="flex justify-center sm:justify-start">
                  <h2 className="text-lg font-semibold text-gray-800">Explore Products</h2>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <FiltersSidebar />

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:flex-1 sm:max-w-md">
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

                {/* Filter Button - Mobile */}
                <Button
                  variant="outline"
                  onClick={() => setUiState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                  className="lg:hidden flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>

                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Show:</Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="25" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {uiState.showFilters && <FiltersSidebar mobile />}
            </div>

            {/* Results count */}
            {searchQuery.trim() && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
            )}

            <section>
              <SearchResults />
            </section>
          </div>
        </div>
      </main>

      {uiState.showCart && (
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onPlaceOrder={placeOrder}
          onClose={() => setUiState(prev => ({ ...prev, showCart: false }))}
        />
      )}

      {uiState.showOrderSuccess && (
        <OrderSuccess
          orderNumber={orderNumber}
          onClose={() => setUiState(prev => ({ ...prev, showOrderSuccess: false }))}
        />
      )}

      {uiState.showEnquiryForm && (
        <EnquiryForm
          onClose={() => setUiState(prev => ({ ...prev, showEnquiryForm: false }))}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </div>
  );
});

Products.displayName = 'Products';

export default Products;