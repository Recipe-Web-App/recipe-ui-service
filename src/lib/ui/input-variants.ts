import { cva } from 'class-variance-authority';

/**
 * Input variants using class-variance-authority
 *
 * Industry standard approach for creating type-safe, maintainable
 * input component variants with Tailwind CSS.
 */

/**
 * Input field variants
 */
export const inputVariants = cva(
  // Base styles - applied to all inputs
  [
    'flex',
    'w-full',
    'rounded-md',
    'border',
    'bg-background',
    'px-3',
    'py-2',
    'font-medium',
    'transition-colors',
    'file:border-0',
    'file:bg-transparent',
    'file:text-foreground',
    'file:text-sm',
    'file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-primary/50',
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
        sm: ['h-8', 'px-2', 'py-1', 'text-xs'],
        default: ['h-9', 'px-3', 'py-2', 'text-sm'],
        lg: ['h-11', 'px-4', 'py-3', 'text-base'],
      },
      state: {
        default: '',
        error: [
          'border-destructive',
          'focus:border-destructive',
          'focus-visible:ring-destructive/50',
        ],
        success: [
          'border-success',
          'focus:border-success',
          'focus-visible:ring-success/50',
        ],
        warning: [
          'border-warning',
          'focus:border-warning',
          'focus-visible:ring-warning/50',
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
 * Input container variants (for wrapping input with icons, etc.)
 */
export const inputContainerVariants = cva(['relative', 'w-full'], {
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
 * Input label variants
 */
export const inputLabelVariants = cva(
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
        sm: ['text-xs', 'mb-1'],
        default: ['text-sm', 'mb-1.5'],
        lg: ['text-base', 'mb-2'],
      },
      state: {
        default: 'text-foreground',
        error: 'text-destructive',
        success: 'text-success',
        warning: 'text-warning',
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
 * Floating label variants (for floating label inputs)
 */
export const floatingLabelVariants = cva(
  [
    'absolute',
    'left-3',
    'font-medium',
    'text-muted-foreground',
    'transition-all',
    'duration-200',
    'pointer-events-none',
    'origin-left',
  ],
  {
    variants: {
      size: {
        sm: [
          'text-xs',
          'top-2',
          'peer-focus:-translate-y-6',
          'peer-focus:scale-75',
          'peer-[:not(:placeholder-shown)]:-translate-y-6',
          'peer-[:not(:placeholder-shown)]:scale-75',
        ],
        default: [
          'text-sm',
          'top-2.5',
          'peer-focus:-translate-y-7',
          'peer-focus:scale-75',
          'peer-[:not(:placeholder-shown)]:-translate-y-7',
          'peer-[:not(:placeholder-shown)]:scale-75',
        ],
        lg: [
          'text-base',
          'top-3.5',
          'peer-focus:-translate-y-8',
          'peer-focus:scale-75',
          'peer-[:not(:placeholder-shown)]:-translate-y-8',
          'peer-[:not(:placeholder-shown)]:scale-75',
        ],
      },
      state: {
        default: 'peer-focus:text-primary',
        error: 'peer-focus:text-destructive',
        success: 'peer-focus:text-success',
        warning: 'peer-focus:text-warning',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

/**
 * Helper text variants
 */
export const helperTextVariants = cva(
  ['text-sm', 'transition-colors', 'mt-1'],
  {
    variants: {
      state: {
        default: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-success',
        warning: 'text-warning',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * Input icon variants (for left/right icons)
 */
export const inputIconVariants = cva(
  [
    'absolute',
    'top-1/2',
    '-translate-y-1/2',
    'text-muted-foreground',
    'transition-colors',
    'pointer-events-none',
  ],
  {
    variants: {
      position: {
        left: 'left-3',
        right: 'right-3',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      interactive: {
        true: 'pointer-events-auto cursor-pointer hover:text-foreground',
        false: 'pointer-events-none',
      },
    },
    defaultVariants: {
      position: 'left',
      size: 'default',
      interactive: false,
    },
  }
);

/**
 * Clear button variants (for clearable inputs)
 */
export const clearButtonVariants = cva(
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
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-5',
        default: 'h-6 w-6',
        lg: 'h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Character counter variants
 */
export const characterCounterVariants = cva(
  ['text-xs', 'text-right', 'mt-1', 'transition-colors'],
  {
    variants: {
      state: {
        default: 'text-muted-foreground',
        warning: 'text-warning',
        error: 'text-destructive',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);
