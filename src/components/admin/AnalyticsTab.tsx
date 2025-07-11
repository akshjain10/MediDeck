// components/admin/AnalyticsTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatCard from './StatCard';
import { Activity, BarChart3, Package } from 'lucide-react';

const AnalyticsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Views"
        value="12,345"
        icon={<Activity className="h-5 w-5" />}
      />
      <StatCard
        title="Conversion Rate"
        value="23.5%"
        icon={<BarChart3 className="h-5 w-5" />}
      />
      <StatCard
        title="Top Product"
        value="Paracetamol"
        icon={<Package className="h-5 w-5" />}
      />
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center">
        <div className="text-gray-400">Sales chart visualization</div>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsTab;