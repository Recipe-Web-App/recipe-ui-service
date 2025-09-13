import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigationState, Breadcrumb } from '@/types/ui/navigation';

interface NavigationStoreState extends NavigationState {
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addToBreadcrumbs: (crumb: Breadcrumb) => void;
  removeBreadcrumb: (id: string) => void;
  setCurrentPage: (page: string) => void;
  addToHistory: (page: string) => void;
  clearHistory: () => void;

  // Utility methods
  getBreadcrumbIndex: (id: string) => number;
  canGoBack: () => boolean;
  getLastPage: () => string | null;
  getPreviousPage: () => string | null;
}

const MAX_HISTORY_SIZE = 50;

export const useNavigationStore = create<NavigationStoreState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true, // Default to open on desktop
      mobileMenuOpen: false,
      breadcrumbs: [],
      currentPage: '/',
      navigationHistory: [],

      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleMobileMenu: () => {
        set(state => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
        set({ breadcrumbs });
      },

      addToBreadcrumbs: (crumb: Breadcrumb) => {
        set(state => ({
          breadcrumbs: [...state.breadcrumbs, crumb],
        }));
      },

      removeBreadcrumb: (id: string) => {
        set(state => ({
          breadcrumbs: state.breadcrumbs.filter(crumb => crumb.id !== id),
        }));
      },

      setCurrentPage: (page: string) => {
        const currentPage = get().currentPage;

        set({ currentPage: page });

        // Add previous page to history if it's different
        if (currentPage && currentPage !== page) {
          get().addToHistory(currentPage);
        }

        // Auto-close mobile menu when navigating
        if (get().mobileMenuOpen) {
          get().setMobileMenuOpen(false);
        }
      },

      addToHistory: (page: string) => {
        set(state => {
          let newHistory = [...state.navigationHistory];

          // Remove page if it already exists in history
          newHistory = newHistory.filter(p => p !== page);

          // Add page to the end
          newHistory.push(page);

          // Limit history size
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory = newHistory.slice(-MAX_HISTORY_SIZE);
          }

          return { navigationHistory: newHistory };
        });
      },

      clearHistory: () => {
        set({ navigationHistory: [] });
      },

      getBreadcrumbIndex: (id: string) => {
        return get().breadcrumbs.findIndex(crumb => crumb.id === id);
      },

      canGoBack: () => {
        return get().navigationHistory.length > 0;
      },

      getLastPage: () => {
        const history = get().navigationHistory;
        return history.length > 0 ? history[history.length - 1] : null;
      },

      getPreviousPage: () => {
        const history = get().navigationHistory;
        return history.length > 1 ? history[history.length - 2] : null;
      },
    }),
    {
      name: 'navigation-storage',
      partialize: state => ({
        sidebarOpen: state.sidebarOpen,
        navigationHistory: state.navigationHistory.slice(-10), // Only persist last 10 items
      }),
    }
  )
);
