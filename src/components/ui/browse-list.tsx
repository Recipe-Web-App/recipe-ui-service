'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  browseListVariants,
  browseListContentVariants,
  browseListPaginationVariants,
  browseListStateVariants,
  browseListErrorVariants,
} from '@/lib/ui/browse-list-variants';
import { List, ListItem } from '@/components/ui/list';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { type BrowseListProps, getErrorMessage } from '@/types/ui/browse-list';

/**
 * BrowseList Component
 *
 * A generic, reusable list component for browsing content with built-in support for:
 * - Compact list layout optimized for scanning
 * - Pagination controls
 * - Loading state with skeletons
 * - Empty state with customizable message
 * - Error state with retry functionality
 * - Full TypeScript generic support
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <BrowseList
 *   items={recipes}
 *   renderItem={(recipe) => <RecipeListItem key={recipe.id} recipe={recipe} />}
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 *   loading={isLoading}
 *   emptyMessage="No recipes found"
 * />
 * ```
 *
 * @template T - The type of items in the list
 */
function BrowseListInner<T>(
  {
    // Data
    items,
    renderItem,

    // Pagination
    currentPage = 1,
    totalPages = 1,
    totalItems,
    pageSize = 20,
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

    // List Configuration
    showDividers = false,

    // Skeleton
    skeletonCount = 8,
    renderSkeleton,

    // Styling
    className,
    listClassName,
    paginationClassName,
    spacing = 'default',

    // Pagination Options
    showPagination = true,
    paginationProps,

    // Error Handling
    onRetry,
    renderError,

    // Accessibility
    'aria-label': ariaLabel = 'Browse list',
    'aria-describedby': ariaDescribedBy,

    ...props
  }: BrowseListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // Default skeleton renderer
  const defaultSkeletonRenderer = React.useCallback(
    () => (
      <ListItem className="py-3">
        <div className="flex flex-1 items-center gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </ListItem>
    ),
    []
  );

  // Render error state (check before loading)
  if (error) {
    const errorMessage = getErrorMessage(error);

    return (
      <div
        ref={ref}
        className={cn(browseListVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className={cn(browseListStateVariants({ type: 'error' }))}>
          {renderError ? (
            renderError(error)
          ) : (
            <div className={cn(browseListErrorVariants())}>
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

  // Render loading state
  if (loading) {
    const skeletons = Array.from({ length: skeletonCount }, (_, i) => i);

    return (
      <div
        ref={ref}
        className={cn(browseListVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-busy="true"
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <List
          className={cn(
            browseListContentVariants({
              spacing,
              dividers: showDividers,
            }),
            listClassName
          )}
        >
          {skeletons.map(index => (
            <React.Fragment key={`skeleton-${index}`}>
              {renderSkeleton ? renderSkeleton() : defaultSkeletonRenderer()}
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  }

  // Render empty state
  if (!items || items.length === 0) {
    return (
      <div
        ref={ref}
        className={cn(browseListVariants({ spacing }), className)}
        role="region"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className={cn(browseListStateVariants({ type: 'empty' }))}>
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

  // Render list with items
  return (
    <div
      ref={ref}
      className={cn(browseListVariants({ spacing }), className)}
      role="region"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {/* List Content */}
      <List
        className={cn(
          browseListContentVariants({
            spacing,
            dividers: showDividers,
          }),
          listClassName
        )}
        role="list"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </List>

      {/* Pagination */}
      {showPagination && totalPages > 1 && onPageChange && (
        <div
          className={cn(
            browseListPaginationVariants({ spacing }),
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
 * BrowseList with proper TypeScript generics and forwardRef
 *
 * This wrapper ensures proper type inference for the generic type parameter T
 * while maintaining ref forwarding capabilities.
 */
export const BrowseList = React.forwardRef(BrowseListInner) as <T>(
  props: BrowseListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof BrowseListInner>;

// Set display name for debugging
(BrowseList as React.ForwardRefExoticComponent<unknown>).displayName =
  'BrowseList';

/**
 * Simplified BrowseList for basic use cases without pagination
 */
export interface SimpleBrowseListProps<T>
  extends Omit<
    BrowseListProps<T>,
    | 'currentPage'
    | 'totalPages'
    | 'onPageChange'
    | 'showPagination'
    | 'paginationProps'
  > {
  showPagination?: false;
}

function SimpleBrowseListInner<T>(
  props: SimpleBrowseListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BrowseList<T>
      ref={ref}
      {...props}
      showPagination={false}
      currentPage={1}
      totalPages={1}
      onPageChange={undefined}
    />
  );
}

export const SimpleBrowseList = React.forwardRef(SimpleBrowseListInner) as <T>(
  props: SimpleBrowseListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof SimpleBrowseListInner>;

(SimpleBrowseList as React.ForwardRefExoticComponent<unknown>).displayName =
  'SimpleBrowseList';
