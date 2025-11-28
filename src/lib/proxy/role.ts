/**
 * Proxy Role Utilities
 *
 * Helper functions for role-based access control in Next.js proxy.
 * These run before page rendering to enforce role requirements.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth/role-guard';
import {
  AUTH_COOKIE_NAMES,
  DEFAULT_UNAUTHORIZED_URL,
} from '@/constants/routes';
import { logUnauthorizedAccess } from './security-log';

/**
 * Extract user role from request cookies
 *
 * @param request - Next.js request object
 * @returns User role string or null if not found
 */
export function getUserRoleFromCookies(request: NextRequest): string | null {
  const role = request.cookies.get(AUTH_COOKIE_NAMES.ROLE)?.value;
  return role ?? null;
}

/**
 * Check if the given role is ADMIN
 *
 * @param role - User role to check
 * @returns True if role is ADMIN
 */
export function hasAdminRole(role: string | null): boolean {
  if (!role) {
    return false;
  }

  return role === UserRole.ADMIN;
}

/**
 * Check if user has a specific role
 *
 * @param userRole - User's current role
 * @param requiredRole - Required role for access
 * @returns True if user has required role
 */
export function hasRole(
  userRole: string | null,
  requiredRole: UserRole
): boolean {
  if (!userRole) {
    return false;
  }

  return userRole === requiredRole;
}

/**
 * Build unauthorized (403) redirect URL
 *
 * Redirects users who lack the required role to the forbidden page.
 *
 * @param request - Next.js request object
 * @param forbiddenUrl - URL to redirect to (default: /403)
 * @returns NextResponse redirect to forbidden page
 */
export function buildUnauthorizedRedirect(
  request: NextRequest,
  forbiddenUrl: string = DEFAULT_UNAUTHORIZED_URL
): NextResponse {
  const url = new URL(forbiddenUrl, request.url);

  // Redirect with 307 (Temporary Redirect) to preserve request method
  return NextResponse.redirect(url, { status: 307 });
}

/**
 * Check admin access and log if unauthorized
 *
 * Combines role checking with security logging for cleaner proxy code.
 *
 * @param request - Next.js request object
 * @param userRole - User's current role
 * @param userId - Optional user ID for logging
 * @returns NextResponse redirect if unauthorized, null if authorized
 */
export function checkAdminAccess(
  request: NextRequest,
  userRole: string | null,
  userId?: string | null
): NextResponse | null {
  if (!hasAdminRole(userRole)) {
    // Log unauthorized access attempt
    logUnauthorizedAccess(request, userRole, UserRole.ADMIN, userId);

    // Redirect to forbidden page
    return buildUnauthorizedRedirect(request);
  }

  // User has admin role, allow access
  return null;
}

/**
 * Extract user ID from request cookies (if available)
 *
 * This is optional and depends on whether you store user ID in cookies.
 * Can be used for more detailed security logging.
 *
 * @param request - Next.js request object
 * @returns User ID or null
 */
export function getUserIdFromCookies(request: NextRequest): string | null {
  // Assuming you might store user ID in a cookie
  // Adjust cookie name as needed based on your implementation
  const userId = request.cookies.get('userId')?.value;
  return userId ?? null;
}
