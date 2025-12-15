import { create } from 'zustand';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';

/**
 * Breadcrumb store state interface
 */
interface BreadcrumbState {
  /** Custom breadcrumbs set by a page component (null means use auto-generated) */
  customBreadcrumbs: BreadcrumbItem[] | null;

  /** Set custom breadcrumbs (overrides auto-generated) */
  setCustomBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;

  /** Clear custom breadcrumbs (reverts to auto-generated) */
  clearCustomBreadcrumbs: () => void;
}

/**
 * Global breadcrumb store for sharing custom breadcrumbs between components.
 *
 * This store solves the hook instance isolation problem where the useBreadcrumbs
 * hook in RecipeViewPage and BreadcrumbHeader have separate state. By using
 * Zustand, both components can share the same breadcrumb state.
 *
 * Usage:
 * - Pages that need custom breadcrumbs call setCustomBreadcrumbs() on mount
 * - Pages should call clearCustomBreadcrumbs() on unmount
 * - BreadcrumbHeader subscribes to the store and renders custom breadcrumbs when set
 */
export const useBreadcrumbStore = create<BreadcrumbState>(set => ({
  customBreadcrumbs: null,

  setCustomBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) =>
    set({ customBreadcrumbs: breadcrumbs }),

  clearCustomBreadcrumbs: () => set({ customBreadcrumbs: null }),
}));
