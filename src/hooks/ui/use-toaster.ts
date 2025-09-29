'use client';

import { useToastStore } from '@/stores/ui/toast-store';

/**
 * Hook to get toaster state for debugging/testing
 *
 * Provides access to the current toasts and basic control functions.
 * This is primarily useful for testing and debugging purposes.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { toasts, count, removeToast, clearAll } = useToaster();
 *
 *   return (
 *     <div>
 *       <p>Active toasts: {count}</p>
 *       <button onClick={clearAll}>Clear All</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useToaster = () => {
  const { toasts, removeToast, clearAllToasts } = useToastStore();

  return {
    toasts,
    count: toasts.length,
    removeToast,
    clearAll: clearAllToasts,
  };
};
