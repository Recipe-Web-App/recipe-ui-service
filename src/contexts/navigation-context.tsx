'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { useNavigationStore } from '@/stores/ui/navigation-store';
import { getFeatureFlags } from '@/lib/features/flags';
import { generateBreadcrumbsFromPath } from '@/lib/navigation/breadcrumb-utils';
import {
  findMatchingRouteMetadata,
  getParentPath,
} from '@/lib/navigation/route-helpers';
import type {
  NavigationContext as INavigationContext,
  Breadcrumb,
} from '@/types/navigation';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';
import type { RouteMetadata } from '@/lib/navigation/route-metadata';

/**
 * Enhanced navigation context with additional helpers
 */
export interface NavigationContextValue extends INavigationContext {
  /** Current route metadata */
  routeMetadata?: RouteMetadata;
  /** Current breadcrumbs */
  breadcrumbs: Breadcrumb[];
  /** Parent route path */
  parentPath: string;
  /** Navigate to a route */
  navigateTo: (path: string) => void;
  /** Navigate back to parent */
  navigateToParent: () => void;
  /** Refresh breadcrumbs */
  refreshBreadcrumbs: () => Promise<void>;
  /** Set custom breadcrumbs (overrides auto-generation) */
  setCustomBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  /** Clear custom breadcrumbs (return to auto-generation) */
  clearCustomBreadcrumbs: () => void;
}

/**
 * Navigation context
 */
const NavigationContext = React.createContext<NavigationContextValue | null>(
  null
);

/**
 * Navigation Provider Props
 */
export interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Navigation Provider Component
 *
 * Provides comprehensive navigation context including:
 * - Current route and metadata
 * - Breadcrumb generation and management
 * - Navigation helpers
 * - Integration with auth, layout, and feature flags
 *
 * This provider should wrap the application at a high level,
 * typically in the root layout or just below it.
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  // Hooks
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { breakpoint } = useLayoutStore();
  const { setBreadcrumbs: setStoreBreadcrumbs } = useNavigationStore();

  // State
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);
  const [customBreadcrumbs, setCustomBreadcrumbs] = React.useState<
    Breadcrumb[] | null
  >(null);
  const [isLoadingBreadcrumbs, setIsLoadingBreadcrumbs] = React.useState(false);

  // Memoized values
  const routeMetadata = React.useMemo(
    () => findMatchingRouteMetadata(pathname),
    [pathname]
  );

  const parentPath = React.useMemo(() => getParentPath(pathname), [pathname]);

  const navigationContext = React.useMemo<INavigationContext>(
    () => ({
      currentPath: pathname,
      isAuthenticated,
      userRoles: user?.roles ?? [],
      featureFlags: getFeatureFlags(),
      isMobile: breakpoint === 'mobile',
    }),
    [pathname, isAuthenticated, user?.roles, breakpoint]
  );

  // Convert BreadcrumbItem to Breadcrumb for store
  const convertToStoreBreadcrumb = (items: BreadcrumbItem[]): Breadcrumb[] => {
    return items.map(item => ({
      id: item.id ?? item.label,
      label: item.label,
      href: item.href,
      icon: undefined, // Store uses LucideIcon, BreadcrumbItem uses string
    }));
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = React.useCallback(async () => {
    setIsLoadingBreadcrumbs(true);

    try {
      const generated = await generateBreadcrumbsFromPath(pathname);
      const converted = convertToStoreBreadcrumb(generated);
      setBreadcrumbs(converted);
      setStoreBreadcrumbs(converted);
    } catch (error) {
      console.error('Error generating breadcrumbs:', error);
      // Fallback to simple breadcrumb
      const fallback: Breadcrumb[] = [{ id: 'home', label: 'Home', href: '/' }];
      setBreadcrumbs(fallback);
      setStoreBreadcrumbs(fallback);
    } finally {
      setIsLoadingBreadcrumbs(false);
    }
  }, [pathname, setStoreBreadcrumbs]);

  // Generate breadcrumbs on mount and route change
  React.useEffect(() => {
    // Skip if custom breadcrumbs are set
    if (customBreadcrumbs) {
      return;
    }

    generateBreadcrumbs();
  }, [pathname, customBreadcrumbs, generateBreadcrumbs]);

  // Navigation helpers
  const navigateTo = React.useCallback((path: string) => {
    window.location.href = path;
  }, []);

  const navigateToParent = React.useCallback(() => {
    if (parentPath) {
      navigateTo(parentPath);
    }
  }, [parentPath, navigateTo]);

  const refreshBreadcrumbs = React.useCallback(async () => {
    await generateBreadcrumbs();
  }, [generateBreadcrumbs]);

  const handleSetCustomBreadcrumbs = React.useCallback(
    (breadcrumbs: Breadcrumb[]) => {
      setCustomBreadcrumbs(breadcrumbs);
      setBreadcrumbs(breadcrumbs);
      setStoreBreadcrumbs(breadcrumbs);
    },
    [setStoreBreadcrumbs]
  );

  const clearCustomBreadcrumbs = React.useCallback(() => {
    setCustomBreadcrumbs(null);
    // Regenerate breadcrumbs
    generateBreadcrumbs();
  }, [generateBreadcrumbs]);

  // Context value
  const contextValue = React.useMemo<NavigationContextValue>(
    () => ({
      ...navigationContext,
      routeMetadata,
      breadcrumbs: customBreadcrumbs ?? breadcrumbs,
      parentPath,
      navigateTo,
      navigateToParent,
      refreshBreadcrumbs,
      setCustomBreadcrumbs: handleSetCustomBreadcrumbs,
      clearCustomBreadcrumbs,
    }),
    [
      navigationContext,
      routeMetadata,
      customBreadcrumbs,
      breadcrumbs,
      parentPath,
      navigateTo,
      navigateToParent,
      refreshBreadcrumbs,
      handleSetCustomBreadcrumbs,
      clearCustomBreadcrumbs,
    ]
  );

  // Show loading indicator if needed (optional)
  if (isLoadingBreadcrumbs && breadcrumbs.length === 0) {
    // Could show a skeleton loader here
    // For now, just continue rendering
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

NavigationProvider.displayName = 'NavigationProvider';

// Export context for use in hooks file
export { NavigationContext };
