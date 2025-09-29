import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import {
  generateBreadcrumbs,
  processNavigationWithContext,
  findActiveNavItem,
  getParentNavItem,
  getNavigationPath,
  flattenNavigation,
  searchNavigation,
  navigationUtils,
} from '@/lib/navigation/generate-subnav';
import type {
  NavItem,
  NavigationContext,
  ProcessedNavItem,
} from '@/types/navigation';

// Mock fs module
jest.mock('fs');
jest.mock('path');

// Mock feature flags
jest.mock('@/lib/features/flags', () => ({
  featureFlags: {
    isEnabled: jest.fn((flag: string) => {
      const enabledFlags = [
        'ENABLE_RECIPE_CREATION',
        'ENABLE_MEAL_PLANNING',
        'SHOW_COMPONENTS_DEMO',
      ];
      return enabledFlags.includes(flag);
    }),
  },
}));

// Mock icon registry
jest.mock('@/lib/ui/icon-registry', () => ({
  getIcon: jest.fn((iconName: string) => {
    // Return a mock component for any icon name
    return () => `MockIcon(${iconName})`;
  }),
}));

const mockNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
  },
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    children: [
      {
        id: 'recipes-browse',
        label: 'Browse Recipes',
        href: '/recipes/browse',
      },
      {
        id: 'recipes-create',
        label: 'Create Recipe',
        href: '/recipes/create',
        metadata: {
          featureFlag: 'ENABLE_RECIPE_CREATION',
          requiredAuth: true,
        },
      },
    ],
  },
  {
    id: 'meal-plans',
    label: 'Meal Plans',
    href: '/meal-plans',
    metadata: {
      featureFlag: 'ENABLE_MEAL_PLANNING',
    },
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    metadata: {
      requiredRoles: ['admin'],
      showInMobile: false,
    },
  },
  {
    id: 'disabled',
    label: 'Disabled',
    href: '/disabled',
    metadata: {
      disabled: true,
    },
  },
];

describe('Navigation Generation Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateBreadcrumbs', () => {
    it('should generate breadcrumbs for root path', () => {
      const breadcrumbs = generateBreadcrumbs('/');
      expect(breadcrumbs).toEqual([{ label: 'Home', href: '/' }]);
    });

    it('should generate breadcrumbs for single segment path', () => {
      const breadcrumbs = generateBreadcrumbs('/recipes');
      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: undefined },
      ]);
    });

    it('should generate breadcrumbs for multi-segment path', () => {
      const breadcrumbs = generateBreadcrumbs('/recipes/create/new');
      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Create', href: '/recipes/create' },
        { label: 'New', href: undefined },
      ]);
    });

    it('should handle dashed segments correctly', () => {
      const breadcrumbs = generateBreadcrumbs('/meal-plans/weekly-plan');
      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Meal Plans', href: '/meal-plans' },
        { label: 'Weekly Plan', href: undefined },
      ]);
    });

    it('should ignore empty segments', () => {
      const breadcrumbs = generateBreadcrumbs('//recipes//create/');
      expect(breadcrumbs).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Create', href: undefined },
      ]);
    });
  });

  describe('processNavigationWithContext', () => {
    let context: NavigationContext;

    beforeEach(() => {
      context = {
        currentPath: '/recipes',
        isAuthenticated: true,
        userRoles: ['user'],
        isMobile: false,
      };
    });

    it('should process basic navigation items', () => {
      const processed = processNavigationWithContext(
        mockNavItems.slice(0, 3),
        context
      );

      expect(processed).toHaveLength(2); // meal-plans is filtered out due to feature flag
      expect(processed[0]).toMatchObject({
        id: 'home',
        active: false,
        visible: true,
        level: 0,
      });
    });

    it('should mark active items correctly', () => {
      const processed = processNavigationWithContext(mockNavItems, context);

      const recipesItem = processed.find(item => item.id === 'recipes');
      expect(recipesItem?.active).toBe(true);
    });

    it('should filter items by feature flags', () => {
      // Mock feature flag to be disabled
      const featureFlagsMock = require('@/lib/features/flags')
        .featureFlags as jest.MockedObject<
        typeof import('@/lib/features/flags').featureFlags
      >;
      featureFlagsMock.isEnabled.mockImplementation((flag: string) => {
        return flag !== 'ENABLE_MEAL_PLANNING';
      });

      const processed = processNavigationWithContext(mockNavItems, context);

      const mealPlansItem = processed.find(item => item.id === 'meal-plans');
      expect(mealPlansItem).toBeUndefined();
    });

    it('should filter items by authentication', () => {
      context.isAuthenticated = false;

      const processed = processNavigationWithContext(mockNavItems, context);

      // Should not include items that require auth
      const recipesItem = processed.find(item => item.id === 'recipes');
      expect(recipesItem?.children).toHaveLength(1); // Only browse, not create
    });

    it('should filter items by user roles', () => {
      const processed = processNavigationWithContext(mockNavItems, context);

      const adminItem = processed.find(item => item.id === 'admin');
      expect(adminItem).toBeUndefined(); // User doesn't have admin role
    });

    it('should filter items by mobile visibility', () => {
      context.isMobile = true;

      const processed = processNavigationWithContext(mockNavItems, context);

      const adminItem = processed.find(item => item.id === 'admin');
      expect(adminItem).toBeUndefined(); // Hidden in mobile
    });

    it('should exclude disabled items by default', () => {
      const processed = processNavigationWithContext(mockNavItems, context);

      const disabledItem = processed.find(item => item.id === 'disabled');
      expect(disabledItem).toBeUndefined();
    });

    it('should include disabled items when specified', () => {
      const options = { includeDisabled: true };
      const processed = processNavigationWithContext(
        mockNavItems,
        context,
        options
      );

      const disabledItem = processed.find(item => item.id === 'disabled');
      expect(disabledItem).toBeDefined();
    });

    it('should process children recursively', () => {
      const processed = processNavigationWithContext(mockNavItems, context);

      const recipesItem = processed.find(item => item.id === 'recipes');
      expect(recipesItem?.children).toHaveLength(1); // Only browse recipe (create requires auth flag check)

      const createItem = recipesItem?.children?.find(
        child => child.id === 'recipes-browse'
      );
      expect(createItem).toBeDefined();
      expect(createItem?.level).toBe(1);
    });
  });

  describe('findActiveNavItem', () => {
    it('should find top-level active item', () => {
      const active = findActiveNavItem(mockNavItems, '/recipes');
      expect(active?.id).toBe('recipes');
    });

    it('should find nested active item', () => {
      const active = findActiveNavItem(mockNavItems, '/recipes/create');
      expect(active?.id).toBe('recipes-create');
    });

    it('should handle nested paths correctly', () => {
      const active = findActiveNavItem(
        mockNavItems,
        '/recipes/create/new-recipe'
      );
      expect(active?.id).toBe('recipes-create'); // Should match parent
    });

    it('should return null for non-matching paths', () => {
      const active = findActiveNavItem(mockNavItems, '/unknown');
      expect(active).toBeNull();
    });
  });

  describe('getParentNavItem', () => {
    it('should return null for root path', () => {
      const parent = getParentNavItem(mockNavItems, '/');
      expect(parent).toBeNull();
    });

    it('should return null for single-segment path', () => {
      const parent = getParentNavItem(mockNavItems, '/recipes');
      expect(parent).toBeNull();
    });

    it('should find parent for nested path', () => {
      const parent = getParentNavItem(mockNavItems, '/recipes/create');
      expect(parent?.id).toBe('recipes');
    });
  });

  describe('getNavigationPath', () => {
    it('should return path to top-level item', () => {
      const path = getNavigationPath(mockNavItems, '/recipes');
      expect(path).toHaveLength(1);
      expect(path[0].id).toBe('recipes');
    });

    it('should return path to nested item', () => {
      const path = getNavigationPath(mockNavItems, '/recipes/create');
      expect(path).toHaveLength(2);
      expect(path[0].id).toBe('recipes');
      expect(path[1].id).toBe('recipes-create');
    });

    it('should return empty array for non-matching path', () => {
      const path = getNavigationPath(mockNavItems, '/unknown');
      expect(path).toHaveLength(0);
    });
  });

  describe('flattenNavigation', () => {
    it('should flatten navigation tree into single array', () => {
      const flattened = flattenNavigation(mockNavItems);

      expect(flattened).toHaveLength(7); // 5 top-level + 2 children

      const ids = flattened.map(item => item.id);
      expect(ids).toContain('recipes');
      expect(ids).toContain('recipes-browse');
      expect(ids).toContain('recipes-create');
    });

    it('should maintain item order', () => {
      const simple = [
        { id: 'a', label: 'A', href: '/a' },
        {
          id: 'b',
          label: 'B',
          children: [
            { id: 'b1', label: 'B1', href: '/b/1' },
            { id: 'b2', label: 'B2', href: '/b/2' },
          ],
        },
        { id: 'c', label: 'C', href: '/c' },
      ];

      const flattened = flattenNavigation(simple);
      const ids = flattened.map(item => item.id);
      expect(ids).toEqual(['a', 'b', 'b1', 'b2', 'c']);
    });
  });

  describe('searchNavigation', () => {
    it('should search by label', () => {
      const results = searchNavigation(mockNavItems, 'recipe');

      expect(results).toHaveLength(3); // recipes, recipes-browse, recipes-create
      expect(results[0].id).toBe('recipes');
    });

    it('should search by href', () => {
      const results = searchNavigation(mockNavItems, '/meal');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('meal-plans');
    });

    it('should be case insensitive', () => {
      const results = searchNavigation(mockNavItems, 'RECIPE');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchNavigation(mockNavItems, 'nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should search in nested items', () => {
      const results = searchNavigation(mockNavItems, 'browse');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('recipes-browse');
    });
  });

  describe('navigationUtils', () => {
    it('should export all utility functions', () => {
      expect(navigationUtils).toHaveProperty('processWithContext');
      expect(navigationUtils).toHaveProperty('findActive');
      expect(navigationUtils).toHaveProperty('getParent');
      expect(navigationUtils).toHaveProperty('getPath');
      expect(navigationUtils).toHaveProperty('flatten');
      expect(navigationUtils).toHaveProperty('search');
      expect(navigationUtils).toHaveProperty('generateBreadcrumbs');
    });

    it('should have consistent function references', () => {
      expect(navigationUtils.processWithContext).toBe(
        processNavigationWithContext
      );
      expect(navigationUtils.findActive).toBe(findActiveNavItem);
      expect(navigationUtils.getParent).toBe(getParentNavItem);
      expect(navigationUtils.getPath).toBe(getNavigationPath);
      expect(navigationUtils.flatten).toBe(flattenNavigation);
      expect(navigationUtils.search).toBe(searchNavigation);
      expect(navigationUtils.generateBreadcrumbs).toBe(generateBreadcrumbs);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty navigation arrays', () => {
      const context: NavigationContext = { currentPath: '/' };

      expect(processNavigationWithContext([], context)).toEqual([]);
      expect(findActiveNavItem([], '/')).toBeNull();
      expect(getNavigationPath([], '/')).toEqual([]);
      expect(flattenNavigation([])).toEqual([]);
      expect(searchNavigation([], 'test')).toEqual([]);
    });

    it('should handle invalid paths', () => {
      expect(generateBreadcrumbs('')).toEqual([{ label: 'Home', href: '/' }]);
      expect(findActiveNavItem(mockNavItems, '')).toBeNull();
      expect(getParentNavItem(mockNavItems, '')).toBeNull();
    });

    it('should handle circular references gracefully', () => {
      // Create navigation with circular reference (edge case)
      const circular: NavItem = {
        id: 'circular',
        label: 'Circular',
        href: '/circular',
      };
      circular.children = [circular]; // Create circular reference

      // These functions should not hang or crash
      expect(() => flattenNavigation([circular])).not.toThrow();
      expect(() => searchNavigation([circular], 'test')).not.toThrow();
    });

    it('should handle malformed navigation items', () => {
      const malformed = [
        { id: '', label: '', href: '/' }, // Empty strings
        { id: 'valid', label: 'Valid', href: '/valid' },
      ] as NavItem[];

      expect(() =>
        processNavigationWithContext(malformed, { currentPath: '/' })
      ).not.toThrow();
      expect(() => flattenNavigation(malformed)).not.toThrow();
    });
  });
});
