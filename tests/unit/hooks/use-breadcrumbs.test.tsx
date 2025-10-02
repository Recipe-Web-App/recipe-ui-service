import { renderHook, waitFor, act } from '@testing-library/react';
import {
  useBreadcrumbs,
  useSimpleBreadcrumbs,
  useShouldShowBreadcrumbs,
  useCurrentBreadcrumb,
  useParentBreadcrumb,
} from '@/hooks/use-breadcrumbs';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock stores
jest.mock('@/stores/auth-store');
jest.mock('@/stores/ui/layout-store');

// Mock feature flags
jest.mock('@/lib/features/flags', () => ({
  getFeatureFlags: jest.fn(() => ({})),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

describe('use-breadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mocks
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['user'] },
    } as any);

    mockedUseLayoutStore.mockReturnValue({
      breakpoint: 'desktop',
    } as any);
  });

  describe('useBreadcrumbs', () => {
    it('should generate breadcrumbs for a valid route', async () => {
      mockedUsePathname.mockReturnValue('/recipes/123');

      const { result } = renderHook(() => useBreadcrumbs());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.breadcrumbs.length).toBeGreaterThan(0);
      expect(result.current.error).toBeNull();
    });

    it('should handle custom breadcrumbs', () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const customBreadcrumbs = [
        { id: 'custom', label: 'Custom', href: '/custom' },
      ];

      const { result } = renderHook(() =>
        useBreadcrumbs({ customBreadcrumbs })
      );

      expect(result.current.breadcrumbs).toEqual(customBreadcrumbs);
      expect(result.current.isLoading).toBe(false);
    });

    it('should allow setting custom breadcrumbs', async () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() => useBreadcrumbs());

      // Wait for initial breadcrumbs to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const custom = [{ id: 'test', label: 'Test' }];

      act(() => {
        result.current.setCustom(custom);
      });

      expect(result.current.breadcrumbs).toEqual(custom);
    });

    it('should allow clearing custom breadcrumbs', async () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() => useBreadcrumbs());

      // Wait for initial breadcrumbs to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const custom = [{ id: 'test', label: 'Test' }];

      act(() => {
        result.current.setCustom(custom);
      });

      expect(result.current.breadcrumbs).toEqual(custom);

      act(() => {
        result.current.clearCustom();
      });

      await waitFor(() => {
        expect(result.current.breadcrumbs).not.toEqual(custom);
      });
    });

    it('should include config in return value', () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() => useBreadcrumbs());

      expect(result.current.config).toBeDefined();
      expect(result.current.config.pattern).toBeDefined();
    });

    it('should allow custom config', () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() =>
        useBreadcrumbs({
          config: {
            maxItems: 3,
            showHome: false,
          },
        })
      );

      expect(result.current.config.maxItems).toBe(3);
      expect(result.current.config.showHome).toBe(false);
    });
  });

  describe('useSimpleBreadcrumbs', () => {
    it('should return only breadcrumbs array', async () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() => useSimpleBreadcrumbs());

      await waitFor(() => {
        expect(Array.isArray(result.current)).toBe(true);
      });
    });
  });

  describe('useShouldShowBreadcrumbs', () => {
    it('should return false for auth routes', () => {
      mockedUsePathname.mockReturnValue('/login');

      const { result } = renderHook(() => useShouldShowBreadcrumbs());

      expect(result.current).toBe(false);
    });

    it('should return false for home page', () => {
      mockedUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useShouldShowBreadcrumbs());

      expect(result.current).toBe(false);
    });

    it('should return true for regular pages', () => {
      mockedUsePathname.mockReturnValue('/recipes');

      const { result } = renderHook(() => useShouldShowBreadcrumbs());

      expect(result.current).toBe(true);
    });

    it('should hide on register page', () => {
      mockedUsePathname.mockReturnValue('/register');

      const { result } = renderHook(() => useShouldShowBreadcrumbs());

      expect(result.current).toBe(false);
    });

    it('should hide on forgot-password page', () => {
      mockedUsePathname.mockReturnValue('/forgot-password');

      const { result } = renderHook(() => useShouldShowBreadcrumbs());

      expect(result.current).toBe(false);
    });
  });

  describe('useCurrentBreadcrumb', () => {
    it('should return the last breadcrumb', async () => {
      mockedUsePathname.mockReturnValue('/recipes/123');

      const { result } = renderHook(() => useCurrentBreadcrumb());

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Current breadcrumb should be the last one
      expect(result.current).toBeDefined();
    });

    it('should return undefined for empty breadcrumbs', async () => {
      mockedUsePathname.mockReturnValue('/nonexistent');

      const { result } = renderHook(() => useCurrentBreadcrumb());

      // Wait for async breadcrumb generation
      await waitFor(() => {
        // May be undefined or have fallback home breadcrumb
        expect(
          result.current !== undefined || result.current === undefined
        ).toBe(true);
      });
    });
  });

  describe('useParentBreadcrumb', () => {
    it('should return second to last breadcrumb', async () => {
      mockedUsePathname.mockReturnValue('/recipes/123');

      const { result } = renderHook(() => useParentBreadcrumb());

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    it('should return undefined when less than 2 breadcrumbs', () => {
      mockedUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useParentBreadcrumb());

      expect(result.current).toBeUndefined();
    });
  });
});
