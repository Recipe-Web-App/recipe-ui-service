import * as React from 'react';
import {
  type BrowseGridProps,
  type BrowseGridColumns,
} from '@/types/ui/browse-grid';
import {
  type MealPlanCardMealPlan,
  type MealPlanCardProps,
  type MealPlanStatus,
} from '@/types/ui/meal-plan-card';

/**
 * Meal plan-specific browse grid props
 *
 * A specialized version of BrowseGridProps that works specifically with meal plans,
 * providing type-safe meal plan actions and MealPlanCard configuration.
 */
export interface MealPlanBrowseGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // Data
  /** Array of meal plans to display in the grid */
  mealPlans: MealPlanCardMealPlan[];

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of meal plans across all pages */
  totalItems?: number;
  /** Number of meal plans per page */
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

  // Meal Plan Card Configuration
  /** Visual variant for all meal plan cards */
  cardVariant?: MealPlanCardProps['variant'];
  /** Size for all meal plan cards */
  cardSize?: MealPlanCardProps['size'];
  /** Whether to show quick actions on cards */
  showQuickActions?: boolean;
  /** Whether to show menu on cards */
  showMenu?: boolean;

  // Meal Plan Actions (applied to ALL cards)
  /** Callback when a meal plan card is clicked */
  onMealPlanClick?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when favorite is clicked */
  onFavorite?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when share is clicked */
  onShare?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when clone is clicked */
  onClone?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when quick view is clicked */
  onQuickView?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when generate shopping list is clicked */
  onGenerateShoppingList?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when view calendar is clicked */
  onViewCalendar?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when edit is clicked (owner only) */
  onEdit?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when delete is clicked (owner only) */
  onDelete?: (mealPlan: MealPlanCardMealPlan) => void;
  /** Callback when duplicate is clicked */
  onDuplicate?: (mealPlan: MealPlanCardMealPlan) => void;

  // Ownership
  /**
   * Determines which meal plans are owned by the current user.
   * - boolean: All meal plans have the same ownership status
   * - function: Determines ownership per meal plan
   */
  isOwner?: boolean | ((mealPlan: MealPlanCardMealPlan) => boolean);

  // Grid Configuration
  /** Custom column configuration for responsive breakpoints */
  columns?: BrowseGridColumns;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Spacing variant for the grid container */
  spacing?: 'compact' | 'default' | 'comfortable';

  // Empty State
  /** Message to display when there are no meal plans */
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
  paginationProps?: BrowseGridProps<MealPlanCardMealPlan>['paginationProps'];

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
 * Meal plan browse action handlers
 *
 * Consolidated interface for all meal plan action handlers
 */
export interface MealPlanBrowseActions {
  onMealPlanClick?: (mealPlan: MealPlanCardMealPlan) => void;
  onFavorite?: (mealPlan: MealPlanCardMealPlan) => void;
  onShare?: (mealPlan: MealPlanCardMealPlan) => void;
  onClone?: (mealPlan: MealPlanCardMealPlan) => void;
  onQuickView?: (mealPlan: MealPlanCardMealPlan) => void;
  onGenerateShoppingList?: (mealPlan: MealPlanCardMealPlan) => void;
  onViewCalendar?: (mealPlan: MealPlanCardMealPlan) => void;
  onEdit?: (mealPlan: MealPlanCardMealPlan) => void;
  onDelete?: (mealPlan: MealPlanCardMealPlan) => void;
  onDuplicate?: (mealPlan: MealPlanCardMealPlan) => void;
}

/**
 * Meal plan filtering and sorting helpers
 */

/**
 * Filter meal plans by status
 *
 * @param mealPlans - Array of meal plans to filter
 * @param status - Status to filter by ('current', 'completed', or 'upcoming')
 * @returns Filtered array of meal plans
 *
 * @example
 * const currentPlans = filterMealPlansByStatus(
 *   allMealPlans,
 *   'current'
 * );
 */
export function filterMealPlansByStatus(
  mealPlans: MealPlanCardMealPlan[],
  status: MealPlanStatus
): MealPlanCardMealPlan[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return mealPlans.filter(plan => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);

    if (status === 'upcoming') {
      return now < start;
    } else if (status === 'completed') {
      return now > end;
    } else {
      // current
      return now >= start && now <= end;
    }
  });
}

/**
 * Filter meal plans by minimum duration
 *
 * @param mealPlans - Array of meal plans to filter
 * @param minDays - Minimum duration in days
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get meal plans that are at least 7 days long
 * const weekLongPlans = filterMealPlansByMinDuration(allMealPlans, 7);
 */
export function filterMealPlansByMinDuration(
  mealPlans: MealPlanCardMealPlan[],
  minDays: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(plan => plan.durationDays >= minDays);
}

/**
 * Filter meal plans by maximum duration
 *
 * @param mealPlans - Array of meal plans to filter
 * @param maxDays - Maximum duration in days
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get short meal plans (3 days or less)
 * const shortPlans = filterMealPlansByMaxDuration(allMealPlans, 3);
 */
export function filterMealPlansByMaxDuration(
  mealPlans: MealPlanCardMealPlan[],
  maxDays: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(plan => plan.durationDays <= maxDays);
}

/**
 * Filter meal plans by duration range
 *
 * @param mealPlans - Array of meal plans to filter
 * @param minDays - Minimum duration in days
 * @param maxDays - Maximum duration in days
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get meal plans between 5-10 days
 * const mediumPlans = filterMealPlansByDurationRange(allMealPlans, 5, 10);
 */
export function filterMealPlansByDurationRange(
  mealPlans: MealPlanCardMealPlan[],
  minDays: number,
  maxDays: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(
    plan => plan.durationDays >= minDays && plan.durationDays <= maxDays
  );
}

/**
 * Filter meal plans by minimum recipe count
 *
 * @param mealPlans - Array of meal plans to filter
 * @param minRecipeCount - Minimum number of recipes
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get meal plans with at least 20 recipes
 * const largePlans = filterMealPlansByMinRecipeCount(allMealPlans, 20);
 */
export function filterMealPlansByMinRecipeCount(
  mealPlans: MealPlanCardMealPlan[],
  minRecipeCount: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(plan => plan.recipeCount >= minRecipeCount);
}

/**
 * Filter meal plans by maximum recipe count
 *
 * @param mealPlans - Array of meal plans to filter
 * @param maxRecipeCount - Maximum number of recipes
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get simple meal plans with at most 10 recipes
 * const simplePlans = filterMealPlansByMaxRecipeCount(allMealPlans, 10);
 */
export function filterMealPlansByMaxRecipeCount(
  mealPlans: MealPlanCardMealPlan[],
  maxRecipeCount: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(plan => plan.recipeCount <= maxRecipeCount);
}

/**
 * Filter meal plans by recipe count range
 *
 * @param mealPlans - Array of meal plans to filter
 * @param minRecipeCount - Minimum number of recipes
 * @param maxRecipeCount - Maximum number of recipes
 * @returns Filtered array of meal plans
 *
 * @example
 * // Get meal plans with 10-25 recipes
 * const mediumPlans = filterMealPlansByRecipeCountRange(allMealPlans, 10, 25);
 */
export function filterMealPlansByRecipeCountRange(
  mealPlans: MealPlanCardMealPlan[],
  minRecipeCount: number,
  maxRecipeCount: number
): MealPlanCardMealPlan[] {
  return mealPlans.filter(
    plan =>
      plan.recipeCount >= minRecipeCount && plan.recipeCount <= maxRecipeCount
  );
}

/**
 * Filter meal plans that are favorited
 *
 * @param mealPlans - Array of meal plans to filter
 * @returns Filtered array of favorited meal plans
 *
 * @example
 * const favoritePlans = filterFavoritedMealPlans(allMealPlans);
 */
export function filterFavoritedMealPlans(
  mealPlans: MealPlanCardMealPlan[]
): MealPlanCardMealPlan[] {
  return mealPlans.filter(plan => plan.isFavorited === true);
}

/**
 * Sort meal plans alphabetically by name
 *
 * @param mealPlans - Array of meal plans to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of meal plans
 *
 * @example
 * // A-Z
 * const alphabetical = sortMealPlansByName(allMealPlans, 'asc');
 */
export function sortMealPlansByName(
  mealPlans: MealPlanCardMealPlan[],
  order: 'asc' | 'desc' = 'asc'
): MealPlanCardMealPlan[] {
  return [...mealPlans].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort meal plans by date created
 *
 * @param mealPlans - Array of meal plans to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of meal plans
 *
 * @example
 * // Newest first
 * const newestPlans = sortMealPlansByDate(allMealPlans, 'desc');
 */
export function sortMealPlansByDate(
  mealPlans: MealPlanCardMealPlan[],
  order: 'asc' | 'desc' = 'desc'
): MealPlanCardMealPlan[] {
  return [...mealPlans].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort meal plans by start date
 *
 * @param mealPlans - Array of meal plans to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of meal plans
 *
 * @example
 * // Soonest start date first
 * const upcoming = sortMealPlansByStartDate(allMealPlans, 'asc');
 */
export function sortMealPlansByStartDate(
  mealPlans: MealPlanCardMealPlan[],
  order: 'asc' | 'desc' = 'asc'
): MealPlanCardMealPlan[] {
  return [...mealPlans].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort meal plans by duration
 *
 * @param mealPlans - Array of meal plans to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of meal plans
 *
 * @example
 * // Longest duration first
 * const longestFirst = sortMealPlansByDuration(allMealPlans, 'desc');
 */
export function sortMealPlansByDuration(
  mealPlans: MealPlanCardMealPlan[],
  order: 'asc' | 'desc' = 'desc'
): MealPlanCardMealPlan[] {
  return [...mealPlans].sort((a, b) => {
    return order === 'asc'
      ? a.durationDays - b.durationDays
      : b.durationDays - a.durationDays;
  });
}

/**
 * Sort meal plans by recipe count
 *
 * @param mealPlans - Array of meal plans to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of meal plans
 *
 * @example
 * // Most recipes first
 * const mostRecipes = sortMealPlansByRecipeCount(allMealPlans, 'desc');
 */
export function sortMealPlansByRecipeCount(
  mealPlans: MealPlanCardMealPlan[],
  order: 'asc' | 'desc' = 'desc'
): MealPlanCardMealPlan[] {
  return [...mealPlans].sort((a, b) => {
    return order === 'asc'
      ? a.recipeCount - b.recipeCount
      : b.recipeCount - a.recipeCount;
  });
}
