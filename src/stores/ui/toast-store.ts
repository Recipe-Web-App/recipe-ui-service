import { create } from 'zustand';
import type { Toast, ToastType, ToastOptions } from '@/types/ui/toast';

interface ToastState {
  toasts: Toast[];
  maxToasts: number;
  defaultDuration: number;

  // Actions
  addToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;

  // Convenience methods
  addSuccessToast: (message: string, options?: ToastOptions) => string;
  addErrorToast: (message: string, options?: ToastOptions) => string;
  addWarningToast: (message: string, options?: ToastOptions) => string;
  addInfoToast: (message: string, options?: ToastOptions) => string;

  // Utility methods
  isToastVisible: (id: string) => boolean;
  getToastById: (id: string) => Toast | undefined;
}

const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  maxToasts: 5,
  defaultDuration: 5000,

  addToast: (message: string, type: ToastType, options?: ToastOptions) => {
    const id = generateToastId();
    const duration = options?.duration ?? get().defaultDuration;

    const toast: Toast = {
      id,
      message,
      type,
      duration,
      dismissible: options?.dismissible ?? true,
      action: options?.action,
      createdAt: Date.now(),
    };

    set(state => {
      let newToasts = [...state.toasts, toast];

      // Enforce max toasts limit (FIFO)
      if (newToasts.length > state.maxToasts) {
        newToasts = newToasts.slice(-state.maxToasts);
      }

      return { toasts: newToasts };
    });

    // Auto-dismiss after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  updateToast: (id: string, updates: Partial<Toast>) => {
    set(state => ({
      toasts: state.toasts.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      ),
    }));
  },

  addSuccessToast: (message: string, options?: ToastOptions) => {
    return get().addToast(message, 'success', options);
  },

  addErrorToast: (message: string, options?: ToastOptions) => {
    return get().addToast(message, 'error', {
      ...options,
      duration: options?.duration ?? 8000, // Longer duration for errors
    });
  },

  addWarningToast: (message: string, options?: ToastOptions) => {
    return get().addToast(message, 'warning', {
      ...options,
      duration: options?.duration ?? 6000, // Slightly longer for warnings
    });
  },

  addInfoToast: (message: string, options?: ToastOptions) => {
    return get().addToast(message, 'info', options);
  },

  isToastVisible: (id: string) => {
    return get().toasts.some(toast => toast.id === id);
  },

  getToastById: (id: string) => {
    return get().toasts.find(toast => toast.id === id);
  },
}));
