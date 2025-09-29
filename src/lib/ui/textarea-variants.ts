import { cva } from 'class-variance-authority';

/**
 * Textarea variants using class-variance-authority
 *
 * Provides styling for textarea components with consistent spacing, sizing, and states.
 */
export const textareaVariants = cva(
  [
    'flex',
    'w-full',
    'rounded-md',
    'border',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'resize-none',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'focus:border-primary',
          'focus:ring-primary/20',
        ],
        destructive: [
          'border-destructive',
          'text-destructive',
          'focus:border-destructive',
          'focus:ring-destructive/20',
          'bg-destructive/10',
        ],
        success: [
          'border-success',
          'text-success',
          'focus:border-success',
          'focus:ring-success/20',
          'bg-success/10',
        ],
        warning: [
          'border-warning',
          'text-neutral-800',
          'focus:border-warning',
          'focus:ring-warning/20',
          'bg-warning/10',
          'dark:text-warning',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'focus:border-border',
          'focus:ring-ring/20',
        ],
      },
      size: {
        sm: ['text-xs', 'px-2', 'py-1', 'min-h-[2.5rem]'],
        default: ['text-sm', 'px-3', 'py-2', 'min-h-[3rem]'],
        lg: ['text-base', 'px-4', 'py-3', 'min-h-[3.5rem]'],
      },
      resize: {
        none: ['resize-none'],
        vertical: ['resize-y'],
        horizontal: ['resize-x'],
        both: ['resize'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      resize: 'vertical',
    },
  }
);

/**
 * Textarea label variants using class-variance-authority
 *
 * Provides styling for textarea labels with proper spacing and emphasis.
 */
export const textareaLabelVariants = cva(
  ['block', 'text-sm', 'font-medium', 'text-foreground', 'mb-1'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
      required: {
        true: ['after:content-["*"]', 'after:ml-1', 'after:text-destructive'],
        false: [],
      },
      disabled: {
        true: ['text-muted-foreground', 'cursor-not-allowed'],
        false: ['text-foreground'],
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
      disabled: false,
    },
  }
);

/**
 * Textarea helper text variants using class-variance-authority
 *
 * Provides styling for helper text, error messages, and character counts.
 */
export const textareaHelperVariants = cva(['text-xs', 'mt-1'], {
  variants: {
    variant: {
      default: ['text-muted-foreground'],
      error: ['text-destructive'],
      success: ['text-basil'],
      warning: ['text-citrus'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Recipe textarea variants using class-variance-authority
 *
 * Specialized styling for recipe-specific textarea use cases.
 */
export const recipeTextareaVariants = cva(
  [
    'w-full',
    'rounded-lg',
    'border-2',
    'p-4',
    'text-sm',
    'leading-relaxed',
    'transition-all',
    'duration-200',
    'resize-vertical',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ],
  {
    variants: {
      type: {
        description: [
          'min-h-[6rem]',
          'border-primary/20',
          'bg-primary/5',
          'text-primary-foreground',
          'placeholder:text-primary/60',
          'focus:border-primary/40',
          'focus:ring-primary/20',
          'focus:bg-primary/10',
        ],
        notes: [
          'min-h-[4rem]',
          'border-citrus/30',
          'bg-citrus/10',
          'text-foreground',
          'placeholder:text-citrus/70',
          'focus:border-citrus/50',
          'focus:ring-citrus/20',
          'focus:bg-citrus/15',
        ],
        instructions: [
          'min-h-[8rem]',
          'border-basil/20',
          'bg-basil/5',
          'text-foreground',
          'placeholder:text-basil/60',
          'focus:border-basil/40',
          'focus:ring-basil/20',
          'focus:bg-basil/10',
        ],
        tips: [
          'min-h-[4rem]',
          'border-secondary/20',
          'bg-secondary/5',
          'text-foreground',
          'placeholder:text-secondary/60',
          'focus:border-secondary/40',
          'focus:ring-secondary/20',
          'focus:bg-secondary/10',
        ],
        review: [
          'min-h-[5rem]',
          'border-accent/30',
          'bg-accent/10',
          'text-foreground',
          'placeholder:text-accent/70',
          'focus:border-accent/50',
          'focus:ring-accent/20',
          'focus:bg-accent/15',
        ],
      },
      state: {
        default: [],
        focused: ['ring-2', 'ring-offset-2'],
        error: [
          'border-destructive/40',
          'bg-destructive/5',
          'text-foreground',
          'focus:border-destructive/60',
          'focus:ring-destructive/20',
        ],
        success: [
          'border-basil/40',
          'bg-basil/5',
          'text-foreground',
          'focus:border-basil/60',
          'focus:ring-basil/20',
        ],
      },
    },
    defaultVariants: {
      type: 'description',
      state: 'default',
    },
  }
);

/**
 * Character counter variants using class-variance-authority
 *
 * Provides styling for character count displays with warning states.
 */
export const characterCounterVariants = cva(
  ['text-xs', 'font-medium', 'tabular-nums'],
  {
    variants: {
      state: {
        default: ['text-muted-foreground'],
        warning: ['text-citrus'],
        error: ['text-destructive'],
        success: ['text-basil'],
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * Textarea container variants using class-variance-authority
 *
 * Provides styling for textarea wrapper containers with proper spacing.
 */
export const textareaContainerVariants = cva(['space-y-1'], {
  variants: {
    fullWidth: {
      true: ['w-full'],
      false: ['w-auto'],
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
