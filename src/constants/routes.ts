/**
 * Route Constants
 *
 * Defines route patterns for authentication and access control.
 * Used by middleware and route guards to determine access levels.
 */

import { checkSync } from 'recheck';

/**
 * Public routes - accessible without authentication
 * These routes can be accessed by anyone, authenticated or not
 */
export const PUBLIC_ROUTES = [
  '/about',
  '/components-demo',
  '/components-demo/(.*)',
] as const;

/**
 * Auth routes - login, register, password reset
 * These routes should redirect authenticated users to home/dashboard
 * (inverse of protected routes)
 */
export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/logged-out',
] as const;

/**
 * Protected routes - require authentication
 * Users must be logged in to access these routes
 *
 * Note: Patterns using (.*) match the route and all sub-routes
 */
export const PROTECTED_ROUTES = [
  // Home
  '/home',

  // Recipes section
  '/recipes',
  '/recipes/(.*)',

  // Collections section
  '/collections',
  '/collections/(.*)',

  // Meal Plans section
  '/meal-plans',
  '/meal-plans/(.*)',

  // Shopping Lists section
  '/shopping-lists',
  '/shopping-lists/(.*)',

  // Kitchen Feed section
  '/feed',
  '/feed/(.*)',

  // Sous Chef section
  '/sous-chef',
  '/sous-chef/(.*)',

  // Account section
  '/account',
  '/account/(.*)',
] as const;

/**
 * Admin routes - require ADMIN role
 * Users must have admin privileges to access these routes
 */
export const ADMIN_ROUTES = ['/admin', '/admin/(.*)'] as const;

/**
 * API and system routes to exclude from middleware
 * These routes are handled separately and should not trigger auth checks
 */
export const EXCLUDED_ROUTES = [
  '/api/(.*)',
  '/_next/(.*)',
  '/favicon.ico',
  '/manifest.json',
  '/.well-known/(.*)',
] as const;

/**
 * Default redirect URL for authenticated users on auth pages
 */
export const DEFAULT_AUTH_REDIRECT = '/';

/**
 * Default login URL for unauthenticated users on protected pages
 */
export const DEFAULT_LOGIN_URL = '/login';

/**
 * Default unauthorized URL for users without required permissions (403 Forbidden)
 */
export const DEFAULT_UNAUTHORIZED_URL = '/403';

/**
 * Query parameter name for return URL
 */
export const RETURN_URL_PARAM = 'returnUrl';

/**
 * Cookie names for authentication
 */
export const AUTH_COOKIE_NAMES = {
  TOKEN: 'authToken',
  EXPIRES_AT: 'tokenExpiresAt',
  REFRESH_TOKEN: 'refreshToken',
  ROLE: 'userRole',
} as const;

/**
 * Check if a route matches any pattern in the list
 *
 * @param pathname - The pathname to check
 * @param patterns - Array of route patterns (supports wildcards with .*)
 * @returns True if pathname matches any pattern
 */
export function matchesRoutePattern(
  pathname: string,
  patterns: readonly string[]
): boolean {
  return patterns.some(pattern => {
    // Convert pattern to regex
    // Strategy: Replace (.*) pattern with a placeholder, then escape all dots,
    // then replace placeholder back with .* regex pattern
    let regexPattern = pattern;

    // Step 1: Replace (.*) with a unique placeholder
    const placeholder = '__WILDCARD__';
    regexPattern = regexPattern.replace(/\(\.\*\)/g, placeholder);

    // Step 2: Escape all remaining dots
    regexPattern = regexPattern.replace(/\./g, '\\.');

    // Step 3: Replace placeholder with .* regex pattern
    regexPattern = regexPattern.replace(new RegExp(placeholder, 'g'), '.*');

    // Step 4: Build final regex pattern
    const finalPattern = `^${regexPattern}$`;

    // Step 5: Validate regex safety using industry-standard 'recheck' library
    // recheck analyzes the pattern for ReDoS (Regular Expression Denial of Service) vulnerabilities
    // This protects against malicious regex patterns that could cause exponential backtracking
    const recheckResult = checkSync(finalPattern, '');

    // If pattern is vulnerable to ReDoS attacks, reject it and fall back to safe exact match
    if (recheckResult.status === 'vulnerable') {
      return pattern === pathname;
    }

    try {
      // Safe to construct RegExp - pattern has been validated by recheck
      // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
      const regex = new RegExp(finalPattern); // eslint-disable-line security/detect-non-literal-regexp
      return regex.test(pathname);
    } catch {
      // If regex construction fails, fall back to exact match
      return pattern === pathname;
    }
  });
}

/**
 * Check if route is public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  return matchesRoutePattern(pathname, PUBLIC_ROUTES);
}

/**
 * Check if route is auth-only (redirect if authenticated)
 */
export function isAuthRoute(pathname: string): boolean {
  return matchesRoutePattern(pathname, AUTH_ROUTES);
}

/**
 * Check if route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return matchesRoutePattern(pathname, PROTECTED_ROUTES);
}

/**
 * Check if route is admin-only (requires ADMIN role)
 */
export function isAdminRoute(pathname: string): boolean {
  return matchesRoutePattern(pathname, ADMIN_ROUTES);
}

/**
 * Check if route should be excluded from middleware
 */
export function isExcludedRoute(pathname: string): boolean {
  return matchesRoutePattern(pathname, EXCLUDED_ROUTES);
}
