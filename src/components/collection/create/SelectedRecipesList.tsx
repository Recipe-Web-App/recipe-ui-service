'use client';

import * as React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  SortableList,
  SortableItem,
  SortableItemContent,
  SortableItemActions,
} from '@/components/ui/sortable-list';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CollectionRecipeFormData } from '@/types/collection/create-collection-form';

/**
 * Props for the SelectedRecipesList component.
 */
export interface SelectedRecipesListProps {
  /** List of selected recipes */
  recipes: CollectionRecipeFormData[];
  /** Callback when recipes are reordered */
  onReorder: (recipes: CollectionRecipeFormData[]) => void;
  /** Callback when a recipe is removed */
  onRemove: (recipeId: string) => void;
  /** Whether reordering is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SelectedRecipesList Component
 *
 * Displays selected recipes for a collection with drag-and-drop reordering
 * and remove functionality.
 */
export function SelectedRecipesList({
  recipes,
  onReorder,
  onRemove,
  disabled = false,
  className,
}: SelectedRecipesListProps) {
  // Handle reorder and update displayOrder values
  const handleReorder = React.useCallback(
    (reorderedRecipes: CollectionRecipeFormData[]) => {
      const updatedRecipes = reorderedRecipes.map((recipe, index) => ({
        ...recipe,
        displayOrder: index,
      }));
      onReorder(updatedRecipes);
    },
    [onReorder]
  );

  return (
    <SortableList<CollectionRecipeFormData>
      items={recipes}
      onReorder={handleReorder}
      keyExtractor={recipe => recipe.id}
      disabled={disabled}
      emptyMessage="No recipes selected. Search and add recipes to your collection."
      aria-label="Selected recipes"
      className={cn('space-y-2', className)}
      renderItem={recipe => (
        <SortableItem
          id={recipe.id}
          disabled={disabled}
          showDragHandle
          dragHandlePosition="start"
          className="bg-card border-border rounded-lg border"
        >
          <SortableItemContent
            layout="row"
            alignment="center"
            className="flex-1 gap-3 p-3"
          >
            {/* Recipe Image */}
            {recipe.recipeImageUrl ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={recipe.recipeImageUrl}
                  alt={recipe.recipeTitle}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md">
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            )}

            {/* Recipe Info */}
            <div className="min-w-0 flex-1">
              <h4 className="text-foreground truncate font-medium">
                {recipe.recipeTitle}
              </h4>
              {recipe.recipeDescription && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {recipe.recipeDescription}
                </p>
              )}
            </div>

            {/* Position Indicator */}
            <div className="text-muted-foreground flex-shrink-0 text-sm">
              #{recipe.displayOrder + 1}
            </div>
          </SortableItemContent>

          {/* Remove Action */}
          <SortableItemActions position="end" className="pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(recipe.id)}
              disabled={disabled}
              aria-label={`Remove ${recipe.recipeTitle} from collection`}
              className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </SortableItemActions>
        </SortableItem>
      )}
    />
  );
}

SelectedRecipesList.displayName = 'SelectedRecipesList';
