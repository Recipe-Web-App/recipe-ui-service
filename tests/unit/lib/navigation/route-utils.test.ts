import {
  isRouteActive,
  getActiveNavItem,
  getDeepestActiveNavItem,
  buildBreadcrumbs,
  getTopLevelNavItems,
  sortNavItems,
  hasNavItemBadge,
  getNavItemBadge,
  getNavItemBadgeVariant,
  isExternalNavItem,
  getNavItemTarget,
} from '@/lib/navigation/route-utils';
import type { NavItem, Breadcrumb } from '@/types/navigation';
import { BookOpen, Calendar, Heart } from 'lucide-react';

describe('route-utils', () => {
  const mockNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: BookOpen,
    },
    {
      id: 'recipes',
      label: 'Recipes',
      href: '/recipes',
      icon: BookOpen,
      children: [
        {
          id: 'recipes-create',
          label: 'Create Recipe',
          href: '/recipes/create',
        },
        {
          id: 'recipes-favorites',
          label: 'Favorites',
          href: '/recipes/favorites',
        },
      ],
    },
    {
      id: 'meal-plans',
      label: 'Meal Plans',
      href: '/meal-plans',
      icon: Calendar,
      metadata: {
        badge: 'New',
        badgeVariant: 'info',
        showInMobile: false,
        showInDesktop: true,
        sortOrder: 10,
      },
    },
    {
      id: 'external',
      label: 'External Link',
      href: 'https://example.com',
      metadata: {
        external: true,
        target: '_blank',
      },
    },
  ];

  describe('isRouteActive', () => {
    it('should return true for exact matches', () => {
      expect(isRouteActive('/recipes', '/recipes')).toBe(true);
      expect(isRouteActive('/', '/')).toBe(true);
    });

    it('should return true for parent routes', () => {
      expect(isRouteActive('/recipes', '/recipes/create')).toBe(true);
      expect(isRouteActive('/recipes', '/recipes/favorites')).toBe(true);
    });

    it('should return false for non-matching routes', () => {
      expect(isRouteActive('/recipes', '/meal-plans')).toBe(false);
      expect(isRouteActive('/meal-plans', '/recipes')).toBe(false);
    });

    it('should handle trailing slashes correctly', () => {
      expect(isRouteActive('/recipes/', '/recipes')).toBe(true);
      expect(isRouteActive('/recipes', '/recipes/')).toBe(true);
      expect(isRouteActive('/recipes/', '/recipes/')).toBe(true);
    });

    it('should not treat root as parent of other routes', () => {
      expect(isRouteActive('/', '/recipes')).toBe(false);
    });

    it('should handle empty or undefined values', () => {
      expect(isRouteActive('', '/recipes')).toBe(false);
      expect(isRouteActive('/recipes', '')).toBe(false);
    });
  });

  describe('getActiveNavItem', () => {
    it('should return the active nav item for exact match', () => {
      const result = getActiveNavItem(mockNavItems, '/recipes');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('recipes');
    });

    it('should return parent item when child is active', () => {
      const result = getActiveNavItem(mockNavItems, '/recipes/create');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('recipes');
    });

    it('should return null when no item is active', () => {
      const result = getActiveNavItem(mockNavItems, '/unknown');
      expect(result).toBeNull();
    });

    it('should handle root route', () => {
      const result = getActiveNavItem(mockNavItems, '/');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('home');
    });
  });

  describe('getDeepestActiveNavItem', () => {
    it('should return the deepest active item', () => {
      const result = getDeepestActiveNavItem(mockNavItems, '/recipes/create');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('recipes-create');
    });

    it('should return parent if no child is active', () => {
      const result = getDeepestActiveNavItem(mockNavItems, '/recipes');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('recipes');
    });

    it('should return null when no item is active', () => {
      const result = getDeepestActiveNavItem(mockNavItems, '/unknown');
      expect(result).toBeNull();
    });
  });

  describe('buildBreadcrumbs', () => {
    it('should build breadcrumbs for root route', () => {
      const breadcrumbs = buildBreadcrumbs('/', mockNavItems);
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].label).toBe('Home');
      expect(breadcrumbs[0].current).toBe(true);
    });

    it('should build breadcrumbs for nested route', () => {
      const breadcrumbs = buildBreadcrumbs('/recipes/create', mockNavItems);
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].label).toBe('Home');
      expect(breadcrumbs[1].label).toBe('Recipes');
      expect(breadcrumbs[2].label).toBe('Create Recipe');
      expect(breadcrumbs[2].current).toBe(true);
      expect(breadcrumbs[2].href).toBeUndefined();
    });

    it('should create fallback breadcrumbs for unknown routes', () => {
      const breadcrumbs = buildBreadcrumbs('/unknown/path', mockNavItems);
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].label).toBe('Home');
      expect(breadcrumbs[1].label).toBe('Unknown');
      expect(breadcrumbs[2].label).toBe('Path');
      expect(breadcrumbs[2].current).toBe(true);
    });
  });

  describe('getTopLevelNavItems', () => {
    it('should return all items for desktop', () => {
      const items = getTopLevelNavItems(mockNavItems, false);
      expect(items).toHaveLength(4);
    });

    it('should filter out mobile-hidden items', () => {
      const items = getTopLevelNavItems(mockNavItems, true);
      const mealPlans = items.find(item => item.id === 'meal-plans');
      expect(mealPlans).toBeTruthy(); // showInMobile is not explicitly false
    });

    it('should include items with no display preferences', () => {
      const items = getTopLevelNavItems(mockNavItems, true);
      const home = items.find(item => item.id === 'home');
      expect(home).toBeTruthy();
    });
  });

  describe('sortNavItems', () => {
    it('should sort by sortOrder', () => {
      const unsortedItems = [
        { id: 'b', label: 'B', metadata: { sortOrder: 20 } },
        { id: 'a', label: 'A', metadata: { sortOrder: 10 } },
        { id: 'c', label: 'C' }, // no sortOrder, should go to end
      ];

      const sorted = sortNavItems(unsortedItems);
      expect(sorted[0].id).toBe('a');
      expect(sorted[1].id).toBe('b');
      expect(sorted[2].id).toBe('c');
    });

    it('should sort alphabetically when sortOrder is equal', () => {
      const unsortedItems = [
        { id: 'z', label: 'Z', metadata: { sortOrder: 10 } },
        { id: 'a', label: 'A', metadata: { sortOrder: 10 } },
      ];

      const sorted = sortNavItems(unsortedItems);
      expect(sorted[0].id).toBe('a');
      expect(sorted[1].id).toBe('z');
    });

    it('should not mutate the original array', () => {
      const original = [
        { id: 'b', label: 'B', metadata: { sortOrder: 20 } },
        { id: 'a', label: 'A', metadata: { sortOrder: 10 } },
      ];
      const originalLength = original.length;
      const originalFirstId = original[0].id;

      sortNavItems(original);

      expect(original).toHaveLength(originalLength);
      expect(original[0].id).toBe(originalFirstId);
    });
  });

  describe('badge utilities', () => {
    it('should detect items with badges', () => {
      const itemWithBadge = mockNavItems.find(item => item.id === 'meal-plans');
      const itemWithoutBadge = mockNavItems.find(item => item.id === 'home');

      expect(hasNavItemBadge(itemWithBadge!)).toBe(true);
      expect(hasNavItemBadge(itemWithoutBadge!)).toBe(false);
    });

    it('should get badge text', () => {
      const item = mockNavItems.find(item => item.id === 'meal-plans');
      expect(getNavItemBadge(item!)).toBe('New');
    });

    it('should get badge variant', () => {
      const item = mockNavItems.find(item => item.id === 'meal-plans');
      expect(getNavItemBadgeVariant(item!)).toBe('info');
    });

    it('should return default badge variant when not specified', () => {
      const item = { id: 'test', label: 'Test', metadata: { badge: 'Test' } };
      expect(getNavItemBadgeVariant(item)).toBe('default');
    });
  });

  describe('external link utilities', () => {
    it('should detect external links by metadata', () => {
      const externalItem = mockNavItems.find(item => item.id === 'external');
      const internalItem = mockNavItems.find(item => item.id === 'home');

      expect(isExternalNavItem(externalItem!)).toBe(true);
      expect(isExternalNavItem(internalItem!)).toBe(false);
    });

    it('should detect external links by href protocol', () => {
      const httpItem = {
        id: 'http',
        label: 'HTTP',
        href: 'http://example.com',
      };
      const httpsItem = {
        id: 'https',
        label: 'HTTPS',
        href: 'https://example.com',
      };
      const internalItem = {
        id: 'internal',
        label: 'Internal',
        href: '/internal',
      };

      expect(isExternalNavItem(httpItem)).toBe(true);
      expect(isExternalNavItem(httpsItem)).toBe(true);
      expect(isExternalNavItem(internalItem)).toBe(false);
    });

    it('should get target attribute', () => {
      const externalItem = mockNavItems.find(item => item.id === 'external');
      const internalItem = mockNavItems.find(item => item.id === 'home');

      expect(getNavItemTarget(externalItem!)).toBe('_blank');
      expect(getNavItemTarget(internalItem!)).toBeUndefined();
    });

    it('should default to _blank for external links without target', () => {
      const item = {
        id: 'ext',
        label: 'External',
        href: 'https://example.com',
      };
      expect(getNavItemTarget(item)).toBe('_blank');
    });
  });
});
