import { cva } from 'class-variance-authority';

/**
 * Dialog overlay variants using class-variance-authority
 *
 * Provides styling for dialog overlay/backdrop with proper opacity and transitions.
 */
export const dialogOverlayVariants = cva(
  [
    'fixed',
    'inset-0',
    'z-50',
    'bg-black/80',
    'backdrop-blur-sm',
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
  ],
  {
    variants: {
      variant: {
        default: ['bg-black/80'],
        light: ['bg-black/60'],
        dark: ['bg-black/90'],
        blur: ['bg-black/50', 'backdrop-blur-md'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Dialog content variants using class-variance-authority
 *
 * Provides styling for dialog content containers with proper positioning and animations.
 */
export const dialogContentVariants = cva(
  [
    'fixed',
    'left-[50%]',
    'top-[50%]',
    'z-50',
    'grid',
    'w-full',
    'max-w-lg',
    'translate-x-[-50%]',
    'translate-y-[-50%]',
    'gap-4',
    'border',
    'bg-white',
    'p-6',
    'shadow-lg',
    'duration-200',
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2',
    'data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2',
    'data-[state=open]:slide-in-from-top-[48%]',
    'sm:rounded-lg',
  ],
  {
    variants: {
      variant: {
        default: ['border-gray-200', 'bg-white', 'text-gray-900', 'shadow-lg'],
        destructive: [
          'border-red-200',
          'bg-red-50',
          'text-red-900',
          'shadow-red-100',
        ],
        success: [
          'border-green-200',
          'bg-green-50',
          'text-green-900',
          'shadow-green-100',
        ],
        warning: [
          'border-yellow-200',
          'bg-yellow-50',
          'text-yellow-900',
          'shadow-yellow-100',
        ],
        info: [
          'border-blue-200',
          'bg-blue-50',
          'text-blue-900',
          'shadow-blue-100',
        ],
      },
      size: {
        sm: ['max-w-sm', 'p-4'],
        default: ['max-w-lg', 'p-6'],
        lg: ['max-w-2xl', 'p-8'],
        xl: ['max-w-4xl', 'p-10'],
        full: ['max-w-[95vw]', 'max-h-[95vh]', 'p-6'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Dialog header variants using class-variance-authority
 *
 * Provides styling for dialog headers with proper spacing and typography.
 */
export const dialogHeaderVariants = cva(
  ['flex', 'flex-col', 'space-y-1.5', 'text-center', 'sm:text-left'],
  {
    variants: {
      variant: {
        default: [],
        destructive: ['text-red-900'],
        success: ['text-green-900'],
        warning: ['text-yellow-900'],
        info: ['text-blue-900'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Dialog title variants using class-variance-authority
 *
 * Provides styling for dialog titles with proper typography and emphasis.
 */
export const dialogTitleVariants = cva(
  ['text-lg', 'font-semibold', 'leading-none', 'tracking-tight'],
  {
    variants: {
      variant: {
        default: ['text-gray-900'],
        destructive: ['text-red-900'],
        success: ['text-green-900'],
        warning: ['text-yellow-900'],
        info: ['text-blue-900'],
      },
      size: {
        sm: ['text-base'],
        default: ['text-lg'],
        lg: ['text-xl'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Dialog description variants using class-variance-authority
 *
 * Provides styling for dialog descriptions with proper text hierarchy.
 */
export const dialogDescriptionVariants = cva(['text-sm', 'text-gray-500'], {
  variants: {
    variant: {
      default: ['text-gray-500'],
      destructive: ['text-red-600'],
      success: ['text-green-600'],
      warning: ['text-yellow-600'],
      info: ['text-blue-600'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Dialog footer variants using class-variance-authority
 *
 * Provides styling for dialog footers with proper button layout.
 */
export const dialogFooterVariants = cva(
  [
    'flex',
    'flex-col-reverse',
    'sm:flex-row',
    'sm:justify-end',
    'sm:space-x-2',
    'space-y-2',
    'sm:space-y-0',
  ],
  {
    variants: {
      layout: {
        default: ['sm:justify-end'],
        spread: ['sm:justify-between'],
        center: ['sm:justify-center'],
        start: ['sm:justify-start'],
      },
    },
    defaultVariants: {
      layout: 'default',
    },
  }
);

/**
 * Dialog close button variants using class-variance-authority
 *
 * Provides styling for dialog close buttons with proper positioning.
 */
export const dialogCloseVariants = cva(
  [
    'absolute',
    'right-4',
    'top-4',
    'rounded-sm',
    'opacity-70',
    'ring-offset-white',
    'transition-opacity',
    'hover:opacity-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-gray-950',
    'focus:ring-offset-2',
    'disabled:pointer-events-none',
    'data-[state=open]:bg-gray-100',
    'data-[state=open]:text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-gray-500',
          'hover:text-gray-900',
          'focus:ring-gray-950',
        ],
        destructive: [
          'text-red-500',
          'hover:text-red-700',
          'focus:ring-red-500',
        ],
        success: [
          'text-green-500',
          'hover:text-green-700',
          'focus:ring-green-500',
        ],
        warning: [
          'text-yellow-500',
          'hover:text-yellow-700',
          'focus:ring-yellow-500',
        ],
        info: ['text-blue-500', 'hover:text-blue-700', 'focus:ring-blue-500'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Confirmation dialog variants using class-variance-authority
 *
 * Specialized styling for confirmation dialogs with action-specific themes.
 */
export const confirmationDialogVariants = cva(['text-center', 'sm:text-left'], {
  variants: {
    type: {
      delete: ['border-red-200', 'bg-red-50', 'text-red-900'],
      save: ['border-green-200', 'bg-green-50', 'text-green-900'],
      discard: ['border-yellow-200', 'bg-yellow-50', 'text-yellow-900'],
      publish: ['border-blue-200', 'bg-blue-50', 'text-blue-900'],
      archive: ['border-gray-200', 'bg-gray-50', 'text-gray-900'],
    },
    severity: {
      low: ['shadow-sm'],
      medium: ['shadow-md'],
      high: ['shadow-lg', 'ring-1', 'ring-inset'],
    },
  },
  defaultVariants: {
    type: 'save',
    severity: 'medium',
  },
});

/**
 * Dialog icon variants using class-variance-authority
 *
 * Provides styling for dialog icons with contextual coloring.
 */
export const dialogIconVariants = cva(
  [
    'mx-auto',
    'flex',
    'h-12',
    'w-12',
    'flex-shrink-0',
    'items-center',
    'justify-center',
    'rounded-full',
    'sm:mx-0',
    'sm:h-10',
    'sm:w-10',
  ],
  {
    variants: {
      variant: {
        default: ['bg-gray-100', 'text-gray-600'],
        destructive: ['bg-red-100', 'text-red-600'],
        success: ['bg-green-100', 'text-green-600'],
        warning: ['bg-yellow-100', 'text-yellow-600'],
        info: ['bg-blue-100', 'text-blue-600'],
      },
      size: {
        sm: ['h-8', 'w-8'],
        default: ['h-10', 'w-10', 'sm:h-10', 'sm:w-10'],
        lg: ['h-12', 'w-12', 'sm:h-12', 'sm:w-12'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Recipe dialog variants using class-variance-authority
 *
 * Specialized styling for recipe-specific dialogs and confirmations.
 */
export const recipeDialogVariants = cva(['border-l-4', 'pl-4'], {
  variants: {
    action: {
      'delete-recipe': ['border-l-red-500', 'bg-red-50', 'text-red-900'],
      'save-recipe': ['border-l-green-500', 'bg-green-50', 'text-green-900'],
      'publish-recipe': ['border-l-blue-500', 'bg-blue-50', 'text-blue-900'],
      'share-recipe': [
        'border-l-purple-500',
        'bg-purple-50',
        'text-purple-900',
      ],
      'export-recipe': [
        'border-l-orange-500',
        'bg-orange-50',
        'text-orange-900',
      ],
      'duplicate-recipe': [
        'border-l-indigo-500',
        'bg-indigo-50',
        'text-indigo-900',
      ],
    },
  },
  defaultVariants: {
    action: 'save-recipe',
  },
});

/**
 * Dialog button variants using class-variance-authority
 *
 * Provides styling for dialog action buttons with contextual emphasis.
 */
export const dialogButtonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-white',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'px-4',
    'py-2',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-blue-600',
          'text-white',
          'hover:bg-blue-700',
          'focus-visible:ring-blue-500',
        ],
        destructive: [
          'bg-red-600',
          'text-white',
          'hover:bg-red-700',
          'focus-visible:ring-red-500',
        ],
        success: [
          'bg-green-600',
          'text-white',
          'hover:bg-green-700',
          'focus-visible:ring-green-500',
        ],
        secondary: [
          'border',
          'border-gray-300',
          'bg-white',
          'text-gray-700',
          'hover:bg-gray-50',
          'focus-visible:ring-gray-500',
        ],
        ghost: [
          'text-gray-700',
          'hover:bg-gray-100',
          'focus-visible:ring-gray-500',
        ],
      },
      size: {
        sm: ['h-8', 'px-3', 'text-xs'],
        default: ['h-9', 'px-4', 'py-2'],
        lg: ['h-10', 'px-6', 'py-3'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
    },
  }
);
