import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message: string, type: 'success' | 'error' | 'info' = 'success', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showSuccess: (message: string, duration?: number) => {
    const store = useToast.getState();
    store.addToast(message, 'success', duration);
  },

  showError: (message: string, duration?: number) => {
    const store = useToast.getState();
    store.addToast(message, 'error', duration);
  },

  showInfo: (message: string, duration?: number) => {
    const store = useToast.getState();
    store.addToast(message, 'info', duration);
  },
}));