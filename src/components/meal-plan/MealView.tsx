/**
 * MealView Component
 *
 * Displays a horizontal scrollable view of a specific meal type across multiple days.
 * Useful for meal prep planning - see all breakfasts, all lunches, etc.
 *
 * Features:
 * - Horizontal scroll layout
 * - Single meal type across multiple days
 * - Day cards with date and meal slot
 * - Meal type header
 * - Responsive card sizing
 * - Fully accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <MealView
 *   data={mealPlanData}
 *   startDate={new Date()}
 *   mealType="breakfast"
 *   days={7}
 *   mode="view"
 * />
 * ```
 *
 * @module components/meal-plan/MealView
 */

'use client';

import * as React from 'react';

import { MealSlot } from './MealSlot';
import { cn } from '@/lib/utils';
import { mealViewContainerVariants } from '@/lib/ui/meal-plan-calendar-variants';
import type { MealViewProps } from '@/types/ui/meal-plan-calendar';
import { getMealSlot } from '@/types/ui/meal-plan-calendar';
import { addDays, formatDayHeader, isToday } from './meal-plan-calendar-utils';
import { Coffee, Salad, UtensilsCrossed, Cookie } from 'lucide-react';

// Icon mapping for meal types
const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Salad,
  dinner: UtensilsCrossed,
  snack: Cookie,
};

/**
 * MealView component
 */
export const MealView = React.forwardRef<HTMLDivElement, MealViewProps>(
  (
    {
      data,
      startDate,
      mealType,
      days = 7,
      mode = 'view',
      size = 'default',
      onMealSlotClick,
      onAddRecipe,
      onRemoveRecipe,
      onViewRecipe,
      className,
      ...props
    },
    ref
  ) => {
    // Generate array of dates
    const dates = React.useMemo(() => {
      const result: Date[] = [];
      for (let i = 0; i < days; i++) {
        result.push(addDays(startDate, i));
      }
      return result;
    }, [startDate, days]);

    // Get the meal type icon
    const MealIcon =
      mealTypeIcons[mealType as keyof typeof mealTypeIcons] ?? Coffee;

    // Capitalize meal type for display
    const mealTypeLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-4', className)}
        {...props}
      >
        {/* Meal type header */}
        <div className="flex items-center gap-2">
          <MealIcon className="text-foreground h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-semibold">{mealTypeLabel}</h3>
        </div>

        {/* Horizontal scroll container */}
        <div
          className={mealViewContainerVariants({ size })}
          role="list"
          aria-label={`${mealTypeLabel} meals`}
        >
          {dates.map(date => {
            const slot = getMealSlot(data, date, mealType) ?? {
              date,
              mealType,
              recipes: [],
            };

            const isTodayDate = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  'bg-card flex min-w-[280px] flex-col gap-2 rounded-lg border p-3',
                  isTodayDate && 'ring-primary ring-2 ring-offset-2'
                )}
                role="listitem"
              >
                {/* Date header */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="text-sm font-medium">
                    {formatDayHeader(date, 'medium')}
                  </div>
                  {isTodayDate && (
                    <span className="text-muted-foreground text-xs">Today</span>
                  )}
                </div>

                {/* Meal slot */}
                <MealSlot
                  slot={slot}
                  mode={mode}
                  size={size}
                  showMealType={false}
                  showDate={false}
                  onSlotClick={onMealSlotClick}
                  onAddRecipe={onAddRecipe}
                  onRemoveRecipe={onRemoveRecipe}
                  onViewRecipe={onViewRecipe}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

MealView.displayName = 'MealView';
