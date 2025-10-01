import { cva } from 'class-variance-authority';

/**
 * Service error boundary container variants
 */
export const serviceErrorBoundaryVariants = cva(
  'rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        inline: 'p-3 text-sm',
        card: 'p-6 shadow-sm',
        page: 'min-h-[400px] p-8 text-center',
      },
      severity: {
        warning:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        critical:
          'border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900',
      },
      healthStatus: {
        healthy:
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        degraded:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        unhealthy:
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        offline:
          'border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900',
        maintenance:
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
      },
    },
    defaultVariants: {
      variant: 'card',
      severity: 'error',
      healthStatus: 'unhealthy',
    },
  }
);

/**
 * Service error header variants
 */
export const serviceErrorHeaderVariants = cva('mb-4', {
  variants: {
    variant: {
      inline: 'mb-2',
      card: 'mb-4',
      page: 'mb-6',
    },
  },
  defaultVariants: {
    variant: 'card',
  },
});

/**
 * Service error title variants
 */
export const serviceErrorTitleVariants = cva('font-semibold', {
  variants: {
    variant: {
      inline: 'text-sm',
      card: 'text-lg',
      page: 'text-2xl',
    },
    severity: {
      warning: 'text-yellow-900 dark:text-yellow-100',
      error: 'text-red-900 dark:text-red-100',
      critical: 'text-red-950 dark:text-red-50',
    },
  },
  defaultVariants: {
    variant: 'card',
    severity: 'error',
  },
});

/**
 * Service error description variants
 */
export const serviceErrorDescriptionVariants = cva('', {
  variants: {
    variant: {
      inline: 'text-xs mt-1',
      card: 'text-sm mt-2',
      page: 'text-base mt-3 max-w-md mx-auto',
    },
    severity: {
      warning: 'text-yellow-700 dark:text-yellow-300',
      error: 'text-red-700 dark:text-red-300',
      critical: 'text-red-800 dark:text-red-200',
    },
  },
  defaultVariants: {
    variant: 'card',
    severity: 'error',
  },
});

/**
 * Service status indicator variants
 */
export const serviceStatusIndicatorVariants = cva(
  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium',
  {
    variants: {
      status: {
        healthy:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        degraded:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        unhealthy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        offline:
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        maintenance:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      },
    },
    defaultVariants: {
      status: 'unhealthy',
    },
  }
);

/**
 * Service status dot variants
 */
export const serviceStatusDotVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    status: {
      healthy: 'bg-green-500 animate-pulse',
      degraded: 'bg-yellow-500 animate-pulse',
      unhealthy: 'bg-red-500',
      offline: 'bg-gray-400',
      maintenance: 'bg-blue-500',
    },
  },
  defaultVariants: {
    status: 'unhealthy',
  },
});

/**
 * Retry info container variants
 */
export const retryInfoVariants = cva('mt-3 rounded-md p-3', {
  variants: {
    variant: {
      inline: 'text-xs',
      card: 'text-sm',
      page: 'text-base max-w-md mx-auto',
    },
    retryable: {
      true: 'bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800',
      false:
        'bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-700',
    },
  },
  defaultVariants: {
    variant: 'card',
    retryable: true,
  },
});

/**
 * Service error actions container variants
 */
export const serviceErrorActionsVariants = cva('flex gap-3', {
  variants: {
    variant: {
      inline: 'mt-2 flex-col sm:flex-row',
      card: 'mt-4 flex-col sm:flex-row',
      page: 'mt-6 flex-col sm:flex-row justify-center',
    },
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    variant: 'card',
    layout: 'horizontal',
  },
});

/**
 * Service error button variants
 */
export const serviceErrorButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        inline: 'px-3 py-1.5 text-xs',
        card: 'px-4 py-2 text-sm',
        page: 'px-6 py-3 text-base',
      },
      intent: {
        primary:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-600',
        secondary:
          'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-600 dark:border-red-700 dark:bg-gray-900 dark:text-red-300 dark:hover:bg-gray-800',
        ghost:
          'text-red-700 hover:bg-red-100 focus-visible:ring-red-600 dark:text-red-300 dark:hover:bg-red-950',
      },
    },
    defaultVariants: {
      variant: 'card',
      intent: 'primary',
    },
  }
);

/**
 * Network status indicator variants
 */
export const networkStatusIndicatorVariants = cva(
  'inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      online: {
        true: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        false: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      },
    },
    defaultVariants: {
      online: true,
    },
  }
);
