'use client';

/**
 * RoleGuard Component
 *
 * A role-based access control component that restricts content based on user roles.
 * Ensures users are both authenticated AND have the required role(s) before
 * accessing protected content.
 *
 * Features:
 * - Role-based authorization (ADMIN, USER)
 * - Single or multiple role support
 * - Configurable matching strategy (ANY/ALL)
 * - Authentication check before role check
 * - Configurable loading states
 * - Customizable fallback components
 * - Event callbacks for observability
 *
 * @example
 * ```tsx
 * // Admin-only content
 * <RoleGuard config={{ roles: UserRole.ADMIN }}>
 *   <AdminDashboard />
 * </RoleGuard>
 *
 * // Multiple roles (user needs at least one)
 * <RoleGuard
 *   config={{
 *     roles: [UserRole.ADMIN, UserRole.USER],
 *     matchStrategy: RoleMatchStrategy.ANY
 *   }}
 * >
 *   <SharedContent />
 * </RoleGuard>
 *
 * // Multiple roles (user needs all of them)
 * <RoleGuard
 *   config={{
 *     roles: [UserRole.ADMIN, UserRole.USER],
 *     matchStrategy: RoleMatchStrategy.ALL
 *   }}
 * >
 *   <RestrictedContent />
 * </RoleGuard>
 * ```
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { isAuthenticated } from '@/lib/auth/route-protection';
import {
  hasRole,
  getUserRoles,
  normalizeRoles,
} from '@/lib/auth/role-protection';
import { ErrorPage } from '@/components/error/ErrorPage';
import { Spinner } from '@/components/ui/spinner';
import { PageErrorType } from '@/types/error/page-errors';
import { cn } from '@/lib/utils';
import { RoleMatchStrategy, type RoleGuardProps } from '@/types/auth';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  matchStrategy: RoleMatchStrategy.ANY,
  fallbackUrl: '/unauthorized',
  showLoadingState: true,
} as const;

/**
 * RoleGuard Component
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  config,
  fallback,
  className,
  'data-testid': testId = 'role-guard',
}) => {
  const router = useRouter();
  const authState = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  // Merge default config with provided config
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const {
    roles,
    matchStrategy,
    fallbackUrl,
    showLoadingState,
    loadingComponent,
    unauthorizedComponent,
    onRoleCheck,
    onRedirect,
  } = finalConfig;

  useEffect(() => {
    // Perform authentication and role check
    const checkRoleAccess = () => {
      // First, check if user is authenticated
      const authResult = isAuthenticated(authState);

      // If not authenticated, redirect to login
      if (!authResult.isAuthenticated || authResult.isTokenExpired) {
        // User needs to login first
        router.push('/login');
        return;
      }

      // Get user roles
      const userRoles = getUserRoles(authState);

      // Check if user has required role(s)
      const hasRequiredRole = hasRole(userRoles, roles, matchStrategy);

      // Call onRoleCheck callback if provided
      if (onRoleCheck) {
        onRoleCheck(hasRequiredRole, userRoles);
      }

      // If user doesn't have required role, handle unauthorized access
      if (!hasRequiredRole) {
        // Call onRedirect callback if provided
        if (onRedirect && fallbackUrl) {
          onRedirect(fallbackUrl);
        }

        // Only redirect if fallbackUrl is provided
        if (fallbackUrl && fallbackUrl !== '/unauthorized') {
          router.push(fallbackUrl);
          return;
        }

        // Otherwise show unauthorized UI (no redirect)
        setIsChecking(false);
        return;
      }

      // User has required role, allow access
      setIsChecking(false);
    };

    checkRoleAccess();
  }, [
    authState,
    roles,
    matchStrategy,
    fallbackUrl,
    router,
    onRoleCheck,
    onRedirect,
  ]);

  // Show loading state while checking authentication and roles
  if (isChecking) {
    if (!showLoadingState) {
      return null;
    }

    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div
        className={cn(
          'flex min-h-screen items-center justify-center',
          className
        )}
        data-testid={`${testId}-loading`}
        role="status"
        aria-label="Checking role permissions"
      >
        <Spinner size="lg" />
      </div>
    );
  }

  // Check role access one more time before rendering
  const authResult = isAuthenticated(authState);
  const userRoles = getUserRoles(authState);
  const hasRequiredRole = hasRole(userRoles, roles, matchStrategy);

  // If not authenticated or doesn't have required role, show unauthorized fallback
  if (
    !authResult.isAuthenticated ||
    authResult.isTokenExpired ||
    !hasRequiredRole
  ) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }

    // Get required roles for display
    const requiredRolesArray = normalizeRoles(roles);
    const requiredRolesString = requiredRolesArray.join(', ');

    // Default unauthorized page
    return (
      <div className={cn(className)} data-testid={`${testId}-unauthorized`}>
        <ErrorPage
          errorType={PageErrorType.FORBIDDEN}
          title="Access Denied"
          description={`You do not have the required permissions to access this page. Required role(s): ${requiredRolesString}`}
          homeUrl="/"
        />
      </div>
    );
  }

  // User has required role, render protected content
  return (
    <div className={cn(className)} data-testid={testId}>
      {children}
    </div>
  );
};

RoleGuard.displayName = 'RoleGuard';
