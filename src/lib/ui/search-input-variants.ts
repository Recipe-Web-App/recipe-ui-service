import { cva } from 'class-variance-authority';

/**
 * SearchInput variants using class-variance-authority
 *
 * Specialized search input component variants that extend the base input patterns
 * with search-specific styling and behavior for optimal user experience.
 */

/**
 * Search input field variants
 */
export const searchInputVariants = cva(
  // Base styles - applied to all search inputs
  [
    'flex',
    'w-full',
    'rounded-md',
    'border',
    'bg-background',
    'font-medium',
    'transition-colors',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:bg-muted',
    'read-only:bg-muted/50',
    'read-only:cursor-default',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'hover:border-input-hover',
          'focus:border-primary',
        ],
        filled: [
          'border-transparent',
          'bg-muted',
          'hover:bg-muted/80',
          'focus:bg-background',
          'focus:border-primary',
        ],
        outlined: [
          'border-2',
          'border-input',
          'hover:border-input-hover',
          'focus:border-primary',
          'bg-transparent',
        ],
      },
      size: {
        sm: ['h-8', 'text-input-sm', 'pl-8', 'pr-8'],
        default: ['h-9', 'text-input-base', 'pl-9', 'pr-9'],
        lg: ['h-11', 'text-input-lg', 'pl-12', 'pr-12'],
      },
      state: {
        default: '',
        error: [
          'border-destructive',
          'focus:border-destructive',
          'focus-visible:ring-destructive',
        ],
        success: [
          'border-green-500',
          'focus:border-green-500',
          'focus-visible:ring-green-500',
        ],
        warning: [
          'border-yellow-500',
          'focus:border-yellow-500',
          'focus-visible:ring-yellow-500',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

/**
 * Search input container variants
 */
export const searchInputContainerVariants = cva(['relative', 'w-full'], {
  variants: {
    size: {
      sm: 'text-input-sm',
      default: 'text-input-base',
      lg: 'text-input-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Search icon variants
 */
export const searchIconVariants = cva(
  [
    'absolute',
    'left-3',
    'top-1/2',
    '-translate-y-1/2',
    'text-muted-foreground',
    'transition-colors',
    'pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-3.5 w-3.5',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      state: {
        default: 'text-muted-foreground',
        focused: 'text-primary',
        error: 'text-destructive',
        success: 'text-green-500',
        warning: 'text-yellow-500',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

/**
 * Clear button variants for search input
 */
export const searchClearButtonVariants = cva(
  [
    'absolute',
    'right-2',
    'top-1/2',
    '-translate-y-1/2',
    'rounded-full',
    'p-1',
    'text-muted-foreground',
    'hover:text-foreground',
    'hover:bg-muted',
    'transition-colors',
    'cursor-pointer',
    'opacity-0',
    'transition-opacity',
    'duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-5',
        default: 'h-6 w-6',
        lg: 'h-7 w-7',
      },
      visible: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'default',
      visible: false,
    },
  }
);

/**
 * Search input label variants
 */
export const searchInputLabelVariants = cva(
  [
    'block',
    'font-medium',
    'text-foreground',
    'transition-colors',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: ['text-label-sm', 'mb-1'],
        default: ['text-label-base', 'mb-1.5'],
        lg: ['text-label-lg', 'mb-2'],
      },
      state: {
        default: 'text-foreground',
        error: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        disabled: 'text-muted-foreground cursor-not-allowed',
      },
      required: {
        true: "after:content-['*'] after:text-destructive after:ml-1",
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
      required: false,
    },
  }
);

/**
 * Search input helper text variants
 */
export const searchInputHelperTextVariants = cva(
  ['text-sm', 'transition-colors', 'mt-1'],
  {
    variants: {
      state: {
        default: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-green-600',
        warning: 'text-yellow-600',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * Search results loading spinner variants
 */
export const searchLoadingSpinnerVariants = cva(
  [
    'absolute',
    'right-8',
    'top-1/2',
    '-translate-y-1/2',
    'animate-spin',
    'text-muted-foreground',
    'transition-opacity',
    'duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      visible: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'default',
      visible: false,
    },
  }
);
