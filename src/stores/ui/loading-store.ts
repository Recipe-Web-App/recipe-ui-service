import { create } from 'zustand';
import type { LoadingState } from '@/types/ui/loading';

interface LoadingStoreState extends LoadingState {
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setOperationLoading: (operation: string, loading: boolean) => void;
  clearAllLoading: () => void;
  clearOperationLoading: (operation: string) => void;

  // Utility methods
  isAnyLoading: () => boolean;
  isOperationLoading: (operation: string) => boolean;
  getLoadingOperations: () => string[];
  getLoadingCount: () => number;
}

export const useLoadingStore = create<LoadingStoreState>((set, get) => ({
  globalLoading: false,
  operationLoading: {},
  loadingMessage: null,

  setGlobalLoading: (loading: boolean, message?: string) => {
    set({
      globalLoading: loading,
      loadingMessage: loading ? (message ?? null) : null,
    });
  },

  setOperationLoading: (operation: string, loading: boolean) => {
    set(state => {
      const newOperationLoading = { ...state.operationLoading };

      if (loading) {
        // eslint-disable-next-line security/detect-object-injection
        newOperationLoading[operation] = true;
      } else {
        // eslint-disable-next-line security/detect-object-injection
        delete newOperationLoading[operation];
      }

      return {
        operationLoading: newOperationLoading,
      };
    });
  },

  clearAllLoading: () => {
    set({
      globalLoading: false,
      operationLoading: {},
      loadingMessage: null,
    });
  },

  clearOperationLoading: (operation: string) => {
    set(state => {
      const newOperationLoading = { ...state.operationLoading };
      // eslint-disable-next-line security/detect-object-injection
      delete newOperationLoading[operation];

      return {
        operationLoading: newOperationLoading,
      };
    });
  },

  isAnyLoading: () => {
    const state = get();
    return (
      state.globalLoading || Object.keys(state.operationLoading).length > 0
    );
  },

  isOperationLoading: (operation: string) => {
    // eslint-disable-next-line security/detect-object-injection
    return Boolean(get().operationLoading[operation]);
  },

  getLoadingOperations: () => {
    return Object.keys(get().operationLoading);
  },

  getLoadingCount: () => {
    const state = get();
    return (
      Object.keys(state.operationLoading).length + (state.globalLoading ? 1 : 0)
    );
  },
}));
