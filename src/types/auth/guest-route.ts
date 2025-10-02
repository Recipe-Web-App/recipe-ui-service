/**
 * Guest Route Types
 *
 * Type definitions for guest-only route protection that redirects authenticated users.
 */

import { ReactNode } from 'react';

/**
 * Configuration options for GuestOnlyRoute component
 */
export interface GuestOnlyRouteConfig {
  /**
   * URL to redirect to when user is authenticated
   * @default '/'
   */
  redirectUrl?: string;

  /**
   * Query parameter name for extracting return URL
   * When present, authenticated users will be redirected to this URL
   * @default 'returnUrl'
   */
  returnUrlParam?: string;

  /**
   * Show loading spinner while checking authentication
   * @default true
   */
  showLoadingState?: boolean;

  /**
   * Custom loading component to show during auth check
   */
  loadingComponent?: ReactNode;

  /**
   * Custom component to show when user is authenticated
   * (before redirect happens)
   */
  authenticatedComponent?: ReactNode;

  /**
   * Callback when authenticated user is redirected
   */
  onRedirect?: (redirectUrl: string) => void;

  /**
   * Callback when authentication check completes
   */
  onAuthCheck?: (isAuthenticated: boolean) => void;
}

/**
 * Props for GuestOnlyRoute component
 */
export interface GuestOnlyRouteProps {
  /**
   * Child components to render when NOT authenticated (guest users)
   */
  children: ReactNode;

  /**
   * Configuration options
   */
  config?: GuestOnlyRouteConfig;

  /**
   * Custom fallback component when user is authenticated
   * Takes precedence over config.authenticatedComponent
   */
  fallback?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}
