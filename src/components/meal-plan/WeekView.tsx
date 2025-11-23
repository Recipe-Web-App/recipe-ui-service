/**
 * WeekView Component
 *
 * Displays a week-based calendar view with meal slots for each day.
 * Supports 5-day (weekdays) or 7-day (with weekends) display.
 *
 * Features:
 * - 7-day or 5-day grid layout
 * - Day headers with date display
 * - Meal slots for each day/meal type
 * - Navigation controls (prev/next week)
 * - Current day highlighting
 * - Weekend toggle support
 * - Fully accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <WeekView
 *   data={mealPlanData}
 *   startDate={new Date()}
 *   mode="edit"
 *   showWeekends
 *   onAddRecipe={(slot) => console.log('Add recipe', slot)}
 * />
 * ```
 *
 * @module components/meal-plan/WeekView
 */

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MealSlot } from './MealSlot';
import { cn } from '@/lib/utils';
import {
  weekGridVariants,
  dayHeaderVariants,
  dayColumnVariants,
  navigationControlsVariants,
  currentDateLabelVariants,
} from '@/lib/ui/meal-plan-calendar-variants';
import type { WeekViewProps } from '@/types/ui/meal-plan-calendar';
import { getMealSlot } from '@/types/ui/meal-plan-calendar';
import {
  getWeekDates,
  isToday,
  isWeekend,
  formatDateRange,
  getDefaultMealTypes,
} from './meal-plan-calendar-utils';

/**
 * WeekView component
 */
export const WeekView = React.forwardRef<HTMLDivElement, WeekViewProps>(
  (
    {
      data,
      startDate,
      mode = 'view',
      mealTypes,
      showWeekends = true,
      size = 'default',
      onMealSlotClick,
      onAddRecipe,
      onRemoveRecipe,
      onViewRecipe,
      onPreviousWeek,
      onNextWeek,
      className,
      ...props
    },
    ref
  ) => {
    // Get meal types to display
    const displayMealTypes = mealTypes ?? getDefaultMealTypes();

    // Get dates for the week
    const weekDates = React.useMemo(
      () => getWeekDates(startDate, showWeekends),
      [startDate, showWeekends]
    );

    // Calculate week end date for header
    const weekEndDate = React.useMemo(
      () => weekDates[weekDates.length - 1],
      [weekDates]
    );

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-4', className)}
        {...props}
      >
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className={currentDateLabelVariants({ size })}>
            {formatDateRange(startDate, weekEndDate)}
          </div>

          {(onPreviousWeek ?? onNextWeek) && (
            <div className={navigationControlsVariants({ size })}>
              {onPreviousWeek && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onPreviousWeek}
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {onNextWeek && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNextWeek}
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Week grid */}
        <div
          className={weekGridVariants({ showWeekends, size })}
          role="grid"
          aria-label="Week calendar"
        >
          {weekDates.map(date => {
            const isTodayDate = isToday(date);
            const isWeekendDate = isWeekend(date);

            return (
              <div
                key={date.toISOString()}
                className={dayColumnVariants({ isToday: isTodayDate, size })}
                role="gridcell"
              >
                {/* Day header */}
                <div
                  className={dayHeaderVariants({
                    isToday: isTodayDate,
                    isWeekend: isWeekendDate,
                    size,
                  })}
                >
                  <div className="text-xs font-normal">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {date.toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                </div>

                {/* Meal slots for this day */}
                <div className="flex flex-col gap-2">
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
          })}
        </div>
      </div>
    );
  }
);

WeekView.displayName = 'WeekView';
