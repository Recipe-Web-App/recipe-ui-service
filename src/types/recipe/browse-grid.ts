import * as React from 'react';
import {
  type BrowseGridProps,
  type BrowseGridColumns,
} from '@/types/ui/browse-grid';
import {
  type RecipeCardRecipe,
  type RecipeCardProps,
} from '@/types/ui/recipe-card';
import { DifficultyLevel } from '@/types/recipe-management/common';

/**
 * Recipe-specific browse grid props
 *
 * A specialized version of BrowseGridProps that works specifically with recipes,
 * providing type-safe recipe actions and RecipeCard configuration.
 */
export interface RecipeBrowseGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // Data
  /** Array of recipes to display in the grid */
  recipes: RecipeCardRecipe[];

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of recipes across all pages */
  totalItems?: number;
  /** Number of recipes per page */
  pageSize?: number;
  /** Callback fired when page changes */
  onPageChange?: (page: number) => void;
  /** Callback fired when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  // States
  /** Whether the grid is in a loading state */
  loading?: boolean;
  /** Error to display (Error object or string message) */
  error?: Error | string | null;

  // Recipe Card Configuration
  /** Visual variant for all recipe cards */
  cardVariant?: RecipeCardProps['variant'];
  /** Size for all recipe cards */
  cardSize?: RecipeCardProps['size'];
  /** Whether to show quick actions on cards */
  showQuickActions?: boolean;
  /** Whether to show menu on cards */
  showMenu?: boolean;
  /** Whether to show author information on cards */
  showAuthor?: boolean;

  // Recipe Actions (applied to ALL cards)
  /** Callback when a recipe card is clicked */
  onRecipeClick?: (recipe: RecipeCardRecipe) => void;
  /** Callback when favorite is clicked */
  onFavorite?: (recipe: RecipeCardRecipe) => void;
  /** Callback when share is clicked */
  onShare?: (recipe: RecipeCardRecipe) => void;
  /** Callback when add to collection is clicked */
  onAddToCollection?: (recipe: RecipeCardRecipe) => void;
  /** Callback when quick view is clicked */
  onQuickView?: (recipe: RecipeCardRecipe) => void;
  /** Callback when edit is clicked (owner only) */
  onEdit?: (recipe: RecipeCardRecipe) => void;
  /** Callback when delete is clicked (owner only) */
  onDelete?: (recipe: RecipeCardRecipe) => void;
  /** Callback when duplicate is clicked (owner only) */
  onDuplicate?: (recipe: RecipeCardRecipe) => void;
  /** Callback when report is clicked (non-owner only) */
  onReport?: (recipe: RecipeCardRecipe) => void;

  // Ownership
  /**
   * Determines which recipes are owned by the current user.
   * - boolean: All recipes have the same ownership status
   * - function: Determines ownership per recipe
   */
  isOwner?: boolean | ((recipe: RecipeCardRecipe) => boolean);

  // Grid Configuration
  /** Custom column configuration for responsive breakpoints */
  columns?: BrowseGridColumns;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Spacing variant for the grid container */
  spacing?: 'compact' | 'default' | 'comfortable';

  // Empty State
  /** Message to display when there are no recipes */
  emptyMessage?: string;
  /** Detailed description for empty state */
  emptyDescription?: string;
  /** Icon or element to display in empty state */
  emptyIcon?: React.ReactNode;
  /** Action buttons for empty state */
  emptyActions?: React.ReactNode;

  // Error Handling
  /** Callback fired when retry button is clicked in error state */
  onRetry?: () => void;

  // Styling
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the grid element */
  gridClassName?: string;
  /** Additional CSS classes for the pagination wrapper */
  paginationClassName?: string;

  // Pagination Options
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean;
  /** Additional props to pass to the Pagination component */
  paginationProps?: BrowseGridProps<RecipeCardRecipe>['paginationProps'];

  // Skeleton
  /** Number of skeleton items to show during loading (default: 12) */
  skeletonCount?: number;

  // Accessibility
  /** Accessible label for the grid region */
  'aria-label'?: string;
  /** Accessible description for the grid region */
  'aria-describedby'?: string;
}

/**
 * Recipe browse action handlers
 *
 * Consolidated interface for all recipe action handlers
 */
export interface RecipeBrowseActions {
  onRecipeClick?: (recipe: RecipeCardRecipe) => void;
  onFavorite?: (recipe: RecipeCardRecipe) => void;
  onShare?: (recipe: RecipeCardRecipe) => void;
  onAddToCollection?: (recipe: RecipeCardRecipe) => void;
  onQuickView?: (recipe: RecipeCardRecipe) => void;
  onEdit?: (recipe: RecipeCardRecipe) => void;
  onDelete?: (recipe: RecipeCardRecipe) => void;
  onDuplicate?: (recipe: RecipeCardRecipe) => void;
  onReport?: (recipe: RecipeCardRecipe) => void;
}

/**
 * Recipe filtering and sorting helpers
 */

/**
 * Filter recipes by difficulty level
 *
 * @param recipes - Array of recipes to filter
 * @param difficulty - Difficulty level to filter by
 * @returns Filtered array of recipes
 *
 * @example
 * const easyRecipes = filterRecipesByDifficulty(allRecipes, DifficultyLevel.EASY);
 */
export function filterRecipesByDifficulty(
  recipes: RecipeCardRecipe[],
  difficulty: DifficultyLevel
): RecipeCardRecipe[] {
  return recipes.filter(recipe => recipe.difficulty === difficulty);
}

/**
 * Filter recipes by maximum total time (prep + cook)
 *
 * @param recipes - Array of recipes to filter
 * @param maxMinutes - Maximum total time in minutes
 * @returns Filtered array of recipes
 *
 * @example
 * // Get recipes that take 30 minutes or less
 * const quickRecipes = filterRecipesByTime(allRecipes, 30);
 */
export function filterRecipesByTime(
  recipes: RecipeCardRecipe[],
  maxMinutes: number
): RecipeCardRecipe[] {
  return recipes.filter(recipe => {
    const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);
    return totalTime <= maxMinutes;
  });
}

/**
 * Filter recipes by minimum time (prep + cook)
 *
 * @param recipes - Array of recipes to filter
 * @param minMinutes - Minimum total time in minutes
 * @returns Filtered array of recipes
 *
 * @example
 * // Get recipes that take at least 60 minutes
 * const elaborateRecipes = filterRecipesByMinTime(allRecipes, 60);
 */
export function filterRecipesByMinTime(
  recipes: RecipeCardRecipe[],
  minMinutes: number
): RecipeCardRecipe[] {
  return recipes.filter(recipe => {
    const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);
    return totalTime >= minMinutes;
  });
}

/**
 * Filter recipes by servings range
 *
 * @param recipes - Array of recipes to filter
 * @param minServings - Minimum servings
 * @param maxServings - Maximum servings
 * @returns Filtered array of recipes
 *
 * @example
 * // Get recipes that serve 4-6 people
 * const familyRecipes = filterRecipesByServings(allRecipes, 4, 6);
 */
export function filterRecipesByServings(
  recipes: RecipeCardRecipe[],
  minServings: number,
  maxServings: number
): RecipeCardRecipe[] {
  return recipes.filter(
    recipe => recipe.servings >= minServings && recipe.servings <= maxServings
  );
}

/**
 * Filter recipes that are favorited
 *
 * @param recipes - Array of recipes to filter
 * @returns Filtered array of favorited recipes
 *
 * @example
 * const favoriteRecipes = filterFavoritedRecipes(allRecipes);
 */
export function filterFavoritedRecipes(
  recipes: RecipeCardRecipe[]
): RecipeCardRecipe[] {
  return recipes.filter(recipe => recipe.isFavorite === true);
}

/**
 * Filter recipes by minimum rating
 *
 * @param recipes - Array of recipes to filter
 * @param minRating - Minimum rating (0-5)
 * @returns Filtered array of recipes
 *
 * @example
 * // Get recipes with 4+ stars
 * const highRatedRecipes = filterRecipesByRating(allRecipes, 4);
 */
export function filterRecipesByRating(
  recipes: RecipeCardRecipe[],
  minRating: number
): RecipeCardRecipe[] {
  return recipes.filter(
    recipe => recipe.rating !== undefined && recipe.rating >= minRating
  );
}

/**
 * Sort recipes by rating
 *
 * @param recipes - Array of recipes to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 *
 * @example
 * // Highest rated first
 * const topRated = sortRecipesByRating(allRecipes, 'desc');
 */
export function sortRecipesByRating(
  recipes: RecipeCardRecipe[],
  order: 'asc' | 'desc' = 'desc'
): RecipeCardRecipe[] {
  return [...recipes].sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return order === 'asc' ? ratingA - ratingB : ratingB - ratingA;
  });
}

/**
 * Sort recipes by date created
 *
 * @param recipes - Array of recipes to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 *
 * @example
 * // Newest first
 * const newestRecipes = sortRecipesByDate(allRecipes, 'desc');
 */
export function sortRecipesByDate(
  recipes: RecipeCardRecipe[],
  order: 'asc' | 'desc' = 'desc'
): RecipeCardRecipe[] {
  return [...recipes].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort recipes by total time (prep + cook)
 *
 * @param recipes - Array of recipes to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 *
 * @example
 * // Quickest recipes first
 * const quickestFirst = sortRecipesByTotalTime(allRecipes, 'asc');
 */
export function sortRecipesByTotalTime(
  recipes: RecipeCardRecipe[],
  order: 'asc' | 'desc' = 'asc'
): RecipeCardRecipe[] {
  return [...recipes].sort((a, b) => {
    const timeA = (a.preparationTime ?? 0) + (a.cookingTime ?? 0);
    const timeB = (b.preparationTime ?? 0) + (b.cookingTime ?? 0);
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
}

/**
 * Sort recipes by servings
 *
 * @param recipes - Array of recipes to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 *
 * @example
 * // Largest batch recipes first
 * const largestBatch = sortRecipesByServings(allRecipes, 'desc');
 */
export function sortRecipesByServings(
  recipes: RecipeCardRecipe[],
  order: 'asc' | 'desc' = 'asc'
): RecipeCardRecipe[] {
  return [...recipes].sort((a, b) => {
    return order === 'asc' ? a.servings - b.servings : b.servings - a.servings;
  });
}

/**
 * Sort recipes alphabetically by title
 *
 * @param recipes - Array of recipes to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of recipes
 *
 * @example
 * // A-Z
 * const alphabetical = sortRecipesByTitle(allRecipes, 'asc');
 */
export function sortRecipesByTitle(
  recipes: RecipeCardRecipe[],
  order: 'asc' | 'desc' = 'asc'
): RecipeCardRecipe[] {
  return [...recipes].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return order === 'asc' ? comparison : -comparison;
  });
}
