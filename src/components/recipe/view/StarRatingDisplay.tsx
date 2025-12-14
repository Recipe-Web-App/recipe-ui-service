'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StarRatingDisplay Props
 */
export interface StarRatingDisplayProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Rating value (supports decimals like 4.5) */
  rating: number;
  /** Maximum stars (default: 5) */
  maxStars?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show numeric rating alongside stars */
  showValue?: boolean;
}

/**
 * Get size classes for stars
 */
function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'h-3 w-3';
    case 'lg':
      return 'h-5 w-5';
    case 'md':
    default:
      return 'h-4 w-4';
  }
}

/**
 * StarRatingDisplay Component
 *
 * Displays a star rating with support for half-star values.
 * Uses CSS clipping to show partial star fills.
 */
export const StarRatingDisplay = React.forwardRef<
  HTMLDivElement,
  StarRatingDisplayProps
>(function StarRatingDisplay(
  { rating, maxStars = 5, size = 'md', showValue = false, className, ...props },
  ref
) {
  const starSize = getSizeClasses(size);

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${rating} out of ${maxStars} stars`}
      {...props}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starPosition = index + 1;
        const isFull = starPosition <= rating;
        const isHalf =
          !isFull && starPosition - 0.5 <= rating && starPosition > rating;

        return (
          <div key={index} className="relative" aria-hidden="true">
            {/* Background (empty) star */}
            <Star className={cn(starSize, 'text-muted-foreground fill-none')} />

            {/* Full star overlay */}
            {isFull && (
              <Star
                className={cn(
                  starSize,
                  'absolute inset-0 fill-yellow-400 text-yellow-400'
                )}
              />
            )}

            {/* Half star overlay */}
            {isHalf && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: '50%' }}
              >
                <Star
                  className={cn(starSize, 'fill-yellow-400 text-yellow-400')}
                />
              </div>
            )}
          </div>
        );
      })}
      {showValue && (
        <span className="text-muted-foreground ml-1 text-sm">
          {rating.toFixed(1)}
        </span>
      )}
      <span className="sr-only">
        {rating} out of {maxStars} stars
      </span>
    </div>
  );
});

StarRatingDisplay.displayName = 'StarRatingDisplay';
