'use client';

import * as React from 'react';
import { BrowseList } from '@/components/ui/browse-list';
import {
  WebRecipeListItem,
  WebRecipeListItemSkeleton,
} from '@/components/recipe/WebRecipeListItem';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type WebRecipeBrowseListProps } from '@/types/recipe/web-recipe-browse';
import { type WebRecipeCardData } from '@/types/ui/web-recipe-card';

/**
 * WebRecipeBrowseList Component
 *
 * A specialized list component for browsing external web recipes.
 * Wraps BrowseList with WebRecipeListItem for a streamlined API.
 *
 * **Features:**
 * - Type-safe web recipe list with WebRecipeListItem integration
 * - External recipe action handlers (open, import, copy)
 * - Loading state with skeletons
 * - Empty state with web-specific defaults
 * - Error handling with retry functionality
 * - Full pagination support
 * - Compact horizontal layout
 *
 * @example
 * ```tsx
 * // Basic usage
 * <WebRecipeBrowseList
 *   recipes={webRecipes}
 *   loading={isLoading}
 *   onOpenExternal={(recipe) => window.open(recipe.url, '_blank')}
 *   onCopyLink={(recipe) => navigator.clipboard.writeText(recipe.url)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pagination
 * <WebRecipeBrowseList
 *   recipes={webRecipes}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   onImport={(recipe) => importRecipe(recipe.url)}
 * />
 * ```
 */
export const WebRecipeBrowseList = React.forwardRef<
  HTMLDivElement,
  WebRecipeBrowseListProps
>(
  (
    {
      // Data
      recipes,

      // Pagination
      currentPage,
      totalPages,
      totalItems,
      pageSize = 20,
      onPageChange,
      onPageSizeChange,

      // States
      loading = false,
      error = null,

      // Item Configuration
      itemVariant = 'default',
      showQuickActions = true,

      // Actions
      onRecipeClick,
      onOpenExternal,
      onImport,
      onCopyLink,

      // Empty State
      emptyMessage = 'No popular recipes found',
      emptyDescription = 'Check back later for new popular recipes from around the web.',
      emptyIcon,
      emptyActions,

      // Error Handling
      onRetry,

      // Styling
      className,
      listClassName,
      paginationClassName,

      // Pagination Options
      showPagination = true,

      // Skeleton
      skeletonCount = 20,

      // Accessibility
      'aria-label': ariaLabel = 'Browse popular recipes',
      'aria-describedby': ariaDescribedBy,

      ...props
    },
    ref
  ) => {
    /**
     * Render a single web recipe list item
     */
    const renderRecipeItem = React.useCallback(
      (recipe: WebRecipeCardData, index: number) => {
        return (
          <WebRecipeListItem
            key={`${recipe.url}-${index}`}
            recipe={recipe}
            variant={itemVariant}
            showQuickActions={showQuickActions}
            onClick={onRecipeClick ? () => onRecipeClick(recipe) : undefined}
            onOpenExternal={
              onOpenExternal ? () => onOpenExternal(recipe) : undefined
            }
            onImport={onImport ? () => onImport(recipe) : undefined}
            onCopyLink={onCopyLink ? () => onCopyLink(recipe) : undefined}
          />
        );
      },
      [
        itemVariant,
        showQuickActions,
        onRecipeClick,
        onOpenExternal,
        onImport,
        onCopyLink,
      ]
    );

    /**
     * Custom skeleton renderer using WebRecipeListItemSkeleton
     */
    const renderSkeleton = React.useCallback(() => {
      return <WebRecipeListItemSkeleton variant={itemVariant} />;
    }, [itemVariant]);

    /**
     * Default empty state icon
     */
    const defaultEmptyIcon = React.useMemo(
      () => (
        <Globe className="text-muted-foreground h-16 w-16" aria-hidden="true" />
      ),
      []
    );

    /**
     * Default empty state actions
     */
    const defaultEmptyActions = React.useMemo(() => {
      if (onRetry) {
        return (
          <Button variant="default" onClick={onRetry}>
            Refresh Recipes
          </Button>
        );
      }
      return undefined;
    }, [onRetry]);

    return (
      <BrowseList<WebRecipeCardData>
        ref={ref}
        // Data
        items={recipes}
        renderItem={renderRecipeItem}
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        // States
        loading={loading}
        error={error}
        // Empty State
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon ?? defaultEmptyIcon}
        emptyActions={emptyActions ?? defaultEmptyActions}
        // Skeleton
        skeletonCount={skeletonCount}
        renderSkeleton={renderSkeleton}
        // Styling
        className={className}
        listClassName={listClassName}
        paginationClassName={paginationClassName}
        // Pagination Options
        showPagination={showPagination}
        // Error Handling
        onRetry={onRetry}
        // Accessibility
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );
  }
);

WebRecipeBrowseList.displayName = 'WebRecipeBrowseList';

export type { WebRecipeBrowseListProps };
