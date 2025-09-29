import type { NavItem } from '@/types/navigation';

/**
 * Filter navigation items based on authentication status
 */
export const filterNavItemsByAuth = (
  items: NavItem[],
  isAuthenticated: boolean
): NavItem[] => {
  return items
    .filter(item => {
      const requiresAuth = item.metadata?.requiredAuth;

      // If item requires auth but user is not authenticated, hide it
      if (requiresAuth && !isAuthenticated) {
        return false;
      }

      return true;
    })
    .map(item => ({
      ...item,
      children: item.children
        ? filterNavItemsByAuth(item.children, isAuthenticated)
        : undefined,
    }));
};

/**
 * Filter navigation items based on user roles
 */
export const filterNavItemsByRoles = (
  items: NavItem[],
  userRoles: string[] = []
): NavItem[] => {
  return items
    .filter(item => {
      const requiredRoles = item.metadata?.requiredRoles;

      // If item requires specific roles, check if user has any of them
      if (requiredRoles && requiredRoles.length > 0) {
        return requiredRoles.some(role => userRoles.includes(role));
      }

      return true;
    })
    .map(item => ({
      ...item,
      children: item.children
        ? filterNavItemsByRoles(item.children, userRoles)
        : undefined,
    }));
};

/**
 * Filter navigation items based on feature flags
 */
export const filterNavItemsByFeatureFlags = (
  items: NavItem[],
  featureFlags: Record<string, boolean> = {}
): NavItem[] => {
  return items
    .filter(item => {
      const requiredFeatureFlag = item.metadata?.featureFlag;

      // If item requires a feature flag, check if it's enabled
      if (requiredFeatureFlag) {
        // eslint-disable-next-line security/detect-object-injection
        return featureFlags[requiredFeatureFlag] === true;
      }

      return true;
    })
    .map(item => ({
      ...item,
      children: item.children
        ? filterNavItemsByFeatureFlags(item.children, featureFlags)
        : undefined,
    }));
};

/**
 * Filter navigation items based on platform (mobile/desktop)
 */
export const filterNavItemsByPlatform = (
  items: NavItem[],
  isMobile: boolean
): NavItem[] => {
  return items
    .filter(item => {
      const metadata = item.metadata;

      if (isMobile) {
        // On mobile, only show items that are explicitly allowed on mobile
        return metadata?.showInMobile !== false;
      } else {
        // On desktop, only show items that are explicitly allowed on desktop
        return metadata?.showInDesktop !== false;
      }
    })
    .map(item => ({
      ...item,
      children: item.children
        ? filterNavItemsByPlatform(item.children, isMobile)
        : undefined,
    }));
};

/**
 * Filter navigation items based on disabled state
 */
export const filterDisabledNavItems = (
  items: NavItem[],
  includeDisabled: boolean = false
): NavItem[] => {
  if (includeDisabled) {
    return items.map(item => ({
      ...item,
      children: item.children
        ? filterDisabledNavItems(item.children, includeDisabled)
        : undefined,
    }));
  }

  return items
    .filter(item => !item.metadata?.disabled)
    .map(item => ({
      ...item,
      children: item.children
        ? filterDisabledNavItems(item.children, includeDisabled)
        : undefined,
    }));
};

/**
 * Comprehensive filter that applies all filtering rules
 */
export interface NavigationFilterOptions {
  isAuthenticated?: boolean;
  userRoles?: string[];
  featureFlags?: Record<string, boolean>;
  isMobile?: boolean;
  includeDisabled?: boolean;
}

export const filterNavigationItems = (
  items: NavItem[],
  options: NavigationFilterOptions = {}
): NavItem[] => {
  const {
    isAuthenticated = false,
    userRoles = [],
    featureFlags = {},
    isMobile = false,
    includeDisabled = false,
  } = options;

  let filteredItems = items;

  // Apply authentication filter
  filteredItems = filterNavItemsByAuth(filteredItems, isAuthenticated);

  // Apply role-based filter
  filteredItems = filterNavItemsByRoles(filteredItems, userRoles);

  // Apply feature flag filter
  filteredItems = filterNavItemsByFeatureFlags(filteredItems, featureFlags);

  // Apply platform filter
  filteredItems = filterNavItemsByPlatform(filteredItems, isMobile);

  // Apply disabled items filter
  filteredItems = filterDisabledNavItems(filteredItems, includeDisabled);

  // Remove items that have no children after filtering (if they only existed for their children)
  filteredItems = filteredItems.filter(item => {
    // If item has an href, it's navigable on its own
    if (item.href) {
      return true;
    }

    // If item has children after filtering, keep it
    if (item.children && item.children.length > 0) {
      return true;
    }

    // Otherwise, remove it
    return false;
  });

  return filteredItems;
};

/**
 * Get visible navigation item count after filtering
 */
export const getVisibleNavItemCount = (
  items: NavItem[],
  options: NavigationFilterOptions = {}
): number => {
  const filteredItems = filterNavigationItems(items, options);

  const countItems = (navItems: NavItem[]): number => {
    return navItems.reduce((count, item) => {
      let itemCount = 1; // Count the item itself

      // Count children recursively
      if (item.children && item.children.length > 0) {
        itemCount += countItems(item.children);
      }

      return count + itemCount;
    }, 0);
  };

  return countItems(filteredItems);
};

/**
 * Check if any navigation items are visible after filtering
 */
export const hasVisibleNavItems = (
  items: NavItem[],
  options: NavigationFilterOptions = {}
): boolean => {
  return getVisibleNavItemCount(items, options) > 0;
};
