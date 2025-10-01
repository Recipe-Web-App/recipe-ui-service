import { cva } from 'class-variance-authority';

/**
 * Component error boundary container variants
 */
export const componentErrorBoundaryVariants = cva(
  'rounded-md transition-all duration-200',
  {
    variants: {
      fallbackMode: {
        skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700',
        placeholder:
          'border-2 border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800',
        hidden: 'hidden',
        minimal:
          'border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-950',
        detailed:
          'border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950',
      },
      severity: {
        critical: 'border-red-300 dark:border-red-700',
        error: 'border-red-200 dark:border-red-800',
        warning: 'border-yellow-200 dark:border-yellow-800',
        info: 'border-blue-200 dark:border-blue-800',
      },
    },
    defaultVariants: {
      fallbackMode: 'skeleton',
      severity: 'error',
    },
  }
);

/**
 * Component error skeleton variants
 */
export const componentErrorSkeletonVariants = cva('animate-pulse rounded', {
  variants: {
    variant: {
      rectangular: 'bg-gray-200 dark:bg-gray-700',
      circular: 'rounded-full bg-gray-200 dark:bg-gray-700',
      text: 'h-4 bg-gray-200 dark:bg-gray-700',
    },
    animation: {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'rectangular',
    animation: 'pulse',
  },
});

/**
 * Component error placeholder variants
 */
export const componentErrorPlaceholderVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'min-h-[80px] gap-1',
        md: 'min-h-[120px] gap-2',
        lg: 'min-h-[200px] gap-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Component error placeholder icon variants
 */
export const componentErrorPlaceholderIconVariants = cva(
  'text-gray-400 dark:text-gray-500',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Component error placeholder title variants
 */
export const componentErrorPlaceholderTitleVariants = cva(
  'font-medium text-gray-600 dark:text-gray-400',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Component error placeholder description variants
 */
export const componentErrorPlaceholderDescriptionVariants = cva(
  'text-gray-500 dark:text-gray-500',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Component error minimal message variants
 */
export const componentErrorMinimalVariants = cva(
  'flex items-center gap-2 text-sm',
  {
    variants: {
      severity: {
        critical: 'text-red-800 dark:text-red-200',
        error: 'text-red-700 dark:text-red-300',
        warning: 'text-yellow-700 dark:text-yellow-300',
        info: 'text-blue-700 dark:text-blue-300',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  }
);

/**
 * Component error detailed message variants
 */
export const componentErrorDetailedVariants = cva('space-y-3', {
  variants: {
    severity: {
      critical: '',
      error: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

/**
 * Component error header variants
 */
export const componentErrorHeaderVariants = cva(
  'flex items-center justify-between',
  {
    variants: {
      severity: {
        critical: '',
        error: '',
        warning: '',
        info: '',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  }
);

/**
 * Component error title variants
 */
export const componentErrorTitleVariants = cva('font-semibold', {
  variants: {
    severity: {
      critical: 'text-red-900 dark:text-red-100',
      error: 'text-red-800 dark:text-red-200',
      warning: 'text-yellow-800 dark:text-yellow-200',
      info: 'text-blue-800 dark:text-blue-200',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'sm',
  },
});

/**
 * Component error description variants
 */
export const componentErrorDescriptionVariants = cva('', {
  variants: {
    severity: {
      critical: 'text-red-700 dark:text-red-300',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'sm',
  },
});

/**
 * Component error badge variants
 */
export const componentErrorBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      severity: {
        critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
        warning:
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  }
);

/**
 * Component error actions container variants
 */
export const componentErrorActionsVariants = cva('flex gap-2', {
  variants: {
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    size: {
      sm: 'mt-2',
      md: 'mt-3',
      lg: 'mt-4',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    size: 'sm',
  },
});

/**
 * Component error button variants
 */
export const componentErrorButtonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-600',
        secondary:
          'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-600 dark:border-red-700 dark:bg-gray-900 dark:text-red-300 dark:hover:bg-gray-800',
        ghost:
          'text-red-700 hover:bg-red-100 focus-visible:ring-red-600 dark:text-red-300 dark:hover:bg-red-950',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'sm',
    },
  }
);

/**
 * Component error details panel variants
 */
export const componentErrorDetailsVariants = cva('mt-3 rounded-md border p-3', {
  variants: {
    severity: {
      critical: 'border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900',
      error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
      warning:
        'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
      info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

/**
 * Component error details title variants
 */
export const componentErrorDetailsTitleVariants = cva(
  'mb-2 text-xs font-semibold',
  {
    variants: {
      severity: {
        critical: 'text-red-900 dark:text-red-100',
        error: 'text-red-800 dark:text-red-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
        info: 'text-blue-800 dark:text-blue-200',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  }
);

/**
 * Component error details text variants
 */
export const componentErrorDetailsTextVariants = cva('font-mono text-xs', {
  variants: {
    severity: {
      critical: 'text-red-700 dark:text-red-300',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
    },
  },
  defaultVariants: {
    severity: 'error',
  },
});

/**
 * Retry countdown variants
 */
export const componentRetryCountdownVariants = cva(
  'mt-2 inline-flex items-center gap-1.5 text-xs',
  {
    variants: {
      severity: {
        critical: 'text-red-700 dark:text-red-300',
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  }
);

/**
 * Component error icon variants
 */
export const componentErrorIconVariants = cva('', {
  variants: {
    severity: {
      critical: 'text-red-600 dark:text-red-400',
      error: 'text-red-500 dark:text-red-500',
      warning: 'text-yellow-500 dark:text-yellow-500',
      info: 'text-blue-500 dark:text-blue-500',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    severity: 'error',
    size: 'sm',
  },
});
