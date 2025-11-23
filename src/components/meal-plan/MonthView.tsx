/**
 * MonthView Component
 *
 * Displays a month-based calendar grid with meal slot indicators.
 * Shows a traditional calendar layout with weeks and days.
 *
 * Features:
 * - Month grid layout (7 columns × variable rows)
 * - Day cells with meal indicators
 * - Month header with navigation
 * - Current day highlighting
 * - Meal count badges per day
 * - Fully accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <MonthView
 *   data={mealPlanData}
 *   month={new Date()}
 *   mode="view"
 *   onDayClick={(date) => console.log('Day clicked', date)}
 * />
 * ```
 *
 * @module components/meal-plan/MonthView
 */

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  monthGridVariants,
  monthDayCellVariants,
  navigationControlsVariants,
  currentDateLabelVariants,
} from '@/lib/ui/meal-plan-calendar-variants';
import type { MonthViewProps } from '@/types/ui/meal-plan-calendar';
import { getMealSlot } from '@/types/ui/meal-plan-calendar';
import {
  getMonthDates,
  isToday,
  isSameMonth,
  formatMonthHeader,
  getDefaultMealTypes,
} from './meal-plan-calendar-utils';
import { Coffee, Salad, UtensilsCrossed, Cookie } from 'lucide-react';

// Icon mapping for meal types
const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Salad,
  dinner: UtensilsCrossed,
  snack: Cookie,
};

/**
 * MonthView component
 */
export const MonthView = React.forwardRef<HTMLDivElement, MonthViewProps>(
  (
    {
      data,
      month,
      mode: _mode = 'view',
      mealTypes,
      size = 'default',
      onDayClick,
      onPreviousMonth,
      onNextMonth,
      className,
      ...props
    },
    ref
  ) => {
    // Get meal types to display
    const displayMealTypes = mealTypes ?? getDefaultMealTypes();

    // Get all dates for the month (including leading/trailing days)
    const monthDates = React.useMemo(() => getMonthDates(month), [month]);

    // Count recipes for a given date
    const getRecipeCount = React.useCallback(
      (date: Date) => {
        let count = 0;
        displayMealTypes.forEach(mealType => {
          const slot = getMealSlot(data, date, mealType);
          if (slot?.recipes && slot.recipes.length > 0) {
            count += slot.recipes.length;
          }
        });
        return count;
      },
      [data, displayMealTypes]
    );

    // Get meal indicators for a date
    const getMealIndicators = React.useCallback(
      (date: Date) => {
        const indicators: Array<{ mealType: string; hasRecipes: boolean }> = [];
        displayMealTypes.forEach(mealType => {
          const slot = getMealSlot(data, date, mealType);
          indicators.push({
            mealType,
            hasRecipes: Boolean(slot?.recipes && slot.recipes.length > 0),
          });
        });
        return indicators;
      },
      [data, displayMealTypes]
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
            {formatMonthHeader(month)}
          </div>

          {(onPreviousMonth ?? onNextMonth) && (
            <div className={navigationControlsVariants({ size })}>
              {onPreviousMonth && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {onNextMonth && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Month grid */}
        <div
          className={monthGridVariants({ size })}
          role="grid"
          aria-label={`Calendar for ${formatMonthHeader(month)}`}
        >
          {/* Day headers (weekdays) */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-muted-foreground text-center text-sm font-medium"
              role="columnheader"
            >
              {day}
            </div>
          ))}

          {/* Day cells */}
          {monthDates.flat().map((date, index) => {
            const isTodayDate = isToday(date);
            const isCurrentMonth = isSameMonth(date, month);
            const recipeCount = getRecipeCount(date);
            const mealIndicators = getMealIndicators(date);

            return (
              <div
                key={`${date.toISOString()}-${index}`}
                className={monthDayCellVariants({
                  isToday: isTodayDate,
                  isCurrentMonth,
                  size,
                })}
                role="gridcell"
                onClick={() => onDayClick?.(date)}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && onDayClick) {
                    e.preventDefault();
                    onDayClick(date);
                  }
                }}
                tabIndex={onDayClick ? 0 : undefined}
                aria-label={`${date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}, ${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}`}
              >
                {/* Day number */}
                <div className="mb-1 text-sm font-semibold">
                  {date.getDate()}
                </div>

                {/* Meal indicators */}
                {recipeCount > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {mealIndicators.map(({ mealType, hasRecipes }) => {
                      if (!hasRecipes) return null;

                      const Icon =
                        mealTypeIcons[mealType as keyof typeof mealTypeIcons];

                      return (
                        <Icon
                          key={mealType}
                          className="text-muted-foreground h-3 w-3"
                          aria-hidden="true"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Recipe count badge */}
                {recipeCount > 0 && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

MonthView.displayName = 'MonthView';
