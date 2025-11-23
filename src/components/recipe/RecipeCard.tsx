import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { RecipeAuthor } from '@/components/ui/avatar';
import { QuickActions } from '@/components/ui/quick-actions';
import { Skeleton } from '@/components/ui/skeleton';
import {
  recipeCardVariants,
  recipeImageContainerVariants,
  recipeImageVariants,
  recipeImageOverlayVariants,
  recipeContentVariants,
  recipeTitleVariants,
  recipeDescriptionVariants,
  recipeMetadataContainerVariants,
  recipeMetadataItemVariants,
  recipeFooterVariants,
  recipeRatingContainerVariants,
  recipeAuthorContainerVariants,
  recipeFavoriteBadgeVariants,
  recipeSkeletonVariants,
} from '@/lib/ui/recipe-card-variants';
import {
  type RecipeCardProps,
  formatRecipeTime,
  getDifficultyVariant,
  getDifficultyLabel,
} from '@/types/ui/recipe-card';
import { getAllRecipeActions } from './recipe-card-utils';
import { Clock, ChefHat, Users } from 'lucide-react';

/**
 * RecipeCard Component
 *
 * A specialized card component for displaying recipe information with:
 * - Hero image with 16:9 aspect ratio
 * - Recipe title and description
 * - Metadata badges (prep time, cook time, difficulty, servings)
 * - Rating display with stars and review count
 * - Recipe author with avatar and info
 * - Quick actions on hover (favorite, share, add-to-collection, quick-view)
 * - Three-dot menu with conditional items based on ownership
 *
 * @example
 * ```tsx
 * <RecipeCard
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
 *       role: 'chef',
 *       verified: true,
 *     },
 *   }}
 *   variant="elevated"
 *   size="default"
 *   isOwner={false}
 *   onFavorite={() => console.log('Favorited')}
 *   onQuickView={() => console.log('Quick view')}
 * />
 * ```
 */
export const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
      recipe,
      variant = 'default',
      size = 'default',
      showQuickActions = true,
      showMenu: _showMenu = true, // Kept for backwards compatibility, now integrated into QuickActions
      showAuthor = true,
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
      ...props
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
        <Card
          ref={ref}
          variant={variant}
          size={size}
          className={cn(recipeCardVariants({ variant, size }), className)}
          {...props}
        >
          <div className={cn(recipeImageContainerVariants({ size }))}>
            <Skeleton
              className={cn(recipeSkeletonVariants({ type: 'image', size }))}
            />
          </div>
          <div className={cn(recipeContentVariants({ size }))}>
            <Skeleton
              className={cn(recipeSkeletonVariants({ type: 'title', size }))}
            />
            <Skeleton
              className={cn(
                recipeSkeletonVariants({ type: 'description', size })
              )}
            />
            <div className="flex gap-2">
              <Skeleton
                className={cn(recipeSkeletonVariants({ type: 'metadata' }))}
              />
              <Skeleton
                className={cn(recipeSkeletonVariants({ type: 'metadata' }))}
              />
            </div>
          </div>
          <div className={cn(recipeFooterVariants({ size }))}>
            <Skeleton
              className={cn(recipeSkeletonVariants({ type: 'author' }))}
            />
          </div>
        </Card>
      );
    }

    const hasImage = recipe.imageUrl && !imageError;
    const isInteractive = Boolean(onClick);

    return (
      <Card
        ref={ref}
        variant={variant}
        size={size}
        className={cn(recipeCardVariants({ variant, size }), className)}
        onClick={isInteractive ? onClick : undefined}
        interactive={isInteractive}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive ? `View recipe: ${recipe.title}` : undefined}
        {...props}
      >
        {/* Recipe Image */}
        {hasImage ? (
          <div
            className={cn(
              recipeImageContainerVariants({ size, interactive: isInteractive })
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.imageUrl!}
              alt={recipe.title}
              className={cn(
                recipeImageVariants(),
                'absolute inset-0 h-full w-full'
              )}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className={cn(recipeImageOverlayVariants())} />

            {/* Favorite badge on image */}
            {recipe.isFavorite && (
              <div className={cn(recipeFavoriteBadgeVariants({ size }))}>
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">Saved</span>
              </div>
            )}

            {/* Quick actions overlay */}
            {showQuickActions && allActions.length > 0 && (
              <QuickActions
                actions={allActions}
                position="top-right"
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                maxVisible={3}
                showOnHover
                showOnFocus
                aria-label="Recipe actions"
              />
            )}
          </div>
        ) : (
          // Fallback when no image
          <div
            className={cn(
              recipeImageContainerVariants({ size, interactive: false }),
              'bg-muted flex items-center justify-center'
            )}
          >
            <ChefHat
              className="text-muted-foreground h-12 w-12 opacity-50"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Recipe Content */}
        <CardContent className={cn(recipeContentVariants({ size }))}>
          {/* Title */}
          <h3
            className={cn(
              recipeTitleVariants({ size, interactive: isInteractive })
            )}
          >
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className={cn(recipeDescriptionVariants({ size }))}>
              {recipe.description}
            </p>
          )}

          {/* Metadata Badges */}
          <div className={cn(recipeMetadataContainerVariants({ size }))}>
            {/* Total Time */}
            {totalTime > 0 && (
              <div className={cn(recipeMetadataItemVariants({ size }))}>
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
            <div className={cn(recipeMetadataItemVariants({ size }))}>
              <Users className="h-3 w-3" aria-hidden="true" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </CardContent>

        {/* Recipe Footer */}
        <CardFooter className={cn(recipeFooterVariants({ size }))}>
          {/* Author Info */}
          {showAuthor && recipe.author ? (
            <div className={cn(recipeAuthorContainerVariants({ size }))}>
              <RecipeAuthor
                author={{
                  id: recipe.author.id,
                  name: recipe.author.name,
                  avatar: recipe.author.avatar,
                  role: recipe.author.role,
                  verified: recipe.author.verified,
                  rating: recipe.author.rating,
                  recipeCount: recipe.author.recipeCount,
                }}
                size="sm"
                variant="simple"
                avatarSize={size === 'sm' ? 'sm' : 'default'}
                showStats={false}
                showRole={false}
              />
            </div>
          ) : (
            <div />
          )}

          {/* Rating */}
          {recipe.rating !== undefined && (
            <div className={cn(recipeRatingContainerVariants({ size }))}>
              <Rating
                value={recipe.rating}
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
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
        </CardFooter>
      </Card>
    );
  }
);

RecipeCard.displayName = 'RecipeCard';

export type { RecipeCardProps };
