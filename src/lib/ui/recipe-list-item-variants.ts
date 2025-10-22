import { cva } from 'class-variance-authority';

/**
 * Recipe list item variants
 *
 * RecipeListItem is a specialized list item component for displaying recipe information
 * in a compact, horizontal layout optimized for scanning and quick browsing.
 *
 * Key differences from RecipeCard:
 * - Horizontal layout (flex-row) instead of vertical (flex-col)
 * - Smaller thumbnail image instead of full hero image
 * - Inline metadata badges instead of stacked
 * - Compact spacing for list density
 */
export const recipeListItemVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'items-center',
    'gap-4',
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'hover:bg-accent/50',
  ],
  {
    variants: {
      variant: {
        default: ['bg-background'],
        compact: ['gap-3', 'bg-background'],
        detailed: ['gap-5', 'bg-background'],
      },
      size: {
        sm: 'p-2 min-h-[72px]',
        default: 'p-3 min-h-[96px]',
        lg: 'p-4 min-h-[120px]',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-sm',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
);

/**
 * Recipe image thumbnail container variants
 * Smaller square/rounded thumbnail for list view
 */
export const recipeListItemImageContainerVariants = cva(
  [
    'relative',
    'shrink-0',
    'bg-muted',
    'rounded-md',
    'overflow-hidden',
    'transition-transform',
    'duration-300',
  ],
  {
    variants: {
      size: {
        sm: 'w-16 h-16',
        default: 'w-20 h-20',
        lg: 'w-24 h-24',
      },
      interactive: {
        true: 'group-hover:scale-105',
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
 * Recipe image thumbnail variants
 */
export const recipeListItemImageVariants = cva([
  'w-full',
  'h-full',
  'object-cover',
  'transition-opacity',
  'duration-300',
]);

/**
 * Recipe content area variants (title, description, metadata)
 * Takes up flexible space in the horizontal layout
 */
export const recipeListItemContentVariants = cva(
  ['flex', 'flex-1', 'flex-col', 'justify-center', 'min-w-0'], // min-w-0 for text truncation
  {
    variants: {
      variant: {
        default: 'gap-1',
        compact: 'gap-0.5',
        detailed: 'gap-2',
      },
      size: {
        sm: 'space-y-0.5',
        default: 'space-y-1',
        lg: 'space-y-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Recipe title variants for list view
 * Limited to single line for compactness
 */
export const recipeListItemTitleVariants = cva(
  [
    'font-semibold',
    'leading-tight',
    'tracking-tight',
    'text-foreground',
    'line-clamp-1', // Single line for list view
    'transition-colors',
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
 * Recipe description variants for list view
 * Optional, hidden in compact variant
 */
export const recipeListItemDescriptionVariants = cva(
  ['text-muted-foreground', 'line-clamp-1', 'transition-colors'],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-sm',
      },
      variant: {
        default: 'block',
        compact: 'hidden',
        detailed: 'block line-clamp-2',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Recipe metadata container variants
 * Inline badges in horizontal layout
 */
export const recipeListItemMetadataContainerVariants = cva(
  ['flex', 'flex-wrap', 'items-center'],
  {
    variants: {
      size: {
        sm: 'gap-1.5',
        default: 'gap-2',
        lg: 'gap-2.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe metadata item variants (time, servings icons)
 */
export const recipeListItemMetadataItemVariants = cva(
  ['flex', 'items-center', 'text-muted-foreground'],
  {
    variants: {
      size: {
        sm: 'gap-1 text-xs',
        default: 'gap-1 text-sm',
        lg: 'gap-1.5 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe metadata section (right side)
 * Contains author and rating information
 */
export const recipeListItemMetadataSection = cva(
  ['flex', 'shrink-0', 'items-center', 'justify-end'],
  {
    variants: {
      size: {
        sm: 'gap-2 min-w-[120px]',
        default: 'gap-3 min-w-[160px]',
        lg: 'gap-4 min-w-[200px]',
      },
      variant: {
        default: 'flex-row',
        compact: 'flex-col items-end gap-1',
        detailed: 'flex-row',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Recipe author container variants for list view
 */
export const recipeListItemAuthorContainerVariants = cva(
  ['flex', 'items-center', 'gap-2', 'shrink-0'],
  {
    variants: {
      size: {
        sm: 'min-w-[80px]',
        default: 'min-w-[100px]',
        lg: 'min-w-[120px]',
      },
      variant: {
        default: 'flex',
        compact: 'hidden md:flex',
        detailed: 'flex',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Recipe rating container variants for list view
 */
export const recipeListItemRatingContainerVariants = cva(
  ['flex', 'items-center', 'gap-1', 'shrink-0'],
  {
    variants: {
      size: {
        sm: 'min-w-[60px]',
        default: 'min-w-[80px]',
        lg: 'min-w-[100px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Favorite badge variants for list view
 * Displayed on image thumbnail
 */
export const recipeListItemFavoriteBadgeVariants = cva(
  [
    'absolute',
    'top-1',
    'right-1',
    'flex',
    'items-center',
    'gap-1',
    'rounded-full',
    'bg-destructive',
    'text-destructive-foreground',
    'shadow-sm',
    'z-10',
  ],
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        default: 'px-2 py-0.5 text-xs',
        lg: 'px-2 py-1 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Skeleton loading state variants for list view
 */
export const recipeListItemSkeletonVariants = cva(
  ['animate-pulse', 'bg-muted'],
  {
    variants: {
      type: {
        image: 'rounded-md',
        title: 'h-4 rounded',
        description: 'h-3 rounded',
        metadata: 'h-3 w-16 rounded',
        author: 'h-8 w-24 rounded-full',
        rating: 'h-4 w-16 rounded',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    compoundVariants: [
      // Image skeletons
      { type: 'image', size: 'sm', className: 'w-16 h-16' },
      { type: 'image', size: 'default', className: 'w-20 h-20' },
      { type: 'image', size: 'lg', className: 'w-24 h-24' },
      // Title skeletons
      { type: 'title', size: 'sm', className: 'w-32' },
      { type: 'title', size: 'default', className: 'w-48' },
      { type: 'title', size: 'lg', className: 'w-56' },
      // Description skeletons
      { type: 'description', size: 'sm', className: 'w-24' },
      { type: 'description', size: 'default', className: 'w-40' },
      { type: 'description', size: 'lg', className: 'w-48' },
    ],
    defaultVariants: {
      type: 'title',
      size: 'default',
    },
  }
);
