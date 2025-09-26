'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { getSubNavigation } from '@/config/navigation';
import { getFeatureFlags } from '@/lib/features/flags';
import type { NavItem, NavigationContext } from '@/types/navigation';

/**
 * Extract the main section from a pathname
 * Examples:
 * - '/recipes/create' -> 'recipes'
 * - '/meal-plans/123' -> 'meal-plans'
 * - '/components-demo/button' -> 'components-demo'
 */
const extractSectionFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || 'home';
};

/**
 * Filter navigation items based on authentication, roles, and feature flags
 */
const filterNavigationItems = (
  items: NavItem[],
  context: NavigationContext
): NavItem[] => {
  return items.filter(item => {
    // Check authentication requirement
    if (item.metadata?.requiredAuth && !context.isAuthenticated) {
      return false;
    }

    // Check role requirements
    if (item.metadata?.requiredRoles?.length) {
      const hasRequiredRole = item.metadata.requiredRoles.some(role =>
        context.userRoles?.includes(role)
      );
      if (!hasRequiredRole) {
        return false;
      }
    }

    // Check feature flag
    if (item.metadata?.featureFlag) {
      const flagEnabled = context.featureFlags?.[item.metadata.featureFlag];
      if (!flagEnabled) {
        return false;
      }
    }

    // Check mobile/desktop visibility
    if (context.isMobile && item.metadata?.showInMobile === false) {
      return false;
    }
    if (!context.isMobile && item.metadata?.showInDesktop === false) {
      return false;
    }

    // Check if item is disabled
    if (item.metadata?.disabled) {
      return false;
    }

    return true;
  });
};

/**
 * Sort navigation items by sort order
 */
const sortNavigationItems = (items: NavItem[]): NavItem[] => {
  return [...items].sort((a, b) => {
    const orderA = a.metadata?.sortOrder ?? 999;
    const orderB = b.metadata?.sortOrder ?? 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort by label for consistent ordering
    return a.label.localeCompare(b.label);
  });
};

/**
 * Hook to get contextual sub-navigation based on current route
 *
 * This hook:
 * 1. Determines the current section from the pathname
 * 2. Fetches the appropriate sub-navigation items
 * 3. Filters items based on authentication, roles, and feature flags
 * 4. Sorts items by their defined order
 *
 * @returns Filtered and sorted sub-navigation items for the current section
 */
export const useSubNavigation = (): NavItem[] => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { breakpoint } = useLayoutStore();

  // Memoize the navigation context to avoid unnecessary recalculations
  const navigationContext = React.useMemo<NavigationContext>(
    () => ({
      currentPath: pathname,
      isAuthenticated,
      userRoles: user?.roles ?? [],
      featureFlags: getFeatureFlags(),
      isMobile: breakpoint === 'mobile',
    }),
    [pathname, isAuthenticated, user?.roles, breakpoint]
  );

  // Get the current section from the pathname
  const currentSection = React.useMemo(() => {
    return extractSectionFromPath(pathname);
  }, [pathname]);

  // Get, filter, and sort sub-navigation items
  const subNavigation = React.useMemo(() => {
    // Get raw sub-navigation items for the current section
    const rawItems = getSubNavigation(currentSection);

    if (!rawItems.length) {
      return [];
    }

    // Filter items based on context
    const filteredItems = filterNavigationItems(rawItems, navigationContext);

    // Sort items by their order
    const sortedItems = sortNavigationItems(filteredItems);

    return sortedItems;
  }, [currentSection, navigationContext]);

  return subNavigation;
};

/**
 * Hook to get the current navigation section
 *
 * @returns The current section identifier (e.g., 'recipes', 'meal-plans')
 */
export const useCurrentSection = (): string => {
  const pathname = usePathname();

  return React.useMemo(() => {
    return extractSectionFromPath(pathname);
  }, [pathname]);
};

/**
 * Hook to check if a specific navigation item should be visible
 *
 * @param item - The navigation item to check
 * @returns Whether the item should be visible
 */
export const useNavItemVisibility = (item: NavItem): boolean => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { breakpoint } = useLayoutStore();

  const navigationContext = React.useMemo<NavigationContext>(
    () => ({
      currentPath: pathname,
      isAuthenticated,
      userRoles: user?.roles ?? [],
      featureFlags: getFeatureFlags(),
      isMobile: breakpoint === 'mobile',
    }),
    [pathname, isAuthenticated, user?.roles, breakpoint]
  );

  return React.useMemo(() => {
    const filteredItems = filterNavigationItems([item], navigationContext);
    return filteredItems.length > 0;
  }, [item, navigationContext]);
};

/**
 * Hook to get breadcrumbs for the current route
 *
 * This is a simplified implementation that generates breadcrumbs
 * based on the pathname segments. Can be enhanced with route metadata.
 *
 * @returns Array of breadcrumb items
 */
export const useBreadcrumbs = () => {
  const pathname = usePathname();

  return React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return [{ label: 'Home', href: '/', current: true }];
    }

    const breadcrumbs = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;

      // Format segment for display (capitalize and replace hyphens)
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        label,
        href: isLast ? undefined : href,
        current: isLast,
        ...(isLast ? {} : { current: false }),
      };
    });

    // Add home breadcrumb at the beginning
    return [{ label: 'Home', href: '/' }, ...breadcrumbs];
  }, [pathname]);
};
