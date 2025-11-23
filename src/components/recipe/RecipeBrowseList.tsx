'use client';

import * as React from 'react';
import { BrowseList } from '@/components/ui/browse-list';
import { RecipeListItem } from '@/components/recipe/RecipeListItem';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type RecipeBrowseListProps } from '@/types/recipe/browse-list';
import { type RecipeListItemRecipe } from '@/types/ui/recipe-list-item';

/**
 * RecipeBrowseList Component
 *
 * A recipe-specific list component that wraps BrowseList with RecipeListItem,
 * providing a streamlined API for browsing recipes in a compact, scannable list view.
 *
 * **Features:**
 * - Type-safe recipe list with RecipeListItem integration
 * - Recipe-specific action handlers (favorite, share, edit, etc.)
 * - Flexible ownership determination (boolean or function)
 * - Loading state with RecipeListItem skeletons
 * - Empty state with recipe-specific defaults
 * - Error handling with retry functionality
 * - Compact list layout optimized for scanning
 * - Full pagination support
 *
 * **Use Cases:**
 * - Browse recipes list view (alternative to grid)
 * - Search results display
 * - Quick scanning of many recipes
 * - Mobile-optimized recipe browsing
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RecipeBrowseList
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
 * <RecipeBrowseList
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
 * <RecipeBrowseList
 *   recipes={data?.recipes ?? []}
 *   loading={isLoading}
 *   error={error}
 *   onRetry={refetch}
 *   currentPage={filters.page}
 *   totalPages={data?.totalPages}
 *   onPageChange={(page) => setFilters({ ...filters, page })}
 *   itemVariant="compact"
 * />
 * ```
 */
export const RecipeBrowseList = React.forwardRef<
  HTMLDivElement,
  RecipeBrowseListProps
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

      // Recipe List Item Configuration
      itemVariant = 'default',
      itemSize = 'default',
      showQuickActions = true,
      showMenu = true,
      showAuthor = true,
      showRating = true,

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

      // List Configuration
      showDividers = false,
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
      listClassName,
      paginationClassName,

      // Pagination Options
      showPagination = true,
      paginationProps,

      // Skeleton
      skeletonCount = 8,

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
      (recipe: RecipeListItemRecipe): boolean => {
        if (typeof isOwner === 'function') {
          return isOwner(recipe);
        }
        return isOwner;
      },
      [isOwner]
    );

    /**
     * Render a single recipe list item
     */
    const renderRecipeListItem = React.useCallback(
      (recipe: RecipeListItemRecipe, index: number) => {
        const owned = isRecipeOwner(recipe);

        return (
          <RecipeListItem
            key={recipe.recipeId}
            recipe={recipe}
            variant={itemVariant}
            size={itemSize}
            showQuickActions={showQuickActions}
            showMenu={showMenu}
            showAuthor={showAuthor}
            showRating={showRating}
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
        itemVariant,
        itemSize,
        showQuickActions,
        showMenu,
        showAuthor,
        showRating,
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
     * Custom skeleton renderer using RecipeListItem with loading state
     */
    const renderSkeleton = React.useCallback(() => {
      return (
        <RecipeListItem
          recipe={{
            recipeId: 0,
            title: '',
            servings: 0,
          }}
          loading
          variant={itemVariant}
          size={itemSize}
        />
      );
    }, [itemVariant, itemSize]);

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
      <BrowseList<RecipeListItemRecipe>
        ref={ref}
        // Data
        items={recipes}
        renderItem={renderRecipeListItem}
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
        // List Configuration
        showDividers={showDividers}
        spacing={spacing}
        // Skeleton
        skeletonCount={skeletonCount}
        renderSkeleton={renderSkeleton}
        // Styling
        className={className}
        listClassName={listClassName}
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

RecipeBrowseList.displayName = 'RecipeBrowseList';

export type { RecipeBrowseListProps };
