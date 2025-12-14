'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
} from '@/components/ui/skeleton';

/**
 * RecipeViewSkeleton Props
 */
export interface RecipeViewSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * RecipeViewSkeleton Component
 *
 * Loading skeleton for the recipe view page that matches the full page layout:
 * - Breadcrumb navigation
 * - Recipe header with hero image, title, metadata, and actions
 * - Two-column layout for ingredients (1/3) and instructions (2/3)
 * - Tags section
 * - Reviews section
 */
const RecipeViewSkeleton = React.forwardRef<
  HTMLDivElement,
  RecipeViewSkeletonProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="status"
      aria-label="Loading recipe"
      className={cn('space-y-6', className)}
      {...props}
    >
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton width={40} height={16} />
        <Skeleton width={8} height={16} />
        <Skeleton width={60} height={16} />
        <Skeleton width={8} height={16} />
        <Skeleton width={120} height={16} />
      </div>

      {/* Recipe Header skeleton */}
      <div className="space-y-4">
        {/* Hero image */}
        <Skeleton
          variant="image"
          className="h-64 w-full rounded-lg md:h-80 lg:h-96"
        />

        {/* Title and rating row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <Skeleton variant="text" className="h-8 w-3/4" />
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} width={16} height={16} />
                ))}
              </div>
              <Skeleton width={60} height={16} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton width={40} height={40} rounded="full" />
            <Skeleton width={40} height={40} rounded="full" />
            <Skeleton width={40} height={40} rounded="full" />
          </div>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton width={80} height={28} rounded="full" />
          <Skeleton width={90} height={28} rounded="full" />
          <Skeleton width={70} height={28} rounded="full" />
          <Skeleton width={85} height={28} rounded="full" />
        </div>

        {/* Description */}
        <SkeletonText lines="two" />

        {/* Author */}
        <div className="flex items-center gap-2">
          <SkeletonAvatar size="sm" />
          <Skeleton width={100} height={16} />
        </div>
      </div>

      {/* Two-column layout: Ingredients & Instructions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ingredients Section (1/3 width on lg) */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="h-6 w-28" />
          </div>

          {/* Servings scaler */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Skeleton width={24} height={24} />
            <Skeleton width={80} height={16} />
            <div className="ml-auto flex items-center gap-2">
              <Skeleton width={32} height={32} rounded="default" />
              <Skeleton width={48} height={32} />
              <Skeleton width={32} height={32} rounded="default" />
            </div>
          </div>

          {/* Ingredient items */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton width={20} height={20} />
                <Skeleton className="flex-1" height={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section (2/3 width on lg) */}
        <div className="space-y-4 lg:col-span-2">
          <Skeleton variant="text" className="h-6 w-28" />

          {/* Instruction steps */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-4 rounded-lg border p-4">
                <Skeleton
                  width={32}
                  height={32}
                  rounded="full"
                  className="flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <SkeletonText lines="two" />
                  {/* Timer indicator on some steps */}
                  {index % 2 === 0 && (
                    <Skeleton width={80} height={20} rounded="full" />
                  )}
                </div>
                <Skeleton width={20} height={20} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <Skeleton variant="text" className="h-6 w-16" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              width={60 + index * 15}
              height={28}
              rounded="full"
            />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-6 w-24" />
          <Skeleton width={120} height={36} rounded="default" />
        </div>

        {/* Average rating display */}
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="text-center">
            <Skeleton width={48} height={40} />
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width={16} height={16} />
              ))}
            </div>
          </div>
          <Skeleton width={80} height={16} />
        </div>

        {/* Review items */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SkeletonAvatar size="sm" />
                  <Skeleton width={100} height={16} />
                </div>
                <Skeleton width={80} height={14} />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} width={14} height={14} />
                ))}
              </div>
              <SkeletonText lines="two" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading recipe details...</span>
    </div>
  );
});

RecipeViewSkeleton.displayName = 'RecipeViewSkeleton';

export { RecipeViewSkeleton };
