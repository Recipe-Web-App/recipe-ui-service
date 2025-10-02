'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  useBreadcrumbs,
  useShouldShowBreadcrumbs,
  type UseBreadcrumbsOptions,
} from '@/hooks/use-breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BreadcrumbConfig } from '@/types/ui/breadcrumb';

/**
 * Auto Breadcrumb Component Props
 */
export interface AutoBreadcrumbProps {
  /** Custom breadcrumb configuration */
  config?: Partial<BreadcrumbConfig>;
  /** Custom class name for the breadcrumb container */
  className?: string;
  /** Whether to show loading skeleton (default: true) */
  showLoadingSkeleton?: boolean;
  /** Whether to show error state (default: true) */
  showError?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Whether to auto-hide when no breadcrumbs (default: true) */
  autoHide?: boolean;
  /** Additional breadcrumb options */
  options?: Omit<UseBreadcrumbsOptions, 'config'>;
  /** Custom wrapper component */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  /** Callback when breadcrumbs are clicked */
  onBreadcrumbClick?: (href: string) => void;
}

/**
 * Auto Breadcrumb Component
 *
 * Automatically generates and displays breadcrumbs for the current route.
 * Integrates with the enhanced breadcrumb hook to provide:
 * - Intelligent breadcrumb generation from route metadata
 * - Loading states with skeleton
 * - Error handling
 * - Auto-hide on certain routes
 * - Responsive behavior
 *
 * This component is designed to be used in layouts for automatic
 * breadcrumb rendering without manual configuration.
 *
 * @example
 * ```tsx
 * // In a layout component
 * <AutoBreadcrumb />
 * ```
 *
 * @example With custom config
 * ```tsx
 * <AutoBreadcrumb
 *   config={{
 *     maxItems: 4,
 *     showHome: true,
 *     separator: 'slash'
 *   }}
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <AutoBreadcrumb
 *   className="mb-6"
 *   wrapper={({ children }) => (
 *     <div className="bg-muted p-4 rounded-lg">
 *       {children}
 *     </div>
 *   )}
 * />
 * ```
 */
export const AutoBreadcrumb = React.forwardRef<
  HTMLElement,
  AutoBreadcrumbProps
>(
  (
    {
      config,
      className,
      showLoadingSkeleton = true,
      showError = true,
      errorMessage = 'Unable to load navigation',
      autoHide = true,
      options = {},
      wrapper: Wrapper,
      onBreadcrumbClick,
    },
    ref
  ) => {
    // Hooks
    const shouldShow = useShouldShowBreadcrumbs();
    const {
      breadcrumbs,
      isLoading,
      error,
      config: breadcrumbConfig,
    } = useBreadcrumbs({
      config,
      ...options,
    });

    // Auto-hide logic
    if (autoHide && !shouldShow) {
      return null;
    }

    // Hide if no breadcrumbs (unless loading or error)
    if (!isLoading && !error && breadcrumbs.length === 0) {
      return null;
    }

    // Loading state
    if (isLoading && showLoadingSkeleton) {
      const skeletonContent = (
        <div
          className={cn('flex items-center gap-2', className)}
          role="status"
          aria-label="Loading breadcrumbs"
        >
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
      );

      return Wrapper ? <Wrapper>{skeletonContent}</Wrapper> : skeletonContent;
    }

    // Error state
    if (error && showError) {
      const errorContent = (
        <div
          className={cn(
            'text-destructive flex items-center gap-2 text-sm',
            className
          )}
          role="alert"
          aria-live="polite"
        >
          <span>⚠</span>
          <span>{errorMessage}</span>
        </div>
      );

      return Wrapper ? <Wrapper>{errorContent}</Wrapper> : errorContent;
    }

    // Render breadcrumbs
    const breadcrumbContent = (
      <Breadcrumb
        ref={ref}
        items={breadcrumbs}
        separator={breadcrumbConfig.separator}
        maxItems={breadcrumbConfig.maxItems}
        showHome={breadcrumbConfig.showHome}
        className={className}
        onClick={
          onBreadcrumbClick
            ? (e: React.MouseEvent<HTMLElement>) => {
                const target = e.target as HTMLElement;
                const anchor = target.closest('a');
                if (anchor?.href) {
                  e.preventDefault();
                  onBreadcrumbClick(anchor.href);
                }
              }
            : undefined
        }
      />
    );

    return Wrapper ? <Wrapper>{breadcrumbContent}</Wrapper> : breadcrumbContent;
  }
);

AutoBreadcrumb.displayName = 'AutoBreadcrumb';

/**
 * Breadcrumb Header Component
 *
 * A pre-styled breadcrumb container for use in page headers.
 * Wraps AutoBreadcrumb with consistent header styling.
 *
 * @example
 * ```tsx
 * <BreadcrumbHeader />
 * ```
 */
export const BreadcrumbHeader: React.FC<
  Omit<AutoBreadcrumbProps, 'wrapper' | 'className'> & {
    className?: string;
    /** Whether to show border below (default: true) */
    showBorder?: boolean;
  }
> = ({ className, showBorder = true, ...props }) => {
  return (
    <div
      className={cn(
        'py-3',
        showBorder && 'border-b',
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur',
        className
      )}
    >
      <AutoBreadcrumb {...props} className="container" />
    </div>
  );
};

BreadcrumbHeader.displayName = 'BreadcrumbHeader';

/**
 * Inline Breadcrumb Component
 *
 * A minimal breadcrumb for inline use within content.
 * Smaller and less prominent than the standard breadcrumb.
 *
 * @example
 * ```tsx
 * <InlineBreadcrumb />
 * ```
 */
export const InlineBreadcrumb: React.FC<AutoBreadcrumbProps> = ({
  className,
  config,
  ...props
}) => {
  return (
    <AutoBreadcrumb
      className={cn('text-sm', className)}
      config={{
        showHome: false,
        maxItems: 3,
        ...config,
      }}
      {...props}
    />
  );
};

InlineBreadcrumb.displayName = 'InlineBreadcrumb';

/**
 * Minimal Breadcrumb Component
 *
 * Ultra-compact breadcrumb for space-constrained layouts.
 * Shows only the parent and current page.
 *
 * @example
 * ```tsx
 * <MinimalBreadcrumb />
 * ```
 */
export const MinimalBreadcrumb: React.FC<AutoBreadcrumbProps> = ({
  className,
  config,
  ...props
}) => {
  return (
    <AutoBreadcrumb
      className={cn('text-xs', className)}
      config={{
        showHome: false,
        maxItems: 2,
        separator: 'arrow',
        ...config,
      }}
      showLoadingSkeleton={false}
      showError={false}
      {...props}
    />
  );
};

MinimalBreadcrumb.displayName = 'MinimalBreadcrumb';

/**
 * Sticky Breadcrumb Component
 *
 * Breadcrumb that sticks to the top of the viewport on scroll.
 * Useful for long pages where navigation context is important.
 *
 * @example
 * ```tsx
 * <StickyBreadcrumb />
 * ```
 */
export const StickyBreadcrumb: React.FC<
  AutoBreadcrumbProps & {
    /** Offset from top in pixels (default: 0) */
    topOffset?: number;
    /** Z-index for sticky positioning (default: 40) */
    zIndex?: number;
  }
> = ({ className, topOffset = 0, zIndex = 40, ...props }) => {
  return (
    <div
      className={cn(
        'sticky border-b',
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur',
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex,
      }}
    >
      <AutoBreadcrumb {...props} className="container py-2" />
    </div>
  );
};

StickyBreadcrumb.displayName = 'StickyBreadcrumb';
