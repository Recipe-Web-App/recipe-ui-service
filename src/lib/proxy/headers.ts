/**
 * Security Headers Utilities
 *
 * Centralized security header management for Next.js proxy.
 * Implements Content Security Policy (CSP) with nonce-based protection,
 * Permissions-Policy, HSTS, and other security best practices.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Header names used for passing data between proxy and app
 */
export const CUSTOM_HEADERS = {
  NONCE: 'X-Nonce',
} as const;

/**
 * Generate a cryptographically secure nonce for CSP
 *
 * Uses crypto.randomUUID() for secure random generation.
 * Nonces should be unique per request to prevent replay attacks.
 *
 * @returns Base64-encoded random nonce string
 */
export function generateNonce(): string {
  // Use crypto.randomUUID() for cryptographically secure random values
  // Convert to base64 for use in CSP header
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

/**
 * Build Content Security Policy header value
 *
 * Implements nonce-based CSP with strict-dynamic for modern browsers.
 * Environment-aware: allows unsafe-eval in development for hot reloading.
 *
 * @param nonce - Unique nonce for this request
 * @param isDevelopment - Whether running in development mode
 * @param options - Optional CSP configuration
 * @returns CSP header value string
 */
export function buildCSPHeader(
  nonce: string,
  isDevelopment = false,
  options: {
    enableGoogleAnalytics?: boolean;
    reportUri?: string | null;
  } = {}
): string {
  const { enableGoogleAnalytics = false, reportUri = null } = options;

  // Base directives for all environments
  const directives: Record<string, string> = {
    // Default to same-origin for all resources
    'default-src': "'self'",

    // Scripts: self-hosted + nonce-based inline scripts + strict-dynamic
    // Note: 'strict-dynamic' allows scripts loaded by trusted scripts
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // Development only: allow eval for hot reloading
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      // Optional: Google Analytics
      ...(enableGoogleAnalytics
        ? [
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
          ]
        : []),
    ].join(' '),

    // Styles: self-hosted + nonce-based inline styles
    'style-src': ["'self'", `'nonce-${nonce}'`].join(' '),

    // Images: self + data URIs + blob (for uploaded/generated images) + https (for external images)
    'img-src': ["'self'", 'blob:', 'data:', 'https:'].join(' '),

    // Fonts: self + data URIs (for inline fonts)
    'font-src': ["'self'", 'data:'].join(' '),

    // AJAX/WebSocket: self + microservice URLs
    // Note: In production, this should list specific microservice domains
    'connect-src': [
      "'self'",
      // Allow .local domains for local development with ingress
      ...(isDevelopment
        ? [
            'http://sous-chef-proxy.local',
            'http://sous-chef-proxy.local',
            'http://sous-chef-proxy.local',
            'http://sous-chef-proxy.local',
            'http://sous-chef-proxy.local',
            'http://sous-chef-proxy.local',
            'ws://localhost:*', // WebSocket connections in dev
          ]
        : []),
      // Optional: Google Analytics
      ...(enableGoogleAnalytics
        ? [
            'https://www.google-analytics.com',
            'https://stats.g.doubleclick.net',
          ]
        : []),
    ].join(' '),

    // Prevent plugins (Flash, Java, etc.)
    'object-src': "'none'",

    // Restrict base tag URLs to prevent base tag hijacking
    'base-uri': "'self'",

    // Restrict form submissions to same origin
    'form-action': "'self'",

    // Prevent embedding in iframes (clickjacking protection)
    'frame-ancestors': "'none'",

    // Block framing entirely
    'frame-src': "'none'",

    // Media sources
    'media-src': ["'self'", 'blob:', 'data:'].join(' '),

    // Worker sources (Service Workers, Web Workers)
    'worker-src': ["'self'", 'blob:'].join(' '),

    // Manifest files
    'manifest-src': "'self'",
  };

  // Production-only directives
  if (!isDevelopment) {
    // Upgrade insecure requests to HTTPS
    directives['upgrade-insecure-requests'] = '';
  }

  // CSP violation reporting (optional, disabled by default)
  if (reportUri) {
    directives['report-uri'] = reportUri;
  }

  // Build CSP string
  const cspString = Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ');

  // Remove extra whitespace and return
  return cspString.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Build Permissions-Policy header value
 *
 * Controls which browser features can be used by the page.
 * Default: restrict most features to same-origin only.
 *
 * @returns Permissions-Policy header value string
 */
export function buildPermissionsPolicy(): string {
  const policies = [
    // Camera and microphone: deny by default (can enable if needed)
    'camera=()',
    'microphone=()',

    // Geolocation: deny by default
    'geolocation=()',

    // Payment APIs: self only
    'payment=(self)',

    // USB/Serial/Bluetooth: deny
    'usb=()',
    'serial=()',
    'bluetooth=()',

    // Screen sharing: deny
    'display-capture=()',

    // Ambient light sensor: deny
    'ambient-light-sensor=()',

    // Accelerometer/Gyroscope: deny
    'accelerometer=()',
    'gyroscope=()',

    // Magnetometer: deny
    'magnetometer=()',

    // Interest cohort (FLoC): deny
    'interest-cohort=()',

    // Full screen: self only
    'fullscreen=(self)',

    // Picture-in-Picture: self only
    'picture-in-picture=(self)',
  ];

  return policies.join(', ');
}

/**
 * Build Strict-Transport-Security (HSTS) header value
 *
 * Forces HTTPS for all future requests.
 * Should ONLY be used in production with valid HTTPS certificates.
 *
 * @returns HSTS header value string
 */
export function buildHSTSHeader(): string {
  // max-age: 1 year (31536000 seconds)
  // includeSubDomains: apply to all subdomains
  // preload: eligible for browser preload lists (optional, requires registration)
  return 'max-age=31536000; includeSubDomains';
}

/**
 * Apply all security headers to a NextResponse
 *
 * Centralized function to apply CSP, Permissions-Policy, HSTS,
 * and other security headers to all proxy responses.
 *
 * @param request - Next.js request object
 * @param response - Next.js response object to modify
 * @param nonce - Unique nonce for CSP (generated per request)
 * @returns Modified response with security headers
 */
export function applySecurityHeaders(
  request: NextRequest,
  response: NextResponse,
  nonce: string
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Check if Google Analytics is enabled
  const enableGoogleAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

  // CSP violation reporting endpoint (disabled by default)
  const reportUri = process.env.CSP_REPORT_URI ?? null;

  // 1. Content Security Policy
  const cspHeader = buildCSPHeader(nonce, isDevelopment, {
    enableGoogleAnalytics,
    reportUri,
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. X-Content-Type-Options: Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 3. X-Frame-Options: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // 4. X-XSS-Protection: Enable browser XSS filter (legacy but harmless)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 5. Referrer-Policy: Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Permissions-Policy: Control browser features
  const permissionsPolicy = buildPermissionsPolicy();
  response.headers.set('Permissions-Policy', permissionsPolicy);

  // 7. HSTS: Force HTTPS (production only)
  if (isProduction) {
    const hstsHeader = buildHSTSHeader();
    response.headers.set('Strict-Transport-Security', hstsHeader);
  }

  // 8. X-DNS-Prefetch-Control: Control DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

/**
 * Extract nonce from request headers
 *
 * Used by the app to access the nonce for inline scripts/styles.
 *
 * @param request - Next.js request object
 * @returns Nonce string or null if not found
 */
export function getNonceFromRequest(request: NextRequest): string | null {
  return request.headers.get(CUSTOM_HEADERS.NONCE);
}
