import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Collection card container variants
 */
export const collectionCardVariants = cva(
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
 * Collection mosaic container variants (2x2 grid for recipe images)
 */
export const collectionMosaicContainerVariants = cva(
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
 * Collection mosaic grid variants (2x2 layout)
 */
export const collectionMosaicGridVariants = cva([
  'grid',
  'grid-cols-2',
  'grid-rows-2',
  'h-full',
  'w-full',
  'gap-0.5',
]);

/**
 * Collection mosaic image variants (individual images in grid)
 */
export const collectionMosaicImageVariants = cva([
  'w-full',
  'h-full',
  'object-cover',
  'transition-transform',
  'duration-200',
  'group-hover:scale-105',
]);

/**
 * Collection mosaic placeholder variants (when no images available)
 */
export const collectionMosaicPlaceholderVariants = cva([
  'flex',
  'items-center',
  'justify-center',
  'h-full',
  'w-full',
  'bg-muted',
  'text-muted-foreground',
]);

/**
 * Collection card content variants
 */
export const collectionContentVariants = cva(
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
 * Collection title variants
 */
export const collectionTitleVariants = cva(
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
 * Collection description variants
 */
export const collectionDescriptionVariants = cva(
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
 * Collection metadata container variants (badges)
 */
export const collectionMetadataContainerVariants = cva([
  'flex',
  'flex-wrap',
  'items-center',
  'gap-2',
]);

/**
 * Collection footer variants
 */
export const collectionFooterVariants = cva(
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
 * Collection stats text variants
 */
export const collectionStatsTextVariants = cva(
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
 * Collection favorite badge variants (overlay badge when favorited)
 */
export const collectionFavoriteBadgeVariants = cva([
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
 * Collection skeleton variants (loading state)
 */
export const collectionSkeletonVariants = cva(
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
export type CollectionCardVariantsProps = VariantProps<
  typeof collectionCardVariants
>;
export type CollectionMosaicContainerVariantsProps = VariantProps<
  typeof collectionMosaicContainerVariants
>;
export type CollectionMosaicImageVariantsProps = VariantProps<
  typeof collectionMosaicImageVariants
>;
export type CollectionContentVariantsProps = VariantProps<
  typeof collectionContentVariants
>;
export type CollectionTitleVariantsProps = VariantProps<
  typeof collectionTitleVariants
>;
export type CollectionDescriptionVariantsProps = VariantProps<
  typeof collectionDescriptionVariants
>;
export type CollectionFooterVariantsProps = VariantProps<
  typeof collectionFooterVariants
>;
export type CollectionStatsTextVariantsProps = VariantProps<
  typeof collectionStatsTextVariants
>;
export type CollectionSkeletonVariantsProps = VariantProps<
  typeof collectionSkeletonVariants
>;
