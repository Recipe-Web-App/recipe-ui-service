import * as React from 'react';
import { cn } from '@/lib/utils';
import { ListItem } from '@/components/ui/list';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { RecipeAuthor } from '@/components/ui/avatar';
import { QuickActions } from '@/components/ui/quick-actions';
import { Skeleton } from '@/components/ui/skeleton';
import {
  recipeListItemVariants,
  recipeListItemImageContainerVariants,
  recipeListItemImageVariants,
  recipeListItemContentVariants,
  recipeListItemTitleVariants,
  recipeListItemDescriptionVariants,
  recipeListItemMetadataContainerVariants,
  recipeListItemMetadataItemVariants,
  recipeListItemMetadataSection,
  recipeListItemAuthorContainerVariants,
  recipeListItemRatingContainerVariants,
  recipeListItemFavoriteBadgeVariants,
  recipeListItemSkeletonVariants,
} from '@/lib/ui/recipe-list-item-variants';
import { type RecipeListItemProps } from '@/types/ui/recipe-list-item';
import {
  formatRecipeTime,
  getDifficultyVariant,
  getDifficultyLabel,
} from '@/types/ui/recipe-card';
import { getAllRecipeActions } from './recipe-card-utils';
import { Clock, ChefHat, Users } from 'lucide-react';

/**
 * RecipeListItem Component
 *
 * A specialized list item component for displaying recipe information in a compact,
 * horizontal layout optimized for scanning and quick browsing.
 *
 * **Features:**
 * - Horizontal layout with thumbnail image
 * - Inline metadata badges (time, difficulty, servings)
 * - Author and rating information
 * - Quick actions on hover
 * - Loading skeleton state
 * - Responsive design
 *
 * **Layout:**
 * ```
 * [Image] [Title/Description/Metadata] [Author] [Rating] [Actions]
 * ```
 *
 * @example
 * ```tsx
 * <RecipeListItem
 *   recipe={{
 *     recipeId: 1,
 *     title: 'Chocolate Chip Cookies',
 *     description: 'Classic soft and chewy cookies',
 *     imageUrl: '/images/cookies.jpg',
 *     preparationTime: 15,
 *     cookingTime: 12,
 *     difficulty: DifficultyLevel.EASY,
 *     servings: 24,
 *     rating: 4.5,
 *     reviewCount: 128,
 *     author: {
 *       id: 'user-123',
 *       name: 'Jane Doe',
 *       avatar: '/avatars/jane.jpg',
 *     },
 *   }}
 *   variant="default"
 *   size="default"
 *   onClick={() => router.push(`/recipes/${recipe.recipeId}`)}
 *   onFavorite={() => toggleFavorite(recipe.recipeId)}
 * />
 * ```
 */
export const RecipeListItem = React.forwardRef<
  HTMLLIElement,
  RecipeListItemProps
>(
  (
    {
      recipe,
      variant = 'default',
      size = 'default',
      showQuickActions = true,
      showMenu: _showMenu = true, // Kept for backwards compatibility
      showAuthor = true,
      showRating = true,
      isOwner = false,
      loading = false,
      onClick,
      onFavorite,
      onShare,
      onAddToCollection,
      onQuickView,
      onEdit,
      onDelete,
      onDuplicate,
      onReport,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-posinset': ariaPosinset,
      'aria-setsize': ariaSetsize,
      ..._props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    // Handler functions - memoized to prevent unnecessary re-renders
    const handlers = React.useMemo(
      () => ({
        onClick,
        onFavorite,
        onShare,
        onAddToCollection,
        onQuickView,
        onEdit,
        onDelete,
        onDuplicate,
        onReport,
      }),
      [
        onClick,
        onFavorite,
        onShare,
        onAddToCollection,
        onQuickView,
        onEdit,
        onDelete,
        onDuplicate,
        onReport,
      ]
    );

    // Get all actions (quick actions + menu items) for QuickActions component
    const allActions = React.useMemo(
      () => getAllRecipeActions(handlers, recipe.isFavorite, isOwner),
      [handlers, recipe.isFavorite, isOwner]
    );

    // Calculate total time
    const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);

    // Show loading skeleton
    if (loading) {
      return (
        <ListItem
          ref={ref}
          className={cn(recipeListItemVariants({ variant, size }), className)}
        >
          <Skeleton
            className={cn(
              recipeListItemSkeletonVariants({ type: 'image', size })
            )}
          />
          <div className={cn(recipeListItemContentVariants({ variant, size }))}>
            <Skeleton
              className={cn(
                recipeListItemSkeletonVariants({ type: 'title', size })
              )}
            />
            {variant !== 'compact' && (
              <Skeleton
                className={cn(
                  recipeListItemSkeletonVariants({ type: 'description', size })
                )}
              />
            )}
            <div className="flex gap-2">
              <Skeleton
                className={cn(
                  recipeListItemSkeletonVariants({ type: 'metadata' })
                )}
              />
              <Skeleton
                className={cn(
                  recipeListItemSkeletonVariants({ type: 'metadata' })
                )}
              />
            </div>
          </div>
          {showAuthor && (
            <Skeleton
              className={cn(recipeListItemSkeletonVariants({ type: 'author' }))}
            />
          )}
          {showRating && (
            <Skeleton
              className={cn(recipeListItemSkeletonVariants({ type: 'rating' }))}
            />
          )}
        </ListItem>
      );
    }

    const hasImage = recipe.imageUrl && !imageError;
    const isInteractive = Boolean(onClick);

    return (
      <ListItem
        ref={ref}
        className={cn(
          recipeListItemVariants({ variant, size, interactive: isInteractive }),
          className
        )}
        onSelect={isInteractive ? onClick : undefined}
        aria-label={
          ariaLabel ??
          (isInteractive ? `View recipe: ${recipe.title}` : undefined)
        }
        aria-describedby={ariaDescribedby}
        aria-posinset={ariaPosinset}
        aria-setsize={ariaSetsize}
      >
        {/* Recipe Image Thumbnail */}
        {hasImage ? (
          <div
            className={cn(
              recipeListItemImageContainerVariants({
                size,
                interactive: isInteractive,
              })
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.imageUrl!}
              alt={recipe.title}
              className={cn(recipeListItemImageVariants())}
              onError={() => setImageError(true)}
              loading="lazy"
            />

            {/* Favorite badge on image */}
            {recipe.isFavorite && (
              <div
                className={cn(recipeListItemFavoriteBadgeVariants({ size }))}
              >
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          // Fallback when no image
          <div
            className={cn(
              recipeListItemImageContainerVariants({ size }),
              'bg-muted flex items-center justify-center'
            )}
          >
            <ChefHat
              className="text-muted-foreground h-8 w-8 opacity-50"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Recipe Content (Title, Description, Metadata) */}
        <div className={cn(recipeListItemContentVariants({ variant, size }))}>
          {/* Title */}
          <h3
            className={cn(
              recipeListItemTitleVariants({ size, interactive: isInteractive })
            )}
          >
            {recipe.title}
          </h3>

          {/* Description (hidden in compact variant) */}
          {recipe.description && (
            <p
              className={cn(
                recipeListItemDescriptionVariants({ size, variant })
              )}
            >
              {recipe.description}
            </p>
          )}

          {/* Metadata Badges */}
          <div
            className={cn(recipeListItemMetadataContainerVariants({ size }))}
          >
            {/* Total Time */}
            {totalTime > 0 && (
              <div className={cn(recipeListItemMetadataItemVariants({ size }))}>
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>{formatRecipeTime(totalTime)}</span>
              </div>
            )}

            {/* Difficulty */}
            {recipe.difficulty && (
              <Badge
                variant={getDifficultyVariant(recipe.difficulty)}
                size={size === 'sm' ? 'sm' : 'default'}
              >
                {getDifficultyLabel(recipe.difficulty)}
              </Badge>
            )}

            {/* Servings */}
            <div className={cn(recipeListItemMetadataItemVariants({ size }))}>
              <Users className="h-3 w-3" aria-hidden="true" />
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>

        {/* Metadata Section (Author & Rating) */}
        <div className={cn(recipeListItemMetadataSection({ variant, size }))}>
          {/* Author Info */}
          {showAuthor && recipe.author && (
            <div
              className={cn(
                recipeListItemAuthorContainerVariants({ variant, size })
              )}
            >
              <RecipeAuthor
                author={{
                  id: recipe.author.id,
                  name: recipe.author.name,
                  avatar: recipe.author.avatar,
                  role: recipe.author.role,
                  verified: recipe.author.verified,
                }}
                size="sm"
                variant="simple"
                avatarSize="sm"
                showStats={false}
                showRole={false}
              />
            </div>
          )}

          {/* Rating */}
          {showRating && recipe.rating !== undefined && (
            <div
              className={cn(recipeListItemRatingContainerVariants({ size }))}
            >
              <Rating
                value={recipe.rating}
                size={size === 'sm' ? 'sm' : 'md'}
                readOnly
                showValue
              />
              {recipe.reviewCount !== undefined && recipe.reviewCount > 0 && (
                <span className="text-muted-foreground text-xs">
                  ({recipe.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick actions overlay */}
        {showQuickActions && allActions && allActions.length > 0 && (
          <div className="absolute top-2 right-2">
            <QuickActions
              actions={allActions}
              position="bottom-left"
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
              maxVisible={2}
              showOnHover
              showOnFocus
              aria-label="Recipe actions"
            />
          </div>
        )}
      </ListItem>
    );
  }
);

RecipeListItem.displayName = 'RecipeListItem';

export type { RecipeListItemProps };
