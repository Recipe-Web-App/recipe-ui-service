'use client';

import { useToastStore } from '@/stores/ui/toast-store';
import type { ToastOptions } from '@/types/ui/toast';

/**
 * Convenience hook for toast notifications
 *
 * Provides a simple, easy-to-use API for triggering toast notifications
 * throughout the application. Wraps the toast store methods with a clean
 * interface that's perfect for component usage.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const toast = useToast();
 *
 *   const handleSuccess = () => {
 *     toast.success('Operation completed successfully!');
 *   };
 *
 *   const handleError = () => {
 *     toast.error('Something went wrong', {
 *       action: {
 *         label: 'Retry',
 *         onClick: () => handleRetry()
 *       }
 *     });
 *   };
 *
 *   const handleCustom = () => {
 *     const id = toast.info('Processing...', { duration: 0 });
 *     // Later...
 *     toast.dismiss(id);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSuccess}>Success</button>
 *       <button onClick={handleError}>Error</button>
 *       <button onClick={handleCustom}>Custom</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useToast = () => {
  const {
    addSuccessToast,
    addErrorToast,
    addWarningToast,
    addInfoToast,
    addToast,
    removeToast,
    clearAllToasts,
    updateToast,
    isToastVisible,
    getToastById,
  } = useToastStore();

  return {
    /**
     * Show a success toast notification
     * @param message - The message to display
     * @param options - Optional configuration
     * @returns Toast ID for later reference
     */
    success: (message: string, options?: ToastOptions) => {
      return addSuccessToast(message, options);
    },

    /**
     * Show an error toast notification
     * @param message - The message to display
     * @param options - Optional configuration
     * @returns Toast ID for later reference
     */
    error: (message: string, options?: ToastOptions) => {
      return addErrorToast(message, options);
    },

    /**
     * Show a warning toast notification
     * @param message - The message to display
     * @param options - Optional configuration
     * @returns Toast ID for later reference
     */
    warning: (message: string, options?: ToastOptions) => {
      return addWarningToast(message, options);
    },

    /**
     * Show an info toast notification
     * @param message - The message to display
     * @param options - Optional configuration
     * @returns Toast ID for later reference
     */
    info: (message: string, options?: ToastOptions) => {
      return addInfoToast(message, options);
    },

    /**
     * Show a default toast notification
     * @param message - The message to display
     * @param options - Optional configuration
     * @returns Toast ID for later reference
     */
    default: (message: string, options?: ToastOptions) => {
      return addToast(message, 'info', options);
    },

    /**
     * Dismiss a specific toast by ID
     * @param id - The toast ID to dismiss
     */
    dismiss: (id: string) => {
      removeToast(id);
    },

    /**
     * Clear all active toasts
     */
    clear: () => {
      clearAllToasts();
    },

    /**
     * Update an existing toast
     * @param id - The toast ID to update
     * @param updates - Partial toast data to update
     */
    update: (id: string, updates: Parameters<typeof updateToast>[1]) => {
      updateToast(id, updates);
    },

    /**
     * Check if a toast is currently visible
     * @param id - The toast ID to check
     * @returns Whether the toast is visible
     */
    isVisible: (id: string) => {
      return isToastVisible(id);
    },

    /**
     * Get a toast by ID
     * @param id - The toast ID to get
     * @returns The toast object or undefined
     */
    getById: (id: string) => {
      return getToastById(id);
    },

    /**
     * Show a loading toast that can be updated later
     * @param message - The loading message
     * @param options - Optional configuration
     * @returns Object with toast ID and update functions
     */
    loading: (
      message: string = 'Loading...',
      options?: Omit<ToastOptions, 'duration'>
    ) => {
      const id = addInfoToast(message, { ...options, duration: 0 });

      return {
        id,
        success: (successMessage: string, successOptions?: ToastOptions) => {
          updateToast(id, {
            message: successMessage,
            type: 'success',
            duration: successOptions?.duration ?? 5000,
          });
          // Auto-dismiss after duration
          setTimeout(() => removeToast(id), successOptions?.duration ?? 5000);
        },
        error: (errorMessage: string, errorOptions?: ToastOptions) => {
          updateToast(id, {
            message: errorMessage,
            type: 'error',
            duration: errorOptions?.duration ?? 8000,
          });
          // Auto-dismiss after duration
          setTimeout(() => removeToast(id), errorOptions?.duration ?? 8000);
        },
        update: (newMessage: string, newOptions?: ToastOptions) => {
          updateToast(id, {
            message: newMessage,
            ...newOptions,
          });
        },
        dismiss: () => removeToast(id),
      };
    },

    /**
     * Show a promise-based toast that automatically updates based on promise state
     * @param promise - The promise to track
     * @param messages - Messages for different states
     * @param options - Optional configuration
     * @returns Promise that resolves with the original promise result
     */
    promise: async <T>(
      promise: Promise<T>,
      messages: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: unknown) => string);
      },
      options?: ToastOptions
    ): Promise<T> => {
      const loadingToast = addInfoToast(messages.loading ?? 'Loading...', {
        ...options,
        duration: 0,
      });

      try {
        const result = await promise;

        const successMessage =
          typeof messages.success === 'function'
            ? messages.success(result)
            : (messages.success ?? 'Success!');

        updateToast(loadingToast, {
          message: successMessage,
          type: 'success',
          duration: options?.duration ?? 5000,
        });

        // Auto-dismiss after duration
        setTimeout(() => removeToast(loadingToast), options?.duration ?? 5000);

        return result;
      } catch (error) {
        const errorMessage =
          typeof messages.error === 'function'
            ? messages.error(error)
            : (messages.error ?? 'Something went wrong');

        updateToast(loadingToast, {
          message: errorMessage,
          type: 'error',
          duration: options?.duration ?? 8000,
        });

        // Auto-dismiss after duration
        setTimeout(() => removeToast(loadingToast), options?.duration ?? 8000);

        throw error;
      }
    },
  };
};

/**
 * Type for the toast function returned by useToast
 */
export type ToastFunction = ReturnType<typeof useToast>;
