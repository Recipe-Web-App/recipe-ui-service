import {
  Heart,
  Share2,
  Copy,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import {
  MealPlanQuickActionType,
  type MealPlanQuickAction,
  type MealPlanQuickActionHandlers,
} from '@/types/meal-plan/quick-actions';
import {
  MealPlanMenuActionType,
  type MealPlanMenuAction,
  type MealPlanMenuActionHandlers,
} from '@/types/meal-plan/menu';

/**
 * Get all available meal plan quick actions
 * Note: All quick actions are available to all users regardless of ownership
 */
export const getMealPlanQuickActionsList = (
  mealPlanId: string,
  handlers: MealPlanQuickActionHandlers
): MealPlanQuickAction[] => {
  const actions: MealPlanQuickAction[] = [];

  // Favorite action (available to all)
  if (handlers.onFavorite) {
    actions.push({
      type: MealPlanQuickActionType.FAVORITE,
      icon: 'Heart',
      label: 'Favorite',
      ariaLabel: 'Favorite this meal plan',
      handler: handlers.onFavorite,
    });
  }

  // Share action (available to all)
  if (handlers.onShare) {
    actions.push({
      type: MealPlanQuickActionType.SHARE,
      icon: 'Share2',
      label: 'Share',
      ariaLabel: 'Share this meal plan',
      handler: handlers.onShare,
    });
  }

  // Clone action (available to all)
  if (handlers.onClone) {
    actions.push({
      type: MealPlanQuickActionType.CLONE,
      icon: 'Copy',
      label: 'Clone',
      ariaLabel: 'Clone this meal plan',
      handler: handlers.onClone,
    });
  }

  // Quick view action (available to all)
  if (handlers.onQuickView) {
    actions.push({
      type: MealPlanQuickActionType.QUICK_VIEW,
      icon: 'Eye',
      label: 'Quick View',
      ariaLabel: 'Quick view of meal plan details',
      handler: handlers.onQuickView,
    });
  }

  // Generate shopping list action (available to all)
  if (handlers.onGenerateShoppingList) {
    actions.push({
      type: MealPlanQuickActionType.GENERATE_SHOPPING_LIST,
      icon: 'ShoppingCart',
      label: 'Shopping List',
      ariaLabel: 'Generate shopping list for this meal plan',
      handler: handlers.onGenerateShoppingList,
    });
  }

  // View calendar action (available to all)
  if (handlers.onViewCalendar) {
    actions.push({
      type: MealPlanQuickActionType.VIEW_CALENDAR,
      icon: 'Calendar',
      label: 'View Calendar',
      ariaLabel: 'View calendar for this meal plan',
      handler: handlers.onViewCalendar,
    });
  }

  return actions;
};

/**
 * Get meal plan menu actions based on ownership
 */
export const getMealPlanMenuActions = (
  mealPlanId: string,
  handlers: MealPlanMenuActionHandlers,
  isOwner: boolean = false
): MealPlanMenuAction[] => {
  const actions: MealPlanMenuAction[] = [];

  // View details (available to all)
  if (handlers.onView) {
    actions.push({
      type: MealPlanMenuActionType.VIEW,
      icon: 'Eye',
      label: 'View Details',
      handler: handlers.onView,
    });
  }

  if (isOwner) {
    // Owner-only actions
    if (handlers.onEdit) {
      actions.push({
        type: MealPlanMenuActionType.EDIT,
        icon: 'Edit',
        label: 'Edit Meal Plan',
        handler: handlers.onEdit,
        requiresOwnership: true,
      });
    }
  }

  // Duplicate (available to all)
  if (handlers.onDuplicate) {
    actions.push({
      type: MealPlanMenuActionType.DUPLICATE,
      icon: 'Copy',
      label: 'Duplicate',
      handler: handlers.onDuplicate,
    });
  }

  // Share (available to all)
  if (handlers.onShare) {
    actions.push({
      type: MealPlanMenuActionType.SHARE,
      icon: 'Share2',
      label: 'Share',
      handler: handlers.onShare,
    });
  }

  // Generate shopping list (available to all)
  if (handlers.onGenerateShoppingList) {
    actions.push({
      type: MealPlanMenuActionType.GENERATE_SHOPPING_LIST,
      icon: 'ShoppingCart',
      label: 'Generate Shopping List',
      handler: handlers.onGenerateShoppingList,
    });
  }

  if (isOwner) {
    // Delete (owner-only)
    if (handlers.onDelete) {
      actions.push({
        type: MealPlanMenuActionType.DELETE,
        icon: 'Trash2',
        label: 'Delete Meal Plan',
        handler: handlers.onDelete,
        requiresOwnership: true,
        variant: 'destructive',
        separator: true,
      });
    }
  }

  return actions;
};

/**
 * Get all meal plan actions (quick actions + menu actions combined)
 */
export const getAllMealPlanActions = (
  mealPlanId: string,
  quickActionHandlers: MealPlanQuickActionHandlers,
  menuActionHandlers: MealPlanMenuActionHandlers,
  isOwner: boolean = false
): {
  quickActions: MealPlanQuickAction[];
  menuActions: MealPlanMenuAction[];
} => {
  return {
    quickActions: getMealPlanQuickActionsList(mealPlanId, quickActionHandlers),
    menuActions: getMealPlanMenuActions(
      mealPlanId,
      menuActionHandlers,
      isOwner
    ),
  };
};

/**
 * Icon registry for meal plan actions
 */
export const mealPlanActionIcons = {
  Heart,
  Share2,
  Copy,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Calendar,
};
