
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DynamicOrderList from '@/components/DynamicOrderList';

const Order = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Create Order</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Add products to your order by searching and selecting items below. 
            You can adjust quantities and manage your order before submitting.
          </p>
          <DynamicOrderList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;
