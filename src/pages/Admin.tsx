import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const { admin, login, logout, loading } = useAdminAuth();

  if (!admin) {
    return <AdminLogin onLogin={login} loading={loading} />;
  }

  return <AdminDashboard adminName={admin.name} onLogout={logout} />;
};

export default Admin;