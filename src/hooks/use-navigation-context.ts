'use client';

import * as React from 'react';
import { NavigationContext } from '@/contexts/navigation-context';
import type { NavigationContextValue } from '@/contexts/navigation-context';
import type { Breadcrumb } from '@/types/navigation';
import type { RouteMetadata } from '@/lib/navigation/route-metadata';

/**
 * Navigation context hooks
 *
 * This file provides hooks for accessing navigation context.
 */

/**
 * Hook to use navigation context
 *
 * @throws Error if used outside of NavigationProvider
 * @returns Navigation context
 */
export function useNavigationContext(): NavigationContextValue {
  const context = React.useContext(NavigationContext);

  if (!context) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider. ' +
        'Make sure to wrap your component tree with <NavigationProvider>.'
    );
  }

  return context;
}

/**
 * Hook to use breadcrumbs from navigation context
 *
 * Convenience hook that only returns breadcrumbs
 */
export function useContextBreadcrumbs(): Breadcrumb[] {
  const { breadcrumbs } = useNavigationContext();
  return breadcrumbs;
}

/**
 * Hook to use current route metadata
 *
 * Convenience hook that only returns route metadata
 */
export function useRouteMetadata(): RouteMetadata | undefined {
  const { routeMetadata } = useNavigationContext();
  return routeMetadata;
}

// Re-export provider and error boundary
export { NavigationProvider } from '@/contexts/navigation-context';
export {
  NavigationProviderWithErrorBoundary,
  NavigationErrorBoundary,
} from '@/contexts/navigation-error-boundary';

export type {
  NavigationContextValue,
  NavigationProviderProps,
} from '@/contexts/navigation-context';
