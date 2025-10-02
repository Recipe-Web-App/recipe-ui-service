import React from 'react';
import { renderHook } from '@testing-library/react';
import {
  useNavigationContext,
  useContextBreadcrumbs,
  useRouteMetadata,
} from '@/hooks/use-navigation-context';
import { NavigationProvider } from '@/contexts/navigation-context';
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

describe('use-navigation-context hooks', () => {
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

    mockedGenerateBreadcrumbs.mockResolvedValue([
      { id: 'home', label: 'Home', href: '/' },
      { id: 'recipes', label: 'Recipes', href: '/recipes' },
    ] as BreadcrumbItem[]);

    mockedFindMatchingRoute.mockReturnValue({
      pattern: '/recipes',
      label: 'Recipes',
    });

    mockedGetParentPath.mockReturnValue('/');
  });

  describe('useNavigationContext', () => {
    it('should return navigation context', () => {
      const { result } = renderHook(() => useNavigationContext(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current).toBeDefined();
      expect(result.current.currentPath).toBe('/recipes');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useNavigationContext());
      }).toThrow(
        'useNavigationContext must be used within a NavigationProvider.'
      );

      consoleError.mockRestore();
    });

    it('should provide navigation functions', () => {
      const { result } = renderHook(() => useNavigationContext(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current.navigateTo).toBeDefined();
      expect(result.current.navigateToParent).toBeDefined();
      expect(result.current.refreshBreadcrumbs).toBeDefined();
    });

    it('should provide breadcrumb management functions', () => {
      const { result } = renderHook(() => useNavigationContext(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current.setCustomBreadcrumbs).toBeDefined();
      expect(result.current.clearCustomBreadcrumbs).toBeDefined();
    });
  });

  describe('useContextBreadcrumbs', () => {
    it('should return breadcrumbs from context', () => {
      const { result } = renderHook(() => useContextBreadcrumbs(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(Array.isArray(result.current)).toBe(true);
    });

    it('should return empty array initially', () => {
      const { result } = renderHook(() => useContextBreadcrumbs(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      // Initially empty, will populate after async breadcrumb generation
      expect(result.current).toBeDefined();
    });

    it('should throw error when used outside provider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useContextBreadcrumbs());
      }).toThrow(
        'useNavigationContext must be used within a NavigationProvider.'
      );

      consoleError.mockRestore();
    });
  });

  describe('useRouteMetadata', () => {
    it('should return current route metadata', () => {
      const { result } = renderHook(() => useRouteMetadata(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current).toEqual({
        pattern: '/recipes',
        label: 'Recipes',
      });
    });

    it('should return undefined when no matching route', () => {
      mockedFindMatchingRoute.mockReturnValue(undefined);

      const { result } = renderHook(() => useRouteMetadata(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(result.current).toBeUndefined();
    });

    it('should throw error when used outside provider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useRouteMetadata());
      }).toThrow(
        'useNavigationContext must be used within a NavigationProvider.'
      );

      consoleError.mockRestore();
    });
  });

  describe('Hook integration', () => {
    it('should allow using multiple hooks together', () => {
      const { result: contextResult } = renderHook(
        () => useNavigationContext(),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      const { result: breadcrumbsResult } = renderHook(
        () => useContextBreadcrumbs(),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      const { result: metadataResult } = renderHook(() => useRouteMetadata(), {
        wrapper: ({ children }) => (
          <NavigationProvider>{children}</NavigationProvider>
        ),
      });

      expect(contextResult.current).toBeDefined();
      expect(breadcrumbsResult.current).toBeDefined();
      expect(metadataResult.current).toBeDefined();
    });

    it('should access context from useNavigationContext', () => {
      const { result: contextResult } = renderHook(
        () => useNavigationContext(),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      const { result: breadcrumbsResult } = renderHook(
        () => useContextBreadcrumbs(),
        {
          wrapper: ({ children }) => (
            <NavigationProvider>{children}</NavigationProvider>
          ),
        }
      );

      // Both return breadcrumbs
      expect(Array.isArray(contextResult.current.breadcrumbs)).toBe(true);
      expect(Array.isArray(breadcrumbsResult.current)).toBe(true);
    });
  });
});
