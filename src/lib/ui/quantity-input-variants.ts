import { cva } from 'class-variance-authority';

/**
 * QuantityInput variants using class-variance-authority
 *
 * Provides styling for the quantity input component with +/- buttons.
 */

/**
 * Container variants - wraps the entire component
 */
export const quantityInputContainerVariants = cva(['relative', 'w-full'], {
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
 * Input wrapper variants - contains buttons and input field
 */
export const quantityInputWrapperVariants = cva(
  ['flex', 'items-center', 'rounded-lg', 'border', 'bg-primary/5'],
  {
    variants: {
      size: {
        sm: 'h-8',
        default: 'h-9',
        lg: 'h-11',
      },
      state: {
        default: [
          'border-primary/20',
          'focus-within:border-primary/40',
          'focus-within:ring-2',
          'focus-within:ring-primary/20',
          'focus-within:ring-offset-2',
        ],
        error: [
          'border-destructive',
          'focus-within:border-destructive',
          'focus-within:ring-2',
          'focus-within:ring-destructive/50',
          'focus-within:ring-offset-2',
        ],
        success: [
          'border-success',
          'focus-within:border-success',
          'focus-within:ring-2',
          'focus-within:ring-success/50',
          'focus-within:ring-offset-2',
        ],
        warning: [
          'border-warning',
          'focus-within:border-warning',
          'focus-within:ring-2',
          'focus-within:ring-warning/50',
          'focus-within:ring-offset-2',
        ],
      },
      disabled: {
        true: ['opacity-50', 'cursor-not-allowed', 'bg-muted'],
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
      disabled: false,
    },
  }
);

/**
 * Input field variants - the actual number input
 */
export const quantityInputVariants = cva(
  [
    'flex-1',
    'min-w-0',
    'bg-transparent',
    'text-center',
    'font-medium',
    'border-0',
    'outline-none',
    'focus:outline-none',
    'placeholder:text-primary/60',
    // Hide native spinner buttons
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: ['px-1', 'text-xs'],
        default: ['px-2', 'text-sm'],
        lg: ['px-3', 'text-base'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Button variants - for +/- buttons
 */
export const quantityInputButtonVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'shrink-0',
    'select-none',
    'transition-colors',
    'text-muted-foreground',
    'hover:text-foreground',
    'hover:bg-primary/10',
    'active:bg-primary/20',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:hover:bg-transparent',
    'disabled:hover:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        sm: ['h-full', 'w-6', 'text-xs'],
        default: ['h-full', 'w-8', 'text-sm'],
        lg: ['h-full', 'w-10', 'text-base'],
      },
      position: {
        left: ['rounded-l-lg', 'border-r', 'border-primary/20'],
        right: ['rounded-r-lg', 'border-l', 'border-primary/20'],
      },
    },
    defaultVariants: {
      size: 'default',
      position: 'left',
    },
  }
);

/**
 * Label variants
 */
export const quantityInputLabelVariants = cva(
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
 * Helper text variants
 */
export const quantityInputHelperTextVariants = cva(
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
