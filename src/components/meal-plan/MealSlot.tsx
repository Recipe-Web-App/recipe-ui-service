/**
 * MealSlot Component
 *
 * Displays a single meal slot in the calendar with assigned recipes.
 * Supports empty state, single and multiple recipes, and edit/view modes.
 *
 * Features:
 * - Empty state with "Add recipe" placeholder
 * - Single and multiple recipe display
 * - Click handlers for add, remove, view actions
 * - Edit and view modes
 * - Keyboard navigation support
 * - Accessible with ARIA labels
 *
 * @example
 * ```tsx
 * // Empty slot in edit mode
 * <MealSlot
 *   slot={{ date: new Date(), mealType: 'breakfast', recipes: [] }}
 *   mode="edit"
 *   onAddRecipe={(slot) => console.log('Add recipe to', slot)}
 * />
 *
 * // Slot with recipe in view mode
 * <MealSlot
 *   slot={{
 *     date: new Date(),
 *     mealType: 'lunch',
 *     recipes: [{ recipeId: 1, recipeName: 'Chicken Salad' }]
 *   }}
 *   mode="view"
 *   onViewRecipe={(id) => console.log('View recipe', id)}
 * />
 * ```
 *
 * @module components/meal-plan/MealSlot
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Plus,
  X,
  Eye,
  Coffee,
  Salad,
  UtensilsCrossed,
  Cookie,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  mealSlotVariants,
  mealSlotHeaderVariants,
  mealSlotContentVariants,
  mealSlotEmptyVariants,
  recipeItemVariants,
  recipeThumbnailVariants,
  recipeNameVariants,
} from '@/lib/ui/meal-plan-calendar-variants';
import type { MealSlotProps } from '@/types/ui/meal-plan-calendar';
import {
  formatMealTypeLabel,
  formatMealSlotLabel,
} from '@/types/ui/meal-plan-calendar';
import { getMealTypeColor } from './meal-plan-calendar-utils';

/**
 * MealSlot component
 */
export const MealSlot = React.forwardRef<HTMLDivElement, MealSlotProps>(
  (
    {
      slot,
      mode = 'view',
      size = 'default',
      onSlotClick,
      onAddRecipe,
      onRemoveRecipe,
      onViewRecipe,
      showMealType = false,
      showDate = false,
      isLoading = false,
      className,
      ...props
    },
    ref
  ) => {
    const isEmpty = slot.recipes.length === 0;

    // Determine the visual state
    const state = isEmpty ? 'empty' : 'filled';

    // Handle slot click
    const handleSlotClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent click if clicking on a button or action
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('[data-action]')) {
          return;
        }

        if (onSlotClick) {
          onSlotClick(slot);
        } else if (isEmpty && mode === 'edit' && onAddRecipe) {
          onAddRecipe(slot);
        }
      },
      [slot, isEmpty, mode, onSlotClick, onAddRecipe]
    );

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (isEmpty && mode === 'edit' && onAddRecipe) {
            onAddRecipe(slot);
          } else if (onSlotClick) {
            onSlotClick(slot);
          }
        }
      },
      [slot, isEmpty, mode, onSlotClick, onAddRecipe]
    );

    // Get meal type icon component
    const MealIcon = React.useMemo(() => {
      switch (slot.mealType) {
        case 'breakfast':
          return Coffee;
        case 'lunch':
          return Salad;
        case 'dinner':
          return UtensilsCrossed;
        case 'snack':
          return Cookie;
        default:
          return Coffee;
      }
    }, [slot.mealType]);

    // Accessibility label
    const ariaLabel = formatMealSlotLabel(slot);

    if (isLoading) {
      return (
        <MealSlotSkeleton
          size={size ?? 'default'}
          showMealType={showMealType}
          showDate={showDate}
        />
      );
    }

    return (
      <div
        ref={ref}
        role={mode === 'edit' && isEmpty ? 'button' : 'article'}
        tabIndex={mode === 'edit' && isEmpty ? 0 : undefined}
        aria-label={ariaLabel}
        onClick={handleSlotClick}
        onKeyDown={handleKeyDown}
        className={cn(mealSlotVariants({ state, mode, size }), className)}
        {...props}
      >
        {/* Header (optional) */}
        {(showMealType || showDate) && (
          <div className={mealSlotHeaderVariants({ size })}>
            {showMealType && (
              <div className="flex items-center gap-1">
                <MealIcon
                  className={cn('h-3 w-3', getMealTypeColor(slot.mealType))}
                  aria-hidden="true"
                />
                <span>{formatMealTypeLabel(slot.mealType)}</span>
              </div>
            )}
            {showDate && (
              <span>
                {slot.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className={mealSlotContentVariants({ size })}>
          {isEmpty ? (
            /* Empty state */
            <div className={mealSlotEmptyVariants({ size })}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">
                {mode === 'edit' ? 'Add recipe' : 'No recipe'}
              </span>
            </div>
          ) : (
            /* Recipe list */
            slot.recipes.map(recipe => (
              <div
                key={recipe.recipeId}
                className={recipeItemVariants({ size })}
                data-recipe-id={recipe.recipeId}
              >
                {/* Recipe thumbnail */}
                {recipe.recipeImage && (
                  <div className={recipeThumbnailVariants({ size })}>
                    <Image
                      src={recipe.recipeImage}
                      alt={recipe.recipeName}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  </div>
                )}

                {/* Recipe name */}
                <div className={recipeNameVariants({ size })}>
                  {recipe.recipeName}
                </div>

                {/* Actions */}
                {mode === 'edit' && (
                  <div className="flex items-center gap-1" data-action>
                    {onViewRecipe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={e => {
                          e.stopPropagation();
                          onViewRecipe(recipe.recipeId);
                        }}
                        aria-label={`View ${recipe.recipeName}`}
                      >
                        <Eye className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    )}
                    {onRemoveRecipe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 h-6 w-6"
                        onClick={e => {
                          e.stopPropagation();
                          onRemoveRecipe(slot, recipe.recipeId);
                        }}
                        aria-label={`Remove ${recipe.recipeName}`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                )}
                {mode === 'view' && onViewRecipe && (
                  <div className="flex items-center" data-action>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={e => {
                        e.stopPropagation();
                        onViewRecipe(recipe.recipeId);
                      }}
                      aria-label={`View ${recipe.recipeName}`}
                    >
                      <Eye className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add button (for empty slots in edit mode) */}
        {isEmpty && mode === 'edit' && onAddRecipe && (
          <div className="sr-only">Press Enter or Space to add a recipe</div>
        )}
      </div>
    );
  }
);

MealSlot.displayName = 'MealSlot';

/**
 * MealSlotSkeleton component for loading state
 */
export const MealSlotSkeleton: React.FC<{
  size?: 'sm' | 'default' | 'lg';
  showMealType?: boolean;
  showDate?: boolean;
}> = ({ size = 'default', showMealType = false, showDate = false }) => {
  return (
    <div className={mealSlotVariants({ state: 'empty', mode: 'view', size })}>
      {(showMealType || showDate) && (
        <div className={mealSlotHeaderVariants({ size })}>
          {showMealType && (
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          )}
          {showDate && (
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          )}
        </div>
      )}
      <div className={mealSlotContentVariants({ size })}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              recipeThumbnailVariants({ size }),
              'bg-muted animate-pulse'
            )}
          />
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-3 w-full animate-pulse rounded" />
            <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

MealSlotSkeleton.displayName = 'MealSlotSkeleton';

// Export both as named exports
export { MealSlotSkeleton as Skeleton };
