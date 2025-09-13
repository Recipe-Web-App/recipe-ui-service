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
      sidebarOpen: true,
      mobileMenuOpen: false,
      breadcrumbs: [],
      currentPage: '/',
      navigationHistory: [],
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useNavigationStore.getState();

      expect(state.sidebarOpen).toBe(true);
      expect(state.mobileMenuOpen).toBe(false);
      expect(state.breadcrumbs).toEqual([]);
      expect(state.currentPage).toBe('/');
      expect(state.navigationHistory).toEqual([]);
    });
  });

  describe('sidebar management', () => {
    describe('toggleSidebar', () => {
      it('should toggle sidebar open state', () => {
        const initialState = useNavigationStore.getState().sidebarOpen;

        act(() => {
          useNavigationStore.getState().toggleSidebar();
        });

        expect(useNavigationStore.getState().sidebarOpen).toBe(!initialState);

        act(() => {
          useNavigationStore.getState().toggleSidebar();
        });

        expect(useNavigationStore.getState().sidebarOpen).toBe(initialState);
      });
    });

    describe('setSidebarOpen', () => {
      it('should set sidebar open state', () => {
        act(() => {
          useNavigationStore.getState().setSidebarOpen(false);
        });

        expect(useNavigationStore.getState().sidebarOpen).toBe(false);

        act(() => {
          useNavigationStore.getState().setSidebarOpen(true);
        });

        expect(useNavigationStore.getState().sidebarOpen).toBe(true);
      });
    });
  });

  describe('mobile menu management', () => {
    describe('toggleMobileMenu', () => {
      it('should toggle mobile menu open state', () => {
        const initialState = useNavigationStore.getState().mobileMenuOpen;

        act(() => {
          useNavigationStore.getState().toggleMobileMenu();
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(
          !initialState
        );

        act(() => {
          useNavigationStore.getState().toggleMobileMenu();
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(initialState);
      });
    });

    describe('setMobileMenuOpen', () => {
      it('should set mobile menu open state', () => {
        act(() => {
          useNavigationStore.getState().setMobileMenuOpen(true);
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(true);

        act(() => {
          useNavigationStore.getState().setMobileMenuOpen(false);
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(false);
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
        act(() => {
          useNavigationStore.getState().setBreadcrumbs([mockBreadcrumb1]);
        });

        expect(useNavigationStore.getState().breadcrumbs).toHaveLength(1);

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
    });

    describe('addToBreadcrumbs', () => {
      it('should add breadcrumb to existing array', () => {
        act(() => {
          useNavigationStore.getState().setBreadcrumbs([mockBreadcrumb1]);
        });

        act(() => {
          useNavigationStore.getState().addToBreadcrumbs(mockBreadcrumb2);
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual([
          mockBreadcrumb1,
          mockBreadcrumb2,
        ]);
      });

      it('should add breadcrumb to empty array', () => {
        act(() => {
          useNavigationStore.getState().addToBreadcrumbs(mockBreadcrumb1);
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual([
          mockBreadcrumb1,
        ]);
      });
    });

    describe('removeBreadcrumb', () => {
      it('should remove breadcrumb by id', () => {
        act(() => {
          useNavigationStore
            .getState()
            .setBreadcrumbs([
              mockBreadcrumb1,
              mockBreadcrumb2,
              mockBreadcrumb3,
            ]);
        });

        act(() => {
          useNavigationStore.getState().removeBreadcrumb('recipes');
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual([
          mockBreadcrumb1,
          mockBreadcrumb3,
        ]);
      });

      it('should do nothing if breadcrumb id does not exist', () => {
        const initialBreadcrumbs = [mockBreadcrumb1, mockBreadcrumb2];

        act(() => {
          useNavigationStore.getState().setBreadcrumbs(initialBreadcrumbs);
        });

        act(() => {
          useNavigationStore.getState().removeBreadcrumb('non-existent');
        });

        expect(useNavigationStore.getState().breadcrumbs).toEqual(
          initialBreadcrumbs
        );
      });
    });

    describe('getBreadcrumbIndex', () => {
      it('should return correct index for existing breadcrumb', () => {
        act(() => {
          useNavigationStore
            .getState()
            .setBreadcrumbs([
              mockBreadcrumb1,
              mockBreadcrumb2,
              mockBreadcrumb3,
            ]);
        });

        expect(useNavigationStore.getState().getBreadcrumbIndex('home')).toBe(
          0
        );
        expect(
          useNavigationStore.getState().getBreadcrumbIndex('recipes')
        ).toBe(1);
        expect(
          useNavigationStore.getState().getBreadcrumbIndex('recipe-detail')
        ).toBe(2);
      });

      it('should return -1 for non-existent breadcrumb', () => {
        act(() => {
          useNavigationStore.getState().setBreadcrumbs([mockBreadcrumb1]);
        });

        expect(
          useNavigationStore.getState().getBreadcrumbIndex('non-existent')
        ).toBe(-1);
      });
    });
  });

  describe('current page and navigation', () => {
    describe('setCurrentPage', () => {
      it('should set current page', () => {
        act(() => {
          useNavigationStore.getState().setCurrentPage('/recipes');
        });

        expect(useNavigationStore.getState().currentPage).toBe('/recipes');
      });

      it('should add previous page to history when changing pages', () => {
        // Set initial page
        act(() => {
          useNavigationStore.getState().setCurrentPage('/home');
        });

        // Change to new page
        act(() => {
          useNavigationStore.getState().setCurrentPage('/recipes');
        });

        expect(useNavigationStore.getState().currentPage).toBe('/recipes');
        expect(useNavigationStore.getState().navigationHistory).toContain(
          '/home'
        );
      });

      it('should not add to history if setting same page', () => {
        act(() => {
          useNavigationStore.getState().setCurrentPage('/home');
        });

        const initialHistory = useNavigationStore.getState().navigationHistory;

        act(() => {
          useNavigationStore.getState().setCurrentPage('/home');
        });

        expect(useNavigationStore.getState().navigationHistory).toEqual(
          initialHistory
        );
      });

      it('should close mobile menu when navigating', () => {
        // Open mobile menu
        act(() => {
          useNavigationStore.getState().setMobileMenuOpen(true);
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(true);

        // Navigate to new page
        act(() => {
          useNavigationStore.getState().setCurrentPage('/recipes');
        });

        expect(useNavigationStore.getState().mobileMenuOpen).toBe(false);
      });
    });
  });

  describe('navigation history', () => {
    describe('addToHistory', () => {
      it('should add page to history', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
        });

        expect(useNavigationStore.getState().navigationHistory).toContain(
          '/home'
        );
      });

      it('should remove existing page before adding to end', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
          useNavigationStore.getState().addToHistory('/recipes');
          useNavigationStore.getState().addToHistory('/home'); // Add home again
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toEqual(['/recipes', '/home']);
        expect(history.filter(page => page === '/home')).toHaveLength(1);
      });

      it('should limit history size to MAX_HISTORY_SIZE', () => {
        // Add more than 50 pages
        act(() => {
          for (let i = 0; i < 55; i++) {
            useNavigationStore.getState().addToHistory(`/page-${i}`);
          }
        });

        const history = useNavigationStore.getState().navigationHistory;
        expect(history).toHaveLength(50);
        expect(history[0]).toBe('/page-5'); // First 5 should be removed
        expect(history[49]).toBe('/page-54'); // Last should be page-54
      });
    });

    describe('clearHistory', () => {
      it('should clear navigation history', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
          useNavigationStore.getState().addToHistory('/recipes');
        });

        expect(useNavigationStore.getState().navigationHistory).toHaveLength(2);

        act(() => {
          useNavigationStore.getState().clearHistory();
        });

        expect(useNavigationStore.getState().navigationHistory).toEqual([]);
      });
    });

    describe('canGoBack', () => {
      it('should return true when history has items', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
        });

        expect(useNavigationStore.getState().canGoBack()).toBe(true);
      });

      it('should return false when history is empty', () => {
        expect(useNavigationStore.getState().canGoBack()).toBe(false);
      });
    });

    describe('getLastPage', () => {
      it('should return last page in history', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
          useNavigationStore.getState().addToHistory('/recipes');
        });

        expect(useNavigationStore.getState().getLastPage()).toBe('/recipes');
      });

      it('should return null when history is empty', () => {
        expect(useNavigationStore.getState().getLastPage()).toBeNull();
      });
    });

    describe('getPreviousPage', () => {
      it('should return second to last page in history', () => {
        act(() => {
          useNavigationStore.getState().addToHistory('/home');
          useNavigationStore.getState().addToHistory('/recipes');
          useNavigationStore.getState().addToHistory('/profile');
        });

        expect(useNavigationStore.getState().getPreviousPage()).toBe(
          '/recipes'
        );
      });

      it('should return null when history has less than 2 items', () => {
        expect(useNavigationStore.getState().getPreviousPage()).toBeNull();

        act(() => {
          useNavigationStore.getState().addToHistory('/home');
        });

        expect(useNavigationStore.getState().getPreviousPage()).toBeNull();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete navigation flow', () => {
      // Start with default state
      expect(useNavigationStore.getState().currentPage).toBe('/');

      // Navigate to home
      act(() => {
        useNavigationStore.getState().setCurrentPage('/home');
      });

      expect(useNavigationStore.getState().currentPage).toBe('/home');
      expect(useNavigationStore.getState().navigationHistory).toContain('/');

      // Set breadcrumbs
      act(() => {
        useNavigationStore
          .getState()
          .setBreadcrumbs([{ id: 'home', label: 'Home', href: '/home' }]);
      });

      // Navigate to recipes
      act(() => {
        useNavigationStore.getState().setCurrentPage('/recipes');
      });

      // Add recipes breadcrumb
      act(() => {
        useNavigationStore.getState().addToBreadcrumbs({
          id: 'recipes',
          label: 'Recipes',
          href: '/recipes',
        });
      });

      expect(useNavigationStore.getState().currentPage).toBe('/recipes');
      expect(useNavigationStore.getState().navigationHistory).toContain(
        '/home'
      );
      expect(useNavigationStore.getState().breadcrumbs).toHaveLength(2);
      expect(useNavigationStore.getState().canGoBack()).toBe(true);
      expect(useNavigationStore.getState().getLastPage()).toBe('/home');
    });

    it('should handle mobile menu auto-close on navigation', () => {
      // Open mobile menu
      act(() => {
        useNavigationStore.getState().setMobileMenuOpen(true);
      });

      expect(useNavigationStore.getState().mobileMenuOpen).toBe(true);

      // Navigate - should auto-close menu
      act(() => {
        useNavigationStore.getState().setCurrentPage('/recipes');
      });

      expect(useNavigationStore.getState().mobileMenuOpen).toBe(false);
      expect(useNavigationStore.getState().currentPage).toBe('/recipes');
    });

    it('should handle breadcrumb navigation with removal', () => {
      // Set up breadcrumbs
      const breadcrumbs = [
        { id: 'home', label: 'Home', href: '/home' },
        { id: 'recipes', label: 'Recipes', href: '/recipes' },
        { id: 'detail', label: 'Recipe Detail', href: '/recipes/123' },
      ];

      act(() => {
        useNavigationStore.getState().setBreadcrumbs(breadcrumbs);
      });

      expect(useNavigationStore.getState().breadcrumbs).toHaveLength(3);

      // Remove middle breadcrumb (simulating navigation back)
      act(() => {
        useNavigationStore.getState().removeBreadcrumb('recipes');
      });

      expect(useNavigationStore.getState().breadcrumbs).toHaveLength(2);
      expect(useNavigationStore.getState().getBreadcrumbIndex('home')).toBe(0);
      expect(useNavigationStore.getState().getBreadcrumbIndex('detail')).toBe(
        1
      );
      expect(useNavigationStore.getState().getBreadcrumbIndex('recipes')).toBe(
        -1
      );
    });
  });
});
