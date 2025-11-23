'use client';

import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Clock, Users, ChefHat, Info } from 'lucide-react';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import {
  getDifficultyLabel,
  getDifficultyVariant,
  formatRecipeTime,
} from '@/types/ui/recipe-card';

/**
 * Props for QuickViewRecipeModal component
 */
export interface QuickViewRecipeModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** The recipe to preview */
  recipe: RecipeCardRecipe;
  /** Optional callback when &quot;View Full Recipe&quot; is clicked */
  onViewFull?: (recipe: RecipeCardRecipe) => void;
}

/**
 * QuickViewRecipeModal Component (Placeholder)
 *
 * A placeholder modal for quickly previewing recipe details.
 * Shows basic recipe information without full ingredients and steps.
 * Future enhancements will include ingredient list, nutrition info, and ratings.
 *
 * @example
 * ```tsx
 * <QuickViewRecipeModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   recipe={recipe}
 *   onViewFull={(recipe) => router.push(`/recipes/${recipe.recipeId}`)}
 * />
 * ```
 */
export const QuickViewRecipeModal = React.forwardRef<
  HTMLDivElement,
  QuickViewRecipeModalProps
>(({ open, onOpenChange, recipe, onViewFull }, ref) => {
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleViewFull = React.useCallback(() => {
    onViewFull?.(recipe);
    handleClose();
  }, [onViewFull, recipe, handleClose]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent ref={ref} size="lg" showClose>
        <ModalHeader>
          <ModalTitle>{recipe.title}</ModalTitle>
          {recipe.description && (
            <ModalDescription>{recipe.description}</ModalDescription>
          )}
        </ModalHeader>

        <ModalBody scrollable>
          {/* Recipe Image */}
          {recipe.imageUrl ? (
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted mb-4 flex aspect-video w-full items-center justify-center rounded-lg">
              <ChefHat className="text-muted-foreground h-16 w-16 opacity-50" />
            </div>
          )}

          {/* Recipe Metadata */}
          <div className="mb-4 flex flex-wrap gap-3">
            {/* Total Time */}
            {totalTime > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>{formatRecipeTime(totalTime)}</span>
              </div>
            )}

            {/* Servings */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="text-muted-foreground h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>

            {/* Difficulty */}
            {recipe.difficulty && (
              <Badge
                variant={getDifficultyVariant(recipe.difficulty)}
                size="default"
              >
                {getDifficultyLabel(recipe.difficulty)}
              </Badge>
            )}
          </div>

          {/* Rating */}
          {recipe.rating !== undefined && (
            <div className="mb-4 flex items-center gap-2">
              <Rating value={recipe.rating} size="md" readOnly showValue />
              {recipe.reviewCount !== undefined && recipe.reviewCount > 0 && (
                <span className="text-muted-foreground text-sm">
                  ({recipe.reviewCount}{' '}
                  {recipe.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}

          {/* Time Breakdown */}
          {(recipe.preparationTime ?? 0) > 0 &&
            (recipe.cookingTime ?? 0) > 0 && (
              <div className="bg-muted mb-4 rounded-lg p-4">
                <h4 className="mb-2 text-sm font-medium">Time Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Prep Time</p>
                    <p className="text-sm font-medium">
                      {formatRecipeTime(recipe.preparationTime ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Cook Time</p>
                    <p className="text-sm font-medium">
                      {formatRecipeTime(recipe.cookingTime ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Placeholder Notice */}
          <div className="flex gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Preview Mode
              </h5>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                This is a quick preview. Click &quot;View Full Recipe&quot; to
                see ingredients, step-by-step instructions, and nutrition
                information.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleViewFull}>View Full Recipe</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

QuickViewRecipeModal.displayName = 'QuickViewRecipeModal';
