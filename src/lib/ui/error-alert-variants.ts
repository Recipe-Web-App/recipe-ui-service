/**
 * Error alert component variants using CVA (Class Variance Authority)
 *
 * This module defines the styling variants for the ErrorAlert component,
 * including container, icon, title, description, actions, and specialized layouts.
 */

import { cva } from 'class-variance-authority';

/**
 * Main error alert container variants
 */
export const errorAlertVariants = cva(
  'relative rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        inline: 'mb-4',
        banner: 'w-full rounded-none border-x-0 border-t-0',
        toast:
          'fixed shadow-lg z-50 max-w-md animate-in slide-in-from-bottom-4 fade-in',
        card: 'shadow-md',
      },
      severity: {
        error:
          'border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100',
        warning:
          'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100',
        info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-base',
        lg: 'p-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'inline',
      severity: 'error',
      size: 'md',
    },
  }
);

/**
 * Toast position variants
 */
export const errorAlertToastPositionVariants = cva('', {
  variants: {
    position: {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
});

/**
 * Error alert icon variants
 */
export const errorAlertIconVariants = cva(
  'flex-shrink-0 transition-colors duration-200',
  {
    variants: {
      severity: {
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-amber-600 dark:text-amber-400',
        info: 'text-blue-600 dark:text-blue-400',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      severity: 'error',
      size: 'md',
    },
  }
);

/**
 * Error alert title variants
 */
export const errorAlertTitleVariants = cva('font-semibold leading-tight', {
  variants: {
    severity: {
      error: 'text-red-900 dark:text-red-100',
      warning: 'text-amber-900 dark:text-amber-100',
      info: 'text-blue-900 dark:text-blue-100',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'md',
  },
});

/**
 * Error alert description variants
 */
export const errorAlertDescriptionVariants = cva('leading-relaxed', {
  variants: {
    severity: {
      error: 'text-red-700 dark:text-red-300',
      warning: 'text-amber-700 dark:text-amber-300',
      info: 'text-blue-700 dark:text-blue-300',
    },
    size: {
      sm: 'text-xs mt-0.5',
      md: 'text-sm mt-1',
      lg: 'text-base mt-1.5',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'md',
  },
});

/**
 * Error alert content wrapper variants
 */
export const errorAlertContentVariants = cva('flex gap-3', {
  variants: {
    withIcon: {
      true: '',
      false: '',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
    },
  },
  defaultVariants: {
    withIcon: true,
    align: 'start',
  },
});

/**
 * Error alert close button variants
 */
export const errorAlertCloseVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      severity: {
        error:
          'text-red-500 hover:bg-red-200 focus:ring-red-600 dark:text-red-400 dark:hover:bg-red-900/30 dark:focus:ring-red-500',
        warning:
          'text-amber-500 hover:bg-amber-200 focus:ring-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/30 dark:focus:ring-amber-500',
        info: 'text-blue-500 hover:bg-blue-200 focus:ring-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:focus:ring-blue-500',
      },
      size: {
        sm: 'h-6 w-6 p-1',
        md: 'h-8 w-8 p-1.5',
        lg: 'h-10 w-10 p-2',
      },
    },
    defaultVariants: {
      severity: 'error',
      size: 'md',
    },
  }
);

/**
 * Error alert actions container variants
 */
export const errorAlertActionsVariants = cva('flex gap-2', {
  variants: {
    size: {
      sm: 'mt-2',
      md: 'mt-3',
      lg: 'mt-4',
    },
    layout: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-stretch',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'horizontal',
  },
});

/**
 * Error alert action button variants
 */
export const errorAlertActionButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      severity: {
        error: 'focus:ring-red-600 dark:focus:ring-red-500',
        warning: 'focus:ring-amber-600 dark:focus:ring-amber-500',
        info: 'focus:ring-blue-600 dark:focus:ring-blue-500',
      },
      variant: {
        primary:
          'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200',
        secondary:
          'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        outline:
          'border border-current bg-transparent hover:bg-current/10 dark:hover:bg-current/20',
        ghost: 'bg-transparent hover:bg-current/10 dark:hover:bg-current/20',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      severity: 'error',
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Error list container variants
 */
export const errorAlertListVariants = cva('space-y-1.5', {
  variants: {
    size: {
      sm: 'mt-2',
      md: 'mt-3',
      lg: 'mt-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/**
 * Individual error item variants
 */
export const errorAlertItemVariants = cva(
  'flex items-start gap-2 rounded-md p-2 transition-colors',
  {
    variants: {
      severity: {
        error:
          'bg-red-100/50 text-red-800 dark:bg-red-900/20 dark:text-red-200',
        warning:
          'bg-amber-100/50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200',
        info: 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      severity: 'error',
      size: 'md',
    },
  }
);

/**
 * Error field label variants
 */
export const errorAlertFieldLabelVariants = cva('font-medium', {
  variants: {
    severity: {
      error: 'text-red-900 dark:text-red-100',
      warning: 'text-amber-900 dark:text-amber-100',
      info: 'text-blue-900 dark:text-blue-100',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'md',
  },
});

/**
 * Collapse toggle button variants
 */
export const errorAlertCollapseToggleVariants = cva(
  'inline-flex items-center gap-1.5 font-medium underline-offset-2 hover:underline transition-colors',
  {
    variants: {
      severity: {
        error:
          'text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200',
        warning:
          'text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200',
        info: 'text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      severity: 'error',
      size: 'md',
    },
  }
);

/**
 * Error hint text variants
 */
export const errorAlertHintVariants = cva('italic', {
  variants: {
    severity: {
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
      info: 'text-blue-600 dark:text-blue-400',
    },
    size: {
      sm: 'text-xs mt-1.5',
      md: 'text-sm mt-2',
      lg: 'text-base mt-2.5',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'md',
  },
});
