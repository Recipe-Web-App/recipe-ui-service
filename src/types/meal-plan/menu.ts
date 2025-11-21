/**
 * Meal plan menu action types
 */
export enum MealPlanMenuActionType {
  VIEW = 'view',
  EDIT = 'edit',
  DUPLICATE = 'duplicate',
  DELETE = 'delete',
  SHARE = 'share',
  GENERATE_SHOPPING_LIST = 'generate_shopping_list',
}

/**
 * Meal plan menu action handler types
 */
export interface MealPlanMenuActionHandlers {
  onView?: (mealPlanId: string) => void;
  onEdit?: (mealPlanId: string) => void;
  onDuplicate?: (mealPlanId: string) => void;
  onDelete?: (mealPlanId: string) => void;
  onShare?: (mealPlanId: string) => void;
  onGenerateShoppingList?: (mealPlanId: string) => void;
}

/**
 * Meal plan menu action configuration
 */
export interface MealPlanMenuAction {
  type: MealPlanMenuActionType;
  icon: string; // Lucide icon name
  label: string;
  handler?: (mealPlanId: string) => void;
  requiresOwnership?: boolean;
  variant?: 'default' | 'destructive';
  separator?: boolean; // Add separator before this item
}
