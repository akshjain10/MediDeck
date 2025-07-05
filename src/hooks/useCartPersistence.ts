
import { useState, useEffect } from 'react';
import { CartItem } from '@/components/Cart';

const CART_STORAGE_KEY = 'arihant_cart_items';

export const useCartPersistence = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(parsedItems);
      } catch (error) {
        console.error('Error loading cart items from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems]);

  const updateCartItems = (items: CartItem[]) => {
    setCartItems(items);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return {
    cartItems,
    setCartItems: updateCartItems,
    clearCart
  };
};
