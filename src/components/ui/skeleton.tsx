import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  skeletonVariants,
  skeletonContainerVariants,
  skeletonTextVariants,
  skeletonAvatarVariants,
} from '@/lib/ui/skeleton-variants';

/**
 * Skeleton component props interface
 */
export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  count?: number;
  circle?: boolean;
  'aria-label'?: string;
}

/**
 * Main Skeleton Component
 *
 * A flexible loading placeholder component that adapts to different content types.
 * Provides smooth animations and accessibility features for loading states.
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton />
 *
 * // Custom dimensions
 * <Skeleton width={200} height={20} />
 *
 * // Multiple lines
 * <Skeleton count={3} />
 *
 * // Circular avatar
 * <Skeleton variant="circular" size="lg" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      animation = 'pulse',
      rounded = 'default',
      intensity = 'default',
      width,
      height,
      count = 1,
      circle = false,
      style,
      'aria-label': ariaLabel = 'Loading...',
      ...props
    },
    ref
  ) => {
    const finalVariant = circle ? 'circular' : variant;
    const baseStyles = skeletonVariants({
      variant: finalVariant,
      size,
      animation,
      rounded: circle ? 'full' : rounded,
      intensity,
    });

    const customStyle: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
    };

    if (count > 1) {
      return (
        <div className="space-y-2" role="status" aria-label={ariaLabel}>
          <span className="sr-only">{ariaLabel}</span>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              ref={index === 0 ? ref : undefined}
              className={cn(
                baseStyles,
                index === count - 1 && '[width:80%]',
                className
              )}
              style={customStyle}
              aria-hidden="true"
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn(baseStyles, className)}
        style={customStyle}
        {...props}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);
Skeleton.displayName = 'Skeleton';

/**
 * Container component props
 */
export interface SkeletonContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonContainerVariants> {}

/**
 * Skeleton Container Component
 *
 * Groups multiple skeleton elements with consistent spacing.
 *
 * @example
 * ```tsx
 * <SkeletonContainer>
 *   <Skeleton variant="text" />
 *   <Skeleton variant="text" />
 * </SkeletonContainer>
 * ```
 */
const SkeletonContainer = React.forwardRef<
  HTMLDivElement,
  SkeletonContainerProps
>(
  (
    {
      className,
      spacing = 'default',
      direction = 'vertical',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          skeletonContainerVariants({ spacing, direction }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SkeletonContainer.displayName = 'SkeletonContainer';

/**
 * Text skeleton props
 */
export interface SkeletonTextProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonTextVariants> {
  lineCount?: number;
  animation?: VariantProps<typeof skeletonVariants>['animation'];
}

/**
 * Skeleton Text Component
 *
 * Creates multiple lines of text skeletons with varied widths.
 *
 * @example
 * ```tsx
 * <SkeletonText lines="paragraph" />
 * ```
 */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    { className, lines = 'three', lineCount, animation = 'pulse', ...props },
    ref
  ) => {
    const count =
      lineCount ??
      (lines === 'single'
        ? 1
        : lines === 'two'
          ? 2
          : lines === 'paragraph'
            ? 5
            : 3);
    const widths = ['100%', '100%', '80%', '95%', '60%'];
    const getWidth = (index: number): string => {
      if (index < widths.length) {
        // eslint-disable-next-line security/detect-object-injection
        return widths[index] as string;
      }
      return '100%';
    };

    return (
      <div
        ref={ref}
        className={cn(skeletonTextVariants({ lines }), className)}
        {...props}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            animation={animation}
            className={`[width:${getWidth(index)}]`}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = 'SkeletonText';

/**
 * Avatar skeleton props
 */
export interface SkeletonAvatarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonAvatarVariants> {
  animation?: VariantProps<typeof skeletonVariants>['animation'];
}

/**
 * Skeleton Avatar Component
 *
 * Circular skeleton for profile images and avatars.
 *
 * @example
 * ```tsx
 * <SkeletonAvatar size="lg" />
 * ```
 */
const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = 'default', animation = 'pulse', ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        variant="circular"
        animation={animation}
        className={cn(skeletonAvatarVariants({ size }), className)}
        aria-label="Loading avatar..."
        {...props}
      />
    );
  }
);
SkeletonAvatar.displayName = 'SkeletonAvatar';

/**
 * Button skeleton component
 */
const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    animation?: VariantProps<typeof skeletonVariants>['animation'];
  }
>(({ className, size = 'default', animation = 'pulse', ...props }, ref) => {
  return (
    <Skeleton
      ref={ref}
      variant="button"
      size={size}
      animation={animation}
      className={className}
      {...props}
    />
  );
});
SkeletonButton.displayName = 'SkeletonButton';

/**
 * Recipe Card Skeleton Component
 *
 * Pre-built skeleton for recipe cards.
 */
const RecipeCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('bg-card space-y-3 rounded-lg border p-4', className)}
      {...props}
    >
      {/* Image placeholder */}
      <Skeleton variant="image" className="h-48 w-full rounded-md" />

      {/* Title */}
      <Skeleton variant="text" size="lg" />

      {/* Description */}
      <SkeletonText lines="two" />

      {/* Meta info */}
      <div className="flex items-center gap-4">
        <Skeleton width={60} height={20} />
        <Skeleton width={80} height={20} />
        <Skeleton width={50} height={20} />
      </div>
    </div>
  );
});
RecipeCardSkeleton.displayName = 'RecipeCardSkeleton';

/**
 * Recipe List Skeleton Component
 *
 * Pre-built skeleton for recipe lists.
 */
const RecipeListSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { count?: number }
>(({ className, count = 3, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 rounded-lg border p-4">
          {/* Thumbnail */}
          <Skeleton
            variant="image"
            className="h-24 w-24 flex-shrink-0 rounded-md"
          />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" size="lg" width="60%" />
            <SkeletonText lines="two" />
            <div className="flex gap-2">
              <Skeleton width={60} height={20} />
              <Skeleton width={80} height={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
RecipeListSkeleton.displayName = 'RecipeListSkeleton';

/**
 * Recipe Detail Skeleton Component
 *
 * Full-page skeleton for recipe details.
 */
const RecipeDetailSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-6', className)} {...props}>
      {/* Hero image */}
      <Skeleton variant="image" className="h-64 w-full rounded-lg md:h-96" />

      {/* Title and meta */}
      <div className="space-y-4">
        <Skeleton variant="text" size="lg" className="h-8" width="70%" />
        <div className="flex gap-4">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
      </div>

      {/* Description */}
      <SkeletonText lines="paragraph" />

      {/* Ingredients */}
      <div className="space-y-3">
        <Skeleton variant="text" size="lg" width={120} />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="circular" className="h-6 w-6 rounded-full" />
              <Skeleton variant="text" width={`${80 - i * 5}%`} />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <Skeleton variant="text" size="lg" width={120} />
        <SkeletonText lines="paragraph" />
      </div>
    </div>
  );
});
RecipeDetailSkeleton.displayName = 'RecipeDetailSkeleton';

/**
 * Profile Skeleton Component
 */
const ProfileSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3', className)}
      {...props}
    >
      <SkeletonAvatar size="lg" />
      <div className="space-y-2">
        <Skeleton variant="text" width={120} />
        <Skeleton variant="text" size="sm" width={180} />
      </div>
    </div>
  );
});
ProfileSkeleton.displayName = 'ProfileSkeleton';

export {
  Skeleton,
  SkeletonContainer,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  RecipeCardSkeleton,
  RecipeListSkeleton,
  RecipeDetailSkeleton,
  ProfileSkeleton,
};
