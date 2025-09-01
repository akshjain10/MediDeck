import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

  const fetchProducts = useCallback(async () => {
    const cacheKey = 'products';
    const cached = cache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.data);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setProducts(result.data);
      
      // Cache the results
      cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now()
      });