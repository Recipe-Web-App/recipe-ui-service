import {
  filterNavItemsByAuth,
  filterNavItemsByRoles,
  filterNavItemsByFeatureFlags,
  filterNavItemsByPlatform,
  filterDisabledNavItems,
  filterNavigationItems,
  getVisibleNavItemCount,
  hasVisibleNavItems,
} from '@/lib/navigation/filter-utils';
import type { NavItem } from '@/types/navigation';
import { BookOpen, Calendar, Heart, Settings } from 'lucide-react';

describe('filter-utils', () => {
  const mockNavItems: NavItem[] = [
    {
      id: 'public',
      label: 'Public Item',
      href: '/public',
      icon: BookOpen,
    },
    {
      id: 'auth-required',
      label: 'Auth Required',
      href: '/private',
      icon: Heart,
      metadata: {
        requiredAuth: true,
      },
    },
    {
      id: 'admin-only',
      label: 'Admin Only',
      href: '/admin',
      icon: Settings,
      metadata: {
        requiredAuth: true,
        requiredRoles: ['admin'],
      },
    },
    {
      id: 'premium-feature',
      label: 'Premium Feature',
      href: '/premium',
      icon: Calendar,
      metadata: {
        featureFlag: 'ENABLE_PREMIUM_FEATURES',
      },
    },
    {
      id: 'mobile-hidden',
      label: 'Desktop Only',
      href: '/desktop',
      metadata: {
        showInMobile: false,
      },
    },
    {
      id: 'desktop-hidden',
      label: 'Mobile Only',
      href: '/mobile',
      metadata: {
        showInDesktop: false,
      },
    },
    {
      id: 'disabled',
      label: 'Disabled Item',
      href: '/disabled',
      metadata: {
        disabled: true,
      },
    },
    {
      id: 'parent-with-children',
      label: 'Parent',
      children: [
        {
          id: 'child-public',
          label: 'Public Child',
          href: '/parent/public',
        },
        {
          id: 'child-auth',
          label: 'Auth Child',
          href: '/parent/auth',
          metadata: {
            requiredAuth: true,
          },
        },
      ],
    },
  ];

  describe('filterNavItemsByAuth', () => {
    it('should show all items when authenticated', () => {
      const filtered = filterNavItemsByAuth(mockNavItems, true);
      expect(filtered).toHaveLength(mockNavItems.length);
    });

    it('should hide auth-required items when not authenticated', () => {
      const filtered = filterNavItemsByAuth(mockNavItems, false);
      const authRequiredItem = filtered.find(
        item => item.id === 'auth-required'
      );
      const adminOnlyItem = filtered.find(item => item.id === 'admin-only');

      expect(authRequiredItem).toBeUndefined();
      expect(adminOnlyItem).toBeUndefined();
    });

    it('should show public items when not authenticated', () => {
      const filtered = filterNavItemsByAuth(mockNavItems, false);
      const publicItem = filtered.find(item => item.id === 'public');

      expect(publicItem).toBeTruthy();
    });

    it('should filter children recursively', () => {
      const filtered = filterNavItemsByAuth(mockNavItems, false);
      const parent = filtered.find(item => item.id === 'parent-with-children');

      expect(parent).toBeTruthy();
      expect(parent?.children).toBeDefined();
      expect(parent?.children).toHaveLength(1); // Only public child should remain
      expect(parent?.children?.[0].id).toBe('child-public');
    });
  });

  describe('filterNavItemsByRoles', () => {
    it('should show items without role requirements', () => {
      const filtered = filterNavItemsByRoles(mockNavItems, []);
      const publicItem = filtered.find(item => item.id === 'public');

      expect(publicItem).toBeTruthy();
    });

    it('should hide items when user lacks required roles', () => {
      const filtered = filterNavItemsByRoles(mockNavItems, ['user']);
      const adminOnlyItem = filtered.find(item => item.id === 'admin-only');

      expect(adminOnlyItem).toBeUndefined();
    });

    it('should show items when user has required roles', () => {
      const filtered = filterNavItemsByRoles(mockNavItems, ['admin']);
      const adminOnlyItem = filtered.find(item => item.id === 'admin-only');

      expect(adminOnlyItem).toBeTruthy();
    });

    it('should work with multiple user roles', () => {
      const filtered = filterNavItemsByRoles(mockNavItems, ['user', 'admin']);
      const adminOnlyItem = filtered.find(item => item.id === 'admin-only');

      expect(adminOnlyItem).toBeTruthy();
    });
  });

  describe('filterNavItemsByFeatureFlags', () => {
    it('should show items without feature flag requirements', () => {
      const filtered = filterNavItemsByFeatureFlags(mockNavItems, {});
      const publicItem = filtered.find(item => item.id === 'public');

      expect(publicItem).toBeTruthy();
    });

    it('should hide items when feature flag is disabled', () => {
      const filtered = filterNavItemsByFeatureFlags(mockNavItems, {
        ENABLE_PREMIUM_FEATURES: false,
      });
      const premiumItem = filtered.find(item => item.id === 'premium-feature');

      expect(premiumItem).toBeUndefined();
    });

    it('should show items when feature flag is enabled', () => {
      const filtered = filterNavItemsByFeatureFlags(mockNavItems, {
        ENABLE_PREMIUM_FEATURES: true,
      });
      const premiumItem = filtered.find(item => item.id === 'premium-feature');

      expect(premiumItem).toBeTruthy();
    });

    it('should hide items when feature flag is missing', () => {
      const filtered = filterNavItemsByFeatureFlags(mockNavItems, {
        OTHER_FEATURE: true,
      });
      const premiumItem = filtered.find(item => item.id === 'premium-feature');

      expect(premiumItem).toBeUndefined();
    });
  });

  describe('filterNavItemsByPlatform', () => {
    it('should filter items for mobile', () => {
      const filtered = filterNavItemsByPlatform(mockNavItems, true);
      const mobileHiddenItem = filtered.find(
        item => item.id === 'mobile-hidden'
      );
      const desktopHiddenItem = filtered.find(
        item => item.id === 'desktop-hidden'
      );

      expect(mobileHiddenItem).toBeUndefined();
      expect(desktopHiddenItem).toBeTruthy();
    });

    it('should filter items for desktop', () => {
      const filtered = filterNavItemsByPlatform(mockNavItems, false);
      const mobileHiddenItem = filtered.find(
        item => item.id === 'mobile-hidden'
      );
      const desktopHiddenItem = filtered.find(
        item => item.id === 'desktop-hidden'
      );

      expect(mobileHiddenItem).toBeTruthy();
      expect(desktopHiddenItem).toBeUndefined();
    });

    it('should include items without platform restrictions', () => {
      const mobileFiltered = filterNavItemsByPlatform(mockNavItems, true);
      const desktopFiltered = filterNavItemsByPlatform(mockNavItems, false);
      const publicItem = 'public';

      expect(mobileFiltered.find(item => item.id === publicItem)).toBeTruthy();
      expect(desktopFiltered.find(item => item.id === publicItem)).toBeTruthy();
    });
  });

  describe('filterDisabledNavItems', () => {
    it('should exclude disabled items by default', () => {
      const filtered = filterDisabledNavItems(mockNavItems);
      const disabledItem = filtered.find(item => item.id === 'disabled');

      expect(disabledItem).toBeUndefined();
    });

    it('should include disabled items when explicitly requested', () => {
      const filtered = filterDisabledNavItems(mockNavItems, true);
      const disabledItem = filtered.find(item => item.id === 'disabled');

      expect(disabledItem).toBeTruthy();
    });

    it('should include enabled items regardless of includeDisabled flag', () => {
      const filteredExclude = filterDisabledNavItems(mockNavItems, false);
      const filteredInclude = filterDisabledNavItems(mockNavItems, true);
      const publicItem = 'public';

      expect(filteredExclude.find(item => item.id === publicItem)).toBeTruthy();
      expect(filteredInclude.find(item => item.id === publicItem)).toBeTruthy();
    });
  });

  describe('filterNavigationItems (comprehensive)', () => {
    it('should apply all filters together', () => {
      const filtered = filterNavigationItems(mockNavItems, {
        isAuthenticated: false,
        userRoles: [],
        featureFlags: { ENABLE_PREMIUM_FEATURES: false },
        isMobile: true,
        includeDisabled: false,
      });

      // Should exclude: auth-required, admin-only, premium-feature, mobile-hidden, disabled
      const excludedIds = [
        'auth-required',
        'admin-only',
        'premium-feature',
        'mobile-hidden',
        'disabled',
      ];
      excludedIds.forEach(id => {
        expect(filtered.find(item => item.id === id)).toBeUndefined();
      });

      // Should include: public, desktop-hidden, parent-with-children (with filtered children)
      expect(filtered.find(item => item.id === 'public')).toBeTruthy();
      expect(filtered.find(item => item.id === 'desktop-hidden')).toBeTruthy();
      expect(
        filtered.find(item => item.id === 'parent-with-children')
      ).toBeTruthy();
    });

    it('should remove parent items that have no href and no visible children', () => {
      const itemsWithEmptyParent: NavItem[] = [
        {
          id: 'empty-parent',
          label: 'Empty Parent',
          children: [
            {
              id: 'auth-child',
              label: 'Auth Child',
              href: '/auth-child',
              metadata: {
                requiredAuth: true,
              },
            },
          ],
        },
        {
          id: 'parent-with-href',
          label: 'Parent with href',
          href: '/parent',
          children: [
            {
              id: 'auth-child-2',
              label: 'Auth Child 2',
              href: '/auth-child-2',
              metadata: {
                requiredAuth: true,
              },
            },
          ],
        },
      ];

      const filtered = filterNavigationItems(itemsWithEmptyParent, {
        isAuthenticated: false,
      });

      // Empty parent should be removed (no href, no visible children)
      expect(filtered.find(item => item.id === 'empty-parent')).toBeUndefined();

      // Parent with href should remain (has href even if no visible children)
      expect(
        filtered.find(item => item.id === 'parent-with-href')
      ).toBeTruthy();
    });

    it('should use default options when none provided', () => {
      const filtered = filterNavigationItems(mockNavItems);

      // Should use defaults: not authenticated, no roles, no feature flags, desktop, exclude disabled
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe('getVisibleNavItemCount', () => {
    it('should count all visible items recursively', () => {
      const count = getVisibleNavItemCount(mockNavItems, {
        isAuthenticated: true,
        featureFlags: { ENABLE_PREMIUM_FEATURES: true },
        isMobile: false,
        includeDisabled: true,
      });

      // Should count: public, auth-required, premium-feature, mobile-hidden, disabled,
      // parent-with-children, child-public, child-auth = 8 items
      // (admin-only is excluded because no admin role provided)
      // (desktop-hidden is excluded because showInDesktop: false)
      expect(count).toBe(8);
    });

    it('should return 0 for empty array', () => {
      const count = getVisibleNavItemCount([]);
      expect(count).toBe(0);
    });

    it('should respect filtering options', () => {
      const count = getVisibleNavItemCount(mockNavItems, {
        isAuthenticated: false,
      });

      // Should exclude auth items, count remaining
      expect(count).toBeLessThan(
        getVisibleNavItemCount(mockNavItems, { isAuthenticated: true })
      );
    });
  });

  describe('hasVisibleNavItems', () => {
    it('should return true when items are visible', () => {
      const hasVisible = hasVisibleNavItems(mockNavItems, {
        isAuthenticated: true,
      });

      expect(hasVisible).toBe(true);
    });

    it('should return false when no items are visible', () => {
      const restrictiveItems: NavItem[] = [
        {
          id: 'auth-only',
          label: 'Auth Only',
          href: '/auth',
          metadata: {
            requiredAuth: true,
          },
        },
      ];

      const hasVisible = hasVisibleNavItems(restrictiveItems, {
        isAuthenticated: false,
      });

      expect(hasVisible).toBe(false);
    });

    it('should return false for empty array', () => {
      const hasVisible = hasVisibleNavItems([]);
      expect(hasVisible).toBe(false);
    });
  });
});
