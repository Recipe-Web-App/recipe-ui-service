import * as React from 'react';
import { type BrowseListProps } from '@/types/ui/browse-list';
import {
  type RecipeListItemRecipe,
  type RecipeListItemProps,
} from '@/types/ui/recipe-list-item';

/**
 * Recipe-specific browse list props
 *
 * A specialized version of BrowseListProps that works specifically with recipes,
 * providing type-safe recipe actions and RecipeListItem configuration.
 *
 * This component provides a compact, scannable list view alternative to the grid view.
 */
export interface RecipeBrowseListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // Data
  /** Array of recipes to display in the list */
  recipes: RecipeListItemRecipe[];

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
  /** Whether the list is in a loading state */
  loading?: boolean;
  /** Error to display (Error object or string message) */
  error?: Error | string | null;

  // Recipe List Item Configuration
  /** Visual variant for all recipe list items */
  itemVariant?: RecipeListItemProps['variant'];
  /** Size for all recipe list items */
  itemSize?: RecipeListItemProps['size'];
  /** Whether to show quick actions on items */
  showQuickActions?: boolean;
  /** Whether to show menu on items */
  showMenu?: boolean;
  /** Whether to show author information on items */
  showAuthor?: boolean;
  /** Whether to show rating on items */
  showRating?: boolean;

  // Recipe Actions (applied to ALL list items)
  /** Callback when a recipe list item is clicked */
  onRecipeClick?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when favorite is clicked */
  onFavorite?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when share is clicked */
  onShare?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when add to collection is clicked */
  onAddToCollection?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when quick view is clicked */
  onQuickView?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when edit is clicked (owner only) */
  onEdit?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when delete is clicked (owner only) */
  onDelete?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when duplicate is clicked (owner only) */
  onDuplicate?: (recipe: RecipeListItemRecipe) => void;
  /** Callback when report is clicked (non-owner only) */
  onReport?: (recipe: RecipeListItemRecipe) => void;

  // Ownership
  /**
   * Determines which recipes are owned by the current user.
   * - boolean: All recipes have the same ownership status
   * - function: Determines ownership per recipe
   */
  isOwner?: boolean | ((recipe: RecipeListItemRecipe) => boolean);

  // List Configuration
  /** Whether to show dividers between list items */
  showDividers?: boolean;
  /** Spacing variant for the list container */
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
  /** Additional CSS classes for the list element */
  listClassName?: string;
  /** Additional CSS classes for the pagination wrapper */
  paginationClassName?: string;

  // Pagination Options
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean;
  /** Additional props to pass to the Pagination component */
  paginationProps?: BrowseListProps<RecipeListItemRecipe>['paginationProps'];

  // Skeleton
  /** Number of skeleton items to show during loading (default: 8) */
  skeletonCount?: number;

  // Accessibility
  /** Accessible label for the list region */
  'aria-label'?: string;
  /** Accessible description for the list region */
  'aria-describedby'?: string;
}

/**
 * Recipe browse action handlers
 *
 * Consolidated interface for all recipe action handlers
 * (shared with RecipeBrowseGrid for consistency)
 */
export interface RecipeBrowseListActions {
  onRecipeClick?: (recipe: RecipeListItemRecipe) => void;
  onFavorite?: (recipe: RecipeListItemRecipe) => void;
  onShare?: (recipe: RecipeListItemRecipe) => void;
  onAddToCollection?: (recipe: RecipeListItemRecipe) => void;
  onQuickView?: (recipe: RecipeListItemRecipe) => void;
  onEdit?: (recipe: RecipeListItemRecipe) => void;
  onDelete?: (recipe: RecipeListItemRecipe) => void;
  onDuplicate?: (recipe: RecipeListItemRecipe) => void;
  onReport?: (recipe: RecipeListItemRecipe) => void;
}

/**
 * Simple RecipeBrowseList without pagination
 *
 * Useful for smaller lists where pagination is not needed
 */
export interface SimpleRecipeBrowseListProps
  extends Omit<
    RecipeBrowseListProps,
    | 'currentPage'
    | 'totalPages'
    | 'onPageChange'
    | 'showPagination'
    | 'paginationProps'
  > {
  showPagination?: false;
}

/**
 * Re-export filter and sort helpers from browse-grid
 * (these work for both grid and list views)
 */
export {
  filterRecipesByDifficulty,
  filterRecipesByTime,
  filterRecipesByMinTime,
  filterRecipesByServings,
  filterFavoritedRecipes,
  filterRecipesByRating,
  sortRecipesByRating,
  sortRecipesByDate,
  sortRecipesByTotalTime,
  sortRecipesByServings,
  sortRecipesByTitle,
} from './browse-grid';
