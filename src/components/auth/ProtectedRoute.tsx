'use client';

/**
 * ProtectedRoute Component
 *
 * A route guard component that ensures users are authenticated before
 * accessing protected content. Handles authentication checks, loading states,
 * and redirects to login with return URL preservation.
 *
 * Features:
 * - Authentication state validation
 * - Token expiration checking
 * - Automatic login redirect with return URL
 * - Configurable loading states
 * - Safe URL redirect validation
 * - Customizable fallback components
 *
 * @example
 * ```tsx
 * // Wrap protected content
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * // With custom configuration
 * <ProtectedRoute
 *   config={{
 *     loginUrl: '/auth/login',
 *     showLoadingState: true,
 *     onRedirect: (url) => console.log('Redirecting to:', url)
 *   }}
 * >
 *   <SettingsPage />
 * </ProtectedRoute>
 * ```
 */

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { isAuthenticated, redirectToLogin } from '@/lib/auth/route-protection';
import { ErrorPage } from '@/components/error/ErrorPage';
import { Spinner } from '@/components/ui/spinner';
import { PageErrorType } from '@/types/error/page-errors';
import { cn } from '@/lib/utils';
import type { ProtectedRouteProps } from '@/types/auth';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  loginUrl: '/login',
  returnUrlParam: 'returnUrl',
  showLoadingState: true,
} as const;

/**
 * ProtectedRoute Component
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  config,
  fallback,
  className,
  'data-testid': testId = 'protected-route',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const authState = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  // Merge default config with provided config
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const {
    loginUrl,
    returnUrlParam,
    showLoadingState,
    loadingComponent,
    unauthorizedComponent,
    onRedirect,
    onAuthCheck,
  } = finalConfig;

  useEffect(() => {
    // Wait for Zustand store to hydrate before checking auth
    if (!authState.hasHydrated) {
      return;
    }

    // Perform authentication check
    const checkAuth = () => {
      const authResult = isAuthenticated(authState);

      // Call onAuthCheck callback if provided
      if (onAuthCheck) {
        onAuthCheck(authResult.isAuthenticated);
      }

      // If not authenticated or token is expired, redirect to login
      if (!authResult.isAuthenticated || authResult.isTokenExpired) {
        const redirectUrl = redirectToLogin(
          loginUrl,
          pathname || '/',
          returnUrlParam
        );

        // Call onRedirect callback if provided
        if (onRedirect) {
          onRedirect(redirectUrl);
        }

        // Redirect to login
        router.push(redirectUrl);
        return;
      }

      // Authentication successful
      setIsChecking(false);
    };

    checkAuth();
  }, [
    authState,
    authState.hasHydrated,
    loginUrl,
    pathname,
    returnUrlParam,
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

  // If not authenticated, show unauthorized fallback
  if (!authResult.isAuthenticated || authResult.isTokenExpired) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }

    // Default unauthorized page
    return (
      <div className={cn(className)} data-testid={`${testId}-unauthorized`}>
        <ErrorPage
          errorType={PageErrorType.UNAUTHORIZED}
          loginUrl={loginUrl}
          homeUrl="/"
        />
      </div>
    );
  }

  // User is authenticated, render protected content
  return (
    <div className={cn(className)} data-testid={testId}>
      {children}
    </div>
  );
};

ProtectedRoute.displayName = 'ProtectedRoute';
