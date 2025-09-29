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
    'bg-card',
    'text-card-foreground',
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
        default: [
          'border-border',
          'bg-card',
          'text-card-foreground',
          'shadow-lg',
        ],
        destructive: [
          'border-destructive/20',
          'bg-destructive/10',
          'text-destructive',
          'dark:bg-destructive/5',
          'dark:border-destructive/15',
        ],
        success: [
          'border-success/20',
          'bg-success/10',
          'text-success',
          'dark:bg-success/5',
          'dark:border-success/15',
        ],
        warning: [
          'border-warning/30',
          'bg-warning/10',
          'text-neutral-800',
          'dark:bg-warning/5',
          'dark:border-warning/15',
          'dark:text-warning',
        ],
        info: [
          'border-primary/20',
          'bg-primary/10',
          'text-primary',
          'dark:bg-primary/5',
          'dark:border-primary/15',
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
        destructive: ['text-destructive'],
        success: ['text-success'],
        warning: ['text-neutral-800', 'dark:text-warning'],
        info: ['text-primary'],
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
        default: ['text-foreground'],
        destructive: ['text-destructive'],
        success: ['text-success'],
        warning: ['text-neutral-800', 'dark:text-warning'],
        info: ['text-primary'],
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
export const dialogDescriptionVariants = cva(
  ['text-sm', 'text-muted-foreground'],
  {
    variants: {
      variant: {
        default: ['text-muted-foreground'],
        destructive: ['text-destructive/80'],
        success: ['text-success/80'],
        warning: ['text-neutral-700', 'dark:text-warning/80'],
        info: ['text-primary/80'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

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
    'ring-offset-background',
    'transition-opacity',
    'hover:opacity-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-2',
    'disabled:pointer-events-none',
    'data-[state=open]:bg-muted',
    'data-[state=open]:text-muted-foreground',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-muted-foreground',
          'hover:text-foreground',
          'focus:ring-ring',
        ],
        destructive: [
          'text-destructive',
          'hover:text-destructive/80',
          'focus:ring-destructive',
        ],
        success: [
          'text-success',
          'hover:text-success/80',
          'focus:ring-success',
        ],
        warning: [
          'text-warning',
          'hover:text-warning/80',
          'focus:ring-warning',
        ],
        info: ['text-primary', 'hover:text-primary/80', 'focus:ring-primary'],
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
      delete: [
        'border-destructive/20',
        'bg-destructive/10',
        'text-destructive',
      ],
      save: ['border-success/20', 'bg-success/10', 'text-success'],
      discard: [
        'border-warning/30',
        'bg-warning/10',
        'text-neutral-800',
        'dark:text-warning',
      ],
      publish: ['border-primary/20', 'bg-primary/10', 'text-primary'],
      archive: ['border-border', 'bg-muted', 'text-muted-foreground'],
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
        default: ['bg-muted', 'text-muted-foreground'],
        destructive: ['bg-destructive/10', 'text-destructive'],
        success: ['bg-success/10', 'text-success'],
        warning: ['bg-warning/10', 'text-warning'],
        info: ['bg-primary/10', 'text-primary'],
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
      'delete-recipe': [
        'border-l-destructive',
        'bg-destructive/10',
        'text-destructive',
      ],
      'save-recipe': ['border-l-success', 'bg-success/10', 'text-success'],
      'publish-recipe': ['border-l-primary', 'bg-primary/10', 'text-primary'],
      'share-recipe': [
        'border-l-secondary',
        'bg-secondary/10',
        'text-secondary-foreground',
      ],
      'export-recipe': [
        'border-l-warning',
        'bg-warning/10',
        'text-neutral-800',
        'dark:text-warning',
      ],
      'duplicate-recipe': [
        'border-l-primary',
        'bg-primary/5',
        'text-primary/80',
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
    'ring-offset-background',
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
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary/90',
          'focus-visible:ring-primary',
        ],
        destructive: [
          'bg-destructive',
          'text-destructive-foreground',
          'hover:bg-destructive/90',
          'focus-visible:ring-destructive',
        ],
        success: [
          'bg-success',
          'text-white',
          'hover:bg-success/90',
          'focus-visible:ring-success',
        ],
        secondary: [
          'border',
          'border-border',
          'bg-background',
          'text-foreground',
          'hover:bg-muted',
          'focus-visible:ring-ring',
        ],
        ghost: ['text-foreground', 'hover:bg-muted', 'focus-visible:ring-ring'],
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
