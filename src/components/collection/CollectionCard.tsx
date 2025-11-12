'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { CollectionQuickActions } from './CollectionQuickActions';
import { CollectionMenu } from './CollectionMenu';
import {
  getVisibilityLabel,
  getVisibilityIcon,
} from '@/types/ui/collection-card';
import {
  collectionCardVariants,
  collectionMosaicContainerVariants,
  collectionMosaicGridVariants,
  collectionMosaicImageVariants,
  collectionContentVariants,
  collectionTitleVariants,
  collectionDescriptionVariants,
  collectionFooterVariants,
  collectionStatsTextVariants,
  collectionSkeletonVariants,
} from '@/lib/ui/collection-card-variants';
import { cn } from '@/lib/utils';
import type { CollectionCardProps } from '@/types/ui/collection-card';

/**
 * CollectionCard - A card component for displaying recipe collections with mosaic image grid
 *
 * Features:
 * - 2x2 mosaic image grid showing collection recipes
 * - Quick actions on hover (Favorite, Share, Add Recipes, Quick View)
 * - Three-dot menu with owner/collaborator/public action sets
 * - Multiple variants (default, elevated, outlined, ghost, interactive)
 * - Multiple sizes (sm, default, lg)
 * - Fully accessible with ARIA labels and keyboard navigation
 */
export const CollectionCard = React.forwardRef<
  HTMLDivElement,
  CollectionCardProps
>(
  (
    {
      collection,
      variant = 'default',
      size = 'default',
      isOwner = false,
      isCollaborator = false,
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
      const images = collection.recipeImages ?? [];
      // Take first 4 images
      const selectedImages = images.slice(0, 4);
      // Fill with placeholders if less than 4
      while (selectedImages.length < 4) {
        selectedImages.push('/images/placeholder-recipe.jpg');
      }
      return selectedImages;
    }, [collection.recipeImages]);

    // Visibility info
    const visibilityLabel = getVisibilityLabel(collection.visibility);

    // Handle card click
    const handleCardClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent click if clicking on menu or quick actions
        const target = event.target as HTMLElement;
        if (
          target.closest('[data-collection-menu]') ||
          target.closest('[data-quick-actions]')
        ) {
          return;
        }
        onClick?.(collection.collectionId);
      },
      [onClick, collection.collectionId]
    );

    // Combine handlers if provided
    const hasQuickActions = !!quickActionHandlers;
    const hasMenu = !!menuActionHandlers;

    return (
      <Card
        ref={ref}
        className={cn(collectionCardVariants({ variant, size }), className)}
        onClick={handleCardClick}
        role="article"
        aria-label={`Collection: ${collection.name}`}
        {...props}
      >
        {/* Mosaic Image Container */}
        <div className={collectionMosaicContainerVariants({ size })}>
          {/* 2x2 Grid */}
          <div className={collectionMosaicGridVariants()}>
            {displayImages.map((imageSrc, index) => (
              <div
                key={index}
                className="relative h-full w-full overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt={`Recipe ${index + 1} from ${collection.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={collectionMosaicImageVariants()}
                />
              </div>
            ))}
          </div>

          {/* Quick Actions Overlay (shown on hover) */}
          {hasQuickActions && (
            <CollectionQuickActions
              collectionId={collection.collectionId}
              isOwner={isOwner}
              isCollaborator={isCollaborator}
              handlers={quickActionHandlers}
            />
          )}
        </div>

        {/* Card Content */}
        <div className={collectionContentVariants({ size })}>
          {/* Header: Name and Menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={collectionTitleVariants({ size })}>
              {collection.name}
            </h3>
            {hasMenu && (
              <div data-collection-menu>
                <CollectionMenu
                  collectionId={collection.collectionId}
                  isOwner={isOwner}
                  isCollaborator={isCollaborator}
                  handlers={menuActionHandlers}
                />
              </div>
            )}
          </div>

          {/* Description */}
          {collection.description && (
            <p className={collectionDescriptionVariants({ size })}>
              {collection.description}
            </p>
          )}

          {/* Footer: Stats and Visibility */}
          <div className={collectionFooterVariants({ size })}>
            <div className={collectionStatsTextVariants({ size })}>
              <span>{collection.recipeCount} recipes</span>
              {collection.collaboratorCount > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span>{collection.collaboratorCount} collaborators</span>
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              {React.createElement(getVisibilityIcon(collection.visibility), {
                className: 'h-3 w-3',
                'aria-hidden': 'true',
              })}
              <span className="sr-only">Visibility:</span>
              <span>{visibilityLabel}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

CollectionCard.displayName = 'CollectionCard';

/**
 * CollectionCardSkeleton - Loading skeleton for CollectionCard
 */
export const CollectionCardSkeleton = React.forwardRef<
  HTMLDivElement,
  { size?: 'sm' | 'default' | 'lg'; className?: string }
>(({ size = 'default', className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(collectionCardVariants({ size }), className)}
      role="status"
      aria-label="Loading collection card"
    >
      {/* Mosaic skeleton */}
      <div className={collectionMosaicContainerVariants({ size })}>
        <div className={collectionMosaicGridVariants()}>
          {[0, 1, 2, 3].map(index => (
            <div key={index} className="relative h-full w-full">
              <div
                className={cn(
                  collectionSkeletonVariants({ element: 'mosaic', size })
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className={collectionContentVariants({ size })}>
        <div className="space-y-2">
          {/* Title skeleton */}
          <div
            className={collectionSkeletonVariants({ element: 'title', size })}
          />
          {/* Description skeleton (2 lines) */}
          <div
            className={collectionSkeletonVariants({
              element: 'description',
              size,
            })}
          />
          <div
            className={cn(
              collectionSkeletonVariants({ element: 'description', size }),
              'w-2/3'
            )}
          />
        </div>
        {/* Footer skeleton */}
        <div className={collectionFooterVariants({ size })}>
          <div
            className={collectionSkeletonVariants({ element: 'stats', size })}
          />
          <div
            className={collectionSkeletonVariants({ element: 'badge', size })}
          />
        </div>
      </div>
    </div>
  );
});

CollectionCardSkeleton.displayName = 'CollectionCardSkeleton';
