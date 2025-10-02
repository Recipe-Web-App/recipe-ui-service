/**
 * Next.js Middleware
 *
 * Runs authentication checks at the edge before page rendering.
 * Provides performance optimization and security by checking auth
 * before React components load.
 *
 * Features:
 * - Edge-level authentication checks
 * - Public route access (no auth required)
 * - Auth route redirects (login/register redirect if authenticated)
 * - Protected route guards (require authentication)
 * - Return URL preservation
 * - Security headers
 */

import { NextRequest } from 'next/server';
import {
  isPublicRoute,
  isAuthRoute,
  isProtectedRoute,
  isExcludedRoute,
} from '@/constants/routes';
import {
  isAuthenticatedMiddleware,
  buildLoginRedirect,
  buildHomeRedirect,
  continueRequest,
} from '@/lib/middleware/auth';

/**
 * Main middleware function
 *
 * Checks authentication and redirects based on route type:
 * 1. Excluded routes (API, static) - skip middleware
 * 2. Public routes - allow access regardless of auth
 * 3. Auth routes (login, register) - redirect if already authenticated
 * 4. Protected routes - require authentication
 * 5. Unknown routes - default to requiring authentication
 *
 * @param request - Next.js request object
 * @returns NextResponse - redirect or continue
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for API routes, static files, etc.
  if (isExcludedRoute(pathname)) {
    return continueRequest(request);
  }

  // 2. Check authentication status
  const isAuthenticated = isAuthenticatedMiddleware(request);

  // 3. Public routes - accessible to everyone
  if (isPublicRoute(pathname)) {
    return continueRequest(request);
  }

  // 4. Auth routes (login, register) - redirect if already authenticated
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // User is already logged in, redirect to home or returnUrl
      return buildHomeRedirect(request);
    }
    // Allow access to auth pages for non-authenticated users
    return continueRequest(request);
  }

  // 5. Protected routes - require authentication
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login with returnUrl
      return buildLoginRedirect(request);
    }
    // User is authenticated, allow access
    return continueRequest(request);
  }

  // 6. Unknown routes - default to requiring authentication for security
  // If you want unknown routes to be public, change this to continueRequest()
  if (!isAuthenticated) {
    return buildLoginRedirect(request);
  }

  return continueRequest(request);
}

/**
 * Matcher configuration
 *
 * Specifies which routes middleware runs on.
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
