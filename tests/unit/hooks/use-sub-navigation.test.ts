import { renderHook } from '@testing-library/react';
import {
  useSubNavigation,
  useCurrentSection,
  useNavItemVisibility,
  useBreadcrumbs,
} from '@/hooks/use-sub-navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { getSubNavigation } from '@/config/navigation';
import { getFeatureFlags } from '@/lib/features/flags';
import type { NavItem } from '@/types/navigation';

// Mock Next.js navigation
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock stores
jest.mock('@/stores/auth-store');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

jest.mock('@/stores/ui/layout-store');
const mockUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

// Mock navigation config
jest.mock('@/config/navigation');
const mockGetSubNavigation = getSubNavigation as jest.MockedFunction<
  typeof getSubNavigation
>;

// Mock feature flags
jest.mock('@/lib/features/flags');
const mockGetFeatureFlags = getFeatureFlags as jest.MockedFunction<
  typeof getFeatureFlags
>;

describe('useSubNavigation', () => {
  const mockAuthStore = {
    isAuthenticated: false,
    user: null,
  };

  const mockLayoutStore = {
    breakpoint: 'desktop' as const,
  };

  const mockFeatureFlags = {
    ENABLE_RECIPE_CREATION: true,
    ENABLE_RECIPE_IMPORT: false,
    SHOW_COMPONENTS_DEMO: false,
    ENABLE_MEAL_PLANNING: true,
    ENABLE_GROCERY_LISTS: true,
    ENABLE_SOCIAL_FEATURES: true,
    ENABLE_USER_PROFILES: true,
    ENABLE_ANALYTICS: false,
  };

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue(mockAuthStore);
    mockUseLayoutStore.mockReturnValue(mockLayoutStore);
    mockGetFeatureFlags.mockReturnValue(mockFeatureFlags);
    mockUsePathname.mockReturnValue('/');
    mockGetSubNavigation.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns empty array when no sub-navigation exists', () => {
      mockUsePathname.mockReturnValue('/unknown');
      mockGetSubNavigation.mockReturnValue([]);

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toEqual([]);
      expect(mockGetSubNavigation).toHaveBeenCalledWith('unknown');
    });

    it('returns sub-navigation for recipes section', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'recipes-browse',
          label: 'Browse Recipes',
          href: '/recipes',
          metadata: { sortOrder: 10 },
        },
        {
          id: 'recipes-create',
          label: 'Create Recipe',
          href: '/recipes/create',
          metadata: { sortOrder: 20 },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toEqual(mockNavItems);
      expect(mockGetSubNavigation).toHaveBeenCalledWith('recipes');
    });
  });

  describe('authentication filtering', () => {
    it('filters out items requiring authentication when user is not authenticated', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'public-item',
          label: 'Public Item',
          href: '/public',
        },
        {
          id: 'auth-item',
          label: 'Auth Item',
          href: '/auth',
          metadata: { requiredAuth: true },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('public-item');
    });

    it('includes items requiring authentication when user is authenticated', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'public-item',
          label: 'Public Item',
          href: '/public',
        },
        {
          id: 'auth-item',
          label: 'Auth Item',
          href: '/auth',
          metadata: { requiredAuth: true },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { id: '1', ingredientName: 'Test User', roles: [] },
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(2);
    });
  });

  describe('role-based filtering', () => {
    it('filters out items requiring specific roles when user lacks them', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'user-item',
          label: 'User Item',
          href: '/user',
        },
        {
          id: 'admin-item',
          label: 'Admin Item',
          href: '/admin',
          metadata: { requiredRoles: ['admin'] },
        },
      ];

      mockUsePathname.mockReturnValue('/settings');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: { id: '1', ingredientName: 'Test User', roles: ['user'] },
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('user-item');
    });

    it('includes items when user has required roles', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'user-item',
          label: 'User Item',
          href: '/user',
        },
        {
          id: 'admin-item',
          label: 'Admin Item',
          href: '/admin',
          metadata: { requiredRoles: ['admin'] },
        },
      ];

      mockUsePathname.mockReturnValue('/settings');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseAuthStore.mockReturnValue({
        ...mockAuthStore,
        isAuthenticated: true,
        user: {
          id: '1',
          ingredientName: 'Test User',
          roles: ['admin', 'user'],
        },
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(2);
    });
  });

  describe('feature flag filtering', () => {
    it('filters out items with disabled feature flags', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'enabled-item',
          label: 'Enabled Item',
          href: '/enabled',
          metadata: { featureFlag: 'ENABLE_RECIPE_CREATION' },
        },
        {
          id: 'disabled-item',
          label: 'Disabled Item',
          href: '/disabled',
          metadata: { featureFlag: 'ENABLE_RECIPE_IMPORT' },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('enabled-item');
    });
  });

  describe('mobile visibility filtering', () => {
    it('filters out items hidden on mobile when on mobile', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'mobile-item',
          label: 'Mobile Item',
          href: '/mobile',
        },
        {
          id: 'desktop-only-item',
          label: 'Desktop Only',
          href: '/desktop',
          metadata: { showInMobile: false },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'mobile',
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe('mobile-item');
    });

    it('includes items hidden on mobile when on desktop', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'mobile-item',
          label: 'Mobile Item',
          href: '/mobile',
        },
        {
          id: 'desktop-only-item',
          label: 'Desktop Only',
          href: '/desktop',
          metadata: { showInMobile: false },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);
      mockUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        breakpoint: 'desktop',
      });

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current).toHaveLength(2);
    });
  });

  describe('sorting', () => {
    it('sorts items by sortOrder', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'third',
          label: 'Third Item',
          href: '/third',
          metadata: { sortOrder: 30 },
        },
        {
          id: 'first',
          label: 'First Item',
          href: '/first',
          metadata: { sortOrder: 10 },
        },
        {
          id: 'second',
          label: 'Second Item',
          href: '/second',
          metadata: { sortOrder: 20 },
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current[0].id).toBe('first');
      expect(result.current[1].id).toBe('second');
      expect(result.current[2].id).toBe('third');
    });

    it('sorts by label when sortOrder is missing', () => {
      const mockNavItems: NavItem[] = [
        {
          id: 'zebra',
          label: 'Zebra',
          href: '/zebra',
        },
        {
          id: 'apple',
          label: 'Apple',
          href: '/apple',
        },
        {
          id: 'banana',
          label: 'Banana',
          href: '/banana',
        },
      ];

      mockUsePathname.mockReturnValue('/recipes');
      mockGetSubNavigation.mockReturnValue(mockNavItems);

      const { result } = renderHook(() => useSubNavigation());

      expect(result.current[0].label).toBe('Apple');
      expect(result.current[1].label).toBe('Banana');
      expect(result.current[2].label).toBe('Zebra');
    });
  });
});

describe('useCurrentSection', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns "home" for root path', () => {
    mockUsePathname.mockReturnValue('/');

    const { result } = renderHook(() => useCurrentSection());

    expect(result.current).toBe('home');
  });

  it('extracts section from single-level path', () => {
    mockUsePathname.mockReturnValue('/recipes');

    const { result } = renderHook(() => useCurrentSection());

    expect(result.current).toBe('recipes');
  });

  it('extracts section from multi-level path', () => {
    mockUsePathname.mockReturnValue('/recipes/create/new');

    const { result } = renderHook(() => useCurrentSection());

    expect(result.current).toBe('recipes');
  });

  it('extracts section from paths with hyphens', () => {
    mockUsePathname.mockReturnValue('/meal-plans');

    const { result } = renderHook(() => useCurrentSection());

    expect(result.current).toBe('meal-plans');
  });
});

describe('useNavItemVisibility', () => {
  const mockItem: NavItem = {
    id: 'test-item',
    label: 'Test Item',
    href: '/test',
    metadata: { requiredAuth: true, featureFlag: 'ENABLE_RECIPE_CREATION' },
  };

  const localMockAuthStore = {
    isAuthenticated: false,
    user: null,
  };

  const localMockLayoutStore = {
    breakpoint: 'desktop' as const,
  };

  const localMockFeatureFlags = {
    ENABLE_RECIPE_CREATION: true,
    ENABLE_RECIPE_IMPORT: false,
    SHOW_COMPONENTS_DEMO: false,
    ENABLE_MEAL_PLANNING: true,
    ENABLE_GROCERY_LISTS: true,
    ENABLE_SOCIAL_FEATURES: true,
    ENABLE_USER_PROFILES: true,
    ENABLE_ANALYTICS: false,
  };

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue(localMockAuthStore);
    mockUseLayoutStore.mockReturnValue(localMockLayoutStore);
    mockGetFeatureFlags.mockReturnValue(localMockFeatureFlags);
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns false for item requiring auth when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      ...localMockAuthStore,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useNavItemVisibility(mockItem));

    expect(result.current).toBe(false);
  });

  it('returns false for item with disabled feature flag', () => {
    const itemWithDisabledFlag: NavItem = {
      ...mockItem,
      metadata: { featureFlag: 'ENABLE_RECIPE_IMPORT' }, // This is disabled in mockFeatureFlags
    };

    const { result } = renderHook(() =>
      useNavItemVisibility(itemWithDisabledFlag)
    );

    expect(result.current).toBe(false);
  });

  it('returns true for visible item', () => {
    mockUseAuthStore.mockReturnValue({
      ...localMockAuthStore,
      isAuthenticated: true,
      user: { id: '1', ingredientName: 'Test User', roles: [] },
    });

    const { result } = renderHook(() => useNavItemVisibility(mockItem));

    expect(result.current).toBe(true);
  });
});

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns home breadcrumb for root path', () => {
    mockUsePathname.mockReturnValue('/');

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current).toEqual([
      { label: 'Home', href: '/', current: true },
    ]);
  });

  it('generates breadcrumbs for single-level path', () => {
    mockUsePathname.mockReturnValue('/recipes');

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Recipes', href: undefined, current: true },
    ]);
  });

  it('generates breadcrumbs for multi-level path', () => {
    mockUsePathname.mockReturnValue('/recipes/create/new');

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Recipes', href: '/recipes', current: false },
      { label: 'Create', href: '/recipes/create', current: false },
      { label: 'New', href: undefined, current: true },
    ]);
  });

  it('formats hyphenated segments correctly', () => {
    mockUsePathname.mockReturnValue('/meal-plans/weekly-plan');

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current).toEqual([
      { label: 'Home', href: '/' },
      { label: 'Meal Plans', href: '/meal-plans', current: false },
      { label: 'Weekly Plan', href: undefined, current: true },
    ]);
  });
});
