import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

interface JWTPayload {
  sub: string;
  name: string;
  email?: string;
  isAnonymous: boolean;
  exp: number;
  iat: number;
}

export const authUtils = {
  // Token storage
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Token validation and decoding
  isTokenValid(token: string): boolean {
    try {
      // Try JWT decode first
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      // If JWT decode fails, try base64 decode (for our mock tokens)
      try {
        const decoded = JSON.parse(atob(token)) as JWTPayload;
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      } catch {
        return false;
      }
    }
  },

  decodeToken(token: string): JWTPayload | null {
    try {
      // Try JWT decode first
      return jwtDecode<JWTPayload>(token);
    } catch {
      // If JWT decode fails, try base64 decode (for our mock tokens)
      try {
        return JSON.parse(atob(token)) as JWTPayload;
      } catch {
        return null;
      }
    }
  },

  // User extraction from token
  getUserFromToken(token: string): User | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      id: decoded.sub,
      name: decoded.name,
      isAnonymous: decoded.isAnonymous,
    };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  },

  // Generate anonymous user data
  generateAnonymousUser(): User {
    const randomId = Math.random().toString(36).substring(2, 10);
    return {
      id: `anon_${randomId}`,
      name: `Guest ${randomId}`,
      isAnonymous: true,
    };
  },

  // Create guest token (mock JWT for anonymous users)
  createGuestToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.name,
      isAnonymous: true,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    };

    // Simple base64 encoding for guest tokens (not secure, just for demo)
    return btoa(JSON.stringify(payload));
  },

  // Create mock JWT token for registered users
  createMockToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.name,
      email: `${user.name}@example.com`, // Mock email
      isAnonymous: false,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      iat: Math.floor(Date.now() / 1000)
    };

    // Simple base64 encoding for mock tokens (not secure, just for demo)
    return btoa(JSON.stringify(payload));
  },

  // Cleanup expired tokens
  cleanupExpiredTokens(): void {
    const token = this.getToken();
    if (token && !this.isTokenValid(token)) {
      this.removeToken();
    }
  },

  // Initialize auth check on app start
  initializeAuth(): { user: User | null; token: string | null; isAuthenticated: boolean } {
    this.cleanupExpiredTokens();
    const token = this.getToken();

    if (token && this.isTokenValid(token)) {
      const user = this.getUserFromToken(token);
      return { user, token, isAuthenticated: true };
    }

    return { user: null, token: null, isAuthenticated: false };
  }
};