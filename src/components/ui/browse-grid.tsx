'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  browseGridVariants,
  browseGridContentVariants,
  browseGridPaginationVariants,
  browseGridStateVariants,
  browseGridErrorVariants,
} from '@/lib/ui/browse-grid-variants';
import { Pagination } from '@/components/ui/pagination';
import { RecipeCardSkeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { type BrowseGridProps, getErrorMessage } from '@/types/ui/browse-grid';

/**
 * BrowseGrid Component
 *
 * A generic, reusable grid component for browsing content with built-in support for:
 * - Responsive grid layout (2/3/4 columns)
 * - Pagination controls
 * - Loading state with skeletons
 * - Empty state with customizable message
 * - Error state with retry functionality
 * - Full TypeScript generic support
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <BrowseGrid
 *   items={recipes}
 *   renderItem={(recipe) => <RecipeCard key={recipe.id} recipe={recipe} />}
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 *   loading={isLoading}
 *   emptyMessage="No recipes found"
 * />
 * ```
 *
 * @template T - The type of items in the grid
 */
function BrowseGridInner<T>(
  {
    // Data
    items,
    renderItem,

    // Pagination
    currentPage = 1,
    totalPages = 1,
    totalItems,
    pageSize = 12,
    onPageChange,
    onPageSizeChange,

    // States
    loading = false,
    error = null,

    // Empty State
    emptyMessage = 'No items found',
    emptyDescription = 'Try adjusting your filters or search terms.',
    emptyIcon,
    emptyActions,

    // Grid Configuration
    columns,
    gap = 'md',

    // Skeleton
    skeletonCount = 12,
    renderSkeleton,

    // Styling
    className,
    gridClassName,
    paginationClassName,
    spacing = 'default',

    // Pagination Options
    showPagination = true,
    paginationProps,

    // Error Handling
    onRetry,
    renderError,

    // Accessibility
    'aria-label': ariaLabel = 'Browse grid',
    'aria-describedby': ariaDescribedBy,

    ...props
  }: BrowseGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // Calculate grid column classes based on custom columns config
  const getGridColumnClasses = React.useMemo(() => {
    if (!columns) return '';

    const classes = [];
    if (columns.mobile) classes.push(`grid-cols-${columns.mobile}`);
    if (columns.tablet) classes.push(`md:grid-cols-${columns.tablet}`);
    if (columns.desktop) classes.push(`lg:grid-cols-${columns.desktop}`);

    return classes.join(' ');
  }, [columns]);

  // Determine if we should use custom columns
  const columnsVariant = columns ? 'custom' : 'default';

  // Render loading state
  if (loading) {
    const skeletons = Array.from({ length: skeletonCount }, (_, i) => i);

    return (
      <div
        ref={ref}
        className={cn(browseGridVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-busy="true"
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div
          className={cn(
            browseGridContentVariants({ gap, columns: columnsVariant }),
            columns && getGridColumnClasses,
            gridClassName
          )}
        >
          {skeletons.map(index =>
            renderSkeleton ? (
              <React.Fragment key={`skeleton-${index}`}>
                {renderSkeleton()}
              </React.Fragment>
            ) : (
              <RecipeCardSkeleton key={`skeleton-${index}`} />
            )
          )}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    const errorMessage = getErrorMessage(error);

    return (
      <div
        ref={ref}
        className={cn(browseGridVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className={cn(browseGridStateVariants({ type: 'error' }))}>
          {renderError ? (
            renderError(error)
          ) : (
            <div className={cn(browseGridErrorVariants())}>
              <AlertTriangle
                className="text-destructive h-12 w-12"
                aria-hidden="true"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Error Loading Content</h3>
                <p className="text-muted-foreground text-sm">{errorMessage}</p>
              </div>
              {onRetry && (
                <Button onClick={onRetry} variant="outline">
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render empty state
  if (!items || items.length === 0) {
    return (
      <div
        ref={ref}
        className={cn(browseGridVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className={cn(browseGridStateVariants({ type: 'empty' }))}>
          <EmptyState variant="default" size="lg">
            {emptyIcon && <EmptyStateIcon>{emptyIcon}</EmptyStateIcon>}
            <EmptyStateTitle>{emptyMessage}</EmptyStateTitle>
            {emptyDescription && (
              <EmptyStateDescription>{emptyDescription}</EmptyStateDescription>
            )}
            {emptyActions && (
              <EmptyStateActions>{emptyActions}</EmptyStateActions>
            )}
          </EmptyState>
        </div>
      </div>
    );
  }

  // Render grid with items
  return (
    <div
      ref={ref}
      className={cn(browseGridVariants({ spacing }), className)}
      role="region"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {/* Grid Content */}
      <div
        className={cn(
          browseGridContentVariants({ gap, columns: columnsVariant }),
          columns && getGridColumnClasses,
          gridClassName
        )}
        role="list"
      >
        {items.map((item, index) => (
          <div key={index} role="listitem">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && onPageChange && (
        <div
          className={cn(
            browseGridPaginationVariants({ spacing }),
            paginationClassName
          )}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            {...paginationProps}
          />
        </div>
      )}
    </div>
  );
}

/**
 * BrowseGrid with proper TypeScript generics and forwardRef
 *
 * This wrapper ensures proper type inference for the generic type parameter T
 * while maintaining ref forwarding capabilities.
 */
export const BrowseGrid = React.forwardRef(BrowseGridInner) as <T>(
  props: BrowseGridProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof BrowseGridInner>;

// Set display name for debugging
(BrowseGrid as React.ForwardRefExoticComponent<unknown>).displayName =
  'BrowseGrid';

/**
 * Simplified BrowseGrid for basic use cases without pagination
 */
export interface SimpleBrowseGridProps<T> extends Omit<
  BrowseGridProps<T>,
  | 'currentPage'
  | 'totalPages'
  | 'onPageChange'
  | 'showPagination'
  | 'paginationProps'
> {
  showPagination?: false;
}

function SimpleBrowseGridInner<T>(
  props: SimpleBrowseGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BrowseGrid<T>
      ref={ref}
      {...props}
      showPagination={false}
      currentPage={1}
      totalPages={1}
      onPageChange={undefined}
    />
  );
}

export const SimpleBrowseGrid = React.forwardRef(SimpleBrowseGridInner) as <T>(
  props: SimpleBrowseGridProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof SimpleBrowseGridInner>;

(SimpleBrowseGrid as React.ForwardRefExoticComponent<unknown>).displayName =
  'SimpleBrowseGrid';
