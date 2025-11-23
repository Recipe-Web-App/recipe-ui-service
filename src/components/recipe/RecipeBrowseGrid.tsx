'use client';

import * as React from 'react';
import { BrowseGrid } from '@/components/ui/browse-grid';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeCardSkeleton } from '@/components/ui/skeleton';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type RecipeBrowseGridProps } from '@/types/recipe/browse-grid';
import { type RecipeCardRecipe } from '@/types/ui/recipe-card';

/**
 * RecipeBrowseGrid Component
 *
 * A recipe-specific grid component that wraps BrowseGrid with RecipeCard,
 * providing a streamlined API for browsing recipes throughout the application.
 *
 * **Features:**
 * - Type-safe recipe grid with RecipeCard integration
 * - Recipe-specific action handlers (favorite, share, edit, etc.)
 * - Flexible ownership determination (boolean or function)
 * - Loading state with RecipeCard skeletons
 * - Empty state with recipe-specific defaults
 * - Error handling with retry functionality
 * - Responsive grid layout (2/3/4 columns)
 * - Full pagination support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RecipeBrowseGrid
 *   recipes={recipes}
 *   loading={isLoading}
 *   onRecipeClick={(recipe) => router.push(`/recipes/${recipe.recipeId}`)}
 *   onFavorite={(recipe) => toggleFavorite(recipe.recipeId)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pagination and ownership
 * <RecipeBrowseGrid
 *   recipes={recipes}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   isOwner={(recipe) => recipe.author?.id === currentUserId}
 *   onEdit={(recipe) => router.push(`/recipes/${recipe.recipeId}/edit`)}
 *   onDelete={(recipe) => deleteRecipe(recipe.recipeId)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With TanStack Query
 * const { data, isLoading, error, refetch } = useRecipes(filters);
 *
 * <RecipeBrowseGrid
 *   recipes={data?.recipes ?? []}
 *   loading={isLoading}
 *   error={error}
 *   onRetry={refetch}
 *   currentPage={filters.page}
 *   totalPages={data?.totalPages}
 *   onPageChange={(page) => setFilters({ ...filters, page })}
 * />
 * ```
 */
export const RecipeBrowseGrid = React.forwardRef<
  HTMLDivElement,
  RecipeBrowseGridProps
>(
  (
    {
      // Data
      recipes,

      // Pagination
      currentPage,
      totalPages,
      totalItems,
      pageSize = 12,
      onPageChange,
      onPageSizeChange,

      // States
      loading = false,
      error = null,

      // Recipe Card Configuration
      cardVariant = 'elevated',
      cardSize = 'default',
      showQuickActions = true,
      showMenu = true,
      showAuthor = true,

      // Recipe Actions
      onRecipeClick,
      onFavorite,
      onShare,
      onAddToCollection,
      onQuickView,
      onEdit,
      onDelete,
      onDuplicate,
      onReport,

      // Ownership
      isOwner = false,

      // Grid Configuration
      columns,
      gap = 'md',
      spacing = 'default',

      // Empty State
      emptyMessage = 'No recipes found',
      emptyDescription = 'Try adjusting your filters or search terms to find more recipes.',
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
      paginationProps,

      // Skeleton
      skeletonCount = 12,

      // Accessibility
      'aria-label': ariaLabel = 'Browse recipes',
      'aria-describedby': ariaDescribedBy,

      ...props
    },
    ref
  ) => {
    /**
     * Determine if a specific recipe is owned by the current user
     */
    const isRecipeOwner = React.useCallback(
      (recipe: RecipeCardRecipe): boolean => {
        if (typeof isOwner === 'function') {
          return isOwner(recipe);
        }
        return isOwner;
      },
      [isOwner]
    );

    /**
     * Render a single recipe card
     */
    const renderRecipeCard = React.useCallback(
      (recipe: RecipeCardRecipe, index: number) => {
        const owned = isRecipeOwner(recipe);

        return (
          <RecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            variant={cardVariant}
            size={cardSize}
            showQuickActions={showQuickActions}
            showMenu={showMenu}
            showAuthor={showAuthor}
            isOwner={owned}
            onClick={onRecipeClick ? () => onRecipeClick(recipe) : undefined}
            onFavorite={onFavorite ? () => onFavorite(recipe) : undefined}
            onShare={onShare ? () => onShare(recipe) : undefined}
            onAddToCollection={
              onAddToCollection ? () => onAddToCollection(recipe) : undefined
            }
            onQuickView={onQuickView ? () => onQuickView(recipe) : undefined}
            onEdit={onEdit ? () => onEdit(recipe) : undefined}
            onDelete={onDelete ? () => onDelete(recipe) : undefined}
            onDuplicate={onDuplicate ? () => onDuplicate(recipe) : undefined}
            onReport={onReport ? () => onReport(recipe) : undefined}
            aria-label={`Recipe: ${recipe.title}`}
            aria-posinset={index + 1}
            aria-setsize={recipes?.length ?? 0}
          />
        );
      },
      [
        isRecipeOwner,
        cardVariant,
        cardSize,
        showQuickActions,
        showMenu,
        showAuthor,
        onRecipeClick,
        onFavorite,
        onShare,
        onAddToCollection,
        onQuickView,
        onEdit,
        onDelete,
        onDuplicate,
        onReport,
        recipes?.length,
      ]
    );

    /**
     * Custom skeleton renderer using RecipeCardSkeleton
     */
    const renderSkeleton = React.useCallback(() => {
      return <RecipeCardSkeleton />;
    }, []);

    /**
     * Default empty state icon
     */
    const defaultEmptyIcon = React.useMemo(
      () => (
        <ChefHat
          className="text-muted-foreground h-16 w-16"
          aria-hidden="true"
        />
      ),
      []
    );

    /**
     * Default empty state actions
     */
    const defaultEmptyActions = React.useMemo(() => {
      // Only show default action if there's a retry handler
      // (implies this is an error or refetchable state)
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
      <BrowseGrid<RecipeCardRecipe>
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
        paginationProps={paginationProps}
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

RecipeBrowseGrid.displayName = 'RecipeBrowseGrid';

export type { RecipeBrowseGridProps };
