
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/Cart';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSetCartItems: (items: CartItem[]) => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-600">MediCare Plus</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/products" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>
            </nav>
          </div>
          
          <Button
            variant="outline"
            onClick={onCartClick}
            className="relative flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
