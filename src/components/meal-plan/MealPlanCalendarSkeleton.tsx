/**
 * MealPlanCalendarSkeleton Component
 *
 * Loading skeleton for the MealPlanCalendar component.
 * Displays placeholder UI while data is loading.
 *
 * @module components/meal-plan/MealPlanCalendarSkeleton
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MealSlotSkeleton } from './MealSlot';

export interface MealPlanCalendarSkeletonProps {
  /** Component size */
  size?: 'sm' | 'default' | 'lg';
  /** Custom className */
  className?: string;
}

/**
 * MealPlanCalendarSkeleton component
 */
export const MealPlanCalendarSkeleton: React.FC<
  MealPlanCalendarSkeletonProps
> = ({ size = 'default', className }) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="bg-muted h-9 w-20 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex items-center justify-between">
        <div className="bg-muted h-6 w-48 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="bg-muted h-9 w-9 animate-pulse rounded-md" />
          <div className="bg-muted h-9 w-9 animate-pulse rounded-md" />
        </div>
      </div>

      {/* Grid skeleton (week view style) */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-2">
            {/* Day header */}
            <div className="bg-muted h-16 animate-pulse rounded border p-2" />

            {/* Meal slots */}
            {Array.from({ length: 4 }).map((_, slotIndex) => (
              <MealSlotSkeleton key={slotIndex} size={size} showMealType />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

MealPlanCalendarSkeleton.displayName = 'MealPlanCalendarSkeleton';
