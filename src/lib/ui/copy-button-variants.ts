import { cva } from 'class-variance-authority';

/**
 * CopyButton variants using class-variance-authority
 *
 * This component provides one-click copy functionality with visual feedback
 * and multiple styling variants optimized for recipe sharing use cases.
 */
export const copyButtonVariants = cva(
  // Base styles - applied to all copy buttons
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    'relative',
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary',
          'text-primary-foreground',
          'shadow',
          'hover:bg-primary/90',
          'active:bg-primary/95',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'shadow-sm',
          'hover:bg-secondary/80',
          'active:bg-secondary/90',
        ],
        outline: [
          'border',
          'border-input',
          'bg-background',
          'shadow-sm',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'active:bg-accent/90',
        ],
        ghost: [
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'active:bg-accent/90',
        ],
        link: [
          'text-primary',
          'underline-offset-4',
          'hover:underline',
          'active:opacity-75',
        ],
        success: [
          'bg-basil',
          'text-white',
          'shadow',
          'hover:bg-basil/90',
          'active:bg-basil/80',
        ],
      },
      size: {
        sm: ['h-8', 'rounded-md', 'px-3', 'text-xs'],
        default: ['h-9', 'px-4', 'py-2', 'text-sm'],
        lg: ['h-10', 'rounded-md', 'px-6', 'text-base'],
        icon: ['h-9', 'w-9', 'p-0'],
      },
      state: {
        idle: [],
        copying: ['animate-pulse', 'cursor-wait'],
        success: [
          'bg-basil',
          'text-white',
          'shadow-basil/20',
          'hover:bg-basil/90',
        ],
        error: [
          'bg-destructive',
          'text-destructive-foreground',
          'shadow-destructive/20',
          'hover:bg-destructive/90',
        ],
      },
      animation: {
        none: [],
        pulse: ['animate-pulse'],
        bounce: ['animate-bounce'],
        shake: ['animate-shake'],
        scale: ['hover:scale-105', 'active:scale-95'],
      },
      recipe: {
        none: [],
        ingredient: [
          'border-l-4',
          'border-l-basil',
          'bg-basil/10',
          'text-foreground',
          'hover:bg-basil/20',
          'dark:bg-basil/5',
          'dark:text-foreground',
          'dark:hover:bg-basil/10',
        ],
        instruction: [
          'border-l-4',
          'border-l-primary',
          'bg-primary/10',
          'text-foreground',
          'hover:bg-primary/20',
          'dark:bg-primary/5',
          'dark:text-foreground',
          'dark:hover:bg-primary/10',
        ],
        url: [
          'border-l-4',
          'border-l-accent',
          'bg-accent/10',
          'text-foreground',
          'hover:bg-accent/20',
          'dark:bg-accent/5',
          'dark:text-foreground',
          'dark:hover:bg-accent/10',
        ],
        nutrition: [
          'border-l-4',
          'border-l-citrus',
          'bg-citrus/10',
          'text-foreground',
          'hover:bg-citrus/20',
          'dark:bg-citrus/5',
          'dark:text-foreground',
          'dark:hover:bg-citrus/10',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'idle',
      animation: 'scale',
      recipe: 'none',
    },
  }
);

/**
 * Feedback message variants for copy notifications
 */
export const copyFeedbackVariants = cva(
  [
    'absolute',
    'inset-0',
    'flex',
    'items-center',
    'justify-center',
    'font-medium',
    'text-xs',
    'transition-opacity',
    'duration-300',
    'pointer-events-none',
  ],
  {
    variants: {
      state: {
        hidden: ['opacity-0'],
        visible: ['opacity-100'],
      },
      type: {
        success: ['text-basil', 'dark:text-basil'],
        error: ['text-destructive', 'dark:text-destructive'],
      },
    },
    defaultVariants: {
      state: 'hidden',
      type: 'success',
    },
  }
);

/**
 * Icon variants for different copy states
 */
export const copyIconVariants = cva(['transition-all', 'duration-200'], {
  variants: {
    state: {
      idle: ['opacity-100', 'scale-100'],
      copying: ['opacity-50', 'scale-90'],
      success: ['opacity-0', 'scale-110'],
      error: ['opacity-0', 'scale-110'],
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

/**
 * Success/Error icon overlay variants
 */
export const copyStatusIconVariants = cva(
  [
    'absolute',
    'inset-0',
    'flex',
    'items-center',
    'justify-center',
    'transition-all',
    'duration-300',
    'pointer-events-none',
  ],
  {
    variants: {
      state: {
        hidden: ['opacity-0', 'scale-50'],
        visible: ['opacity-100', 'scale-100'],
      },
      type: {
        success: ['text-basil', 'dark:text-basil'],
        error: ['text-destructive', 'dark:text-destructive'],
      },
    },
    defaultVariants: {
      state: 'hidden',
      type: 'success',
    },
  }
);
