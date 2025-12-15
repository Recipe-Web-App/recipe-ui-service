'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useBreadcrumbStore } from '@/stores/ui/breadcrumb-store';
import {
  generateBreadcrumbsFromPath,
  enrichBreadcrumbsWithContext,
  filterBreadcrumbsByAuth,
  getBreadcrumbConfig,
} from '@/lib/navigation/breadcrumb-utils';
import type { BreadcrumbItem, BreadcrumbConfig } from '@/types/ui/breadcrumb';
import type { NavigationContext } from '@/types/navigation';
import { useLayoutStore } from '@/stores/ui/layout-store';
import { getFeatureFlags } from '@/lib/features/flags';

/**
 * Hook options for breadcrumb generation
 */
export interface UseBreadcrumbsOptions {
  /** Custom breadcrumb configuration */
  config?: Partial<BreadcrumbConfig>;
  /** Custom breadcrumbs to use instead of auto-generation */
  customBreadcrumbs?: BreadcrumbItem[];
  /** Whether to enable auto-refresh on route change (default: true) */
  autoRefresh?: boolean;
  /** Whether to filter by authentication status (default: true) */
  filterByAuth?: boolean;
  /** Whether to enrich with context (default: true) */
  enrichWithContext?: boolean;
}

/**
 * Hook return type
 */
export interface UseBreadcrumbsReturn {
  /** Current breadcrumb items */
  breadcrumbs: BreadcrumbItem[];
  /** Whether breadcrumbs are being loaded */
  isLoading: boolean;
  /** Error if breadcrumb generation failed */
  error: Error | null;
  /** Manually refresh breadcrumbs */
  refresh: () => Promise<void>;
  /** Set custom breadcrumbs */
  setCustom: (breadcrumbs: BreadcrumbItem[]) => void;
  /** Clear custom breadcrumbs and return to auto-generation */
  clearCustom: () => void;
  /** Breadcrumb configuration */
  config: BreadcrumbConfig;
}

/**
 * Enhanced breadcrumb hook with full route metadata integration
 *
 * This hook provides intelligent breadcrumb generation using:
 * - Route metadata for accurate labels and icons
 * - Dynamic route parameter resolution
 * - Recipe-specific navigation patterns
 * - Authentication and feature flag filtering
 * - Context enrichment
 *
 * @example
 * ```tsx
 * const { breadcrumbs, isLoading } = useBreadcrumbs();
 *
 * return (
 *   <Breadcrumb items={breadcrumbs} />
 * );
 * ```
 *
 * @example With custom config
 * ```tsx
 * const { breadcrumbs } = useBreadcrumbs({
 *   config: {
 *     maxItems: 3,
 *     showHome: false,
 *   }
 * });
 * ```
 *
 * @example With custom breadcrumbs
 * ```tsx
 * const { breadcrumbs, setCustom } = useBreadcrumbs();
 *
 * useEffect(() => {
 *   // Override auto-generated breadcrumbs
 *   setCustom([
 *     { label: 'Home', href: '/' },
 *     { label: 'Custom Page' },
 *   ]);
 * }, []);
 * ```
 */
export function useBreadcrumbs(
  options: UseBreadcrumbsOptions = {}
): UseBreadcrumbsReturn {
  const {
    config: customConfig,
    customBreadcrumbs: initialCustomBreadcrumbs,
    autoRefresh = true,
    filterByAuth = true,
    enrichWithContext = true,
  } = options;

  // Hooks
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { breakpoint } = useLayoutStore();

  // Get custom breadcrumbs reactively from global store
  // This triggers re-renders when the store updates (unlike .subscribe() which doesn't)
  const storeCustomBreadcrumbs = useBreadcrumbStore(
    state => state.customBreadcrumbs
  );

  // State
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);
  const [customBreadcrumbs, setCustomBreadcrumbs] = React.useState<
    BreadcrumbItem[] | null
  >(initialCustomBreadcrumbs ?? null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Memoized navigation context
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

  // Get breadcrumb config
  const config = React.useMemo<BreadcrumbConfig>(() => {
    const defaultConfig = getBreadcrumbConfig(pathname);
    return {
      ...defaultConfig,
      ...customConfig,
    };
  }, [pathname, customConfig]);

  // Generate breadcrumbs
  const generateBreadcrumbs = React.useCallback(async () => {
    // Check global store for custom breadcrumbs FIRST (shared across components)
    const storeCustomBreadcrumbs =
      useBreadcrumbStore.getState().customBreadcrumbs;
    if (storeCustomBreadcrumbs) {
      setBreadcrumbs(storeCustomBreadcrumbs);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Then check local custom breadcrumbs (from hook options)
    if (customBreadcrumbs) {
      setBreadcrumbs(customBreadcrumbs);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate breadcrumbs from path
      let generated = await generateBreadcrumbsFromPath(pathname, config);

      // Filter by auth if enabled
      if (filterByAuth) {
        generated = filterBreadcrumbsByAuth(generated, isAuthenticated);
      }

      // Enrich with context if enabled
      if (enrichWithContext) {
        generated = enrichBreadcrumbsWithContext(generated, navigationContext);
      }

      setBreadcrumbs(generated);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to generate breadcrumbs');
      setError(error);
      console.error('Error generating breadcrumbs:', error);

      // Set fallback breadcrumbs
      setBreadcrumbs([{ id: 'home', label: 'Home', href: '/' }]);
    } finally {
      setIsLoading(false);
    }
  }, [
    pathname,
    config,
    customBreadcrumbs,
    filterByAuth,
    enrichWithContext,
    isAuthenticated,
    navigationContext,
  ]);

  // Auto-refresh on route change
  React.useEffect(() => {
    if (autoRefresh) {
      generateBreadcrumbs();
    }
  }, [pathname, autoRefresh, generateBreadcrumbs]);

  // Manual refresh
  const refresh = React.useCallback(async () => {
    await generateBreadcrumbs();
  }, [generateBreadcrumbs]);

  // Set custom breadcrumbs
  const setCustom = React.useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setCustomBreadcrumbs(breadcrumbs);
    setBreadcrumbs(breadcrumbs);
    setIsLoading(false);
    setError(null);
  }, []);

  // Clear custom breadcrumbs
  const clearCustom = React.useCallback(() => {
    setCustomBreadcrumbs(null);
    // Will trigger regeneration via useEffect
  }, []);

  return {
    // Prioritize global store breadcrumbs (set by RecipeViewPage) over local state
    breadcrumbs: storeCustomBreadcrumbs ?? breadcrumbs,
    isLoading: storeCustomBreadcrumbs ? false : isLoading,
    error: storeCustomBreadcrumbs ? null : error,
    refresh,
    setCustom,
    clearCustom,
    config,
  };
}

/**
 * Simple breadcrumb hook that only returns breadcrumbs
 *
 * Convenience wrapper around useBreadcrumbs for simple use cases
 */
export function useSimpleBreadcrumbs(
  config?: Partial<BreadcrumbConfig>
): BreadcrumbItem[] {
  const { breadcrumbs } = useBreadcrumbs({ config });
  return breadcrumbs;
}

/**
 * Hook to check if breadcrumbs should be shown for current route
 *
 * Some routes (like auth pages) may not need breadcrumbs
 */
export function useShouldShowBreadcrumbs(): boolean {
  const pathname = usePathname();

  return React.useMemo(() => {
    // Hide breadcrumbs on auth routes
    const authRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
    ];

    if (authRoutes.some(route => pathname.startsWith(route))) {
      return false;
    }

    // Hide breadcrumbs on home page (optional)
    if (pathname === '/') {
      return false;
    }

    // Show breadcrumbs for all other routes
    return true;
  }, [pathname]);
}

/**
 * Hook to get the current breadcrumb (last item in trail)
 */
export function useCurrentBreadcrumb(): BreadcrumbItem | undefined {
  const { breadcrumbs } = useBreadcrumbs();

  return React.useMemo(() => {
    return breadcrumbs[breadcrumbs.length - 1];
  }, [breadcrumbs]);
}

/**
 * Hook to get breadcrumb at a specific index
 */
export function useBreadcrumbAtIndex(
  index: number
): BreadcrumbItem | undefined {
  const { breadcrumbs } = useBreadcrumbs();

  return React.useMemo(() => {
    // eslint-disable-next-line security/detect-object-injection
    return breadcrumbs[index];
  }, [breadcrumbs, index]);
}

/**
 * Hook to get the home breadcrumb (first item)
 */
export function useHomeBreadcrumb(): BreadcrumbItem | undefined {
  return useBreadcrumbAtIndex(0);
}

/**
 * Hook to get parent breadcrumb (second to last item)
 */
export function useParentBreadcrumb(): BreadcrumbItem | undefined {
  const { breadcrumbs } = useBreadcrumbs();

  return React.useMemo(() => {
    if (breadcrumbs.length < 2) {
      return undefined;
    }
    return breadcrumbs[breadcrumbs.length - 2];
  }, [breadcrumbs]);
}
