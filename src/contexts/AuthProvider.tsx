import React, { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { authUtils } from '../utils/auth';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, isLoading, login, logout, setLoading } = useAuthStore();
  const tokenCheckInterval = useRef<number | null>(null);

  // Enhanced logout function that cleans up storage
  const handleLogout = useCallback(() => {
    authUtils.removeToken();
    logout();
  }, [logout]);

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

  // Monitor token expiration
  useEffect(() => {
    // Clear any existing interval
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    // Only start monitoring if user is authenticated
    if (user && token) {
      tokenCheckInterval.current = window.setInterval(() => {
        const currentToken = authUtils.getToken();

        if (!currentToken || !authUtils.isTokenValid(currentToken)) {
          console.warn('Token expired or invalid, logging out user');
          handleLogout();
        }
      }, 60000); // Check every minute
    }

    // Cleanup on unmount or when user/token changes
    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
        tokenCheckInterval.current = null;
      }
    };
  }, [user, token, handleLogout]); // Re-run when user or token changes

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