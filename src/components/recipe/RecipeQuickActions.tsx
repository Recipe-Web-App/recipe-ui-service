'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { QuickActions } from '@/components/ui/quick-actions';
import { ShareRecipeModal } from './ShareRecipeModal';
import { QuickViewRecipeModal } from './QuickViewRecipeModal';
import { AddToCollectionModal } from './AddToCollectionModal';
import { useToastStore } from '@/stores/ui/toast-store';
import { getRecipeQuickActionsList } from './recipe-card-utils';
import {
  useFavoriteRecipe,
  useUnfavoriteRecipe,
  useIsRecipeFavorited,
} from '@/hooks/recipe-management/useFavorites';
import type { RecipeQuickActionsProps } from '@/types/recipe/quick-actions';
import { DEFAULT_RECIPE_QUICK_ACTIONS_PROPS } from '@/types/recipe/quick-actions';

/**
 * RecipeQuickActions Component
 *
 * A specialized quick actions component for recipe cards that provides:
 * - Favorite/unfavorite action (integrated with recipe-management API)
 * - Share action (opens ShareRecipeModal)
 * - Add to collection action (opens AddToCollectionModal)
 * - Quick view action (opens QuickViewRecipeModal)
 *
 * This component wraps the base QuickActions component with recipe-specific
 * behavior and full API integration for favorites and collections.
 *
 * @example
 * ```tsx
 * <div className="group relative">
 *   <RecipeCard recipe={recipe} />
 *   <RecipeQuickActions
 *     recipe={recipe}
 *     position="top-right"
 *     size="md"
 *   />
 * </div>
 * ```
 *
 * @example With custom handlers
 * ```tsx
 * <RecipeQuickActions
 *   recipe={recipe}
 *   handlers={{
 *     onFavorite: (recipe) => console.log('Favorited:', recipe.title),
 *     onShare: (recipe) => console.log('Shared:', recipe.title),
 *   }}
 * />
 * ```
 */
export const RecipeQuickActions = React.forwardRef<
  HTMLDivElement,
  RecipeQuickActionsProps
>(
  (
    {
      recipe,
      handlers = {},
      position = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS.position,
      size = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS.size,
      maxVisible = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS.maxVisible,
      showOnHover = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS.showOnHover,
      showOnFocus = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS.showOnFocus,
      className,
      overlayClassName,
      actionClassName,
      'aria-label': ariaLabel = DEFAULT_RECIPE_QUICK_ACTIONS_PROPS[
        'aria-label'
      ],
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const { addSuccessToast, addErrorToast } = useToastStore();

    // Modal states
    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [quickViewModalOpen, setQuickViewModalOpen] = React.useState(false);
    const [addToCollectionModalOpen, setAddToCollectionModalOpen] =
      React.useState(false);

    // Favorite hooks
    const { data: isFavorited, isLoading: isCheckingFavorite } =
      useIsRecipeFavorited(recipe.recipeId);
    const favoriteMutation = useFavoriteRecipe();
    const unfavoriteMutation = useUnfavoriteRecipe();

    // Determine actual favorite status (prioritize API data, fallback to recipe prop)
    const actualIsFavorite = isFavorited ?? recipe.isFavorite ?? false;

    /**
     * Favorite/unfavorite handler
     * Toggles favorite status using recipe-management API
     */
    const handleFavorite = React.useCallback(async () => {
      if (handlers.onFavorite) {
        // Use custom handler if provided
        handlers.onFavorite(recipe);
        return;
      }

      try {
        if (actualIsFavorite) {
          // Unfavorite the recipe
          await unfavoriteMutation.mutateAsync(recipe.recipeId);
          addSuccessToast(`Removed "${recipe.title}" from favorites`, {
            duration: 3000,
          });
        } else {
          // Favorite the recipe
          await favoriteMutation.mutateAsync(recipe.recipeId);
          addSuccessToast(`Added "${recipe.title}" to favorites`, {
            duration: 3000,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update favorite status';
        addErrorToast(errorMessage, { duration: 5000 });
      }
    }, [
      handlers,
      recipe,
      actualIsFavorite,
      favoriteMutation,
      unfavoriteMutation,
      addSuccessToast,
      addErrorToast,
    ]);

    /**
     * Share handler
     * Opens ShareRecipeModal by default, or uses custom handler if provided
     */
    const handleShare = React.useCallback(() => {
      if (handlers.onShare) {
        // Use custom handler if provided
        handlers.onShare(recipe);
      } else {
        // Default: Open share modal
        setShareModalOpen(true);
      }
    }, [handlers, recipe]);

    /**
     * Add to collection handler
     * Opens AddToCollectionModal by default, or uses custom handler if provided
     */
    const handleAddToCollection = React.useCallback(() => {
      if (handlers.onAddToCollection) {
        // Use custom handler if provided
        handlers.onAddToCollection(recipe);
      } else {
        // Default: Open add to collection modal
        setAddToCollectionModalOpen(true);
      }
    }, [handlers, recipe]);

    /**
     * Quick view handler
     * Opens QuickViewRecipeModal by default, or uses custom handler if provided
     */
    const handleQuickView = React.useCallback(() => {
      if (handlers.onQuickView) {
        // Use custom handler if provided
        handlers.onQuickView(recipe);
      } else {
        // Default: Open quick view modal
        setQuickViewModalOpen(true);
      }
    }, [handlers, recipe]);

    /**
     * Build actions array using helper function
     * Actions are memoized to prevent unnecessary re-renders
     */
    const actions = React.useMemo(
      () =>
        getRecipeQuickActionsList(
          {
            onFavorite: handleFavorite,
            onShare: handleShare,
            onAddToCollection: handleAddToCollection,
            onQuickView: handleQuickView,
          },
          actualIsFavorite,
          isCheckingFavorite ||
            favoriteMutation.isPending ||
            unfavoriteMutation.isPending
        ),
      [
        handleFavorite,
        handleShare,
        handleAddToCollection,
        handleQuickView,
        actualIsFavorite,
        isCheckingFavorite,
        favoriteMutation.isPending,
        unfavoriteMutation.isPending,
      ]
    );

    // Don't render if no actions available
    if (actions.length === 0) {
      return null;
    }

    return (
      <>
        {/* Quick Actions Overlay */}
        <QuickActions
          ref={ref}
          actions={actions}
          position={position}
          size={size}
          maxVisible={maxVisible}
          showOnHover={showOnHover}
          showOnFocus={showOnFocus}
          className={className}
          overlayClassName={overlayClassName}
          actionClassName={actionClassName}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          {...props}
        />

        {/* Share Modal */}
        <ShareRecipeModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          recipe={recipe}
        />

        {/* Quick View Modal */}
        <QuickViewRecipeModal
          open={quickViewModalOpen}
          onOpenChange={setQuickViewModalOpen}
          recipe={recipe}
          onViewFull={recipe => {
            // Navigate to full recipe page
            router.push(`/recipes/${recipe.recipeId}`);
          }}
        />

        {/* Add to Collection Modal */}
        <AddToCollectionModal
          open={addToCollectionModalOpen}
          onOpenChange={setAddToCollectionModalOpen}
          recipe={recipe}
        />
      </>
    );
  }
);

RecipeQuickActions.displayName = 'RecipeQuickActions';

export type { RecipeQuickActionsProps };
