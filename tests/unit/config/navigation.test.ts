import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  topLevelNavigation,
  recipesSubNavigation,
  collectionsSubNavigation,
  mealPlansSubNavigation,
  shoppingListsSubNavigation,
  kitchenFeedSubNavigation,
  sousChefSubNavigation,
  accountSubNavigation,
  subNavigationMap,
  getSubNavigation,
  footerNavigation,
  quickActions,
  navigationConfig,
} from '@/config/navigation';
import type { NavItem } from '@/types/navigation';

// Mock the feature flags module
jest.mock('@/lib/features/flags', () => ({
  featureFlags: {
    isEnabled: jest.fn((flag: string) => {
      // Default enabled flags for testing
      const enabledFlags = [
        'ENABLE_MEAL_PLANNING',
        'ENABLE_RECIPE_CREATION',
        'ENABLE_RECIPE_IMPORT',
        'ENABLE_GROCERY_LISTS',
        'ENABLE_SOCIAL_FEATURES',
        'ENABLE_USER_PROFILES',
        'ENABLE_ANALYTICS',
        'SHOW_COMPONENTS_DEMO',
      ];
      return enabledFlags.includes(flag);
    }),
  },
}));

describe('Navigation Configuration', () => {
  describe('topLevelNavigation', () => {
    it('should have all required top-level navigation items', () => {
      const expectedIds = [
        'recipes',
        'collections',
        'meal-plans',
        'shopping-lists',
        'kitchen-feed',
        'sous-chef',
        'account',
        'components-demo',
      ];

      const actualIds = topLevelNavigation.map(item => item.id);
      expectedIds.forEach(id => {
        expect(actualIds).toContain(id);
      });
    });

    it('should have proper structure for each navigation item', () => {
      topLevelNavigation.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
        expect(typeof item.id).toBe('string');
        expect(typeof item.label).toBe('string');
        expect(item.id.length).toBeGreaterThan(0);
        expect(item.label.length).toBeGreaterThan(0);

        // Either href or children should be present (or both)
        const hasHref = Boolean(item.href);
        const hasChildren = Boolean(item.children && item.children.length > 0);
        if (!hasHref && !hasChildren) {
          throw new Error(
            `Navigation item ${item.id} must have either href or children`
          );
        }

        // Metadata should be properly structured if present
        if (item.metadata) {
          if (item.metadata.sortOrder !== undefined) {
            expect(typeof item.metadata.sortOrder).toBe('number');
          }
          if (item.metadata.requiredAuth !== undefined) {
            expect(typeof item.metadata.requiredAuth).toBe('boolean');
          }
          if (item.metadata.featureFlag !== undefined) {
            expect(typeof item.metadata.featureFlag).toBe('string');
          }
        }
      });
    });

    it('should have unique IDs for all navigation items', () => {
      const ids = topLevelNavigation.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should have proper sort order', () => {
      const sortOrders = topLevelNavigation
        .map(item => item.metadata?.sortOrder || 0)
        .filter(order => order >= 0);

      const sortedOrders = [...sortOrders].sort((a, b) => a - b);
      expect(sortOrders).toEqual(sortedOrders);
    });

    it('should have icons for navigation items', () => {
      topLevelNavigation.forEach(item => {
        expect(item.icon).toBeDefined();
      });
    });

    it('should have children for all dropdown items', () => {
      // All top-level items now have dropdown children
      topLevelNavigation.forEach(item => {
        expect(item.children).toBeDefined();
        expect(Array.isArray(item.children)).toBe(true);
        expect(item.children!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Sub-navigation configurations', () => {
    describe('recipesSubNavigation', () => {
      it('should have all recipe-related navigation items', () => {
        const expectedIds = [
          'recipes-create',
          'recipes-my-recipes',
          'recipes-favorites',
          'recipes-popular',
          'recipes-trending',
          'recipes-shared',
        ];

        const actualIds = recipesSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should have proper href paths for all items', () => {
        recipesSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/recipes/);
        });
      });
    });

    describe('collectionsSubNavigation', () => {
      it('should have all collection-related navigation items', () => {
        const expectedIds = [
          'collections-create',
          'collections-my-collections',
          'collections-favorites',
          'collections-popular',
          'collections-trending',
          'collections-shared',
        ];

        const actualIds = collectionsSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should have proper href paths for all items', () => {
        collectionsSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/collections/);
        });
      });
    });

    describe('mealPlansSubNavigation', () => {
      it('should have all meal plan related navigation items', () => {
        const expectedIds = [
          'meal-plans-create',
          'meal-plans-my-plans',
          'meal-plans-favorites',
          'meal-plans-popular',
          'meal-plans-trending',
          'meal-plans-shared',
        ];

        const actualIds = mealPlansSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should have proper href paths for all items', () => {
        mealPlansSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/meal-plans/);
        });
      });
    });

    describe('shoppingListsSubNavigation', () => {
      it('should have all shopping list navigation items', () => {
        const expectedIds = ['shopping-lists-create', 'shopping-lists-browse'];

        const actualIds = shoppingListsSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should have proper href paths for all items', () => {
        shoppingListsSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/shopping-lists/);
        });
      });

      it('should require authentication for all items', () => {
        shoppingListsSubNavigation.forEach(item => {
          expect(item.metadata?.requiredAuth).toBe(true);
        });
      });
    });

    describe('kitchenFeedSubNavigation', () => {
      it('should have all kitchen feed navigation items', () => {
        const expectedIds = [
          'feed-co-chefs',
          'feed-my-activity',
          'feed-discover',
        ];

        const actualIds = kitchenFeedSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should require authentication for all items', () => {
        kitchenFeedSubNavigation.forEach(item => {
          expect(item.metadata?.requiredAuth).toBe(true);
        });
      });

      it('should have proper href paths for all items', () => {
        kitchenFeedSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/feed/);
        });
      });
    });

    describe('sousChefSubNavigation', () => {
      it('should have all sous chef navigation items', () => {
        const expectedIds = [
          'sous-chef-cook',
          'sous-chef-adapt',
          'sous-chef-timers',
        ];

        const actualIds = sousChefSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should have proper href paths for all items', () => {
        sousChefSubNavigation.forEach(item => {
          expect(item.href).toBeDefined();
          expect(item.href).toMatch(/^\/sous-chef/);
        });
      });
    });

    describe('accountSubNavigation', () => {
      it('should have all account navigation items', () => {
        const expectedIds = [
          'account-profile',
          'account-edit',
          'account-logout',
        ];

        const actualIds = accountSubNavigation.map(item => item.id);
        expectedIds.forEach(id => {
          expect(actualIds).toContain(id);
        });
      });

      it('should require authentication for all items', () => {
        accountSubNavigation.forEach(item => {
          expect(item.metadata?.requiredAuth).toBe(true);
        });
      });

      it('should mark logout as an action item', () => {
        const logoutItem = accountSubNavigation.find(
          item => item.id === 'account-logout'
        );
        expect(logoutItem).toBeDefined();
        expect(logoutItem?.metadata?.isAction).toBe(true);
      });
    });
  });

  describe('subNavigationMap', () => {
    it('should map all main navigation sections to their sub-navigation', () => {
      const expectedKeys = [
        'recipes',
        'collections',
        'meal-plans',
        'shopping-lists',
        'kitchen-feed',
        'feed',
        'sous-chef',
        'account',
        'components-demo',
      ];
      const actualKeys = Object.keys(subNavigationMap);

      expectedKeys.forEach(key => {
        expect(actualKeys).toContain(key);
      });
    });

    it('should return arrays of navigation items', () => {
      Object.values(subNavigationMap).forEach(navItems => {
        expect(Array.isArray(navItems)).toBe(true);
        expect(navItems.length).toBeGreaterThan(0);
      });
    });

    it('should have feed as an alias for kitchen-feed', () => {
      expect(subNavigationMap['feed']).toBe(subNavigationMap['kitchen-feed']);
    });
  });

  describe('getSubNavigation', () => {
    it('should return correct sub-navigation for known sections', () => {
      expect(getSubNavigation('recipes')).toEqual(recipesSubNavigation);
      expect(getSubNavigation('collections')).toEqual(collectionsSubNavigation);
      expect(getSubNavigation('meal-plans')).toEqual(mealPlansSubNavigation);
      expect(getSubNavigation('shopping-lists')).toEqual(
        shoppingListsSubNavigation
      );
      expect(getSubNavigation('kitchen-feed')).toEqual(
        kitchenFeedSubNavigation
      );
      expect(getSubNavigation('feed')).toEqual(kitchenFeedSubNavigation);
      expect(getSubNavigation('sous-chef')).toEqual(sousChefSubNavigation);
      expect(getSubNavigation('account')).toEqual(accountSubNavigation);
    });

    it('should return empty array for unknown sections', () => {
      expect(getSubNavigation('unknown')).toEqual([]);
      expect(getSubNavigation('')).toEqual([]);
    });
  });

  describe('footerNavigation', () => {
    it('should have all required footer sections', () => {
      const expectedSections = ['product', 'support', 'legal', 'social'];
      const actualSections = Object.keys(footerNavigation);

      expectedSections.forEach(section => {
        expect(actualSections).toContain(section);
      });
    });

    it('should have proper structure for footer links', () => {
      Object.values(footerNavigation).forEach(section => {
        expect(Array.isArray(section)).toBe(true);
        section.forEach(link => {
          expect(link).toHaveProperty('label');
          expect(link).toHaveProperty('href');
          expect(typeof link.label).toBe('string');
          expect(typeof link.href).toBe('string');
        });
      });
    });

    it('should mark external links properly', () => {
      footerNavigation.social.forEach(link => {
        if (link.href.startsWith('http')) {
          expect(link.external).toBe(true);
        }
      });
    });
  });

  describe('quickActions', () => {
    it('should have all essential quick actions', () => {
      const expectedIds = [
        'quick-create-recipe',
        'quick-meal-plan',
        'quick-shopping-list',
        'quick-timers',
      ];

      const actualIds = quickActions.map(action => action.id);
      expectedIds.forEach(id => {
        expect(actualIds).toContain(id);
      });
    });

    it('should have icons for all quick actions', () => {
      quickActions.forEach(action => {
        expect(action.icon).toBeDefined();
      });
    });

    it('should have tooltips for all quick actions', () => {
      quickActions.forEach(action => {
        expect(action.metadata?.tooltip).toBeDefined();
        expect(typeof action.metadata?.tooltip).toBe('string');
      });
    });
  });

  describe('navigationConfig', () => {
    it('should export all navigation configurations', () => {
      expect(navigationConfig).toHaveProperty('topLevel');
      expect(navigationConfig).toHaveProperty('subNavigation');
      expect(navigationConfig).toHaveProperty('footer');
      expect(navigationConfig).toHaveProperty('quickActions');
      expect(navigationConfig).toHaveProperty('getSubNavigation');
    });

    it('should have consistent references', () => {
      expect(navigationConfig.topLevel).toBe(topLevelNavigation);
      expect(navigationConfig.subNavigation).toBe(subNavigationMap);
      expect(navigationConfig.footer).toBe(footerNavigation);
      expect(navigationConfig.quickActions).toBe(quickActions);
      expect(navigationConfig.getSubNavigation).toBe(getSubNavigation);
    });
  });

  describe('Navigation item validation', () => {
    const validateNavItem = (item: NavItem, context = 'unknown') => {
      // ID validation
      expect(item.id).toBeDefined();
      expect(item.id).toBeTruthy();

      // Label validation
      expect(item.label).toBeDefined();
      expect(item.label).toBeTruthy();

      // Either href or children should be present
      const hasHref = Boolean(item.href);
      const hasChildren = Boolean(item.children && item.children.length > 0);
      if (!hasHref && !hasChildren) {
        throw new Error(`${context}: Should have href or children`);
      }

      // Validate children recursively
      if (item.children) {
        item.children.forEach((child, index) => {
          validateNavItem(child, `${context} > child[${index}]`);
        });
      }
    };

    it('should validate all top-level navigation items', () => {
      topLevelNavigation.forEach((item, index) => {
        validateNavItem(item, `topLevel[${index}]`);
      });
    });

    it('should validate all sub-navigation items', () => {
      Object.entries(subNavigationMap).forEach(([section, items]) => {
        items.forEach((item, index) => {
          validateNavItem(item, `${section}[${index}]`);
        });
      });
    });

    it('should validate all quick actions', () => {
      quickActions.forEach((item, index) => {
        validateNavItem(item, `quickActions[${index}]`);
      });
    });
  });
});

describe('Navigation Type Guards', () => {
  let mockNavItem: NavItem;

  beforeEach(() => {
    mockNavItem = {
      id: 'test-item',
      label: 'Test Item',
      href: '/test',
    };
  });

  it('should properly identify items with children', () => {
    const { hasChildren } = require('@/types/navigation');

    expect(hasChildren(mockNavItem)).toBe(false);

    mockNavItem.children = [];
    expect(hasChildren(mockNavItem)).toBe(false);

    mockNavItem.children = [{ id: 'child', label: 'Child', href: '/child' }];
    expect(hasChildren(mockNavItem)).toBe(true);
  });

  it('should properly identify external links', () => {
    const { isExternalLink } = require('@/types/navigation');

    expect(isExternalLink(mockNavItem)).toBe(false);

    mockNavItem.href = 'https://example.com';
    expect(isExternalLink(mockNavItem)).toBe(true);

    mockNavItem.href = '/internal';
    mockNavItem.metadata = { external: true };
    expect(isExternalLink(mockNavItem)).toBe(true);
  });

  it('should properly identify items requiring authentication', () => {
    const { requiresAuth } = require('@/types/navigation');

    expect(requiresAuth(mockNavItem)).toBe(false);

    mockNavItem.metadata = { requiredAuth: true };
    expect(requiresAuth(mockNavItem)).toBe(true);
  });

  it('should properly identify disabled items', () => {
    const { isDisabled } = require('@/types/navigation');

    expect(isDisabled(mockNavItem)).toBe(false);

    mockNavItem.metadata = { disabled: true };
    expect(isDisabled(mockNavItem)).toBe(true);
  });
});
