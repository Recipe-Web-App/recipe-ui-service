/**
 * Meal plan quick action types
 */
export enum MealPlanQuickActionType {
  FAVORITE = 'favorite',
  SHARE = 'share',
  CLONE = 'clone',
  QUICK_VIEW = 'quick_view',
  GENERATE_SHOPPING_LIST = 'generate_shopping_list',
  VIEW_CALENDAR = 'view_calendar',
}

/**
 * Meal plan quick action handler types
 */
export interface MealPlanQuickActionHandlers {
  onFavorite?: (mealPlanId: string) => void;
  onShare?: (mealPlanId: string) => void;
  onClone?: (mealPlanId: string) => void;
  onQuickView?: (mealPlanId: string) => void;
  onGenerateShoppingList?: (mealPlanId: string) => void;
  onViewCalendar?: (mealPlanId: string) => void;
}

/**
 * Meal plan quick action configuration
 */
export interface MealPlanQuickAction {
  type: MealPlanQuickActionType;
  icon: string; // Lucide icon name
  label: string;
  ariaLabel: string;
  handler?: (mealPlanId: string) => void;
  requiresOwnership?: boolean;
}
