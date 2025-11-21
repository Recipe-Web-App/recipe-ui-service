import type { BadgeProps } from '@/components/ui/badge';

/**
 * Meal plan status based on date range
 */
export type MealPlanStatus = 'current' | 'completed' | 'upcoming';

/**
 * Meal plan data shape for MealPlanCard component
 * Based on MealPlanResponseDto with additional display fields
 */
export interface MealPlanCardMealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  recipeCount: number;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
  // Additional display fields
  ownerName?: string;
  ownerAvatar?: string;
  recipeImages?: string[]; // Recipe images for mosaic display
  isFavorited?: boolean;
  // Meal type breakdown for badge display
  mealTypeBreakdown?: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack?: number;
    dessert?: number;
  };
}

/**
 * Meal plan card variant types
 */
export type MealPlanCardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'ghost'
  | 'interactive';

/**
 * Meal plan card size types
 */
export type MealPlanCardSize = 'sm' | 'default' | 'lg';

// Import handler types from their source modules
// These are defined in meal-plan/quick-actions.ts and meal-plan/menu.ts

/**
 * MealPlanCard component props
 */
export interface MealPlanCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Meal plan data to display */
  mealPlan: MealPlanCardMealPlan;
  /** Visual variant */
  variant?: MealPlanCardVariant;
  /** Size variant */
  size?: MealPlanCardSize;
  /** Whether the current user owns this meal plan */
  isOwner?: boolean;
  /** Quick action handlers (hover overlay actions) */
  quickActionHandlers?: import('../meal-plan/quick-actions').MealPlanQuickActionHandlers;
  /** Menu action handlers (three-dot menu actions) */
  menuActionHandlers?: import('../meal-plan/menu').MealPlanMenuActionHandlers;
  /** Click handler for card */
  onClick?: (mealPlanId: string) => void;
  /** Custom class name */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * Helper function: Get meal plan status based on date range
 *
 * @param startDate - ISO date string for start date
 * @param endDate - ISO date string for end date
 * @returns Status: 'current', 'completed', or 'upcoming'
 *
 * @example
 * getMealPlanStatus('2024-01-15', '2024-01-21') // 'completed' (if today is after 2024-01-21)
 */
export const getMealPlanStatus = (
  startDate: string,
  endDate: string
): MealPlanStatus => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'upcoming';
  } else if (now > end) {
    return 'completed';
  } else {
    return 'current';
  }
};

/**
 * Helper function: Get status badge label
 *
 * @param status - Meal plan status
 * @returns User-friendly label
 */
export const getStatusLabel = (status: MealPlanStatus): string => {
  switch (status) {
    case 'current':
      return 'Current';
    case 'completed':
      return 'Completed';
    case 'upcoming':
      return 'Upcoming';
    default:
      return 'Unknown';
  }
};

/**
 * Helper function: Get status badge variant
 *
 * @param status - Meal plan status
 * @returns Badge variant matching the status
 */
export const getStatusVariant = (
  status: MealPlanStatus
): BadgeProps['variant'] => {
  switch (status) {
    case 'current':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'upcoming':
      return 'outline';
    default:
      return 'secondary';
  }
};

/**
 * Helper function: Format date range as "Week of [date]"
 *
 * @param startDate - ISO date string
 * @returns Formatted date range (e.g., "Week of Jan 15")
 *
 * @example
 * formatDateRange('2024-01-15') // "Week of Jan 15"
 */
export const formatDateRange = (startDate: string): string => {
  const date = new Date(startDate);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();

  return `Week of ${month} ${day}`;
};

/**
 * Helper function: Format meal type breakdown as badge text
 *
 * @param breakdown - Meal type breakdown object
 * @returns Formatted breakdown (e.g., "7B · 7L · 7D")
 *
 * @example
 * formatMealBreakdown({ breakfast: 7, lunch: 7, dinner: 7 }) // "7B · 7L · 7D"
 */
export const formatMealBreakdown = (breakdown?: {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack?: number;
  dessert?: number;
}): string => {
  if (!breakdown) {
    return 'No meals';
  }

  const parts: string[] = [];

  if (breakdown.breakfast > 0) {
    parts.push(`${breakdown.breakfast}B`);
  }
  if (breakdown.lunch > 0) {
    parts.push(`${breakdown.lunch}L`);
  }
  if (breakdown.dinner > 0) {
    parts.push(`${breakdown.dinner}D`);
  }
  if (breakdown.snack && breakdown.snack > 0) {
    parts.push(`${breakdown.snack}S`);
  }
  if (breakdown.dessert && breakdown.dessert > 0) {
    parts.push(`${breakdown.dessert}Ds`);
  }

  if (parts.length === 0) {
    return 'No meals';
  }

  return parts.join(' · ');
};

/**
 * Helper function: Get duration text
 *
 * @param durationDays - Number of days in the meal plan
 * @returns Formatted duration text
 *
 * @example
 * getDurationText(7) // "7 days"
 * getDurationText(1) // "1 day"
 */
export const getDurationText = (durationDays: number): string => {
  if (durationDays === 1) {
    return '1 day';
  }
  return `${durationDays} days`;
};

/**
 * Helper function: Get recipe count text
 *
 * @param count - Number of recipes in the meal plan
 * @returns Formatted recipe count text
 *
 * @example
 * getRecipeCountText(21) // "21 recipes"
 * getRecipeCountText(1) // "1 recipe"
 * getRecipeCountText(0) // "No recipes"
 */
export const getRecipeCountText = (count: number): string => {
  if (count === 0) {
    return 'No recipes';
  } else if (count === 1) {
    return '1 recipe';
  } else {
    return `${count} recipes`;
  }
};
