'use client';

import * as React from 'react';
import { Heart, Share2, SquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * RecipeActions Props
 */
export interface RecipeActionsProps {
  /** Whether the recipe is favorited by the current user */
  isFavorited?: boolean;
  /** Whether the favorite action is loading */
  isFavoriteLoading?: boolean;
  /** Callback when favorite button is clicked */
  onToggleFavorite?: () => void;
  /** Callback when share button is clicked */
  onShare?: () => void;
  /** Callback when bookmark button is clicked */
  onBookmark?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RecipeActions Component
 *
 * Displays action buttons for recipe interactions including
 * favorite, share, and bookmark/save to collection.
 */
export const RecipeActions = React.forwardRef<
  HTMLDivElement,
  RecipeActionsProps
>(function RecipeActions(
  {
    isFavorited = false,
    isFavoriteLoading = false,
    onToggleFavorite,
    onShare,
    onBookmark,
    className,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex gap-2', className)}
      data-testid="recipe-actions"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleFavorite}
        disabled={isFavoriteLoading}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        data-testid="favorite-button"
      >
        <Heart
          className={cn('h-4 w-4', isFavorited && 'fill-red-500 text-red-500')}
          aria-hidden="true"
        />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onShare}
        aria-label="Share recipe"
        data-testid="share-button"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onBookmark}
        aria-label="Save to collection"
        data-testid="bookmark-button"
      >
        <SquarePlus className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
});

RecipeActions.displayName = 'RecipeActions';
