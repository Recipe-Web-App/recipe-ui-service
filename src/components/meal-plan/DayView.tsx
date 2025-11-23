/**
 * DayView Component
 *
 * Displays a single day view with all meal slots shown vertically.
 * Provides a detailed view of one day's meal plan.
 *
 * Features:
 * - Vertical layout of all meal types for a single day
 * - Day header with date display
 * - Navigation controls (prev/next day)
 * - Current day highlighting
 * - Larger meal slots for detailed view
 * - Fully accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <DayView
 *   data={mealPlanData}
 *   date={new Date()}
 *   mode="edit"
 *   onAddRecipe={(slot) => console.log('Add recipe', slot)}
 * />
 * ```
 *
 * @module components/meal-plan/DayView
 */

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MealSlot } from './MealSlot';
import { cn } from '@/lib/utils';
import {
  dayViewContainerVariants,
  dayViewHeaderVariants,
  dayViewContentVariants,
  navigationControlsVariants,
  currentDateLabelVariants,
} from '@/lib/ui/meal-plan-calendar-variants';
import type { DayViewProps } from '@/types/ui/meal-plan-calendar';
import { getMealSlot } from '@/types/ui/meal-plan-calendar';
import {
  isToday,
  formatFullDate,
  getDefaultMealTypes,
} from './meal-plan-calendar-utils';

/**
 * DayView component
 */
export const DayView = React.forwardRef<HTMLDivElement, DayViewProps>(
  (
    {
      data,
      date,
      mode = 'view',
      mealTypes,
      size = 'default',
      onMealSlotClick,
      onAddRecipe,
      onRemoveRecipe,
      onViewRecipe,
      onPreviousDay,
      onNextDay,
      className,
      ...props
    },
    ref
  ) => {
    // Get meal types to display
    const displayMealTypes = mealTypes ?? getDefaultMealTypes();

    // Check if this is today
    const isTodayDate = React.useMemo(() => isToday(date), [date]);

    return (
      <div
        ref={ref}
        className={cn(dayViewContainerVariants({ size }), className)}
        {...props}
      >
        {/* Header with navigation */}
        <div className={dayViewHeaderVariants({ size })}>
          <div className="flex items-center justify-between">
            <div className={currentDateLabelVariants({ size })}>
              {formatFullDate(date)}
              {isTodayDate && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  (Today)
                </span>
              )}
            </div>

            {(onPreviousDay ?? onNextDay) && (
              <div className={navigationControlsVariants({ size })}>
                {onPreviousDay && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onPreviousDay}
                    aria-label="Previous day"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
                {onNextDay && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onNextDay}
                    aria-label="Next day"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Day content - vertical meal slots */}
        <div
          className={dayViewContentVariants({ size })}
          role="feed"
          aria-label={`Meal plan for ${formatFullDate(date)}`}
        >
          {displayMealTypes.map(mealType => {
            const slot = getMealSlot(data, date, mealType) ?? {
              date,
              mealType,
              recipes: [],
            };

            return (
              <MealSlot
                key={`${date.toISOString()}-${mealType}`}
                slot={slot}
                mode={mode}
                size={size}
                showMealType
                onSlotClick={onMealSlotClick}
                onAddRecipe={onAddRecipe}
                onRemoveRecipe={onRemoveRecipe}
                onViewRecipe={onViewRecipe}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

DayView.displayName = 'DayView';
