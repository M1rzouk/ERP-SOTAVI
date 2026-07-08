import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); // ⬅️ réservé au premier chargement
  const [authLoading, setAuthLoading] = useState(false);     // ⬅️ pour les appels async (login/logout)
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (matricule, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const userData = await authService.login(matricule, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      initialLoading,
      authLoading,
      error,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission: (perm) => user?.permissions?.includes(perm) || false,
      hasRole: (role) => user?.roles?.includes(role) || false,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};