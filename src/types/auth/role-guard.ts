/**
 * Role Guard Types
 *
 * Type definitions for role-based access control and authorization guards.
 */

import { ReactNode } from 'react';

/**
 * User roles enum matching database schema
 * Supports ADMIN and USER roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

/**
 * Strategy for matching multiple roles
 */
export enum RoleMatchStrategy {
  /**
   * User must have at least one of the required roles
   */
  ANY = 'any',

  /**
   * User must have all of the required roles
   */
  ALL = 'all',
}

/**
 * Configuration options for RoleGuard component
 */
export interface RoleGuardConfig {
  /**
   * Required role(s) for access
   * Can be a single role or array of roles
   */
  roles: UserRole | UserRole[];

  /**
   * Strategy for matching multiple roles
   * @default RoleMatchStrategy.ANY
   */
  matchStrategy?: RoleMatchStrategy;

  /**
   * URL to redirect to when user lacks required role
   * @default '/unauthorized'
   */
  fallbackUrl?: string;

  /**
   * Show loading spinner while checking roles
   * @default true
   */
  showLoadingState?: boolean;

  /**
   * Custom loading component to show during role check
   */
  loadingComponent?: ReactNode;

  /**
   * Custom unauthorized component to show when user lacks role
   */
  unauthorizedComponent?: ReactNode;

  /**
   * Callback when role check completes
   */
  onRoleCheck?: (hasRole: boolean, userRoles?: string[]) => void;

  /**
   * Callback when user is redirected due to insufficient permissions
   */
  onRedirect?: (redirectUrl: string) => void;
}

/**
 * Props for RoleGuard component
 */
export interface RoleGuardProps {
  /**
   * Child components to render when user has required role
   */
  children: ReactNode;

  /**
   * Configuration options
   */
  config: RoleGuardConfig;

  /**
   * Custom fallback component when user lacks role
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
 * Role check result
 */
export interface RoleCheckResult {
  /**
   * Whether the user has the required role(s)
   */
  hasRole: boolean;

  /**
   * The user's roles
   */
  userRoles: string[] | undefined;

  /**
   * Required roles being checked
   */
  requiredRoles: UserRole[];

  /**
   * Strategy used for matching
   */
  strategy: RoleMatchStrategy;
}
