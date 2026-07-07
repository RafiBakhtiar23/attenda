import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context';
import { authAPI } from '../api/api';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const token = response.data.token;
      if (!token) {
        throw new Error("Login did not return a token.");
      }
      localStorage.setItem('token', token);
      
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data.data;
      
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      // Ensure cleanup on any login process failure
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;