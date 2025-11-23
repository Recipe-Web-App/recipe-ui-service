import type { MealPlanResponseDto } from '@/types/meal-plan-management/meal-plan';
import type { CheckboxOption } from '@/types/ui/filter-panel';
import { MealType } from '@/types/meal-plan-management/common';

/**
 * Meal plan filter values interface
 * Defines the shape of filter state for meal plan browsing
 */
export interface MealPlanFilterValues {
  /** Search term for filtering meal plan names/descriptions */
  search?: string;
  /** Selected duration options */
  duration?: string[];
  /** Recipe count range [min, max] */
  recipeCountRange?: [number, number];
  /** Selected status options (Current, Upcoming, Completed) */
  status?: string[];
  /** Selected meal type options */
  mealTypes?: string[];
  /** Show only meal plans owned by current user */
  showMyMealPlans?: boolean;
  /** Show only meal plans marked as favorites */
  showOnlyFavorited?: boolean;
}

/**
 * MealPlanFilters component props
 */
export interface MealPlanFiltersProps {
  /** Array of meal plans for filtering */
  mealPlans: MealPlanResponseDto[];
  /** Current filter values (controlled) */
  values: MealPlanFilterValues;
  /** Callback when filter values change */
  onFilterChange: (values: MealPlanFilterValues) => void;
  /** Optional className for styling */
  className?: string;
  /** Whether filters are collapsible (mobile) */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Total number of results with current filters */
  totalResults?: number;
  /** Whether to show result count */
  showResultCount?: boolean;
  /** Loading state for results */
  loadingResults?: boolean;
  /** Panel title */
  title?: string;
  /** Panel variant */
  variant?: 'default' | 'compact' | 'full';
  /** Panel size */
  size?: 'sm' | 'md' | 'lg';
  /** Panel position */
  position?: 'sidebar' | 'drawer' | 'modal';
  /** Whether to show header */
  showHeader?: boolean;
  /** Whether to show footer */
  showFooter?: boolean;
}

/**
 * Default filter values
 * Shows all meal plans by default
 */
export const DEFAULT_MEAL_PLAN_FILTER_VALUES: MealPlanFilterValues = {
  search: '',
  duration: [],
  recipeCountRange: [0, 50],
  status: [],
  mealTypes: [],
  showMyMealPlans: false,
  showOnlyFavorited: false,
};

/**
 * Filter configuration constants
 */
export const MEAL_PLAN_FILTER_CONSTANTS = {
  /** Maximum recipe count */
  MAX_RECIPE_COUNT: 50,
  /** Recipe count slider step */
  RECIPE_COUNT_STEP: 5,
  /** Search debounce delay in ms */
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

/**
 * Duration options for meal plan filtering
 */
export const DURATION_OPTIONS = {
  ONE_WEEK: '1 week',
  TWO_WEEKS: '2 weeks',
  ONE_MONTH: '1 month',
  CUSTOM: 'Custom',
} as const;

/**
 * Status options for meal plan filtering
 */
export const STATUS_OPTIONS = {
  CURRENT: 'Current',
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
} as const;

/**
 * Get duration filter options for checkbox filter
 */
export function getDurationOptions(): CheckboxOption[] {
  return [
    {
      id: DURATION_OPTIONS.ONE_WEEK,
      label: '1 Week',
      description: 'Meal plans lasting one week (7 days)',
    },
    {
      id: DURATION_OPTIONS.TWO_WEEKS,
      label: '2 Weeks',
      description: 'Meal plans lasting two weeks (14 days)',
    },
    {
      id: DURATION_OPTIONS.ONE_MONTH,
      label: '1 Month',
      description: 'Meal plans lasting one month (28-31 days)',
    },
    {
      id: DURATION_OPTIONS.CUSTOM,
      label: 'Custom',
      description: 'Meal plans with custom duration',
    },
  ];
}

/**
 * Get status filter options for checkbox filter
 */
export function getStatusOptions(): CheckboxOption[] {
  return [
    {
      id: STATUS_OPTIONS.CURRENT,
      label: 'Current',
      description: 'Meal plans currently active',
    },
    {
      id: STATUS_OPTIONS.UPCOMING,
      label: 'Upcoming',
      description: 'Meal plans scheduled for the future',
    },
    {
      id: STATUS_OPTIONS.COMPLETED,
      label: 'Completed',
      description: 'Meal plans that have ended',
    },
  ];
}

/**
 * Get meal type filter options for checkbox filter
 * Maps from MealType enum to checkbox options
 */
export function getMealTypeOptions(): CheckboxOption[] {
  return [
    {
      id: MealType.BREAKFAST,
      label: 'Breakfast',
      description: 'Morning meals',
    },
    {
      id: MealType.LUNCH,
      label: 'Lunch',
      description: 'Midday meals',
    },
    {
      id: MealType.DINNER,
      label: 'Dinner',
      description: 'Evening meals',
    },
    {
      id: MealType.SNACK,
      label: 'Snack',
      description: 'Light snacks between meals',
    },
    {
      id: MealType.DESSERT,
      label: 'Dessert',
      description: 'Sweet treats and desserts',
    },
  ];
}

/**
 * Format recipe count for display
 */
export function formatRecipeCount(count: number): string {
  if (count === 0) return '0 recipes';
  if (count === 1) return '1 recipe';
  if (count >= 50) return '50+ recipes';
  return `${count} recipes`;
}

/**
 * Convert MealPlanFilterValues to generic FilterValues for FilterPanel
 */
export function mealPlanFiltersToFilterValues(
  values: MealPlanFilterValues
): Record<string, unknown> {
  return {
    search: values.search ?? '',
    duration: values.duration ?? [],
    recipeCountRange: values.recipeCountRange ?? [0, 50],
    status: values.status ?? [],
    mealTypes: values.mealTypes ?? [],
    showMyMealPlans: values.showMyMealPlans ?? false,
    showOnlyFavorited: values.showOnlyFavorited ?? false,
  };
}

/**
 * Convert generic FilterValues from FilterPanel to MealPlanFilterValues
 */
export function filterValuesToMealPlanFilters(
  values: Record<string, unknown>
): MealPlanFilterValues {
  return {
    search: typeof values.search === 'string' ? values.search : undefined,
    duration: Array.isArray(values.duration)
      ? (values.duration as string[])
      : undefined,
    recipeCountRange: Array.isArray(values.recipeCountRange)
      ? (values.recipeCountRange as [number, number])
      : undefined,
    status: Array.isArray(values.status)
      ? (values.status as string[])
      : undefined,
    mealTypes: Array.isArray(values.mealTypes)
      ? (values.mealTypes as string[])
      : undefined,
    showMyMealPlans:
      typeof values.showMyMealPlans === 'boolean'
        ? values.showMyMealPlans
        : undefined,
    showOnlyFavorited:
      typeof values.showOnlyFavorited === 'boolean'
        ? values.showOnlyFavorited
        : undefined,
  };
}
