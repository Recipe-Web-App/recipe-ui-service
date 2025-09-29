import { cva } from 'class-variance-authority';

/**
 * Skeleton component variants using class-variance-authority
 *
 * Provides loading placeholders for content that's being fetched.
 * Includes multiple animation styles and shape variants for different content types.
 */

/**
 * Base skeleton variants
 */
export const skeletonVariants = cva(
  [
    // Base styles
    'relative',
    'overflow-hidden',
    'bg-muted',
    'rounded-md',
    'before:absolute',
    'before:inset-0',
    'before:-translate-x-full',
    'before:bg-gradient-to-r',
    'before:from-transparent',
    'before:via-white/20',
    'before:to-transparent',
    // Minimum dimensions for visibility
    'min-h-[1rem]',
    'min-w-[2rem]',
    // Ensure visibility
    '[&]:!opacity-100',
    '[&]:!block',
  ],
  {
    variants: {
      variant: {
        default: 'bg-muted',
        text: 'h-4 bg-muted',
        circular: 'bg-muted',
        card: 'bg-muted',
        image: 'aspect-square bg-muted',
        button: 'h-10 px-4 bg-muted',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
        full: 'w-full',
      },
      animation: {
        pulse: 'animate-skeleton-pulse',
        wave: 'animate-skeleton-wave',
        none: 'animate-none',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
      intensity: {
        light: 'opacity-50',
        default: 'opacity-100',
        strong: 'opacity-100 dark:opacity-90',
      },
    },
    compoundVariants: [
      // Size adjustments for text variant
      {
        variant: 'text',
        size: 'sm',
        className: 'h-3',
      },
      {
        variant: 'text',
        size: 'default',
        className: 'h-4',
      },
      {
        variant: 'text',
        size: 'lg',
        className: 'h-6',
      },
      // Size adjustments for circular variant
      {
        variant: 'circular',
        size: 'sm',
        className: 'h-8 w-8 rounded-full',
      },
      {
        variant: 'circular',
        size: 'default',
        className: 'h-10 w-10 rounded-full',
      },
      {
        variant: 'circular',
        size: 'lg',
        className: 'h-12 w-12 rounded-full',
      },
      // Circular always has full rounding
      {
        variant: 'circular',
        className: 'rounded-full',
      },
      // Size adjustments for button variant
      {
        variant: 'button',
        size: 'sm',
        className: 'h-8 px-3 rounded-md',
      },
      {
        variant: 'button',
        size: 'default',
        className: 'h-10 px-4 rounded-md',
      },
      {
        variant: 'button',
        size: 'lg',
        className: 'h-12 px-6 rounded-md',
      },
      // Card sizes
      {
        variant: 'card',
        size: 'sm',
        className: 'p-3 rounded-lg',
      },
      {
        variant: 'card',
        size: 'default',
        className: 'p-4 rounded-lg',
      },
      {
        variant: 'card',
        size: 'lg',
        className: 'p-6 rounded-lg',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'pulse',
      rounded: 'default',
      intensity: 'default',
    },
  }
);

/**
 * Container for grouping skeleton elements
 */
export const skeletonContainerVariants = cva('space-y-3', {
  variants: {
    spacing: {
      tight: 'space-y-1',
      default: 'space-y-3',
      loose: 'space-y-4',
    },
    direction: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row space-x-3 space-y-0',
    },
  },
  defaultVariants: {
    spacing: 'default',
    direction: 'vertical',
  },
});

/**
 * Text skeleton for multi-line content
 */
export const skeletonTextVariants = cva('space-y-2', {
  variants: {
    lines: {
      single: '',
      two: 'space-y-2',
      three: 'space-y-2',
      paragraph: 'space-y-2',
    },
  },
  defaultVariants: {
    lines: 'three',
  },
});

/**
 * Recipe-specific skeleton presets
 */
export const recipeSkeletonVariants = cva('', {
  variants: {
    type: {
      card: 'rounded-lg bg-card p-4 space-y-3',
      list: 'space-y-2',
      detail: 'space-y-4',
      ingredient: 'flex items-center space-x-2',
      nutrition: 'grid grid-cols-2 gap-2',
    },
  },
  defaultVariants: {
    type: 'card',
  },
});

/**
 * Avatar skeleton variant
 */
export const skeletonAvatarVariants = cva('rounded-full bg-muted', {
  variants: {
    size: {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Type exports for variant props
 */
export type SkeletonVariants = typeof skeletonVariants;
export type SkeletonContainerVariants = typeof skeletonContainerVariants;
export type SkeletonTextVariants = typeof skeletonTextVariants;
export type RecipeSkeletonVariants = typeof recipeSkeletonVariants;
export type SkeletonAvatarVariants = typeof skeletonAvatarVariants;
