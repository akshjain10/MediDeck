
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessProps {
  orderNumber: string;
  onClose: () => void;
}

const OrderSuccess = ({ orderNumber, onClose }: OrderSuccessProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your order has been placed successfully. 
          </p>
          <p className="text-sm text-gray-500">
            We will contact you soon to confirm your order details.
          </p>
          <Button onClick={onClose} className="w-full">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
