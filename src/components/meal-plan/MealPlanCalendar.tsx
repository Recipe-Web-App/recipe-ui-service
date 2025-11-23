/**
 * MealPlanCalendar Component
 *
 * Main component that orchestrates all calendar views (week/day/month/meal).
 * Provides view switching, navigation, and data management for meal planning.
 *
 * Features:
 * - Multiple view modes (week, day, month, meal)
 * - View switching controls
 * - Date navigation
 * - Controlled component pattern
 * - Full keyboard navigation
 * - Responsive design
 * - Fully accessible
 *
 * @example
 * ```tsx
 * <MealPlanCalendar
 *   value={mealPlanData}
 *   onChange={setMealPlanData}
 *   mode="edit"
 *   defaultView="week"
 * />
 * ```
 *
 * @module components/meal-plan/MealPlanCalendar
 */

'use client';

import * as React from 'react';
import { Calendar, Clock, Grid3x3, List } from 'lucide-react';

import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { MealView } from './MealView';
import { cn } from '@/lib/utils';
import {
  mealPlanCalendarVariants,
  calendarHeaderVariants,
  viewSwitcherVariants,
  viewSwitcherButtonVariants,
} from '@/lib/ui/meal-plan-calendar-variants';
import type {
  MealPlanCalendarProps,
  CalendarView,
  MealSlot,
  MealType,
} from '@/types/ui/meal-plan-calendar';
import {
  addRecipeToSlot,
  removeRecipeFromSlot,
} from '@/types/ui/meal-plan-calendar';
import {
  addDays,
  addWeeks,
  addMonths,
  getStartOfWeek,
  getStartOfMonth,
} from './meal-plan-calendar-utils';

/**
 * MealPlanCalendar component
 */
export const MealPlanCalendar = React.forwardRef<
  HTMLDivElement,
  MealPlanCalendarProps
>(
  (
    {
      value,
      onChange,
      mode = 'view',
      defaultView = 'week',
      currentDate: controlledCurrentDate,
      onCurrentDateChange,
      mealTypes,
      showWeekends = true,
      size = 'default',
      onMealSlotClick,
      onViewRecipe,
      className,
      ...props
    },
    ref
  ) => {
    // View state (controlled or uncontrolled)
    const [internalView, setInternalView] =
      React.useState<CalendarView>(defaultView);
    const [internalMealType, setInternalMealType] =
      React.useState<MealType>('breakfast');

    // Current date state (controlled or uncontrolled)
    const [internalCurrentDate, setInternalCurrentDate] = React.useState<Date>(
      () => controlledCurrentDate ?? new Date()
    );

    const currentDate = controlledCurrentDate ?? internalCurrentDate;
    const setCurrentDate = React.useCallback(
      (date: Date) => {
        if (!controlledCurrentDate) {
          setInternalCurrentDate(date);
        }
        onCurrentDateChange?.(date);
      },
      [controlledCurrentDate, onCurrentDateChange]
    );

    // Handle view change
    const handleViewChange = (view: CalendarView) => {
      setInternalView(view);
    };

    // Handle meal type change for meal view
    const handleMealTypeChange = (mealType: MealType) => {
      setInternalMealType(mealType);
    };

    // Navigation handlers
    const handlePreviousWeek = React.useCallback(() => {
      setCurrentDate(addWeeks(currentDate, -1));
    }, [currentDate, setCurrentDate]);

    const handleNextWeek = React.useCallback(() => {
      setCurrentDate(addWeeks(currentDate, 1));
    }, [currentDate, setCurrentDate]);

    const handlePreviousDay = React.useCallback(() => {
      setCurrentDate(addDays(currentDate, -1));
    }, [currentDate, setCurrentDate]);

    const handleNextDay = React.useCallback(() => {
      setCurrentDate(addDays(currentDate, 1));
    }, [currentDate, setCurrentDate]);

    const handlePreviousMonth = React.useCallback(() => {
      setCurrentDate(addMonths(currentDate, -1));
    }, [currentDate, setCurrentDate]);

    const handleNextMonth = React.useCallback(() => {
      setCurrentDate(addMonths(currentDate, 1));
    }, [currentDate, setCurrentDate]);

    const handleDayClick = React.useCallback(
      (date: Date) => {
        setCurrentDate(date);
        setInternalView('day');
      },
      [setCurrentDate]
    );

    // Recipe management handlers
    const handleAddRecipe = React.useCallback(
      (slot: MealSlot) => {
        // In a real app, this would open a recipe selector modal
        // For now, we'll just call onChange if provided
        if (onChange) {
          // Create a placeholder recipe for demonstration
          const newRecipe = {
            recipeId: Date.now(), // Temporary ID
            recipeName: 'New Recipe',
          };
          const updatedData = addRecipeToSlot(value, slot, newRecipe);
          onChange(updatedData);
        }
      },
      [value, onChange]
    );

    const handleRemoveRecipe = React.useCallback(
      (slot: MealSlot, recipeId: number) => {
        if (onChange) {
          const updatedData = removeRecipeFromSlot(value, slot, recipeId);
          onChange(updatedData);
        }
      },
      [value, onChange]
    );

    // Calculate start dates for different views
    const weekStartDate = React.useMemo(
      () => getStartOfWeek(currentDate),
      [currentDate]
    );

    const monthDate = React.useMemo(
      () => getStartOfMonth(currentDate),
      [currentDate]
    );

    return (
      <div
        ref={ref}
        className={cn(mealPlanCalendarVariants({ size }), className)}
        {...props}
      >
        {/* Header with view switcher */}
        <div className={calendarHeaderVariants({ size })}>
          <div className={viewSwitcherVariants({ size })}>
            <button
              className={viewSwitcherButtonVariants({
                active: internalView === 'week',
              })}
              onClick={() => handleViewChange('week')}
              aria-label="Week view"
              aria-pressed={internalView === 'week'}
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Week</span>
            </button>

            <button
              className={viewSwitcherButtonVariants({
                active: internalView === 'day',
              })}
              onClick={() => handleViewChange('day')}
              aria-label="Day view"
              aria-pressed={internalView === 'day'}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>Day</span>
            </button>

            <button
              className={viewSwitcherButtonVariants({
                active: internalView === 'month',
              })}
              onClick={() => handleViewChange('month')}
              aria-label="Month view"
              aria-pressed={internalView === 'month'}
            >
              <Grid3x3 className="h-4 w-4" aria-hidden="true" />
              <span>Month</span>
            </button>

            <button
              className={viewSwitcherButtonVariants({
                active: internalView === 'meal',
              })}
              onClick={() => handleViewChange('meal')}
              aria-label="Meal view"
              aria-pressed={internalView === 'meal'}
            >
              <List className="h-4 w-4" aria-hidden="true" />
              <span>Meal</span>
            </button>
          </div>

          {/* Meal type selector for meal view */}
          {internalView === 'meal' && (
            <div className="flex gap-2">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(
                type => (
                  <button
                    key={type}
                    className={viewSwitcherButtonVariants({
                      active: internalMealType === type,
                    })}
                    onClick={() => handleMealTypeChange(type)}
                    aria-label={`${type.charAt(0).toUpperCase() + type.slice(1)} view`}
                    aria-pressed={internalMealType === type}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Render appropriate view */}
        <div className="flex-1">
          {internalView === 'week' && (
            <WeekView
              data={value}
              startDate={weekStartDate}
              mode={mode}
              mealTypes={mealTypes}
              showWeekends={showWeekends}
              size={size ?? undefined}
              onMealSlotClick={onMealSlotClick}
              onAddRecipe={handleAddRecipe}
              onRemoveRecipe={handleRemoveRecipe}
              onViewRecipe={onViewRecipe}
              onPreviousWeek={handlePreviousWeek}
              onNextWeek={handleNextWeek}
            />
          )}

          {internalView === 'day' && (
            <DayView
              data={value}
              date={currentDate}
              mode={mode}
              mealTypes={mealTypes}
              size={size ?? undefined}
              onMealSlotClick={onMealSlotClick}
              onAddRecipe={handleAddRecipe}
              onRemoveRecipe={handleRemoveRecipe}
              onViewRecipe={onViewRecipe}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
            />
          )}

          {internalView === 'month' && (
            <MonthView
              data={value}
              month={monthDate}
              mode={mode}
              mealTypes={mealTypes}
              size={size ?? undefined}
              onDayClick={handleDayClick}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
          )}

          {internalView === 'meal' && (
            <MealView
              data={value}
              startDate={weekStartDate}
              mealType={internalMealType}
              days={7}
              mode={mode}
              size={size ?? undefined}
              onMealSlotClick={onMealSlotClick}
              onAddRecipe={handleAddRecipe}
              onRemoveRecipe={handleRemoveRecipe}
              onViewRecipe={onViewRecipe}
            />
          )}
        </div>
      </div>
    );
  }
);

MealPlanCalendar.displayName = 'MealPlanCalendar';
