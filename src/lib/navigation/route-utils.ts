import type { NavItem, Breadcrumb } from '@/types/navigation';

/**
 * Check if a route is currently active
 * Supports exact matches and parent route detection
 */
export const isRouteActive = (href: string, currentPath: string): boolean => {
  if (!href || !currentPath) {
    return false;
  }

  // Normalize paths by removing trailing slashes
  const normalizedHref = href.replace(/\/$/, '') || '/';
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';

  // Exact match
  if (normalizedHref === normalizedPath) {
    return true;
  }

  // Parent route match (but not for root)
  if (
    normalizedHref !== '/' &&
    normalizedPath.startsWith(normalizedHref + '/')
  ) {
    return true;
  }

  return false;
};

/**
 * Find the active navigation item from a list of nav items
 */
export const getActiveNavItem = (
  items: NavItem[],
  currentPath: string
): NavItem | null => {
  for (const item of items) {
    // Check if this item is active
    if (item.href && isRouteActive(item.href, currentPath)) {
      return item;
    }

    // Check children recursively
    if (item.children && item.children.length > 0) {
      const activeChild = getActiveNavItem(item.children, currentPath);
      if (activeChild) {
        return item; // Return the parent item as active
      }
    }
  }

  return null;
};

/**
 * Find the deepest active navigation item (useful for breadcrumbs)
 */
export const getDeepestActiveNavItem = (
  items: NavItem[],
  currentPath: string
): NavItem | null => {
  for (const item of items) {
    // Check if this item is active
    if (item.href && isRouteActive(item.href, currentPath)) {
      // Check if any children are also active (go deeper)
      if (item.children && item.children.length > 0) {
        const activeChild = getDeepestActiveNavItem(item.children, currentPath);
        if (activeChild) {
          return activeChild;
        }
      }
      return item;
    }

    // Check children recursively even if parent isn't active
    if (item.children && item.children.length > 0) {
      const activeChild = getDeepestActiveNavItem(item.children, currentPath);
      if (activeChild) {
        return activeChild;
      }
    }
  }

  return null;
};

/**
 * Build breadcrumb trail from navigation configuration and current path
 */
export const buildBreadcrumbs = (
  currentPath: string,
  navItems: NavItem[]
): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [];

  // Always start with Home
  if (currentPath !== '/') {
    breadcrumbs.push({
      id: 'home',
      label: 'Home',
      href: '/',
    });
  }

  // Find the path to the current item
  const findPathToItem = (
    items: NavItem[],
    targetPath: string,
    currentBreadcrumbs: Breadcrumb[]
  ): Breadcrumb[] | null => {
    for (const item of items) {
      const newBreadcrumbs = [
        ...currentBreadcrumbs,
        {
          id: item.id,
          label: item.label,
          href: item.href,
          icon: item.icon,
        },
      ];

      // First check if any children match (for deepest match preference)
      if (item.children && item.children.length > 0) {
        const childResult = findPathToItem(
          item.children,
          targetPath,
          newBreadcrumbs
        );
        if (childResult) {
          return childResult;
        }
      }

      // Check if this item matches the target
      if (item.href && isRouteActive(item.href, targetPath)) {
        return newBreadcrumbs;
      }
    }

    return null;
  };

  const pathBreadcrumbs = findPathToItem(navItems, currentPath, []);

  if (pathBreadcrumbs) {
    // Add all breadcrumbs from the path, excluding any duplicate Home entries
    const filteredBreadcrumbs = pathBreadcrumbs.filter(
      breadcrumb => breadcrumb.href !== '/' || breadcrumbs.length === 0
    );

    breadcrumbs.push(...filteredBreadcrumbs);
  } else {
    // Fallback: create breadcrumbs from URL segments
    const segments = currentPath.split('/').filter(Boolean);
    let href = '';

    segments.forEach((segment, index) => {
      href += `/${segment}`;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        id: `segment-${index}`,
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        href: isLast ? undefined : href, // Don't link the current page
        current: isLast,
      });
    });
  }

  // Mark the last breadcrumb as current
  if (breadcrumbs.length > 0) {
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    lastBreadcrumb.current = true;
    lastBreadcrumb.href = undefined; // Current page shouldn't be a link
  }

  return breadcrumbs;
};

/**
 * Get navigation items that should be displayed in the top-level navigation
 */
export const getTopLevelNavItems = (
  items: NavItem[],
  isMobile: boolean = false
): NavItem[] => {
  return items.filter(item => {
    const metadata = item.metadata;

    // Filter based on mobile/desktop display preferences
    if (isMobile && metadata?.showInMobile === false) {
      return false;
    }

    if (!isMobile && metadata?.showInDesktop === false) {
      return false;
    }

    // Include by default if no specific display preferences are set
    return true;
  });
};

/**
 * Sort navigation items by their sort order
 */
export const sortNavItems = (items: NavItem[]): NavItem[] => {
  return [...items].sort((a, b) => {
    const orderA = a.metadata?.sortOrder ?? 999;
    const orderB = b.metadata?.sortOrder ?? 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If sort orders are equal, sort alphabetically by label
    return a.label.localeCompare(b.label);
  });
};

/**
 * Check if a navigation item has a badge
 */
export const hasNavItemBadge = (item: NavItem): boolean => {
  return Boolean(item.metadata?.badge);
};

/**
 * Get the badge text for a navigation item
 */
export const getNavItemBadge = (item: NavItem): string | number | undefined => {
  return item.metadata?.badge;
};

/**
 * Get the badge variant for a navigation item
 */
export const getNavItemBadgeVariant = (
  item: NavItem
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info' => {
  return item.metadata?.badgeVariant ?? 'default';
};

/**
 * Check if external link (opens in new tab)
 */
export const isExternalNavItem = (item: NavItem): boolean => {
  return (
    Boolean(item.metadata?.external) || Boolean(item.href?.startsWith('http'))
  );
};

/**
 * Get the target attribute for a navigation item
 */
export const getNavItemTarget = (
  item: NavItem
): '_blank' | '_self' | '_parent' | '_top' | undefined => {
  if (isExternalNavItem(item)) {
    return item.metadata?.target ?? '_blank';
  }

  return item.metadata?.target;
};
