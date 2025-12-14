'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { StarRatingDisplay } from './StarRatingDisplay';

/**
 * ReviewItem Props
 */
export interface ReviewItemProps {
  /** Review ID */
  reviewId: number;
  /** User ID of the reviewer */
  userId: string;
  /** Rating (1-5) */
  rating: number;
  /** Review comment */
  comment?: string | null;
  /** Date the review was created */
  createdAt: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ReviewItem Component
 *
 * Displays a single review with user avatar, rating, and comment.
 */
export const ReviewItem = React.forwardRef<HTMLDivElement, ReviewItemProps>(
  function ReviewItem(
    { reviewId, userId, rating, comment, createdAt, className },
    ref
  ) {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    const userInitial = userId.charAt(0).toUpperCase();

    return (
      <div
        ref={ref}
        className={cn('space-y-2 rounded-lg border p-4', className)}
        data-testid="review-item"
        data-review-id={reviewId}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="bg-muted flex h-8 w-8 items-center justify-center rounded-full"
              data-testid="user-avatar"
            >
              <span className="text-sm font-medium">{userInitial}</span>
            </div>
            <span className="font-medium" data-testid="user-name">
              User
            </span>
          </div>
          <span
            className="text-muted-foreground text-sm"
            data-testid="review-date"
          >
            {formattedDate}
          </span>
        </div>

        <StarRatingDisplay
          rating={rating}
          size="md"
          data-testid="rating-stars"
        />

        {comment && (
          <p className="text-sm" data-testid="review-comment">
            {comment}
          </p>
        )}
      </div>
    );
  }
);

ReviewItem.displayName = 'ReviewItem';
