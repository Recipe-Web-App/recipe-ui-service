import { cva } from 'class-variance-authority';

/**
 * Error boundary container variants using class-variance-authority
 *
 * Provides styling for error boundary components with different display modes.
 */
export const errorBoundaryVariants = cva(
  [
    'relative',
    'w-full',
    'rounded-lg',
    'border',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        inline: [
          'p-3',
          'text-sm',
          'bg-red-50',
          'text-red-900',
          'border-red-200',
        ],
        card: [
          'p-6',
          'text-sm',
          'bg-red-50',
          'text-red-900',
          'border-red-200',
          'shadow-sm',
        ],
        page: [
          'min-h-[400px]',
          'p-8',
          'text-base',
          'bg-red-50',
          'text-red-900',
          'border-red-200',
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'text-center',
        ],
        toast: [
          'p-4',
          'text-sm',
          'bg-red-50',
          'text-red-900',
          'border-red-200',
          'shadow-lg',
          'max-w-sm',
        ],
        minimal: [
          'p-2',
          'text-xs',
          'bg-red-50',
          'text-red-800',
          'border-red-200',
          'rounded',
        ],
      },
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'card',
      size: 'default',
    },
  }
);

/**
 * Error boundary icon variants using class-variance-authority
 *
 * Provides styling for error boundary icons with contextual sizing and colors.
 */
export const errorBoundaryIconVariants = cva(
  ['flex-shrink-0', 'text-red-500'],
  {
    variants: {
      variant: {
        inline: ['h-4', 'w-4'],
        card: ['h-6', 'w-6'],
        page: ['h-12', 'w-12', 'mb-4'],
        toast: ['h-5', 'w-5'],
        minimal: ['h-3', 'w-3'],
      },
      size: {
        sm: ['h-4', 'w-4'],
        default: ['h-5', 'w-5'],
        lg: ['h-6', 'w-6'],
      },
    },
    defaultVariants: {
      variant: 'card',
      size: 'default',
    },
  }
);

/**
 * Error boundary title variants using class-variance-authority
 *
 * Provides styling for error boundary titles with proper emphasis and spacing.
 */
export const errorBoundaryTitleVariants = cva(
  ['font-semibold', 'text-red-900'],
  {
    variants: {
      variant: {
        inline: ['text-sm', 'mb-1'],
        card: ['text-lg', 'mb-2'],
        page: ['text-2xl', 'mb-4'],
        toast: ['text-sm', 'mb-1'],
        minimal: ['text-xs', 'mb-1'],
      },
      size: {
        sm: ['text-sm'],
        default: ['text-base'],
        lg: ['text-lg'],
      },
    },
    defaultVariants: {
      variant: 'card',
      size: 'default',
    },
  }
);

/**
 * Error boundary description variants using class-variance-authority
 *
 * Provides styling for error boundary descriptions with proper text hierarchy.
 */
export const errorBoundaryDescriptionVariants = cva(['text-red-800'], {
  variants: {
    variant: {
      inline: ['text-xs', 'mb-2'],
      card: ['text-sm', 'mb-4'],
      page: ['text-base', 'mb-6', 'max-w-md'],
      toast: ['text-xs', 'mb-2'],
      minimal: ['text-xs'],
    },
    size: {
      sm: ['text-xs'],
      default: ['text-sm'],
      lg: ['text-base'],
    },
  },
  defaultVariants: {
    variant: 'card',
    size: 'default',
  },
});

/**
 * Error boundary action variants using class-variance-authority
 *
 * Provides styling for error boundary actions and buttons.
 */
export const errorBoundaryActionVariants = cva(['flex', 'gap-2'], {
  variants: {
    layout: {
      horizontal: ['flex-row', 'items-center'],
      vertical: ['flex-col', 'items-start'],
      inline: ['inline-flex', 'items-center'],
    },
    variant: {
      inline: ['mt-1'],
      card: ['mt-4'],
      page: ['mt-6'],
      toast: ['mt-2'],
      minimal: ['mt-1'],
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    variant: 'card',
  },
});

/**
 * Error boundary button variants using class-variance-authority
 *
 * Provides styling for error boundary action buttons.
 */
export const errorBoundaryButtonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'font-medium',
    'ring-offset-white',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-red-600',
          'text-white',
          'hover:bg-red-700',
          'focus-visible:ring-red-500',
        ],
        secondary: [
          'border',
          'border-red-300',
          'bg-white',
          'text-red-700',
          'hover:bg-red-50',
          'focus-visible:ring-red-500',
        ],
        ghost: [
          'text-red-700',
          'hover:bg-red-100',
          'focus-visible:ring-red-500',
        ],
        link: [
          'text-red-600',
          'underline-offset-4',
          'hover:underline',
          'focus-visible:ring-red-500',
          'px-0',
          'py-0',
        ],
      },
      size: {
        sm: ['h-7', 'px-2', 'text-xs'],
        default: ['h-8', 'px-3', 'text-sm'],
        lg: ['h-9', 'px-4', 'text-sm'],
      },
      variant: {
        inline: ['text-xs', 'px-2', 'py-1'],
        card: ['text-sm', 'px-3', 'py-2'],
        page: ['text-base', 'px-6', 'py-3'],
        toast: ['text-xs', 'px-2', 'py-1'],
        minimal: ['text-xs', 'px-1', 'py-0.5'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
      variant: 'card',
    },
  }
);

/**
 * Error boundary content variants using class-variance-authority
 *
 * Provides styling for error boundary content layout.
 */
export const errorBoundaryContentVariants = cva(['flex'], {
  variants: {
    variant: {
      inline: ['items-start', 'gap-2'],
      card: ['flex-col'],
      page: ['flex-col', 'items-center', 'text-center'],
      toast: ['items-start', 'gap-3'],
      minimal: ['items-center', 'gap-1'],
    },
    withIcon: {
      true: [],
      false: [],
    },
  },
  defaultVariants: {
    variant: 'card',
    withIcon: false,
  },
});

/**
 * Error boundary details variants using class-variance-authority
 *
 * Provides styling for collapsible error details sections.
 */
export const errorBoundaryDetailsVariants = cva(
  [
    'mt-4',
    'p-3',
    'bg-red-100',
    'border',
    'border-red-200',
    'rounded',
    'text-xs',
    'font-mono',
    'text-red-900',
    'overflow-auto',
    'max-h-40',
  ],
  {
    variants: {
      variant: {
        inline: ['mt-2', 'p-2', 'text-xs'],
        card: ['mt-4', 'p-3', 'text-xs'],
        page: ['mt-6', 'p-4', 'text-sm', 'max-w-2xl', 'w-full'],
        toast: ['mt-2', 'p-2', 'text-xs'],
        minimal: ['mt-1', 'p-1', 'text-xs'],
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  }
);

/**
 * Error boundary loading variants using class-variance-authority
 *
 * Provides styling for retry loading states.
 */
export const errorBoundaryLoadingVariants = cva(
  ['inline-flex', 'items-center', 'gap-2'],
  {
    variants: {
      variant: {
        inline: ['text-xs'],
        card: ['text-sm'],
        page: ['text-base'],
        toast: ['text-xs'],
        minimal: ['text-xs'],
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  }
);
