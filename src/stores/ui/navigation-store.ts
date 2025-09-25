import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigationState, Breadcrumb } from '@/types/ui/navigation';

interface NavigationStore extends NavigationState {
  // Actions
  toggleSidebar: () => void;
  collapseSidebar: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setActiveRoute: (route: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  pushToHistory: (route: string) => void;
}

const MAX_HISTORY_SIZE = 10;

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      breadcrumbs: [],
      activeRoute: '/',
      navigationHistory: [],

      // Action implementations
      toggleSidebar: () =>
        set(state => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      collapseSidebar: (collapsed: boolean) =>
        set({
          isSidebarCollapsed: collapsed,
        }),

      toggleMobileMenu: () =>
        set(state => ({
          isMobileMenuOpen: !state.isMobileMenuOpen,
        })),

      closeMobileMenu: () =>
        set({
          isMobileMenuOpen: false,
        }),

      setActiveRoute: (route: string) => {
        const currentRoute = get().activeRoute;

        // Update active route
        set({ activeRoute: route });

        // Add previous route to history if it's different
        if (currentRoute && currentRoute !== route) {
          get().pushToHistory(currentRoute);
        }

        // Auto-close mobile menu when navigating
        if (get().isMobileMenuOpen) {
          get().closeMobileMenu();
        }
      },

      setBreadcrumbs: (breadcrumbs: Breadcrumb[]) =>
        set({
          breadcrumbs,
        }),

      pushToHistory: (route: string) =>
        set(state => {
          let newHistory = [...state.navigationHistory];

          // Remove route if it already exists in history
          newHistory = newHistory.filter(r => r !== route);

          // Add route to the end
          newHistory.push(route);

          // Limit history size to MAX_HISTORY_SIZE
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory = newHistory.slice(-MAX_HISTORY_SIZE);
          }

          return { navigationHistory: newHistory };
        }),
    }),
    {
      name: 'navigation-storage',
      partialize: state => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);
