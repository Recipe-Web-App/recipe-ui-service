import { cva } from 'class-variance-authority';

/**
 * Toast variants using class-variance-authority
 *
 * Industry standard approach for creating type-safe, maintainable
 * toast component variants with Tailwind CSS.
 */

/**
 * Toast container variants
 */
export const toastVariants = cva(
  // Base styles - applied to all toasts
  [
    'relative',
    'flex',
    'items-start',
    'gap-3',
    'p-4',
    'rounded-lg',
    'border',
    'shadow-lg',
    'backdrop-blur-sm',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'max-w-md',
    'w-full',
    'pointer-events-auto',
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-background',
          'border-border',
          'text-foreground',
          'shadow-md',
        ],
        success: [
          'bg-success/10',
          'border-success/20',
          'text-success',
          'dark:bg-success/5',
          'dark:border-success/15',
          'dark:text-success',
        ],
        error: [
          'bg-destructive/10',
          'border-destructive/20',
          'text-destructive',
          'dark:bg-destructive/5',
          'dark:border-destructive/15',
          'dark:text-destructive',
        ],
        warning: [
          'bg-warning/10',
          'border-warning/30',
          'text-neutral-800',
          'dark:bg-warning/5',
          'dark:border-warning/15',
          'dark:text-warning',
        ],
        info: [
          'bg-primary/10',
          'border-primary/20',
          'text-primary',
          'dark:bg-primary/5',
          'dark:border-primary/15',
          'dark:text-primary',
        ],
      },
      size: {
        sm: ['text-sm', 'p-3', 'gap-2'],
        default: ['text-base', 'p-4', 'gap-3'],
        lg: ['text-lg', 'p-5', 'gap-4'],
      },
      position: {
        'top-left': 'justify-start',
        'top-center': 'justify-center',
        'top-right': 'justify-end',
        'bottom-left': 'justify-start',
        'bottom-center': 'justify-center',
        'bottom-right': 'justify-end',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'top-right',
    },
  }
);

/**
 * Toast icon variants
 */
export const toastIconVariants = cva(
  ['flex-shrink-0', 'transition-colors', 'mt-0.5'],
  {
    variants: {
      variant: {
        default: 'text-muted-foreground',
        success: 'text-success',
        error: 'text-destructive',
        warning: 'text-warning',
        info: 'text-primary',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toast content variants (for title and description)
 */
export const toastContentVariants = cva(['flex-1', 'min-w-0'], {
  variants: {
    size: {
      sm: 'gap-1',
      default: 'gap-2',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Toast title variants
 */
export const toastTitleVariants = cva(
  ['font-semibold', 'leading-tight', 'break-words'],
  {
    variants: {
      variant: {
        default: 'text-foreground',
        success: 'text-success',
        error: 'text-destructive',
        warning: 'text-neutral-800 dark:text-warning',
        info: 'text-primary',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toast description variants
 */
export const toastDescriptionVariants = cva(
  ['text-sm', 'leading-relaxed', 'break-words', 'mt-1'],
  {
    variants: {
      variant: {
        default: 'text-muted-foreground',
        success: 'text-success/80',
        error: 'text-destructive/80',
        warning: 'text-neutral-700 dark:text-warning/80',
        info: 'text-primary/80',
      },
      size: {
        sm: 'text-xs mt-0.5',
        default: 'text-sm mt-1',
        lg: 'text-base mt-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toast close button variants
 */
export const toastCloseButtonVariants = cva(
  [
    'flex-shrink-0',
    'rounded-full',
    'p-1',
    'transition-colors',
    'hover:bg-black/5',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'dark:hover:bg-white/10',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-muted-foreground',
          'hover:text-foreground',
          'focus:ring-ring',
        ],
        success: [
          'text-green-500',
          'hover:text-green-600',
          'focus:ring-green-500',
          'dark:text-green-400',
          'dark:hover:text-green-300',
        ],
        error: [
          'text-red-500',
          'hover:text-red-600',
          'focus:ring-red-500',
          'dark:text-red-400',
          'dark:hover:text-red-300',
        ],
        warning: [
          'text-yellow-500',
          'hover:text-yellow-600',
          'focus:ring-yellow-500',
          'dark:text-yellow-400',
          'dark:hover:text-yellow-300',
        ],
        info: [
          'text-blue-500',
          'hover:text-blue-600',
          'focus:ring-blue-500',
          'dark:text-blue-400',
          'dark:hover:text-blue-300',
        ],
      },
      size: {
        sm: 'h-6 w-6',
        default: 'h-7 w-7',
        lg: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toast action button variants
 */
export const toastActionVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-sm',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'mt-2',
    'px-3',
    'py-1.5',
    'border',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border',
          'bg-background',
          'hover:bg-muted',
          'focus:ring-ring',
          'text-foreground',
        ],
        success: [
          'border-green-300',
          'bg-green-100',
          'hover:bg-green-200',
          'focus:ring-green-500',
          'text-green-800',
          'dark:border-green-700',
          'dark:bg-green-900/50',
          'dark:hover:bg-green-800/50',
          'dark:text-green-200',
        ],
        error: [
          'border-red-300',
          'bg-red-100',
          'hover:bg-red-200',
          'focus:ring-red-500',
          'text-red-800',
          'dark:border-red-700',
          'dark:bg-red-900/50',
          'dark:hover:bg-red-800/50',
          'dark:text-red-200',
        ],
        warning: [
          'border-yellow-300',
          'bg-yellow-100',
          'hover:bg-yellow-200',
          'focus:ring-yellow-500',
          'text-yellow-800',
          'dark:border-yellow-700',
          'dark:bg-yellow-900/50',
          'dark:hover:bg-yellow-800/50',
          'dark:text-yellow-200',
        ],
        info: [
          'border-blue-300',
          'bg-blue-100',
          'hover:bg-blue-200',
          'focus:ring-blue-500',
          'text-blue-800',
          'dark:border-blue-700',
          'dark:bg-blue-900/50',
          'dark:hover:bg-blue-800/50',
          'dark:text-blue-200',
        ],
      },
      size: {
        sm: ['text-xs', 'px-2', 'py-1'],
        default: ['text-sm', 'px-3', 'py-1.5'],
        lg: ['text-base', 'px-4', 'py-2'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toast progress bar variants (for auto-dismiss timer)
 */
export const toastProgressVariants = cva(
  [
    'absolute',
    'bottom-0',
    'left-0',
    'h-1',
    'transition-all',
    'duration-100',
    'ease-linear',
  ],
  {
    variants: {
      variant: {
        default: 'bg-muted-foreground/30',
        success: 'bg-success/50',
        error: 'bg-destructive/50',
        warning: 'bg-warning/50',
        info: 'bg-primary/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
