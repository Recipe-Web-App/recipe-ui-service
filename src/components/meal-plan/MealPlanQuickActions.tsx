'use client';

import * as React from 'react';
import { Heart, Share2, Copy, Eye, ShoppingCart, Calendar } from 'lucide-react';
import { QuickActions } from '@/components/ui/quick-actions';
import { getMealPlanQuickActionsList } from './meal-plan-card-utils';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';

export interface MealPlanQuickActionsProps {
  /** Meal plan ID */
  mealPlanId: string;
  /** Action handlers */
  handlers: MealPlanQuickActionHandlers;
  /** Custom class name */
  className?: string;
}

// Icon mapping
const iconMap = {
  Heart,
  Share2,
  Copy,
  Eye,
  ShoppingCart,
  Calendar,
};

/**
 * MealPlanQuickActions - Hover overlay with quick action buttons for meal plans
 *
 * Provides quick access to common meal plan actions:
 * - Favorite: Add/remove from favorites
 * - Share: Share the meal plan with others
 * - Clone: Duplicate the meal plan
 * - Quick View: Preview meal plan details
 * - Shopping List: Generate shopping list for the meal plan
 * - View Calendar: View the meal plan in calendar format
 *
 * @example
 * ```tsx
 * <div className="group relative">
 *   <MealPlanCard mealPlan={mealPlan} />
 *   <MealPlanQuickActions
 *     mealPlanId={mealPlan.id}
 *     handlers={{
 *       onFavorite: handleFavorite,
 *       onShare: handleShare,
 *       onClone: handleClone,
 *       onQuickView: handleQuickView,
 *       onGenerateShoppingList: handleGenerateShoppingList,
 *       onViewCalendar: handleViewCalendar,
 *     }}
 *   />
 * </div>
 * ```
 */
export const MealPlanQuickActions = React.forwardRef<
  HTMLDivElement,
  MealPlanQuickActionsProps
>(({ mealPlanId, handlers, className, ...props }, ref) => {
  const quickActions = React.useMemo(
    () => getMealPlanQuickActionsList(mealPlanId, handlers),
    [mealPlanId, handlers]
  );

  const handleActionClick = React.useCallback(
    (actionType: string) => {
      const action = quickActions.find(a => a.type === actionType);
      if (action?.handler) {
        action.handler(mealPlanId);
      }
    },
    [mealPlanId, quickActions]
  );

  // Map actions to QuickActions format
  const mappedActions = React.useMemo(
    () =>
      quickActions.map(action => {
        const IconComponent = iconMap[action.icon as keyof typeof iconMap];
        return {
          id: action.type,
          icon: IconComponent,
          label: action.label,
          onClick: () => handleActionClick(action.type),
        };
      }),
    [quickActions, handleActionClick]
  );

  if (mappedActions.length === 0) {
    return null;
  }

  return (
    <QuickActions
      ref={ref}
      actions={mappedActions}
      className={className}
      {...props}
    />
  );
});

MealPlanQuickActions.displayName = 'MealPlanQuickActions';
