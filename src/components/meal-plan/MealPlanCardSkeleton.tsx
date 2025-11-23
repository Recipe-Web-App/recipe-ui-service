'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  mealPlanCardVariants,
  mealPlanMosaicContainerVariants,
  mealPlanMosaicGridVariants,
  mealPlanContentVariants,
  mealPlanFooterVariants,
  mealPlanSkeletonVariants,
} from '@/lib/ui/meal-plan-card-variants';

export interface MealPlanCardSkeletonProps {
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
  /** Custom class name */
  className?: string;
}

/**
 * MealPlanCardSkeleton - Loading skeleton for MealPlanCard
 *
 * Displays an animated loading skeleton that matches the structure of a MealPlanCard.
 * Used while meal plan data is being fetched from the API.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <MealPlanCardSkeleton size="default" />
 * ) : (
 *   <MealPlanCard mealPlan={mealPlan} />
 * )}
 * ```
 */
export const MealPlanCardSkeleton = React.forwardRef<
  HTMLDivElement,
  MealPlanCardSkeletonProps
>(({ size = 'default', className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(mealPlanCardVariants({ size }), className)}
      role="status"
      aria-label="Loading meal plan card"
    >
      {/* Mosaic skeleton - 2x2 grid of recipe images */}
      <div className={mealPlanMosaicContainerVariants({ size })}>
        <div className={mealPlanMosaicGridVariants()}>
          {[0, 1, 2, 3].map(index => (
            <div key={index} className="relative h-full w-full">
              <div
                className={cn(
                  mealPlanSkeletonVariants({ element: 'mosaic', size })
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className={mealPlanContentVariants({ size })}>
        <div className="space-y-2">
          {/* Title skeleton */}
          <div
            className={mealPlanSkeletonVariants({ element: 'title', size })}
          />

          {/* Description skeleton (2 lines) */}
          <div
            className={mealPlanSkeletonVariants({
              element: 'description',
              size,
            })}
          />
          <div
            className={cn(
              mealPlanSkeletonVariants({ element: 'description', size }),
              'w-2/3'
            )}
          />

          {/* Metadata badges skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={mealPlanSkeletonVariants({ element: 'badge', size })}
            />
            <div
              className={mealPlanSkeletonVariants({ element: 'badge', size })}
            />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className={mealPlanFooterVariants({ size })}>
        <div className={mealPlanSkeletonVariants({ element: 'stats', size })} />
        <div className={mealPlanSkeletonVariants({ element: 'badge', size })} />
      </div>
    </div>
  );
});

MealPlanCardSkeleton.displayName = 'MealPlanCardSkeleton';
