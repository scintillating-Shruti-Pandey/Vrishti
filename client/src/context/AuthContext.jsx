import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('vrishti_token');
    const savedUser = localStorage.getItem('vrishti_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        api.get('/auth/me').then((res) => {
          setUser(res.data.user);
          localStorage.setItem('vrishti_user', JSON.stringify(res.data.user));
        }).catch(() => {
          logout();
        });
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('vrishti_token', token);
    localStorage.setItem('vrishti_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, adminKey = '') => {
    const res = await api.post('/auth/register', { name, email, password, adminKey });
    const { token, user: userData } = res.data;
    localStorage.setItem('vrishti_token', token);
    localStorage.setItem('vrishti_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('vrishti_token');
    localStorage.removeItem('vrishti_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    localStorage.setItem(
      'vrishti_user',
      JSON.stringify({ ...user, ...updatedData })
    );
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
