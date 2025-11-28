/**
 * Next.js Proxy
 *
 * Runs authentication checks before page rendering.
 * Provides performance optimization and security by checking auth
 * before React components load.
 *
 * Features:
 * - Request-level authentication checks
 * - Public route access (no auth required)
 * - Auth route redirects (login/register redirect if authenticated)
 * - Protected route guards (require authentication)
 * - Return URL preservation
 * - Security headers with CSP nonce generation
 * - Role-based access control
 *
 * Note: As of Next.js 16, proxy runs on Node.js runtime (not Edge).
 */

import { NextRequest } from 'next/server';
import {
  isPublicRoute,
  isAuthRoute,
  isProtectedRoute,
  isAdminRoute,
  isExcludedRoute,
} from '@/constants/routes';
import {
  isAuthenticatedMiddleware,
  buildLoginRedirect,
  buildHomeRedirect,
  continueRequest,
} from '@/lib/proxy/auth';
import { checkAdminAccess, getUserRoleFromCookies } from '@/lib/proxy/role';
import {
  generateNonce,
  applySecurityHeaders,
  CUSTOM_HEADERS,
} from '@/lib/proxy/headers';

/**
 * Main proxy function
 *
 * Checks authentication and redirects based on route type:
 * 1. Generate nonce for CSP
 * 2. Excluded routes (API, static) - skip proxy
 * 3. Public routes - allow access regardless of auth
 * 4. Auth routes (login, register) - redirect if already authenticated
 * 5. Protected routes - require authentication
 * 6. Admin routes - require authentication AND admin role
 * 7. Unknown routes - default to requiring authentication
 *
 * All responses include security headers with CSP nonce.
 *
 * @param request - Next.js request object
 * @returns NextResponse - redirect or continue
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Generate nonce for Content Security Policy
  const nonce = generateNonce();

  // Add nonce to request headers so it's accessible in the app
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CUSTOM_HEADERS.NONCE, nonce);

  // 2. Skip proxy for API routes, static files, etc.
  if (isExcludedRoute(pathname)) {
    const response = continueRequest(request, nonce);
    return applySecurityHeaders(request, response, nonce);
  }

  // 3. Check authentication status
  const isAuthenticated = isAuthenticatedMiddleware(request);

  // 4. Public routes - accessible to everyone
  if (isPublicRoute(pathname)) {
    const response = continueRequest(request, nonce);
    return applySecurityHeaders(request, response, nonce);
  }

  // 5. Auth routes (login, register) - redirect if already authenticated
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // User is already logged in, redirect to home or returnUrl
      const response = buildHomeRedirect(request);
      return applySecurityHeaders(request, response, nonce);
    }
    // Allow access to auth pages for non-authenticated users
    const response = continueRequest(request, nonce);
    return applySecurityHeaders(request, response, nonce);
  }

  // 6. Admin routes - require authentication AND admin role
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login with returnUrl
      const response = buildLoginRedirect(request);
      return applySecurityHeaders(request, response, nonce);
    }

    // Check if user has admin role
    const userRole = getUserRoleFromCookies(request);
    const adminCheckResult = checkAdminAccess(request, userRole);

    // If user doesn't have admin role, redirect to forbidden page
    if (adminCheckResult) {
      return applySecurityHeaders(request, adminCheckResult, nonce);
    }

    // User is authenticated with admin role, allow access
    const response = continueRequest(request, nonce);
    return applySecurityHeaders(request, response, nonce);
  }

  // 7. Protected routes - require authentication
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login with returnUrl
      const response = buildLoginRedirect(request);
      return applySecurityHeaders(request, response, nonce);
    }
    // User is authenticated, allow access
    const response = continueRequest(request, nonce);
    return applySecurityHeaders(request, response, nonce);
  }

  // 8. Unknown routes - default to requiring authentication for security
  // If you want unknown routes to be public, change this to continueRequest()
  if (!isAuthenticated) {
    const response = buildLoginRedirect(request);
    return applySecurityHeaders(request, response, nonce);
  }

  const response = continueRequest(request, nonce);
  return applySecurityHeaders(request, response, nonce);
}

/**
 * Matcher configuration
 *
 * Specifies which routes proxy runs on.
 * Excludes:
 * - API routes (/api/*)
 * - Static files (_next/static/*)
 * - Image optimization (_next/image/*)
 * - Favicon and other assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
};
