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
          'bg-green-600',
          'text-white',
          'shadow',
          'hover:bg-green-700',
          'active:bg-green-800',
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
          'bg-green-600',
          'text-white',
          'shadow-green-200',
          'hover:bg-green-700',
        ],
        error: [
          'bg-red-600',
          'text-white',
          'shadow-red-200',
          'hover:bg-red-700',
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
          'border-l-green-500',
          'bg-green-50',
          'text-green-900',
          'hover:bg-green-100',
          'dark:bg-green-950',
          'dark:text-green-100',
          'dark:hover:bg-green-900',
        ],
        instruction: [
          'border-l-4',
          'border-l-blue-500',
          'bg-blue-50',
          'text-blue-900',
          'hover:bg-blue-100',
          'dark:bg-blue-950',
          'dark:text-blue-100',
          'dark:hover:bg-blue-900',
        ],
        url: [
          'border-l-4',
          'border-l-purple-500',
          'bg-purple-50',
          'text-purple-900',
          'hover:bg-purple-100',
          'dark:bg-purple-950',
          'dark:text-purple-100',
          'dark:hover:bg-purple-900',
        ],
        nutrition: [
          'border-l-4',
          'border-l-orange-500',
          'bg-orange-50',
          'text-orange-900',
          'hover:bg-orange-100',
          'dark:bg-orange-950',
          'dark:text-orange-100',
          'dark:hover:bg-orange-900',
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
        success: ['text-green-600', 'dark:text-green-400'],
        error: ['text-red-600', 'dark:text-red-400'],
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
        success: ['text-green-600', 'dark:text-green-400'],
        error: ['text-red-600', 'dark:text-red-400'],
      },
    },
    defaultVariants: {
      state: 'hidden',
      type: 'success',
    },
  }
);
