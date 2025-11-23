/**
 * MealPlanCalendarEmpty Component
 *
 * Empty state component for the MealPlanCalendar.
 * Displays helpful messaging when no meal plan data exists.
 *
 * @module components/meal-plan/MealPlanCalendarEmpty
 */

'use client';

import * as React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface MealPlanCalendarEmptyProps {
  /** Called when create plan button is clicked */
  onCreatePlan?: () => void;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Custom className */
  className?: string;
}

/**
 * MealPlanCalendarEmpty component
 */
export const MealPlanCalendarEmpty: React.FC<MealPlanCalendarEmptyProps> = ({
  onCreatePlan,
  title = 'No meal plan yet',
  description = 'Start planning your meals for the week by creating your first meal plan.',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-muted/50 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center',
        className
      )}
    >
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <CalendarDays className="text-muted-foreground h-8 w-8" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md text-sm">{description}</p>
      </div>

      {onCreatePlan && (
        <Button onClick={onCreatePlan} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Create Meal Plan
        </Button>
      )}
    </div>
  );
};

MealPlanCalendarEmpty.displayName = 'MealPlanCalendarEmpty';
