/**
 * Role Protection Utilities
 *
 * Utilities for role-based access control and authorization.
 */

import type { AuthState } from '@/stores/auth-store';
import { UserRole, RoleMatchStrategy } from '@/types/auth';

/**
 * Normalize roles to array format and ensure uppercase
 *
 * @param roles - Single role or array of roles
 * @returns Array of normalized roles
 */
export const normalizeRoles = (roles: UserRole | UserRole[]): UserRole[] => {
  return Array.isArray(roles) ? roles : [roles];
};

/**
 * Get user roles from auth state
 *
 * Supports both user.roles (AuthorizedUser) and future authUser formats
 *
 * @param authState - Authentication state from store
 * @returns Array of user roles or undefined
 */
export const getUserRoles = (authState: AuthState): string[] | undefined => {
  // Check AuthorizedUser.roles first (current implementation)
  if (authState.user?.roles) {
    return authState.user.roles;
  }

  // Future compatibility: check authUser if it has roles
  if (authState.authUser && 'roles' in authState.authUser) {
    return (authState.authUser as { roles?: string[] }).roles;
  }

  return undefined;
};

/**
 * Check if user has required role(s)
 *
 * @param userRoles - User's roles from auth state
 * @param requiredRoles - Required role(s) for access
 * @param strategy - Matching strategy (ANY or ALL)
 * @returns True if user has required role(s), false otherwise
 */
export const hasRole = (
  userRoles: string[] | undefined,
  requiredRoles: UserRole | UserRole[],
  strategy: RoleMatchStrategy = RoleMatchStrategy.ANY
): boolean => {
  // No user roles means no access
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Normalize required roles to array
  const normalizedRequired = normalizeRoles(requiredRoles);

  // Normalize user roles to uppercase for case-insensitive comparison
  const normalizedUserRoles = userRoles.map(role => role.toUpperCase());

  // Check based on strategy
  if (strategy === RoleMatchStrategy.ALL) {
    // User must have ALL required roles
    return normalizedRequired.every(role => normalizedUserRoles.includes(role));
  }

  // Default to ANY: User must have at least ONE required role
  return normalizedRequired.some(role => normalizedUserRoles.includes(role));
};

/**
 * Check if user is admin
 *
 * Convenience method to check for admin role
 *
 * @param authState - Authentication state from store
 * @returns True if user has admin role
 */
export const isAdmin = (authState: AuthState): boolean => {
  const userRoles = getUserRoles(authState);
  return hasRole(userRoles, UserRole.ADMIN);
};

/**
 * Check if user is a standard user (non-admin)
 *
 * Convenience method to check for user role
 *
 * @param authState - Authentication state from store
 * @returns True if user has user role
 */
export const isUser = (authState: AuthState): boolean => {
  const userRoles = getUserRoles(authState);
  return hasRole(userRoles, UserRole.USER);
};
