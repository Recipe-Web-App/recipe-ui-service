'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Recipe search result item for display.
 */
export interface RecipeSearchResult {
  /** Recipe ID from the backend */
  recipeId: number;
  /** Recipe title */
  title: string;
  /** Recipe description (truncated) */
  description?: string;
  /** Recipe image URL */
  imageUrl?: string;
}

/**
 * Props for the RecipeSearchResults component.
 */
export interface RecipeSearchResultsProps {
  /** Search results to display */
  results: RecipeSearchResult[];
  /** IDs of recipes already selected */
  selectedRecipeIds: Set<number>;
  /** Callback when a recipe is added */
  onAddRecipe: (recipe: RecipeSearchResult) => void;
  /** Whether results are loading */
  isLoading?: boolean;
  /** Error message if search failed */
  error?: string | null;
  /** Search query for empty state context */
  searchQuery?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RecipeSearchResults Component
 *
 * Displays recipe search results with add functionality.
 * Shows loading skeletons, empty states, and error handling.
 */
export function RecipeSearchResults({
  results,
  selectedRecipeIds,
  onAddRecipe,
  isLoading = false,
  error = null,
  searchQuery = '',
  className,
}: RecipeSearchResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('space-y-2', className)}
        aria-busy="true"
        aria-label="Loading search results"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <RecipeSearchResultSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          'border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-center',
          className
        )}
        role="alert"
      >
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  // Empty state - no search query
  if (!searchQuery) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex flex-col items-center justify-center py-8',
          className
        )}
      >
        <Search className="mb-2 h-8 w-8 opacity-50" aria-hidden="true" />
        <p className="text-sm">Search for recipes to add to your collection</p>
      </div>
    );
  }

  // Empty state - no results
  if (results.length === 0) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex flex-col items-center justify-center py-8',
          className
        )}
      >
        <Search className="mb-2 h-8 w-8 opacity-50" aria-hidden="true" />
        <p className="text-sm">
          No recipes found for &quot;{searchQuery}&quot;
        </p>
        <p className="mt-1 text-xs">Try a different search term</p>
      </div>
    );
  }

  // Results list
  return (
    <div
      className={cn('space-y-2', className)}
      role="list"
      aria-label="Recipe search results"
    >
      {results.map(recipe => {
        const isSelected = selectedRecipeIds.has(recipe.recipeId);
        return (
          <RecipeSearchResultItem
            key={recipe.recipeId}
            recipe={recipe}
            isSelected={isSelected}
            onAdd={() => onAddRecipe(recipe)}
          />
        );
      })}
    </div>
  );
}

/**
 * Individual recipe search result item.
 */
interface RecipeSearchResultItemProps {
  recipe: RecipeSearchResult;
  isSelected: boolean;
  onAdd: () => void;
}

function RecipeSearchResultItem({
  recipe,
  isSelected,
  onAdd,
}: RecipeSearchResultItemProps) {
  return (
    <div
      role="listitem"
      className={cn(
        'bg-card border-border flex items-center gap-3 rounded-lg border p-3 transition-colors',
        isSelected && 'border-primary/50 bg-primary/5'
      )}
    >
      {/* Recipe Image */}
      {recipe.imageUrl ? (
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      ) : (
        <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
          <span className="text-muted-foreground text-xs">No img</span>
        </div>
      )}

      {/* Recipe Info */}
      <div className="min-w-0 flex-1">
        <h4 className="text-foreground truncate text-sm font-medium">
          {recipe.title}
        </h4>
        {recipe.description && (
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
            {recipe.description}
          </p>
        )}
      </div>

      {/* Add Button */}
      <Button
        variant={isSelected ? 'outline' : 'secondary'}
        size="sm"
        onClick={onAdd}
        disabled={isSelected}
        aria-label={
          isSelected ? `${recipe.title} already added` : `Add ${recipe.title}`
        }
        className="flex-shrink-0"
      >
        {isSelected ? (
          <span className="text-xs">Added</span>
        ) : (
          <>
            <Plus className="mr-1 h-3 w-3" aria-hidden="true" />
            <span className="text-xs">Add</span>
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Skeleton loader for recipe search results.
 */
function RecipeSearchResultSkeleton() {
  return (
    <div className="bg-card border-border flex items-center gap-3 rounded-lg border p-3">
      <Skeleton className="h-12 w-12 flex-shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-16 flex-shrink-0" />
    </div>
  );
}

RecipeSearchResults.displayName = 'RecipeSearchResults';
