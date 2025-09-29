import { cva } from 'class-variance-authority';

/**
 * Alert variants using class-variance-authority
 *
 * Provides styling for alert components with different states and contexts.
 */
export const alertVariants = cva(
  [
    'relative',
    'w-full',
    'rounded-lg',
    'border',
    'px-4',
    'py-3',
    'text-sm',
    'transition-all',
    'duration-200',
    '[&>svg~*]:pl-7',
    '[&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute',
    '[&>svg]:left-4',
    '[&>svg]:top-4',
    '[&>svg]:text-current',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary/10',
          'text-primary',
          'border-primary/20',
          '[&>svg]:text-primary',
        ],
        destructive: [
          'bg-destructive/10',
          'text-destructive',
          'border-destructive/20',
          '[&>svg]:text-destructive',
        ],
        success: [
          'bg-success/10',
          'text-success',
          'border-success/20',
          '[&>svg]:text-success',
        ],
        warning: [
          'bg-warning/10',
          'text-neutral-800',
          'border-warning/30',
          '[&>svg]:text-warning',
        ],
        info: [
          'bg-primary/10',
          'text-primary',
          'border-primary/20',
          '[&>svg]:text-primary',
        ],
        secondary: [
          'bg-muted',
          'text-muted-foreground',
          'border-border',
          '[&>svg]:text-muted-foreground',
        ],
      },
      size: {
        sm: ['px-3', 'py-2', 'text-xs'],
        default: ['px-4', 'py-3', 'text-sm'],
        lg: ['px-6', 'py-4', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Alert title variants using class-variance-authority
 *
 * Provides styling for alert titles with proper emphasis and spacing.
 */
export const alertTitleVariants = cva(
  ['mb-1', 'font-medium', 'leading-none', 'tracking-tight'],
  {
    variants: {
      variant: {
        default: ['text-primary'],
        destructive: ['text-destructive'],
        success: ['text-success'],
        warning: ['text-neutral-800'],
        info: ['text-primary'],
        secondary: ['text-muted-foreground'],
      },
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Alert description variants using class-variance-authority
 *
 * Provides styling for alert descriptions with proper text hierarchy.
 */
export const alertDescriptionVariants = cva(['text-sm'], {
  variants: {
    variant: {
      default: ['text-primary/80'],
      destructive: ['text-destructive/80'],
      success: ['text-success/80'],
      warning: ['text-neutral-700'],
      info: ['text-primary/80'],
      secondary: ['text-muted-foreground'],
    },
    size: {
      sm: ['text-xs'],
      default: ['text-sm'],
      lg: ['text-base'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Alert action variants using class-variance-authority
 *
 * Provides styling for alert actions and buttons.
 */
export const alertActionVariants = cva(['mt-3', 'flex', 'gap-2', 'flex-wrap'], {
  variants: {
    layout: {
      horizontal: ['flex-row', 'items-center'],
      vertical: ['flex-col', 'items-start'],
      inline: ['mt-1', 'inline-flex', 'items-center'],
    },
  },
  defaultVariants: {
    layout: 'horizontal',
  },
});

/**
 * Alert button variants using class-variance-authority
 *
 * Provides styling for alert action buttons with contextual colors.
 */
export const alertButtonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-xs',
    'font-medium',
    'ring-offset-white',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'px-3',
    'py-1.5',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary/90',
          'focus-visible:ring-primary/50',
        ],
        secondary: [
          'border',
          'border-border',
          'bg-background',
          'text-foreground',
          'hover:bg-muted',
          'focus-visible:ring-primary/50',
        ],
        destructive: [
          'bg-destructive',
          'text-destructive-foreground',
          'hover:bg-destructive/90',
          'focus-visible:ring-destructive/50',
        ],
        success: [
          'bg-success',
          'text-white',
          'hover:bg-success/90',
          'focus-visible:ring-success/50',
        ],
        warning: [
          'bg-warning',
          'text-neutral-800',
          'hover:bg-warning/90',
          'focus-visible:ring-warning/50',
        ],
        ghost: [
          'text-foreground',
          'hover:bg-muted',
          'focus-visible:ring-primary/50',
        ],
        link: [
          'text-primary',
          'underline-offset-4',
          'hover:underline',
          'focus-visible:ring-primary/50',
          'px-0',
          'py-0',
        ],
      },
      size: {
        sm: ['h-7', 'px-2', 'text-xs'],
        default: ['h-8', 'px-3', 'text-xs'],
        lg: ['h-9', 'px-4', 'text-sm'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
    },
  }
);

/**
 * Alert close button variants using class-variance-authority
 *
 * Provides styling for alert close/dismiss buttons.
 */
export const alertCloseVariants = cva(
  [
    'absolute',
    'right-2',
    'top-2',
    'rounded-sm',
    'opacity-70',
    'ring-offset-white',
    'transition-opacity',
    'hover:opacity-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:pointer-events-none',
    'h-6',
    'w-6',
    'flex',
    'items-center',
    'justify-center',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-blue-500',
          'hover:text-blue-700',
          'focus:ring-blue-500',
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
        secondary: [
          'text-gray-500',
          'hover:text-gray-700',
          'focus:ring-gray-500',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Recipe alert variants using class-variance-authority
 *
 * Specialized styling for recipe-specific alerts and notifications.
 */
export const recipeAlertVariants = cva(['border-l-4', 'pl-4', 'bg-white'], {
  variants: {
    type: {
      'recipe-saved': ['border-l-green-500', 'bg-green-50', 'text-green-900'],
      'recipe-published': ['border-l-blue-500', 'bg-blue-50', 'text-blue-900'],
      'recipe-shared': [
        'border-l-purple-500',
        'bg-purple-50',
        'text-purple-900',
      ],
      'recipe-imported': [
        'border-l-indigo-500',
        'bg-indigo-50',
        'text-indigo-900',
      ],
      'recipe-error': ['border-l-red-500', 'bg-red-50', 'text-red-900'],
      'cooking-tip': ['border-l-yellow-500', 'bg-yellow-50', 'text-yellow-900'],
      'nutritional-info': ['border-l-teal-500', 'bg-teal-50', 'text-teal-900'],
      'seasonal-suggestion': [
        'border-l-orange-500',
        'bg-orange-50',
        'text-orange-900',
      ],
    },
  },
  defaultVariants: {
    type: 'recipe-saved',
  },
});

/**
 * Toast alert variants using class-variance-authority
 *
 * Specialized styling for toast notifications with positioning and animations.
 */
export const toastAlertVariants = cva(
  [
    'fixed',
    'z-50',
    'flex',
    'w-full',
    'max-w-sm',
    'items-center',
    'space-x-4',
    'rounded-lg',
    'border',
    'p-4',
    'shadow-lg',
    'transition-all',
    'duration-300',
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-right-1/2',
    'data-[state=open]:slide-in-from-right-1/2',
  ],
  {
    variants: {
      variant: {
        default: ['bg-white', 'text-gray-900', 'border-gray-200'],
        destructive: ['bg-red-50', 'text-red-900', 'border-red-200'],
        success: ['bg-green-50', 'text-green-900', 'border-green-200'],
        warning: ['bg-yellow-50', 'text-yellow-900', 'border-yellow-200'],
        info: ['bg-blue-50', 'text-blue-900', 'border-blue-200'],
      },
      position: {
        'top-left': ['top-4', 'left-4'],
        'top-center': ['top-4', 'left-1/2', '-translate-x-1/2'],
        'top-right': ['top-4', 'right-4'],
        'bottom-left': ['bottom-4', 'left-4'],
        'bottom-center': ['bottom-4', 'left-1/2', '-translate-x-1/2'],
        'bottom-right': ['bottom-4', 'right-4'],
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
);

/**
 * Alert icon variants using class-variance-authority
 *
 * Provides styling for alert icons with contextual sizing and colors.
 */
export const alertIconVariants = cva(['flex-shrink-0'], {
  variants: {
    variant: {
      default: ['text-primary'],
      destructive: ['text-destructive'],
      success: ['text-success'],
      warning: ['text-warning'],
      info: ['text-primary'],
      secondary: ['text-muted-foreground'],
    },
    size: {
      sm: ['h-4', 'w-4'],
      default: ['h-5', 'w-5'],
      lg: ['h-6', 'w-6'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Banner alert variants using class-variance-authority
 *
 * Specialized styling for banner-style alerts that span full width.
 */
export const bannerAlertVariants = cva(
  [
    'w-full',
    'border-y',
    'px-4',
    'py-3',
    'text-center',
    'text-sm',
    'font-medium',
  ],
  {
    variants: {
      variant: {
        default: ['bg-blue-50', 'text-blue-900', 'border-blue-200'],
        destructive: ['bg-red-50', 'text-red-900', 'border-red-200'],
        success: ['bg-green-50', 'text-green-900', 'border-green-200'],
        warning: ['bg-yellow-50', 'text-yellow-900', 'border-yellow-200'],
        info: ['bg-blue-50', 'text-blue-900', 'border-blue-200'],
        maintenance: ['bg-orange-50', 'text-orange-900', 'border-orange-200'],
      },
      position: {
        top: ['border-t-0'],
        bottom: ['border-b-0'],
        middle: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'middle',
    },
  }
);

/**
 * Inline alert variants using class-variance-authority
 *
 * Specialized styling for compact inline alerts within forms or content.
 */
export const inlineAlertVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-2',
    'rounded',
    'px-2',
    'py-1',
    'text-xs',
    'font-medium',
  ],
  {
    variants: {
      variant: {
        default: ['bg-blue-100', 'text-blue-800'],
        destructive: ['bg-red-100', 'text-red-800'],
        success: ['bg-green-100', 'text-green-800'],
        warning: ['bg-yellow-100', 'text-yellow-800'],
        info: ['bg-blue-100', 'text-blue-800'],
        secondary: ['bg-gray-100', 'text-gray-800'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
