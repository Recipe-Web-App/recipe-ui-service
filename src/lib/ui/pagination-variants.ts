import { cva } from 'class-variance-authority';

/**
 * Pagination container variants
 */
export const paginationVariants = cva('flex items-center space-x-2', {
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    size: 'default',
    justify: 'center',
  },
});

/**
 * Pagination item (button) variants
 */
export const paginationItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 min-w-8 text-xs',
        default: 'h-10 min-w-10 text-sm',
        lg: 'h-12 min-w-12 text-base',
      },
      active: {
        true: 'bg-primary text-primary-foreground hover:bg-primary/90',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      active: false,
    },
  }
);

/**
 * Pagination navigation button variants (prev/next)
 */
export const paginationNavVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-2 text-xs gap-1',
        default: 'h-10 px-3 text-sm gap-1.5',
        lg: 'h-12 px-4 text-base gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Pagination ellipsis variants
 */
export const paginationEllipsisVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Pagination info text variants
 */
export const paginationInfoVariants = cva('text-muted-foreground', {
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
});

/**
 * Page size selector variants
 */
export const pageSizeSelectorVariants = cva('inline-flex items-center gap-2', {
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
});

/**
 * Page jump input variants
 */
export const pageJumpVariants = cva('inline-flex items-center gap-2', {
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
});
