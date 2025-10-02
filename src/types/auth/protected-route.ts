/**
 * Protected Route Types
 *
 * Type definitions for route protection and authentication guards.
 */

import { ReactNode } from 'react';

/**
 * Configuration options for ProtectedRoute component
 */
export interface ProtectedRouteConfig {
  /**
   * URL to redirect to when user is not authenticated
   * @default '/login'
   */
  loginUrl?: string;

  /**
   * URL to redirect to after successful login
   * If not provided, will use the current URL
   */
  returnUrl?: string;

  /**
   * Query parameter name for storing return URL
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
   * Custom unauthorized component to show when not authenticated
   */
  unauthorizedComponent?: ReactNode;

  /**
   * Callback when user is redirected to login
   */
  onRedirect?: (returnUrl: string) => void;

  /**
   * Callback when authentication check completes
   */
  onAuthCheck?: (isAuthenticated: boolean) => void;
}

/**
 * Props for ProtectedRoute component
 */
export interface ProtectedRouteProps {
  /**
   * Child components to render when authenticated
   */
  children: ReactNode;

  /**
   * Configuration options
   */
  config?: ProtectedRouteConfig;

  /**
   * Custom fallback component when not authenticated
   * Takes precedence over config.unauthorizedComponent
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

/**
 * Return URL storage options
 */
export interface ReturnUrlOptions {
  /**
   * The URL to store as return destination
   */
  url: string;

  /**
   * Query parameter name
   * @default 'returnUrl'
   */
  paramName?: string;
}

/**
 * Authentication check result
 */
export interface AuthCheckResult {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Whether the token is expired
   */
  isTokenExpired: boolean;

  /**
   * Whether auth check is still loading
   */
  isLoading: boolean;

  /**
   * The authenticated user if available
   */
  user: unknown;
}
