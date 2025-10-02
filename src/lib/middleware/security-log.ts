/**
 * Security Logging Utilities
 *
 * Centralized security event logging for middleware.
 * Logs unauthorized access attempts and other security events
 * for monitoring and audit purposes.
 */

import { NextRequest } from 'next/server';

/**
 * Security event types
 */
export enum SecurityEventType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
}

/**
 * Security log entry structure
 */
export interface SecurityLogEntry {
  timestamp: string;
  event: SecurityEventType;
  path: string;
  ip: string | null;
  userAgent: string | null;
  userRole?: string | null;
  requiredRole?: string;
  userId?: string | null;
  reason?: string;
}

/**
 * Extract client IP from request
 *
 * @param request - Next.js request object
 * @returns Client IP address or null if not available
 */
function getClientIp(request: NextRequest): string | null {
  // Try X-Forwarded-For header (from proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Try X-Real-IP header
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to request IP (may not be available in all environments)
  // @ts-expect-error - request.ip exists in Next.js but not typed in all versions
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return request.ip ?? null;
}

/**
 * Extract user agent from request
 *
 * @param request - Next.js request object
 * @returns User agent string or null
 */
function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent');
}

/**
 * Create a structured security log entry
 *
 * @param request - Next.js request object
 * @param event - Security event type
 * @param metadata - Additional metadata for the log entry
 * @returns Structured log entry
 */
export function createSecurityLogEntry(
  request: NextRequest,
  event: SecurityEventType,
  metadata?: {
    userRole?: string | null;
    requiredRole?: string;
    userId?: string | null;
    reason?: string;
  }
): SecurityLogEntry {
  return {
    timestamp: new Date().toISOString(),
    event,
    path: request.nextUrl.pathname,
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
    ...metadata,
  };
}

/**
 * Log a security event to console
 *
 * In production, this could be extended to send logs to:
 * - Sentry
 * - DataDog
 * - CloudWatch
 * - Custom logging service
 *
 * @param logEntry - Security log entry to log
 */
export function logSecurityEvent(logEntry: SecurityLogEntry): void {
  // Use console.warn for security events to ensure visibility
  console.warn('[SECURITY EVENT]', JSON.stringify(logEntry, null, 2));
}

/**
 * Log unauthorized access attempt
 *
 * Called when a user tries to access a resource they don't have permission for.
 *
 * @param request - Next.js request object
 * @param userRole - User's current role
 * @param requiredRole - Role required for access
 * @param userId - Optional user ID for tracking
 */
export function logUnauthorizedAccess(
  request: NextRequest,
  userRole: string | null,
  requiredRole: string,
  userId?: string | null
): void {
  const logEntry = createSecurityLogEntry(
    request,
    SecurityEventType.UNAUTHORIZED_ACCESS,
    {
      userRole,
      requiredRole,
      userId,
    }
  );

  logSecurityEvent(logEntry);
}

/**
 * Log authentication failure
 *
 * Called when authentication check fails.
 *
 * @param request - Next.js request object
 * @param reason - Reason for authentication failure
 */
export function logAuthenticationFailure(
  request: NextRequest,
  reason: string
): void {
  const logEntry = createSecurityLogEntry(
    request,
    SecurityEventType.AUTHENTICATION_FAILURE,
    {
      reason,
    }
  );

  logSecurityEvent(logEntry);
}

/**
 * Log invalid token event
 *
 * Called when a token is malformed or invalid.
 *
 * @param request - Next.js request object
 */
export function logInvalidToken(request: NextRequest): void {
  const logEntry = createSecurityLogEntry(
    request,
    SecurityEventType.INVALID_TOKEN
  );

  logSecurityEvent(logEntry);
}

/**
 * Log expired token event
 *
 * Called when a token has expired.
 *
 * @param request - Next.js request object
 */
export function logExpiredToken(request: NextRequest): void {
  const logEntry = createSecurityLogEntry(
    request,
    SecurityEventType.EXPIRED_TOKEN
  );

  logSecurityEvent(logEntry);
}
