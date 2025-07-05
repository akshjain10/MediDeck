
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  admin_id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  admin_id?: string;
  name?: string;
  email?: string;
  message?: string;
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const adminData = localStorage.getItem('admin_user');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('authenticate_admin', {
        admin_email: email,
        admin_password: password
      });

      if (error) {
        throw error;
      }

      const response = data as unknown as AuthResponse;

      if (response.success) {
        const adminUser = {
          admin_id: response.admin_id!,
          name: response.name!,
          email: response.email!
        };
        setAdmin(adminUser);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        toast({
          title: "Login Successful",
          description: `Welcome, ${response.name}!`,
        });
        return { success: true };
      } else {
        toast({
          title: "Login Failed",
          description: response.message || 'Invalid credentials',
          variant: "destructive",
        });
        return { success: false, error: response.message };
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return { admin, login, logout, loading };
};
