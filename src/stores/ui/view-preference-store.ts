import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * View mode type - grid or list view
 */
export type ViewMode = 'grid' | 'list';

/**
 * View Preference Store State
 *
 * Manages the user's preferred view mode (grid or list) for browse pages.
 * This preference is persisted to localStorage and shared across the application.
 */
interface ViewPreferenceState {
  /** Current view mode (grid or list) */
  viewMode: ViewMode;

  /** Set the view mode */
  setViewMode: (mode: ViewMode) => void;

  /** Toggle between grid and list views */
  toggleViewMode: () => void;

  /** Reset to default view mode (grid) */
  resetViewMode: () => void;
}

/**
 * Default view mode
 */
const DEFAULT_VIEW_MODE: ViewMode = 'grid';

/**
 * View Preference Store
 *
 * A lightweight Zustand store for managing view mode preferences with
 * automatic localStorage persistence.
 *
 * @example
 * ```tsx
 * // Get and set view mode
 * const viewMode = useViewPreferenceStore(state => state.viewMode);
 * const setViewMode = useViewPreferenceStore(state => state.setViewMode);
 *
 * // Toggle between modes
 * const toggleViewMode = useViewPreferenceStore(state => state.toggleViewMode);
 * ```
 */
export const useViewPreferenceStore = create<ViewPreferenceState>()(
  persist(
    set => ({
      // Initial state
      viewMode: DEFAULT_VIEW_MODE,

      // Actions
      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
      },

      toggleViewMode: () => {
        set(state => ({
          viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
        }));
      },

      resetViewMode: () => {
        set({ viewMode: DEFAULT_VIEW_MODE });
      },
    }),
    {
      name: 'view-preference-storage',
      partialize: state => ({
        viewMode: state.viewMode,
      }),
    }
  )
);

/**
 * Hook to get just the view mode value
 *
 * @example
 * ```tsx
 * const viewMode = useViewMode();
 * ```
 */
export const useViewMode = () =>
  useViewPreferenceStore(state => state.viewMode);

/**
 * Hook to get the view mode setter
 *
 * @example
 * ```tsx
 * const setViewMode = useSetViewMode();
 * setViewMode('list');
 * ```
 */
export const useSetViewMode = () =>
  useViewPreferenceStore(state => state.setViewMode);

/**
 * Hook to get the view mode toggle function
 *
 * @example
 * ```tsx
 * const toggleViewMode = useToggleViewMode();
 * toggleViewMode();
 * ```
 */
export const useToggleViewMode = () =>
  useViewPreferenceStore(state => state.toggleViewMode);
