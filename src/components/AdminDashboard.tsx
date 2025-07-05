
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Package, Eye, EyeOff, Building, BarChart3 } from 'lucide-react';
import AdminProductTable from './AdminProductTable';
import { useAdminProducts } from '@/hooks/useAdminProducts';

interface AdminDashboardProps {
  adminName: string;
  onLogout: () => void;
}

const AdminDashboard = ({ adminName, onLogout }: AdminDashboardProps) => {
  const { products, stats, loading, toggleProductVisibility, updateProduct } = useAdminProducts();

  if (loading && !products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {adminName}</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visible Products</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.visible_products || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hidden Products</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.hidden_products || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.company_stats?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Company Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.company_stats?.slice(0, 5).map((company, index) => (
                  <div key={company.company} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{company.company}</span>
                    <span className="text-sm text-gray-600">{company.count} products</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.category_stats?.slice(0, 5).map((category, index) => (
                  <div key={category.category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.count} products</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <AdminProductTable
          products={products}
          onToggleVisibility={toggleProductVisibility}
          onUpdateProduct={updateProduct}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
