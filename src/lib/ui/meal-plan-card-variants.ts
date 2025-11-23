import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Meal plan card container variants
 */
export const mealPlanCardVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'flex-col',
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'bg-background',
  ],
  {
    variants: {
      variant: {
        default: ['border', 'border-border', 'shadow-sm', 'hover:shadow-md'],
        elevated: ['shadow-md', 'hover:shadow-lg', 'border-none'],
        outlined: [
          'border-2',
          'border-border',
          'shadow-none',
          'hover:border-primary',
        ],
        ghost: ['border-none', 'shadow-none', 'hover:bg-accent'],
        interactive: [
          'border',
          'border-border',
          'shadow-sm',
          'hover:shadow-md',
          'hover:border-primary',
          'cursor-pointer',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
        ],
      },
      size: {
        sm: 'min-h-[280px] rounded-md',
        default: 'min-h-[320px] rounded-lg',
        lg: 'min-h-[380px] rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Meal plan mosaic container variants (2x2 grid for recipe images)
 */
export const mealPlanMosaicContainerVariants = cva(
  ['relative', 'w-full', 'overflow-hidden', 'bg-muted'],
  {
    variants: {
      size: {
        sm: 'h-[140px]',
        default: 'h-[180px]',
        lg: 'h-[220px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal plan mosaic grid variants (2x2 layout)
 */
export const mealPlanMosaicGridVariants = cva([
  'grid',
  'grid-cols-2',
  'grid-rows-2',
  'h-full',
  'w-full',
  'gap-0.5',
]);

/**
 * Meal plan mosaic image variants (individual images in grid)
 */
export const mealPlanMosaicImageVariants = cva([
  'w-full',
  'h-full',
  'object-cover',
  'transition-transform',
  'duration-200',
  'group-hover:scale-105',
]);

/**
 * Meal plan mosaic placeholder variants (when no images available)
 */
export const mealPlanMosaicPlaceholderVariants = cva([
  'flex',
  'items-center',
  'justify-center',
  'h-full',
  'w-full',
  'bg-muted',
  'text-muted-foreground',
]);

/**
 * Meal plan card content variants
 */
export const mealPlanContentVariants = cva(
  ['flex', 'flex-col', 'flex-1', 'gap-2'],
  {
    variants: {
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal plan title variants
 */
export const mealPlanTitleVariants = cva(
  [
    'font-semibold',
    'text-foreground',
    'line-clamp-2',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
      interactive: {
        true: 'group-hover:text-primary',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      interactive: false,
    },
  }
);

/**
 * Meal plan description variants
 */
export const mealPlanDescriptionVariants = cva(
  ['text-muted-foreground', 'line-clamp-2'],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal plan metadata container variants (badges and info)
 */
export const mealPlanMetadataContainerVariants = cva([
  'flex',
  'flex-wrap',
  'items-center',
  'gap-2',
]);

/**
 * Meal plan footer variants
 */
export const mealPlanFooterVariants = cva(
  [
    'flex',
    'items-center',
    'justify-between',
    'border-t',
    'border-border',
    'bg-muted/30',
  ],
  {
    variants: {
      size: {
        sm: 'p-2 gap-2',
        default: 'p-3 gap-3',
        lg: 'p-4 gap-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal plan stats text variants
 */
export const mealPlanStatsTextVariants = cva(
  ['text-muted-foreground', 'font-medium'],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal plan status badge variants (current/completed/upcoming overlay)
 */
export const mealPlanStatusBadgeVariants = cva([
  'absolute',
  'top-2',
  'left-2',
  'z-10',
  'flex',
  'items-center',
  'gap-1',
  'rounded-full',
  'backdrop-blur-sm',
  'px-2.5',
  'py-1',
  'text-xs',
  'font-medium',
  'shadow-sm',
]);

/**
 * Meal plan favorite badge variants (overlay badge when favorited)
 */
export const mealPlanFavoriteBadgeVariants = cva([
  'absolute',
  'top-2',
  'right-2',
  'z-10',
  'flex',
  'items-center',
  'gap-1',
  'rounded-full',
  'bg-background/90',
  'backdrop-blur-sm',
  'px-2',
  'py-1',
  'text-xs',
  'font-medium',
  'text-foreground',
  'shadow-sm',
]);

/**
 * Meal plan skeleton variants (loading state)
 */
export const mealPlanSkeletonVariants = cva(
  ['animate-pulse', 'bg-muted', 'rounded'],
  {
    variants: {
      element: {
        mosaic: 'w-full',
        title: 'h-5 w-3/4',
        description: 'h-4 w-full',
        badge: 'h-5 w-20 rounded-full',
        stats: 'h-4 w-24',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    compoundVariants: [
      {
        element: 'mosaic',
        size: 'sm',
        className: 'h-[140px]',
      },
      {
        element: 'mosaic',
        size: 'default',
        className: 'h-[180px]',
      },
      {
        element: 'mosaic',
        size: 'lg',
        className: 'h-[220px]',
      },
    ],
    defaultVariants: {
      element: 'title',
      size: 'default',
    },
  }
);

/**
 * Export variant types
 */
export type MealPlanCardVariantsProps = VariantProps<
  typeof mealPlanCardVariants
>;
export type MealPlanMosaicContainerVariantsProps = VariantProps<
  typeof mealPlanMosaicContainerVariants
>;
export type MealPlanMosaicImageVariantsProps = VariantProps<
  typeof mealPlanMosaicImageVariants
>;
export type MealPlanContentVariantsProps = VariantProps<
  typeof mealPlanContentVariants
>;
export type MealPlanTitleVariantsProps = VariantProps<
  typeof mealPlanTitleVariants
>;
export type MealPlanDescriptionVariantsProps = VariantProps<
  typeof mealPlanDescriptionVariants
>;
export type MealPlanFooterVariantsProps = VariantProps<
  typeof mealPlanFooterVariants
>;
export type MealPlanStatsTextVariantsProps = VariantProps<
  typeof mealPlanStatsTextVariants
>;
export type MealPlanSkeletonVariantsProps = VariantProps<
  typeof mealPlanSkeletonVariants
>;
