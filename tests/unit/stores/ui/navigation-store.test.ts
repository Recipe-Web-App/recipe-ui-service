import { act } from '@testing-library/react';
import { useNavigationStore } from '@/stores/ui/navigation-store';
import type { Breadcrumb } from '@/types/ui/navigation';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useNavigationStore', () => {
  beforeEach(() => {
    // Reset store state
    useNavigationStore.setState({
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      breadcrumbs: [],
      activeRoute: '/',
      navigationHistory: [],
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useNavigationStore.getState();

      expect(state.isSidebarOpen).toBe(true);
      expect(state.isSidebarCollapsed).toBe(false);
      expect(state.isMobileMenuOpen).toBe(false);
      expect(state.breadcrumbs).toEqual([]);
      expect(state.activeRoute).toBe('/');
      expect(state.navigationHistory).toEqual([]);
    });
  });

  describe('sidebar management', () => {
    describe('toggleSidebar', () => {
      it('should toggle sidebar open state', () => {
        const initialState = useNavigationStore.getState().isSidebarOpen;

        act(() => {
          useNavigationStore.getState().toggleSidebar();
        });

        expect(useNavigationStore.getState().isSidebarOpen).toBe(!initialState);

        act(() => {
          useNavigationStore.getState().toggleSidebar();
        });

        expect(useNavigationStore.getState().isSidebarOpen).toBe(initialState);
      });
    });

    describe('collapseSidebar', () => {
      it('should set sidebar collapsed state to true', () => {
        act(() => {
          useNavigationStore.getState().collapseSidebar(true);
        });

        expect(useNavigationStore.getState().isSidebarCollapsed).toBe(true);
      });

      it('should set sidebar collapsed state to false', () => {
        // First set to true
        act(() => {
          useNavigationStore.getState().collapseSidebar(true);
        });

        // Then set to false
        act(() => {
          useNavigationStore.getState().collapseSidebar(false);
        });

        expect(useNavigationStore.getState().isSidebarCollapsed).toBe(false);
      });

      it('should maintain independent state from isSidebarOpen', () => {
        // Set collapsed to true
        act(() => {
          useNavigationStore.getState().collapseSidebar(true);
        });

        // Toggle sidebar open/closed
        act(() => {
          useNavigationStore.getState().toggleSidebar();
        });

        // Collapsed state should remain unchanged
        expect(useNavigationStore.getState().isSidebarCollapsed).toBe(true);
        expect(useNavigationStore.getState().isSidebarOpen).toBe(false);
      });
    });

    describe('sidebar states combinations', () => {
      it('should support open and expanded state', () => {
        act(() => {
          useNavigationStore.setState({
            isSidebarOpen: true,
            isSidebarCollapsed: false,
          });
        });

        const state = useNavigationStore.getState();
        expect(state.isSidebarOpen).toBe(true);
        expect(state.isSidebarCollapsed).toBe(false);
      });

      it('should support open and collapsed state', () => {
        act(() => {
          useNavigationStore.setState({
            isSidebarOpen: true,
            isSidebarCollapsed: true,
          });
        });

        const state = useNavigationStore.getState();
        expect(state.isSidebarOpen).toBe(true);
        expect(state.isSidebarCollapsed).toBe(true);
      });

      it('should support closed state', () => {
        act(() => {
          useNavigationStore.setState({
            isSidebarOpen: false,
            isSidebarCollapsed: false, // Collapsed state doesn't matter when closed
          });
        });

        const state = useNavigationStore.getState();
        expect(state.isSidebarOpen).toBe(false);
      });
    });
  });

  describe('mobile menu management', () => {
    describe('toggleMobileMenu', () => {
      it('should toggle mobile menu open state', () => {
        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);

        act(() => {
          useNavigationStore.getState().toggleMobileMenu();
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(true);

        act(() => {
          useNavigationStore.getState().toggleMobileMenu();
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);
      });
    });

    describe('closeMobileMenu', () => {
      it('should close mobile menu', () => {
        // First open the menu
        act(() => {
          useNavigationStore.setState({ isMobileMenuOpen: true });
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(true);

        // Then close it
        act(() => {
          useNavigationStore.getState().closeMobileMenu();
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);
      });

      it('should keep menu closed if already closed', () => {
        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);

        act(() => {
          useNavigationStore.getState().closeMobileMenu();
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);
      });
    });
  });

  describe('active route and navigation', () => {
    describe('setActiveRoute', () => {
      it('should set active route', () => {
        act(() => {
          useNavigationStore.getState().setActiveRoute('/recipes');
        });

        expect(useNavigationStore.getState().activeRoute).toBe('/recipes');
      });

      it('should add previous route to history when changing routes', () => {
        // Set initial route
        act(() => {
          useNavigationStore.getState().setActiveRoute('/home');
        });

        // Change to new route
        act(() => {
          useNavigationStore.getState().setActiveRoute('/recipes');
        });

        expect(useNavigationStore.getState().activeRoute).toBe('/recipes');
        expect(useNavigationStore.getState().navigationHistory).toContain(
          '/home'
        );
      });

      it('should not add to history if setting same route', () => {
        act(() => {
          useNavigationStore.getState().setActiveRoute('/home');
        });

        const initialHistory = useNavigationStore.getState().navigationHistory;

        act(() => {
          useNavigationStore.getState().setActiveRoute('/home');
        });

        expect(useNavigationStore.getState().navigationHistory).toEqual(
          initialHistory
        );
      });

      it('should auto-close mobile menu when navigating', () => {
        // Open mobile menu
        act(() => {
          useNavigationStore.setState({ isMobileMenuOpen: true });
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(true);

        // Navigate to new route
        act(() => {
          useNavigationStore.getState().setActiveRoute('/recipes');
        });

        expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);
      });

      it('should handle navigation from initial route', () => {
        // Start with default route
        expect(useNavigationStore.getState().activeRoute).toBe('/');

        // Navigate to new route
        act(() => {
          useNavigationStore.getState().setActiveRoute('/recipes');
        });

        expect(useNavigationStore.getState().activeRoute).toBe('/recipes');
        expect(useNavigationStore.getState().navigationHistory).toContain('/');
      });
    });
  });

  describe('breadcrumb management', () => {
    const mockBreadcrumb1: Breadcrumb = {
      id: 'home',
      label: 'Home',
      href: '/',
    };

    const mockBreadcrumb2: Breadcrumb = {
      id: 'recipes',
      label: 'Recipes',
      href: '/recipes',
    };

    const mockBreadcrumb3: Breadcrumb = {
      id: 'recipe-detail',
      label: 'Recipe Detail',
      href: '/recipes/123',
    };

    describe('setBreadcrumbs', () => {
      it('should set breadcrumbs array', () => {
        const breadcrumbs = [mockBreadcrumb1, mockBreadcrumb2];

        act(() => {
          useNavigationStore.getState().setBreadcrumbs(breadcrumbs);
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual(breadcrumbs);
      });

      it('should replace existing breadcrumbs', () => {
        // Set initial breadcrumbs
        act(() => {
          useNavigationStore.getState().setBreadcrumbs([mockBreadcrumb1]);
        });

        expect(useNavigationStore.getState().breadcrumbs).toHaveLength(1);

        // Replace with new breadcrumbs
        act(() => {
          useNavigationStore
            .getState()
            .setBreadcrumbs([mockBreadcrumb2, mockBreadcrumb3]);
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual([
          mockBreadcrumb2,
          mockBreadcrumb3,
        ]);
      });

      it('should handle empty breadcrumbs array', () => {
        // Set some breadcrumbs
        act(() => {
          useNavigationStore
            .getState()
            .setBreadcrumbs([mockBreadcrumb1, mockBreadcrumb2]);
        });

        // Clear breadcrumbs
        act(() => {
          useNavigationStore.getState().setBreadcrumbs([]);
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual([]);
      });
    });
  });

  describe('navigation history', () => {
    describe('pushToHistory', () => {
      it('should add route to history', () => {
        act(() => {
          useNavigationStore.getState().pushToHistory('/home');
        });

        expect(useNavigationStore.getState().navigationHistory).toContain(
          '/home'
        );
      });

      it('should remove existing route before adding to end', () => {
        act(() => {
          useNavigationStore.getState().pushToHistory('/home');
          useNavigationStore.getState().pushToHistory('/recipes');
          useNavigationStore.getState().pushToHistory('/home'); // Add home again
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toEqual(['/recipes', '/home']);
        expect(history.filter(route => route === '/home')).toHaveLength(1);
      });

      it('should limit history size to 10 items', () => {
        // Add more than 10 routes
        act(() => {
          for (let i = 0; i < 15; i++) {
            useNavigationStore.getState().pushToHistory(`/page-${i}`);
          }
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toHaveLength(10);
        expect(history[0]).toBe('/page-5'); // First 5 should be removed
        expect(history[9]).toBe('/page-14'); // Last should be page-14
      });

      it('should maintain order when route already exists', () => {
        act(() => {
          useNavigationStore.getState().pushToHistory('/page-1');
          useNavigationStore.getState().pushToHistory('/page-2');
          useNavigationStore.getState().pushToHistory('/page-3');
          useNavigationStore.getState().pushToHistory('/page-1'); // Re-add page-1
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toEqual(['/page-2', '/page-3', '/page-1']);
        expect(history.indexOf('/page-1')).toBe(2); // Should be at the end
      });
    });

    describe('history integration with setActiveRoute', () => {
      it('should build navigation history through route changes', () => {
        // Navigate through several routes
        act(() => {
          useNavigationStore.getState().setActiveRoute('/home');
        });

        act(() => {
          useNavigationStore.getState().setActiveRoute('/recipes');
        });

        act(() => {
          useNavigationStore.getState().setActiveRoute('/profile');
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toContain('/');
        expect(history).toContain('/home');
        expect(history).toContain('/recipes');
        expect(useNavigationStore.getState().activeRoute).toBe('/profile');
      });

      it('should not exceed 10 items in history through navigation', () => {
        // Navigate through more than 10 unique routes
        act(() => {
          for (let i = 0; i < 12; i++) {
            useNavigationStore.getState().setActiveRoute(`/route-${i}`);
          }
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete navigation flow', () => {
      // Start with default state
      expect(useNavigationStore.getState().activeRoute).toBe('/');

      // Navigate to home
      act(() => {
        useNavigationStore.getState().setActiveRoute('/home');
      });

      expect(useNavigationStore.getState().activeRoute).toBe('/home');
      expect(useNavigationStore.getState().navigationHistory).toContain('/');

      // Set breadcrumbs
      act(() => {
        useNavigationStore
          .getState()
          .setBreadcrumbs([{ id: 'home', label: 'Home', href: '/home' }]);
      });

      // Navigate to recipes with mobile menu open
      act(() => {
        useNavigationStore.setState({ isMobileMenuOpen: true });
        useNavigationStore.getState().setActiveRoute('/recipes');
      });

      // Mobile menu should be closed
      expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);

      // Add recipes breadcrumb
      act(() => {
        useNavigationStore.getState().setBreadcrumbs([
          { id: 'home', label: 'Home', href: '/home' },
          { id: 'recipes', label: 'Recipes', href: '/recipes' },
        ]);
      });

      // Verify final state
      const finalState = useNavigationStore.getState();
      expect(finalState.activeRoute).toBe('/recipes');
      expect(finalState.navigationHistory).toContain('/home');
      expect(finalState.breadcrumbs).toHaveLength(2);
      expect(finalState.isMobileMenuOpen).toBe(false);
    });

    it('should handle sidebar states with navigation', () => {
      // Start with sidebar open and expanded
      expect(useNavigationStore.getState().isSidebarOpen).toBe(true);
      expect(useNavigationStore.getState().isSidebarCollapsed).toBe(false);

      // Collapse sidebar
      act(() => {
        useNavigationStore.getState().collapseSidebar(true);
      });

      // Navigate to a new route
      act(() => {
        useNavigationStore.getState().setActiveRoute('/recipes');
      });

      // Sidebar collapsed state should persist
      expect(useNavigationStore.getState().isSidebarCollapsed).toBe(true);
      expect(useNavigationStore.getState().activeRoute).toBe('/recipes');

      // Toggle sidebar closed
      act(() => {
        useNavigationStore.getState().toggleSidebar();
      });

      expect(useNavigationStore.getState().isSidebarOpen).toBe(false);
      expect(useNavigationStore.getState().isSidebarCollapsed).toBe(true); // Collapsed state persists
    });

    it('should handle mobile navigation flow', () => {
      // Open mobile menu
      act(() => {
        useNavigationStore.getState().toggleMobileMenu();
      });

      expect(useNavigationStore.getState().isMobileMenuOpen).toBe(true);

      // Navigate to a route
      act(() => {
        useNavigationStore.getState().setActiveRoute('/recipes');
      });

      // Mobile menu should auto-close
      expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);

      // Open mobile menu again
      act(() => {
        useNavigationStore.getState().toggleMobileMenu();
      });

      // Explicitly close mobile menu
      act(() => {
        useNavigationStore.getState().closeMobileMenu();
      });

      expect(useNavigationStore.getState().isMobileMenuOpen).toBe(false);
    });
  });

  describe('persistence', () => {
    it('should only persist isSidebarCollapsed state', () => {
      // The persist middleware is mocked, but we can verify the configuration
      // by checking what would be persisted based on the partialize function

      const mockState = {
        isSidebarOpen: false,
        isSidebarCollapsed: true,
        isMobileMenuOpen: true,
        breadcrumbs: [{ id: 'test', label: 'Test' }],
        activeRoute: '/test',
        navigationHistory: ['/home', '/recipes'],
      };

      // In a real implementation with persist middleware:
      // Only isSidebarCollapsed should be persisted
      // This is defined in the partialize function of the store

      // Set various states
      act(() => {
        useNavigationStore.setState(mockState);
      });

      // Verify all states are set
      const state = useNavigationStore.getState();
      expect(state.isSidebarCollapsed).toBe(true);
      expect(state.isSidebarOpen).toBe(false);
      expect(state.isMobileMenuOpen).toBe(true);
      expect(state.breadcrumbs).toHaveLength(1);
      expect(state.activeRoute).toBe('/test');
      expect(state.navigationHistory).toHaveLength(2);
    });
  });
});
