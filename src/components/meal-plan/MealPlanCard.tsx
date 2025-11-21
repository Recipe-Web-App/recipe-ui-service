'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { MealPlanQuickActions } from './MealPlanQuickActions';
import { MealPlanMenu } from './MealPlanMenu';
import {
  getMealPlanStatus,
  getStatusLabel,
  getStatusVariant,
  formatDateRange,
  formatMealBreakdown,
  getDurationText,
  getRecipeCountText,
} from '@/types/ui/meal-plan-card';
import {
  mealPlanCardVariants,
  mealPlanMosaicContainerVariants,
  mealPlanMosaicGridVariants,
  mealPlanMosaicImageVariants,
  mealPlanContentVariants,
  mealPlanTitleVariants,
  mealPlanDescriptionVariants,
  mealPlanFooterVariants,
  mealPlanStatsTextVariants,
  mealPlanStatusBadgeVariants,
  mealPlanFavoriteBadgeVariants,
} from '@/lib/ui/meal-plan-card-variants';
import { cn } from '@/lib/utils';
import type { MealPlanCardProps } from '@/types/ui/meal-plan-card';

/**
 * MealPlanCard - A card component for displaying meal plans with recipe image mosaic
 *
 * Features:
 * - 2x2 mosaic image grid showing recipes from the meal plan
 * - Status badge (Current/Completed/Upcoming) based on date range
 * - Date range display ("Week of Jan 15")
 * - Meal type breakdown badge ("7B · 7L · 7D")
 * - Duration and recipe count indicators
 * - Creator info with avatar
 * - Quick actions on hover (Favorite, Share, Clone, Quick View, Shopping List, Calendar)
 * - Three-dot menu with owner/public action sets
 * - Multiple variants (default, elevated, outlined, ghost, interactive)
 * - Multiple sizes (sm, default, lg)
 * - Fully accessible with ARIA labels and keyboard navigation
 *
 * @example
 * ```tsx
 * <MealPlanCard
 *   mealPlan={mealPlan}
 *   isOwner={true}
 *   quickActionHandlers={{
 *     onFavorite: handleFavorite,
 *     onShare: handleShare,
 *     onClone: handleClone,
 *     onQuickView: handleQuickView,
 *     onGenerateShoppingList: handleGenerateShoppingList,
 *     onViewCalendar: handleViewCalendar,
 *   }}
 *   menuActionHandlers={{
 *     onView: handleView,
 *     onEdit: handleEdit,
 *     onDuplicate: handleDuplicate,
 *     onShare: handleShare,
 *     onGenerateShoppingList: handleGenerateShoppingList,
 *     onDelete: handleDelete,
 *   }}
 *   onClick={handleCardClick}
 * />
 * ```
 */
export const MealPlanCard = React.forwardRef<HTMLDivElement, MealPlanCardProps>(
  (
    {
      mealPlan,
      variant = 'default',
      size = 'default',
      isOwner = false,
      quickActionHandlers,
      menuActionHandlers,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    // Compute display images (up to 4 for mosaic)
    const displayImages = React.useMemo(() => {
      const images = mealPlan.recipeImages ?? [];
      // Take first 4 images
      const selectedImages = images.slice(0, 4);
      // Fill with placeholders if less than 4
      while (selectedImages.length < 4) {
        selectedImages.push('/images/placeholder-recipe.jpg');
      }
      return selectedImages;
    }, [mealPlan.recipeImages]);

    // Status info
    const status = getMealPlanStatus(mealPlan.startDate, mealPlan.endDate);
    const statusLabel = getStatusLabel(status);
    const statusVariant = getStatusVariant(status);

    // Date range
    const dateRangeText = formatDateRange(mealPlan.startDate);

    // Meal breakdown
    const mealBreakdownText = formatMealBreakdown(mealPlan.mealTypeBreakdown);

    // Duration
    const durationText = getDurationText(mealPlan.durationDays);

    // Recipe count
    const recipeCountText = getRecipeCountText(mealPlan.recipeCount);

    // Handle card click
    const handleCardClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent click if clicking on menu or quick actions
        const target = event.target as HTMLElement;
        if (
          target.closest('[data-meal-plan-menu]') ||
          target.closest('[data-quick-actions]')
        ) {
          return;
        }
        onClick?.(mealPlan.id);
      },
      [onClick, mealPlan.id]
    );

    // Combine handlers if provided
    const hasQuickActions = !!quickActionHandlers;
    const hasMenu = !!menuActionHandlers;

    // Get user initials for avatar fallback
    const getUserInitials = (name?: string): string => {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    return (
      <Card
        ref={ref}
        className={cn(mealPlanCardVariants({ variant, size }), className)}
        onClick={handleCardClick}
        role="article"
        aria-label={`Meal plan: ${mealPlan.name}`}
        {...props}
      >
        {/* Mosaic Image Container */}
        <div className={mealPlanMosaicContainerVariants({ size })}>
          {/* 2x2 Grid */}
          <div className={mealPlanMosaicGridVariants()}>
            {displayImages.map((imageSrc, index) => (
              <div
                key={index}
                className="relative h-full w-full overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt={`Recipe ${index + 1} from ${mealPlan.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={mealPlanMosaicImageVariants()}
                />
              </div>
            ))}
          </div>

          {/* Status Badge */}
          <div className={mealPlanStatusBadgeVariants()}>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>

          {/* Favorite Badge */}
          {mealPlan.isFavorited && (
            <div className={mealPlanFavoriteBadgeVariants()}>
              <Heart className="h-3 w-3 fill-current" />
            </div>
          )}

          {/* Quick Actions Overlay (shown on hover) */}
          {hasQuickActions && (
            <MealPlanQuickActions
              mealPlanId={mealPlan.id}
              handlers={quickActionHandlers}
            />
          )}
        </div>

        {/* Card Content */}
        <div className={mealPlanContentVariants({ size })}>
          {/* Header: Name and Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={mealPlanTitleVariants({ size })}>{mealPlan.name}</h3>
            {hasMenu && (
              <div data-meal-plan-menu>
                <MealPlanMenu
                  mealPlanId={mealPlan.id}
                  isOwner={isOwner}
                  handlers={menuActionHandlers}
                />
              </div>
            )}
          </div>

          {/* Description */}
          {mealPlan.description && (
            <p className={mealPlanDescriptionVariants({ size })}>
              {mealPlan.description}
            </p>
          )}

          {/* Metadata: Date Range, Duration, Meal Breakdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range */}
            <Badge variant="outline" className="gap-1">
              <CalendarIcon className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Date range:</span>
              <span>{dateRangeText}</span>
            </Badge>

            {/* Duration */}
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Duration:</span>
              <span>{durationText}</span>
            </Badge>

            {/* Meal Breakdown */}
            {mealPlan.mealTypeBreakdown && (
              <Badge variant="secondary">
                <span className="sr-only">Meal breakdown:</span>
                <span>{mealBreakdownText}</span>
              </Badge>
            )}
          </div>

          {/* Footer: Recipe Count and Creator */}
          <div className={mealPlanFooterVariants({ size })}>
            <div className={mealPlanStatsTextVariants({ size })}>
              <span>{recipeCountText}</span>
            </div>

            {/* Creator Info */}
            {mealPlan.ownerName && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={mealPlan.ownerAvatar}
                    alt={mealPlan.ownerName}
                  />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(mealPlan.ownerName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground truncate text-sm">
                  {mealPlan.ownerName}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

MealPlanCard.displayName = 'MealPlanCard';

// Re-export skeleton for convenience
export { MealPlanCardSkeleton } from './MealPlanCardSkeleton';
