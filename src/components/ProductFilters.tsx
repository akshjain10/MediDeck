
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Filter } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface FilterOptions {
  companies: string[];
  categories: string[];
  salts: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface ActiveFilters {
  companies: string[];
  categories: string[];
  salts: string[];
  priceMin: number;
  priceMax: number;
  searchTerm: string;
}

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filteredProducts: Product[]) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    companies: [],
    categories: [],
    salts: [],
    priceRange: { min: 0, max: 1000 }
  });
  
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    companies: [],
    categories: [],
    salts: [],
    priceMin: 0,
    priceMax: 1000,
    searchTerm: ''
  });

  // Extract filter options from products
  useEffect(() => {
    const companies = [...new Set(products.map(p => p.company).filter(Boolean))].sort();
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    const salts = [...new Set(products.map(p => p.salt).filter(Boolean))].sort();
    const prices = products.map(p => p.mrp).filter(p => p > 0);
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;

    setFilterOptions({
      companies,
      categories,
      salts,
      priceRange: { min: minPrice, max: maxPrice }
    });

    setActiveFilters(prev => ({
      ...prev,
      priceMin: minPrice,
      priceMax: maxPrice
    }));
  }, [products]);

  // Apply filters whenever activeFilters change
  useEffect(() => {
    let filtered = products;

    // Search term filter
    if (activeFilters.searchTerm.trim()) {
      const searchTerm = activeFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.brandName.toLowerCase().includes(searchTerm) ||
        product.company.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        (product.salt && product.salt.toLowerCase().includes(searchTerm))
      );
    }

    // Company filter
    if (activeFilters.companies.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.companies.includes(product.company)
      );
    }

    // Category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && activeFilters.categories.includes(product.category)
      );
    }

    // Salt filter
    if (activeFilters.salts.length > 0) {
      filtered = filtered.filter(product => 
        product.salt && activeFilters.salts.includes(product.salt)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.mrp >= activeFilters.priceMin && product.mrp <= activeFilters.priceMax
    );

    onFiltersChange(filtered);
  }, [activeFilters, products, onFiltersChange]);

  const handleCompanyFilter = (company: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      companies: checked
        ? [...prev.companies, company]
        : prev.companies.filter(c => c !== company)
    }));
  };

  const handleCategoryFilter = (category: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleSaltFilter = (salt: string, checked: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      salts: checked
        ? [...prev.salts, salt]
        : prev.salts.filter(s => s !== salt)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      companies: [],
      categories: [],
      salts: [],
      priceMin: filterOptions.priceRange.min,
      priceMax: filterOptions.priceRange.max,
      searchTerm: ''
    });
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'company':
        handleCompanyFilter(value, false);
        break;
      case 'category':
        handleCategoryFilter(value, false);
        break;
      case 'salt':
        handleSaltFilter(value, false);
        break;
    }
  };

  const activeFilterCount = 
    activeFilters.companies.length + 
    activeFilters.categories.length + 
    activeFilters.salts.length +
    (activeFilters.searchTerm.trim() ? 1 : 0) +
    (activeFilters.priceMin !== filterOptions.priceRange.min || 
     activeFilters.priceMax !== filterOptions.priceRange.max ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.searchTerm.trim() && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: {activeFilters.searchTerm}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setActiveFilters(prev => ({ ...prev, searchTerm: '' }))}
              />
            </Badge>
          )}
          
          {activeFilters.companies.map(company => (
            <Badge key={company} variant="secondary" className="flex items-center space-x-1">
              <span>{company}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('company', company)}
              />
            </Badge>
          ))}
          
          {activeFilters.categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center space-x-1">
              <span>{category}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('category', category)}
              />
            </Badge>
          ))}
          
          {activeFilters.salts.map(salt => (
            <Badge key={salt} variant="secondary" className="flex items-center space-x-1">
              <span>{salt}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('salt', salt)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {isExpanded && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Search Filter */}
            <div>
              <Label className="text-sm font-medium">Search</Label>
              <Input
                placeholder="Search products, companies, salts..."
                value={activeFilters.searchTerm}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="mt-2"
              />
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div>
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={activeFilters.priceMin}
                  onChange={(e) => setActiveFilters(prev => ({ 
                    ...prev, 
                    priceMin: parseInt(e.target.value) || 0 
                  }))}
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={activeFilters.priceMax}
                  onChange={(e) => setActiveFilters(prev => ({ 
                    ...prev, 
                    priceMax: parseInt(e.target.value) || 1000 
                  }))}
                  className="w-24"
                />
              </div>
            </div>

            <Separator />

            {/* Company Filter */}
            <div>
              <Label className="text-sm font-medium">Company</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.companies.map(company => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={activeFilters.companies.includes(company)}
                      onCheckedChange={(checked) => handleCompanyFilter(company, !!checked)}
                    />
                    <Label htmlFor={`company-${company}`} className="text-sm">
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={activeFilters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryFilter(category, !!checked)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Salt Filter */}
            <div>
              <Label className="text-sm font-medium">Salt/Composition</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.salts.slice(0, 10).map(salt => (
                  <div key={salt} className="flex items-center space-x-2">
                    <Checkbox
                      id={`salt-${salt}`}
                      checked={activeFilters.salts.includes(salt)}
                      onCheckedChange={(checked) => handleSaltFilter(salt, !!checked)}
                    />
                    <Label htmlFor={`salt-${salt}`} className="text-sm">
                      {salt}
                    </Label>
                  </div>
                ))}
                {filterOptions.salts.length > 10 && (
                  <p className="text-xs text-gray-500">
                    And {filterOptions.salts.length - 10} more...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductFilters;
