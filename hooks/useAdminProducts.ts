const addProduct = async (newProduct: Omit<Product, 'id' | 'visibility'>) => {
    try {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add',
                data: newProduct
            })
        });
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        
        await fetchProducts();
        toast({ title: "Product Added", description: "New product has been added successfully." });
        
        });
          })
            data: { originalId, changes }
            action: 'update',
          body: JSON.stringify({
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        const response = await fetch('/api/admin/products', {