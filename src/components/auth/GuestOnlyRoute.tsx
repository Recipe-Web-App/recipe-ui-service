'use client';

/**
 * GuestOnlyRoute Component
 *
 * A route guard component that ensures only unauthenticated users can access
 * certain pages (like login/register). Authenticated users are automatically
 * redirected to a safe destination.
 *
 * Features:
 * - Authentication state validation (inverse of ProtectedRoute)
 * - Redirects authenticated users to home or returnUrl
 * - Safe URL validation to prevent open redirects
 * - Configurable loading states
 * - Customizable fallback components
 * - Callback hooks for auth events
 *
 * @example
 * ```tsx
 * // Wrap guest-only pages (login, register)
 * <GuestOnlyRoute>
 *   <LoginPage />
 * </GuestOnlyRoute>
 *
 * // With custom configuration
 * <GuestOnlyRoute
 *   config={{
 *     redirectUrl: '/dashboard',
 *     onRedirect: (url) => console.log('Redirecting to:', url)
 *   }}
 * >
 *   <RegisterPage />
 * </GuestOnlyRoute>
 * ```
 */

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { isAuthenticated, redirectToHome } from '@/lib/auth/route-protection';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { GuestOnlyRouteProps } from '@/types/auth';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  redirectUrl: '/',
  returnUrlParam: 'returnUrl',
  showLoadingState: true,
} as const;

/**
 * GuestOnlyRoute Component
 */
export const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({
  children,
  config,
  fallback,
  className,
  'data-testid': testId = 'guest-only-route',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  // Merge default config with provided config
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const {
    redirectUrl,
    returnUrlParam,
    showLoadingState,
    loadingComponent,
    authenticatedComponent,
    onRedirect,
    onAuthCheck,
  } = finalConfig;

  useEffect(() => {
    // Perform authentication check
    const checkAuth = () => {
      const authResult = isAuthenticated(authState);

      // Call onAuthCheck callback if provided
      if (onAuthCheck) {
        onAuthCheck(authResult.isAuthenticated);
      }

      // If authenticated (and token is valid), redirect to home/returnUrl
      if (authResult.isAuthenticated && !authResult.isTokenExpired) {
        const destination = redirectToHome(
          searchParams,
          redirectUrl,
          returnUrlParam
        );

        // Call onRedirect callback if provided
        if (onRedirect) {
          onRedirect(destination);
        }

        // Redirect authenticated user away from guest-only page
        router.push(destination);
        return;
      }

      // User is not authenticated (or token expired), allow access
      setIsChecking(false);
    };

    checkAuth();
  }, [
    authState,
    redirectUrl,
    returnUrlParam,
    searchParams,
    router,
    onRedirect,
    onAuthCheck,
  ]);

  // Show loading state while checking authentication
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
        aria-label="Checking authentication"
      >
        <Spinner size="lg" />
      </div>
    );
  }

  // Check authentication state one more time before rendering
  const authResult = isAuthenticated(authState);

  // If authenticated with valid token, show fallback (before redirect completes)
  if (authResult.isAuthenticated && !authResult.isTokenExpired) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (authenticatedComponent) {
      return <>{authenticatedComponent}</>;
    }

    // Default: show nothing (redirect is happening)
    return null;
  }

  // User is NOT authenticated, render guest-only content
  return (
    <div className={cn(className)} data-testid={testId}>
      {children}
    </div>
  );
};

GuestOnlyRoute.displayName = 'GuestOnlyRoute';
