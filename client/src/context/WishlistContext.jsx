import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ products: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      setWishlist(res.data.wishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    const res = await api.post(`/wishlist/toggle/${productId}`);
    setWishlist(res.data.wishlist);
    return res.data.action; // 'added' or 'removed'
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some(
      (p) => (p._id || p) === productId
    );
  };

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
    wishlistCount: wishlist.products.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
