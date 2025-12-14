'use client';

import * as React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DifficultyLevel } from '@/types/recipe-management/common';

/**
 * RecipeMetadata Props
 */
export interface RecipeMetadataProps {
  /** Preparation time in minutes */
  preparationTime?: number | null;
  /** Cooking time in minutes */
  cookingTime?: number | null;
  /** Number of servings */
  servings: number;
  /** Recipe difficulty level */
  difficulty?: DifficultyLevel | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format difficulty level for display
 */
function formatDifficulty(difficulty: DifficultyLevel): string {
  return difficulty.toLowerCase().replace(/_/g, ' ');
}

/**
 * RecipeMetadata Component
 *
 * Displays recipe metadata badges including preparation time,
 * cooking time, servings, and difficulty level.
 */
export const RecipeMetadata = React.forwardRef<
  HTMLDivElement,
  RecipeMetadataProps
>(function RecipeMetadata(
  { preparationTime, cookingTime, servings, difficulty, className },
  ref
) {
  // Always render since servings is a required prop
  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-3', className)}
      data-testid="recipe-metadata"
    >
      {preparationTime && (
        <div
          className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm"
          data-testid="prep-time-badge"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Prep: {preparationTime} min</span>
        </div>
      )}

      {cookingTime && (
        <div
          className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm"
          data-testid="cook-time-badge"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Cook: {cookingTime} min</span>
        </div>
      )}

      <div
        className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm"
        data-testid="servings-badge"
      >
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>
          {servings} serving{servings !== 1 && 's'}
        </span>
      </div>

      {difficulty && (
        <div
          className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1 text-sm capitalize"
          data-testid="difficulty-badge"
        >
          <ChefHat className="h-4 w-4" aria-hidden="true" />
          <span>{formatDifficulty(difficulty)}</span>
        </div>
      )}
    </div>
  );
});

RecipeMetadata.displayName = 'RecipeMetadata';
