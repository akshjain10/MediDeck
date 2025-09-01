const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        setAdmin(result.admin);
        localStorage.setItem('admin_user', JSON.stringify(result.admin));
        toast({
          title: "Login Successful",
          description: `Welcome, ${result.admin.name}!`,
        });
        return { success: true };
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      toast({