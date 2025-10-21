import { cva } from 'class-variance-authority';

/**
 * Recipe card variants extending base card styles
 *
 * RecipeCard is a specialized card component for displaying recipe information
 * with image, metadata, author, and interactive actions.
 */
export const recipeCardVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'flex-col',
    'overflow-hidden',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: [],
        elevated: [],
        outlined: [],
        ghost: [],
        interactive: [],
      },
      size: {
        sm: 'min-h-[280px]',
        default: 'min-h-[320px]',
        lg: 'min-h-[380px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Recipe image container variants
 * Maintains 16:9 aspect ratio for consistent image display
 */
export const recipeImageContainerVariants = cva(
  [
    'relative',
    'w-full',
    'bg-muted',
    'overflow-hidden',
    'transition-transform',
    'duration-300',
  ],
  {
    variants: {
      size: {
        sm: 'h-32',
        default: 'h-40',
        lg: 'h-48',
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
 * Recipe image variants
 */
export const recipeImageVariants = cva([
  'w-full',
  'h-full',
  'object-cover',
  'transition-opacity',
  'duration-300',
]);

/**
 * Recipe image overlay variants
 * Gradient overlay for better text readability on images
 */
export const recipeImageOverlayVariants = cva([
  'absolute',
  'inset-0',
  'bg-gradient-to-t',
  'from-black/60',
  'via-black/20',
  'to-transparent',
  'opacity-0',
  'group-hover:opacity-100',
  'transition-opacity',
  'duration-300',
  'pointer-events-none',
]);

/**
 * Recipe content area variants
 */
export const recipeContentVariants = cva(['flex', 'flex-1', 'flex-col'], {
  variants: {
    size: {
      sm: 'p-3 space-y-2',
      default: 'p-4 space-y-3',
      lg: 'p-5 space-y-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Recipe title variants
 */
export const recipeTitleVariants = cva(
  [
    'font-semibold',
    'leading-tight',
    'tracking-tight',
    'text-foreground',
    'line-clamp-2',
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
 * Recipe description variants
 */
export const recipeDescriptionVariants = cva(
  [
    'text-muted-foreground',
    'line-clamp-2',
    'leading-relaxed',
    'transition-colors',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe metadata container variants
 */
export const recipeMetadataContainerVariants = cva(
  ['flex', 'flex-wrap', 'items-center', 'gap-2'],
  {
    variants: {
      size: {
        sm: 'mt-1',
        default: 'mt-2',
        lg: 'mt-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe metadata item variants (for individual time/difficulty/servings badges)
 */
export const recipeMetadataItemVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1',
    'text-muted-foreground',
    'transition-colors',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-xs',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe footer variants
 */
export const recipeFooterVariants = cva(
  ['flex', 'items-center', 'justify-between', 'border-t', 'border-border/50'],
  {
    variants: {
      size: {
        sm: 'px-3 py-2 gap-2',
        default: 'px-4 py-3 gap-3',
        lg: 'px-5 py-4 gap-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe rating container variants
 */
export const recipeRatingContainerVariants = cva(
  ['flex', 'items-center', 'gap-1.5'],
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe author container variants
 */
export const recipeAuthorContainerVariants = cva(
  ['flex', 'items-center', 'gap-2', 'overflow-hidden'],
  {
    variants: {
      size: {
        sm: 'min-w-0',
        default: 'min-w-0',
        lg: 'min-w-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe menu button variants (three-dot menu)
 */
export const recipeMenuButtonVariants = cva(
  [
    'absolute',
    'top-2',
    'right-2',
    'z-10',
    'opacity-0',
    'group-hover:opacity-100',
    'group-focus-within:opacity-100',
    'transition-opacity',
    'duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'p-1',
        default: 'p-1.5',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe loading skeleton variants
 */
export const recipeSkeletonVariants = cva(['animate-pulse', 'bg-muted'], {
  variants: {
    type: {
      image: 'w-full rounded-t-lg',
      title: 'h-5 w-3/4 rounded',
      description: 'h-4 w-full rounded',
      metadata: 'h-4 w-20 rounded',
      author: 'h-8 w-32 rounded',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  compoundVariants: [
    {
      type: 'image',
      size: 'sm',
      className: 'h-32',
    },
    {
      type: 'image',
      size: 'default',
      className: 'h-40',
    },
    {
      type: 'image',
      size: 'lg',
      className: 'h-48',
    },
  ],
  defaultVariants: {
    type: 'title',
    size: 'default',
  },
});

/**
 * Recipe favorite badge variants
 * Badge shown on image when recipe is favorited
 */
export const recipeFavoriteBadgeVariants = cva(
  [
    'absolute',
    'top-2',
    'left-2',
    'z-10',
    'flex',
    'items-center',
    'gap-1',
    'rounded-full',
    'bg-red-500',
    'text-white',
    'shadow-md',
    'transition-transform',
    'hover:scale-110',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe quick actions container positioning
 */
export const recipeQuickActionsContainerVariants = cva(
  [
    'absolute',
    'top-0',
    'right-0',
    'opacity-0',
    'group-hover:opacity-100',
    'group-focus-within:opacity-100',
    'transition-opacity',
    'duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'p-2',
        default: 'p-2',
        lg: 'p-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);
