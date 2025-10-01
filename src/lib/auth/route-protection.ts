/**
 * Route Protection Utilities
 *
 * Utility functions for handling route protection and authentication checks.
 */

import type { ReturnUrlOptions, AuthCheckResult } from '@/types/auth';
import type { AuthState } from '@/stores/auth-store';

/**
 * Default query parameter name for return URL
 */
export const DEFAULT_RETURN_URL_PARAM = 'returnUrl';

/**
 * Stores the return URL in the URL query parameters
 *
 * @param options - Return URL configuration
 * @returns The login URL with return URL parameter
 *
 * @example
 * ```ts
 * const loginUrl = getReturnUrl({
 *   url: '/recipes',
 *   paramName: 'returnUrl'
 * });
 * // Returns: "/login?returnUrl=%2F recipes"
 * ```
 */
export const getReturnUrl = (options: ReturnUrlOptions): string => {
  const { url, paramName = DEFAULT_RETURN_URL_PARAM } = options;

  // Encode the return URL to safely include in query parameter
  const encodedUrl = encodeURIComponent(url);

  return `?${paramName}=${encodedUrl}`;
};

/**
 * Builds a login redirect URL with return URL parameter
 *
 * @param loginUrl - The login page URL
 * @param returnUrl - The URL to return to after login
 * @param paramName - Query parameter name for return URL
 * @returns Complete login URL with return parameter
 *
 * @example
 * ```ts
 * const url = redirectToLogin('/login', '/recipes', 'returnUrl');
 * // Returns: "/login?returnUrl=%2F recipes"
 * ```
 */
export const redirectToLogin = (
  loginUrl: string,
  returnUrl: string,
  paramName: string = DEFAULT_RETURN_URL_PARAM
): string => {
  const queryString = getReturnUrl({ url: returnUrl, paramName });
  return `${loginUrl}${queryString}`;
};

/**
 * Extracts the return URL from query parameters
 *
 * @param searchParams - URL search parameters
 * @param paramName - Query parameter name
 * @returns The decoded return URL or null
 *
 * @example
 * ```ts
 * const params = new URLSearchParams('returnUrl=%2F recipes');
 * const url = extractReturnUrl(params);
 * // Returns: "/recipes"
 * ```
 */
export const extractReturnUrl = (
  searchParams: URLSearchParams | string,
  paramName: string = DEFAULT_RETURN_URL_PARAM
): string | null => {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams)
      : searchParams;

  const returnUrl = params.get(paramName);

  if (!returnUrl) {
    return null;
  }

  try {
    return decodeURIComponent(returnUrl);
  } catch {
    // If decoding fails, return the raw value
    return returnUrl;
  }
};

/**
 * Checks if the user is authenticated based on auth store state
 *
 * @param authState - Current auth store state
 * @returns Authentication check result
 *
 * @example
 * ```ts
 * const authState = useAuthStore();
 * const result = isAuthenticated(authState);
 * if (result.isAuthenticated && !result.isTokenExpired) {
 *   // User is authenticated with valid token
 * }
 * ```
 */
export const isAuthenticated = (authState: AuthState): AuthCheckResult => {
  const {
    isAuthenticated: authenticated,
    isLoading,
    isTokenExpired,
    authUser,
    user,
    token,
  } = authState;

  // Check if user has a valid token
  const hasValidToken = Boolean(token) && !isTokenExpired();

  // User is considered authenticated if:
  // 1. isAuthenticated flag is true, AND
  // 2. Has a valid (non-expired) token, AND
  // 3. Has either authUser or user data
  const isUserAuthenticated =
    authenticated && hasValidToken && (Boolean(authUser) || Boolean(user));

  return {
    isAuthenticated: isUserAuthenticated,
    isTokenExpired: isTokenExpired(),
    isLoading,
    user: authUser ?? user,
  };
};

/**
 * Validates if a return URL is safe to redirect to
 *
 * Prevents open redirect vulnerabilities by ensuring the URL is relative
 * and doesn't navigate to external sites.
 *
 * @param url - The URL to validate
 * @returns Whether the URL is safe for redirect
 *
 * @example
 * ```ts
 * isSafeReturnUrl('/recipes'); // true
 * isSafeReturnUrl('https://evil.com'); // false
 * isSafeReturnUrl('//evil.com'); // false
 * ```
 */
export const isSafeReturnUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Reject URLs that:
  // 1. Start with http:// or https:// (absolute URLs)
  // 2. Start with // (protocol-relative URLs)
  // 3. Contain newlines or control characters
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//') ||
    /[\n\r]/.test(url)
  ) {
    return false;
  }

  // URL must start with /
  if (!url.startsWith('/')) {
    return false;
  }

  return true;
};

/**
 * Gets a safe return URL, defaulting to a safe fallback if invalid
 *
 * @param url - The URL to validate
 * @param fallback - Fallback URL if validation fails
 * @returns A safe return URL
 *
 * @example
 * ```ts
 * getSafeReturnUrl('/recipes', '/'); // '/recipes'
 * getSafeReturnUrl('https://evil.com', '/'); // '/'
 * ```
 */
export const getSafeReturnUrl = (
  url: string | null,
  fallback: string = '/'
): string => {
  if (!url || !isSafeReturnUrl(url)) {
    return fallback;
  }

  return url;
};
