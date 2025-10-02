'use client';

import * as React from 'react';
import { NavigationProvider } from './navigation-context';
import type { NavigationProviderProps } from './navigation-context';

/**
 * Navigation error boundary component
 * Catches navigation-specific errors and provides fallback UI
 */
interface NavigationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class NavigationErrorBoundary extends React.Component<
  NavigationErrorBoundaryProps,
  NavigationErrorBoundaryState
> {
  constructor(props: NavigationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): NavigationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'Navigation Error Boundary caught an error:',
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Navigation temporarily unavailable
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced navigation provider with error boundary
 */
export const NavigationProviderWithErrorBoundary: React.FC<
  NavigationProviderProps & { fallback?: React.ReactNode }
> = ({ children, fallback }) => (
  <NavigationErrorBoundary fallback={fallback}>
    <NavigationProvider>{children}</NavigationProvider>
  </NavigationErrorBoundary>
);

NavigationProviderWithErrorBoundary.displayName =
  'NavigationProviderWithErrorBoundary';
