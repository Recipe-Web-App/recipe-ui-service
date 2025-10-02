/**
 * Middleware Authentication Utilities
 *
 * Helper functions for Next.js middleware authentication checks.
 * These run at the edge before page rendering.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAMES,
  DEFAULT_LOGIN_URL,
  DEFAULT_AUTH_REDIRECT,
  RETURN_URL_PARAM,
} from '@/constants/routes';

/**
 * Extract auth token from request cookies
 *
 * @param request - Next.js request object
 * @returns Auth token string or null if not found
 */
export function getAuthTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get(AUTH_COOKIE_NAMES.TOKEN)?.value;
  return token ?? null;
}

/**
 * Extract token expiration timestamp from cookies
 *
 * @param request - Next.js request object
 * @returns Expiration timestamp or null
 */
export function getTokenExpiresAt(request: NextRequest): number | null {
  const expiresAt = request.cookies.get(AUTH_COOKIE_NAMES.EXPIRES_AT)?.value;
  return expiresAt ? Number(expiresAt) : null;
}

/**
 * Check if token is expired
 *
 * @param expiresAt - Token expiration timestamp
 * @returns True if token is expired
 */
export function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) {
    return true;
  }

  // Add 5 minute buffer for safety
  const bufferMs = 5 * 60 * 1000;
  return Date.now() >= expiresAt - bufferMs;
}

/**
 * Check if user has valid authentication
 *
 * @param request - Next.js request object
 * @returns True if user is authenticated with valid token
 */
export function isAuthenticatedMiddleware(request: NextRequest): boolean {
  const token = getAuthTokenFromCookies(request);
  const expiresAt = getTokenExpiresAt(request);

  if (!token) {
    return false;
  }

  if (isTokenExpired(expiresAt)) {
    return false;
  }

  return true;
}

/**
 * Build login redirect URL with return URL parameter
 *
 * @param request - Next.js request object
 * @param loginUrl - Login page URL
 * @returns NextResponse redirect to login with returnUrl
 */
export function buildLoginRedirect(
  request: NextRequest,
  loginUrl: string = DEFAULT_LOGIN_URL
): NextResponse {
  const { pathname, search } = request.nextUrl;

  // Build return URL (current path + query string)
  const returnUrl = search ? `${pathname}${search}` : pathname;

  // Create URL with return parameter
  const url = new URL(loginUrl, request.url);
  url.searchParams.set(RETURN_URL_PARAM, returnUrl);

  // Redirect with 307 (Temporary Redirect) to preserve request method
  return NextResponse.redirect(url, { status: 307 });
}

/**
 * Build home redirect URL (for authenticated users on auth pages)
 *
 * Checks for returnUrl in query params and validates it's safe.
 * Falls back to default redirect if no safe returnUrl found.
 *
 * @param request - Next.js request object
 * @param redirectUrl - Default redirect URL
 * @returns NextResponse redirect to home/returnUrl
 */
export function buildHomeRedirect(
  request: NextRequest,
  redirectUrl: string = DEFAULT_AUTH_REDIRECT
): NextResponse {
  const { searchParams } = request.nextUrl;

  // Check for returnUrl in query params
  const returnUrl = searchParams.get(RETURN_URL_PARAM);

  // Validate returnUrl is safe (must be relative, start with /)
  const safeReturnUrl = validateReturnUrl(returnUrl);

  // Use returnUrl if safe, otherwise use default
  const targetUrl = safeReturnUrl ?? redirectUrl;

  const url = new URL(targetUrl, request.url);

  // Redirect with 307 (Temporary Redirect) to preserve request method
  return NextResponse.redirect(url, { status: 307 });
}

/**
 * Validate return URL is safe for redirect
 *
 * Prevents open redirect vulnerabilities by ensuring URL is relative.
 *
 * @param url - Return URL to validate
 * @returns Safe URL or null if invalid
 */
export function validateReturnUrl(url: string | null): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Reject absolute URLs (http://, https://, //)
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//')
  ) {
    return null;
  }

  // Reject URLs with newlines or control characters
  if (/[\n\r]/.test(url)) {
    return null;
  }

  // URL must start with /
  if (!url.startsWith('/')) {
    return null;
  }

  return url;
}

/**
 * Add security headers to response
 *
 * @param response - Next.js response object
 * @returns Response with security headers
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers if not already present
  if (!response.headers.has('X-Content-Type-Options')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  if (!response.headers.has('X-Frame-Options')) {
    response.headers.set('X-Frame-Options', 'DENY');
  }

  if (!response.headers.has('X-XSS-Protection')) {
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  if (!response.headers.has('Referrer-Policy')) {
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  return response;
}

/**
 * Create response that continues to next middleware/page
 *
 * @param _request - Next.js request object (unused, for consistency with other functions)
 * @returns NextResponse that continues the chain
 */
export function continueRequest(_request: NextRequest): NextResponse {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}
