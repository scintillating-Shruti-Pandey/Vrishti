import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity, selectedSize, selectedColor) => {
    const res = await api.post('/cart/add', {
      productId,
      quantity,
      selectedSize,
      selectedColor,
    });
    setCart(res.data.cart);
    return res.data.cart;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await api.put(`/cart/update/${itemId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeFromCart = async (itemId) => {
    const res = await api.delete(`/cart/remove/${itemId}`);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [] });
  };

  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
