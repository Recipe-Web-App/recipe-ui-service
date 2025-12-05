import { cva } from 'class-variance-authority';

/**
 * Web recipe card variants
 *
 * WebRecipeCard is a specialized card for displaying external recipes
 * with recipe name, source domain, and external link actions.
 * Uses dashed border to visually distinguish from internal recipe cards.
 */
export const webRecipeCardVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'flex-col',
    'transition-all',
    'duration-200',
    'border-dashed', // Visually distinguish external recipes
  ],
  {
    variants: {
      variant: {
        default: ['border-border', 'bg-card'],
        outlined: ['border-2', 'border-muted-foreground/30', 'bg-card'],
      },
      size: {
        sm: 'min-h-[140px]',
        default: 'min-h-[160px]',
        lg: 'min-h-[180px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Web recipe card header variants
 * Contains the title and external link icon
 */
export const webRecipeCardHeaderVariants = cva(
  ['flex', 'items-start', 'justify-between', 'gap-2'],
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
 * Web recipe card title variants
 */
export const webRecipeCardTitleVariants = cva(
  [
    'font-semibold',
    'leading-tight',
    'tracking-tight',
    'text-foreground',
    'line-clamp-2',
    'flex-1',
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
 * Web recipe card external icon variants
 */
export const webRecipeCardIconVariants = cva(
  ['text-muted-foreground', 'shrink-0', 'transition-colors'],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Web recipe card content area variants
 */
export const webRecipeCardContentVariants = cva(
  ['flex', 'flex-1', 'flex-col'],
  {
    variants: {
      size: {
        sm: 'px-3 pb-2 space-y-2',
        default: 'px-4 pb-3 space-y-2',
        lg: 'px-5 pb-4 space-y-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Web recipe card source badge variants
 * Shows the source domain of the external recipe
 */
export const webRecipeCardSourceVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1',
    'rounded-full',
    'bg-muted',
    'text-muted-foreground',
    'transition-colors',
    'w-fit',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Web recipe card footer variants
 * Contains action buttons
 */
export const webRecipeCardFooterVariants = cva(
  [
    'flex',
    'flex-wrap', // Allow wrapping when space is tight
    'items-center',
    'justify-between',
    'border-t',
    'border-dashed',
    'border-border/50',
    'mt-auto',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-1.5 gap-1.5',
        default: 'px-3 py-2 gap-2',
        lg: 'px-4 py-3 gap-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Web recipe card action button group variants
 */
export const webRecipeCardActionsVariants = cva(
  ['flex', 'items-center', 'gap-1', 'shrink-0'],
  {
    variants: {
      size: {
        sm: 'gap-1',
        default: 'gap-1.5',
        lg: 'gap-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Web recipe card skeleton variants
 */
export const webRecipeCardSkeletonVariants = cva(
  ['animate-pulse', 'bg-muted'],
  {
    variants: {
      type: {
        title: 'h-5 w-3/4 rounded',
        source: 'h-6 w-24 rounded-full',
        actions: 'h-9 w-24 rounded',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    compoundVariants: [
      {
        type: 'title',
        size: 'sm',
        className: 'h-4 w-2/3',
      },
      {
        type: 'title',
        size: 'lg',
        className: 'h-6 w-4/5',
      },
    ],
    defaultVariants: {
      type: 'title',
      size: 'default',
    },
  }
);

/**
 * Web recipe list item variants
 */
export const webRecipeListItemVariants = cva(
  [
    'group',
    'flex',
    'items-center',
    'gap-3',
    'rounded-lg',
    'border',
    'border-dashed',
    'border-border',
    'bg-card',
    'transition-all',
    'duration-200',
    'hover:border-primary/50',
    'hover:bg-accent/50',
  ],
  {
    variants: {
      variant: {
        default: 'p-3',
        compact: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Web recipe list item content variants
 */
export const webRecipeListItemContentVariants = cva(
  ['flex', 'flex-1', 'items-center', 'gap-3', 'min-w-0'],
  {
    variants: {
      variant: {
        default: '',
        compact: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Web recipe list item title variants
 */
export const webRecipeListItemTitleVariants = cva(
  [
    'font-medium',
    'text-foreground',
    'truncate',
    'flex-1',
    'transition-colors',
    'group-hover:text-primary',
  ],
  {
    variants: {
      variant: {
        default: 'text-sm',
        compact: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Web recipe list item actions variants
 */
export const webRecipeListItemActionsVariants = cva(
  ['flex', 'items-center', 'shrink-0'],
  {
    variants: {
      variant: {
        default: 'gap-1.5',
        compact: 'gap-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
