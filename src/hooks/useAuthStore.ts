import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: (user: User, token: string) =>
    set({ user, token, isLoading: false }),

  logout: () =>
    set({ user: null, token: null, isLoading: false }),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),
}));