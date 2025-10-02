import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  NavigationProvider,
  NavigationContext,
} from '@/contexts/navigation-context';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { useNavigationStore } from '@/stores/ui/navigation-store';
import * as breadcrumbUtils from '@/lib/navigation/breadcrumb-utils';
import * as routeHelpers from '@/lib/navigation/route-helpers';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock stores
jest.mock('@/stores/auth-store');
jest.mock('@/stores/ui/layout-store');
jest.mock('@/stores/ui/navigation-store');

// Mock breadcrumb utilities
jest.mock('@/lib/navigation/breadcrumb-utils');
jest.mock('@/lib/navigation/route-helpers');

// Mock feature flags
jest.mock('@/lib/features/flags', () => ({
  getFeatureFlags: jest.fn(() => ({})),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;
const mockedUseNavigationStore = useNavigationStore as jest.MockedFunction<
  typeof useNavigationStore
>;
const mockedGenerateBreadcrumbs =
  breadcrumbUtils.generateBreadcrumbsFromPath as jest.MockedFunction<
    typeof breadcrumbUtils.generateBreadcrumbsFromPath
  >;
const mockedFindMatchingRoute =
  routeHelpers.findMatchingRouteMetadata as jest.MockedFunction<
    typeof routeHelpers.findMatchingRouteMetadata
  >;
const mockedGetParentPath = routeHelpers.getParentPath as jest.MockedFunction<
  typeof routeHelpers.getParentPath
>;

describe('NavigationContext', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockNavigationStore = {
    setBreadcrumbs: jest.fn(),
    setCurrentPath: jest.fn(),
    clearCustomBreadcrumbs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mocks
    mockedUsePathname.mockReturnValue('/recipes');
    mockedUseRouter.mockReturnValue(mockRouter as any);
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['user'] },
    } as any);
    mockedUseLayoutStore.mockReturnValue({
      breakpoint: 'desktop',
    } as any);
    mockedUseNavigationStore.mockReturnValue(mockNavigationStore as any);

    // Default breadcrumb generation - using mockImplementation for immediate return
    mockedGenerateBreadcrumbs.mockImplementation(
      async () =>
        [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'recipes', label: 'Recipes', href: '/recipes' },
        ] as BreadcrumbItem[]
    );

    mockedFindMatchingRoute.mockReturnValue({
      pattern: '/recipes',
      label: 'Recipes',
    });

    mockedGetParentPath.mockReturnValue('/');
  });

  describe('NavigationProvider', () => {
    it('should provide navigation context to children', () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current?.currentPath).toBe('/recipes');
      expect(result.current?.isAuthenticated).toBe(true);
    });

    it('should generate breadcrumbs on mount', async () => {
      renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      await waitFor(() => {
        expect(mockedGenerateBreadcrumbs).toHaveBeenCalledWith('/recipes');
      });
    });

    it('should update breadcrumbs when pathname changes', async () => {
      const { rerender } = renderHook(
        () => React.useContext(NavigationContext),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      mockedUsePathname.mockReturnValue('/recipes/123');
      mockedGenerateBreadcrumbs.mockResolvedValue([
        { id: 'home', label: 'Home', href: '/' },
        { id: 'recipes', label: 'Recipes', href: '/recipes' },
        { id: '123', label: 'Recipe 123', href: '/recipes/123' },
      ] as BreadcrumbItem[]);

      rerender();

      await waitFor(() => {
        expect(mockedGenerateBreadcrumbs).toHaveBeenCalledWith('/recipes/123');
      });
    });

    it('should extract route metadata for current path', () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current?.routeMetadata).toEqual({
        pattern: '/recipes',
        label: 'Recipes',
      });
    });

    it('should provide parent path', () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current?.parentPath).toBe('/');
    });
  });

  describe('Navigation functions', () => {
    it('should have navigateTo function', () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current?.navigateTo).toBeDefined();
      expect(typeof result.current?.navigateTo).toBe('function');
    });

    it('should have navigateToParent function', () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current?.navigateToParent).toBeDefined();
      expect(typeof result.current?.navigateToParent).toBe('function');
    });

    it('should provide parent path for navigation', () => {
      mockedUsePathname.mockReturnValue('/recipes/123');
      mockedGetParentPath.mockReturnValue('/recipes');

      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current?.parentPath).toBe('/recipes');
    });
  });

  describe('Breadcrumb management', () => {
    it('should refresh breadcrumbs on demand', async () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      mockedGenerateBreadcrumbs.mockClear();

      await act(async () => {
        await result.current?.refreshBreadcrumbs();
      });

      expect(mockedGenerateBreadcrumbs).toHaveBeenCalledWith('/recipes');
    });

    it('should set custom breadcrumbs', async () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      const customBreadcrumbs = [
        { id: 'custom', label: 'Custom', href: '/custom' },
      ];

      await act(async () => {
        result.current?.setCustomBreadcrumbs(customBreadcrumbs as any);
      });

      await waitFor(() => {
        expect(mockNavigationStore.setBreadcrumbs).toHaveBeenCalledWith(
          expect.arrayContaining([expect.objectContaining({ label: 'Custom' })])
        );
      });
    });

    it('should clear custom breadcrumbs and regenerate', async () => {
      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      mockedGenerateBreadcrumbs.mockClear();

      await act(async () => {
        result.current?.clearCustomBreadcrumbs();
      });

      // Should regenerate breadcrumbs after clearing custom ones
      await waitFor(() => {
        expect(mockedGenerateBreadcrumbs).toHaveBeenCalled();
      });
    });
  });

  describe('Context value updates', () => {
    it('should update isAuthenticated when auth state changes', () => {
      const { result, rerender } = renderHook(
        () => React.useContext(NavigationContext),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      expect(result.current?.isAuthenticated).toBe(true);

      mockedUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
      } as any);

      rerender();

      expect(result.current?.isAuthenticated).toBe(false);
    });

    it('should update isMobile when breakpoint changes', () => {
      const { result, rerender } = renderHook(
        () => React.useContext(NavigationContext),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      expect(result.current?.isMobile).toBe(false);

      mockedUseLayoutStore.mockReturnValue({
        breakpoint: 'mobile',
      } as any);

      rerender();

      expect(result.current?.isMobile).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle breadcrumb generation errors gracefully', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockedGenerateBreadcrumbs.mockRejectedValue(
        new Error('Generation failed')
      );

      renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Error generating breadcrumbs:',
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    it('should provide fallback breadcrumb on error', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockedGenerateBreadcrumbs.mockRejectedValue(
        new Error('Generation failed')
      );

      const { result } = renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      await waitFor(() => {
        // Should have fallback home breadcrumb
        expect(result.current?.breadcrumbs).toHaveLength(1);
        expect(result.current?.breadcrumbs[0]?.label).toBe('Home');
      });

      consoleError.mockRestore();
    });
  });

  describe('Store integration', () => {
    it('should update navigation store with breadcrumbs', async () => {
      renderHook(() => React.useContext(NavigationContext), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      await waitFor(() => {
        expect(mockNavigationStore.setBreadcrumbs).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ label: 'Home' }),
            expect.objectContaining({ label: 'Recipes' }),
          ])
        );
      });
    });
  });
});
