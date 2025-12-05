'use client';

import * as React from 'react';
import { BrowseGrid } from '@/components/ui/browse-grid';
import {
  WebRecipeCard,
  WebRecipeCardSkeleton,
} from '@/components/recipe/WebRecipeCard';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type WebRecipeBrowseGridProps } from '@/types/recipe/web-recipe-browse';
import { type WebRecipeCardData } from '@/types/ui/web-recipe-card';

/**
 * WebRecipeBrowseGrid Component
 *
 * A specialized grid component for browsing external web recipes.
 * Wraps BrowseGrid with WebRecipeCard for a streamlined API.
 *
 * **Features:**
 * - Type-safe web recipe grid with WebRecipeCard integration
 * - External recipe action handlers (open, import, copy)
 * - Loading state with WebRecipeCard skeletons
 * - Empty state with web-specific defaults
 * - Error handling with retry functionality
 * - Responsive grid layout (2/3/4 columns)
 * - Full pagination support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <WebRecipeBrowseGrid
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
 * <WebRecipeBrowseGrid
 *   recipes={webRecipes}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   onImport={(recipe) => importRecipe(recipe.url)}
 * />
 * ```
 */
export const WebRecipeBrowseGrid = React.forwardRef<
  HTMLDivElement,
  WebRecipeBrowseGridProps
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

      // Card Configuration
      cardVariant = 'default',
      cardSize = 'default',
      showQuickActions = true,

      // Actions
      onRecipeClick,
      onOpenExternal,
      onImport,
      onCopyLink,

      // Grid Configuration
      columns,
      gap = 'md',
      spacing = 'default',

      // Empty State
      emptyMessage = 'No popular recipes found',
      emptyDescription = 'Check back later for new popular recipes from around the web.',
      emptyIcon,
      emptyActions,

      // Error Handling
      onRetry,

      // Styling
      className,
      gridClassName,
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
     * Render a single web recipe card
     */
    const renderRecipeCard = React.useCallback(
      (recipe: WebRecipeCardData, index: number) => {
        return (
          <WebRecipeCard
            key={`${recipe.url}-${index}`}
            recipe={recipe}
            variant={cardVariant}
            size={cardSize}
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
        cardVariant,
        cardSize,
        showQuickActions,
        onRecipeClick,
        onOpenExternal,
        onImport,
        onCopyLink,
      ]
    );

    /**
     * Custom skeleton renderer using WebRecipeCardSkeleton
     */
    const renderSkeleton = React.useCallback(() => {
      return <WebRecipeCardSkeleton size={cardSize} />;
    }, [cardSize]);

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
      <BrowseGrid<WebRecipeCardData>
        ref={ref}
        // Data
        items={recipes}
        renderItem={renderRecipeCard}
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
        // Grid Configuration
        columns={columns}
        gap={gap}
        spacing={spacing}
        // Skeleton
        skeletonCount={skeletonCount}
        renderSkeleton={renderSkeleton}
        // Styling
        className={className}
        gridClassName={gridClassName}
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

WebRecipeBrowseGrid.displayName = 'WebRecipeBrowseGrid';

export type { WebRecipeBrowseGridProps };
