import React, { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { authUtils } from '../utils/auth';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, isLoading, login, logout, setLoading } = useAuthStore();

  // Initialize authentication on app start
  useEffect(() => {
    setLoading(true);
    const authData = authUtils.initializeAuth();

    if (authData.isAuthenticated && authData.user && authData.token) {
      login(authData.user, authData.token);
    } else {
      logout();
    }

    setLoading(false);
  }, [login, logout, setLoading]);

  // Enhanced login function that stores token
  const handleLogin = (user: User, token: string) => {
    authUtils.setToken(token);
    login(user, token);
  };

  // Guest login function
  const loginAsGuest = () => {
    const guestUser = authUtils.generateAnonymousUser();
    const guestToken = authUtils.createGuestToken(guestUser);
    handleLogin(guestUser, guestToken);
  };

  // Enhanced logout function that cleans up storage
  const handleLogout = () => {
    authUtils.removeToken();
    logout();
  };

  // Derived values
  const isAuthenticated = Boolean(user && token && authUtils.isTokenValid(token));
  const isAnonymous = user?.isAnonymous ?? false;

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAnonymous,
    login: handleLogin,
    loginAsGuest,
    logout: handleLogout,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};