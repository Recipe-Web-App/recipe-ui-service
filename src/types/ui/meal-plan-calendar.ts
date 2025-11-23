/**
 * MealPlanCalendar Component Types
 *
 * Type definitions for the MealPlanCalendar component and its sub-components.
 * Supports multiple view modes (week/month/day/meal) and edit/view modes.
 *
 * @module types/ui/meal-plan-calendar
 */

import type { VariantProps } from 'class-variance-authority';
import type {
  mealPlanCalendarVariants,
  mealSlotVariants,
} from '@/lib/ui/meal-plan-calendar-variants';

/**
 * Meal type enumeration
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Calendar view mode
 */
export type ViewMode = 'week' | 'month' | 'day' | 'meal';

/**
 * Alias for ViewMode (for backwards compatibility)
 */
export type CalendarView = ViewMode;

/**
 * Calendar interaction mode
 */
export type CalendarMode = 'view' | 'edit';

/**
 * Recipe data for display in meal slots
 */
export interface MealSlotRecipe {
  /** Unique recipe identifier */
  recipeId: number;
  /** Recipe name */
  recipeName: string;
  /** Optional recipe image URL */
  recipeImage?: string;
  /** Preparation time in minutes */
  prepTime?: number;
  /** Cooking time in minutes */
  cookTime?: number;
  /** Total time in minutes */
  totalTime?: number;
  /** Servings count */
  servings?: number;
}

/**
 * Meal slot data structure
 */
export interface MealSlot {
  /** Date for this meal slot */
  date: Date;
  /** Type of meal (breakfast, lunch, dinner, snack) */
  mealType: MealType;
  /** Recipes assigned to this slot */
  recipes: MealSlotRecipe[];
}

/**
 * Complete meal plan calendar data
 */
export interface MealPlanCalendarData {
  /** Start date of the meal plan */
  startDate: Date;
  /** End date of the meal plan */
  endDate: Date;
  /** All meal slots in the plan */
  slots: MealSlot[];
}

/**
 * MealSlot component props
 */
export interface MealSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'slot'>,
    VariantProps<typeof mealSlotVariants> {
  /** Meal slot data */
  slot: MealSlot;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Called when slot is clicked */
  onSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Show meal type label */
  showMealType?: boolean;
  /** Show date label */
  showDate?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * WeekView component props
 */
export interface WeekViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Meal plan data */
  data: MealPlanCalendarData;
  /** Start date of the week */
  startDate: Date;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Available meal types */
  mealTypes?: MealType[];
  /** Show weekends */
  showWeekends?: boolean;
  /** Called when meal slot is clicked */
  onMealSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Called when previous week button is clicked */
  onPreviousWeek?: () => void;
  /** Called when next week button is clicked */
  onNextWeek?: () => void;
  /** Component size */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * MonthView component props
 */
export interface MonthViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Meal plan data */
  data: MealPlanCalendarData;
  /** Month to display (any date in the month) */
  month: Date;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Available meal types */
  mealTypes?: MealType[];
  /** Called when a day is clicked */
  onDayClick?: (date: Date) => void;
  /** Called when meal slot is clicked */
  onMealSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Called when previous month button is clicked */
  onPreviousMonth?: () => void;
  /** Called when next month button is clicked */
  onNextMonth?: () => void;
  /** Component size */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * DayView component props
 */
export interface DayViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Meal plan data */
  data: MealPlanCalendarData;
  /** Day to display */
  date: Date;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Available meal types */
  mealTypes?: MealType[];
  /** Called when meal slot is clicked */
  onMealSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Called when previous day button is clicked */
  onPreviousDay?: () => void;
  /** Called when next day button is clicked */
  onNextDay?: () => void;
  /** Component size */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * MealView component props
 */
export interface MealViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Meal plan data */
  data: MealPlanCalendarData;
  /** Meal type to display */
  mealType: MealType;
  /** Date range start */
  startDate: Date;
  /** Number of days to display (default: 7) */
  days?: number;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Called when meal slot is clicked */
  onMealSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Component size */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * MealPlanCalendar main component props
 */
export interface MealPlanCalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof mealPlanCalendarVariants> {
  /** Meal plan data (controlled) */
  value: MealPlanCalendarData;
  /** Called when data changes */
  onChange?: (data: MealPlanCalendarData) => void;
  /** Interaction mode */
  mode?: CalendarMode;
  /** Default view mode */
  defaultView?: ViewMode;
  /** Current view mode (controlled) */
  view?: ViewMode;
  /** Called when view mode changes */
  onViewChange?: (view: ViewMode) => void;
  /** Current date (controlled) */
  currentDate?: Date;
  /** Called when current date changes */
  onCurrentDateChange?: (date: Date) => void;
  /** Start date override */
  startDate?: Date;
  /** Available meal types */
  mealTypes?: MealType[];
  /** Show weekends in week view */
  showWeekends?: boolean;
  /** Show view switcher */
  showViewSwitcher?: boolean;
  /** Called when meal slot is clicked */
  onMealSlotClick?: (slot: MealSlot) => void;
  /** Called when add recipe button is clicked */
  onAddRecipe?: (slot: MealSlot) => void;
  /** Called when remove recipe button is clicked */
  onRemoveRecipe?: (slot: MealSlot, recipeId: number) => void;
  /** Called when view recipe button is clicked */
  onViewRecipe?: (recipeId: number) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * Helper function to get a meal slot from data
 *
 * @param data - Meal plan calendar data
 * @param date - Date to find
 * @param mealType - Meal type to find
 * @returns Meal slot or undefined if not found
 */
export function getMealSlot(
  data: MealPlanCalendarData,
  date: Date,
  mealType: MealType
): MealSlot | undefined {
  return data.slots.find(
    slot =>
      slot.date.toDateString() === date.toDateString() &&
      slot.mealType === mealType
  );
}

/**
 * Helper function to add a recipe to a meal slot
 *
 * @param data - Meal plan calendar data
 * @param slot - Meal slot to add recipe to
 * @param recipe - Recipe to add
 * @returns Updated meal plan calendar data
 */
export function addRecipeToSlot(
  data: MealPlanCalendarData,
  slot: MealSlot,
  recipe: MealSlotRecipe
): MealPlanCalendarData {
  const existingSlot = getMealSlot(data, slot.date, slot.mealType);

  if (existingSlot) {
    // Update existing slot
    return {
      ...data,
      slots: data.slots.map(s =>
        s.date.toDateString() === slot.date.toDateString() &&
        s.mealType === slot.mealType
          ? { ...s, recipes: [...s.recipes, recipe] }
          : s
      ),
    };
  } else {
    // Create new slot
    return {
      ...data,
      slots: [...data.slots, { ...slot, recipes: [recipe] }],
    };
  }
}

/**
 * Helper function to remove a recipe from a meal slot
 *
 * @param data - Meal plan calendar data
 * @param slot - Meal slot to remove recipe from
 * @param recipeId - ID of recipe to remove
 * @returns Updated meal plan calendar data
 */
export function removeRecipeFromSlot(
  data: MealPlanCalendarData,
  slot: MealSlot,
  recipeId: number
): MealPlanCalendarData {
  return {
    ...data,
    slots: data.slots
      .map(s =>
        s.date.toDateString() === slot.date.toDateString() &&
        s.mealType === slot.mealType
          ? { ...s, recipes: s.recipes.filter(r => r.recipeId !== recipeId) }
          : s
      )
      .filter(s => s.recipes.length > 0), // Remove empty slots
  };
}

/**
 * Format meal type label
 *
 * @param mealType - Meal type
 * @returns Formatted label
 */
export function formatMealTypeLabel(mealType: MealType): string {
  const labels: Record<MealType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  // eslint-disable-next-line security/detect-object-injection
  return labels[mealType];
}

/**
 * Format meal slot label for accessibility
 *
 * @param slot - Meal slot
 * @returns Formatted label
 */
export function formatMealSlotLabel(slot: MealSlot): string {
  const dateStr = slot.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const mealLabel = formatMealTypeLabel(slot.mealType);

  if (slot.recipes.length === 0) {
    return `${dateStr}, ${mealLabel}: No recipes assigned`;
  } else if (slot.recipes.length === 1) {
    return `${dateStr}, ${mealLabel}: ${slot.recipes[0].recipeName}`;
  } else {
    const recipeNames = slot.recipes.map(r => r.recipeName).join(', ');
    return `${dateStr}, ${mealLabel}: ${slot.recipes.length} recipes - ${recipeNames}`;
  }
}
