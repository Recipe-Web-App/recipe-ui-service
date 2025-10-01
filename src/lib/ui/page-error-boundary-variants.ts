import { cva } from 'class-variance-authority';

/**
 * Page error boundary container variants
 */
export const pageErrorBoundaryVariants = cva(
  'flex min-h-screen flex-col items-center justify-center px-4 py-16 transition-all duration-300',
  {
    variants: {
      errorType: {
        'not-found':
          'bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900',
        unauthorized:
          'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900',
        forbidden:
          'bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900',
        'server-error':
          'bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900',
        'service-unavailable':
          'bg-gradient-to-b from-orange-50 to-white dark:from-orange-950 dark:to-gray-900',
        maintenance:
          'bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900',
        timeout:
          'bg-gradient-to-b from-orange-50 to-white dark:from-orange-950 dark:to-gray-900',
        gone: 'bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900',
        'bad-request':
          'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900',
        unknown:
          'bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900',
      },
    },
    defaultVariants: {
      errorType: 'unknown',
    },
  }
);

/**
 * Page error content container variants
 */
export const pageErrorContentVariants = cva(
  'w-full max-w-2xl text-center space-y-8',
  {
    variants: {
      animated: {
        true: 'animate-in fade-in-50 slide-in-from-bottom-4 duration-500',
        false: '',
      },
    },
    defaultVariants: {
      animated: true,
    },
  }
);

/**
 * Page error status code variants
 */
export const pageErrorStatusCodeVariants = cva(
  'font-mono font-bold tracking-tight',
  {
    variants: {
      errorType: {
        'not-found': 'text-blue-600 dark:text-blue-400',
        unauthorized: 'text-yellow-600 dark:text-yellow-400',
        forbidden: 'text-red-600 dark:text-red-400',
        'server-error': 'text-red-600 dark:text-red-400',
        'service-unavailable': 'text-orange-600 dark:text-orange-400',
        maintenance: 'text-blue-600 dark:text-blue-400',
        timeout: 'text-orange-600 dark:text-orange-400',
        gone: 'text-gray-600 dark:text-gray-400',
        'bad-request': 'text-yellow-600 dark:text-yellow-400',
        unknown: 'text-gray-600 dark:text-gray-400',
      },
      size: {
        sm: 'text-6xl',
        md: 'text-8xl',
        lg: 'text-9xl',
      },
    },
    defaultVariants: {
      errorType: 'unknown',
      size: 'md',
    },
  }
);

/**
 * Page error title variants
 */
export const pageErrorTitleVariants = cva('font-bold tracking-tight', {
  variants: {
    errorType: {
      'not-found': 'text-gray-900 dark:text-gray-100',
      unauthorized: 'text-gray-900 dark:text-gray-100',
      forbidden: 'text-gray-900 dark:text-gray-100',
      'server-error': 'text-gray-900 dark:text-gray-100',
      'service-unavailable': 'text-gray-900 dark:text-gray-100',
      maintenance: 'text-gray-900 dark:text-gray-100',
      timeout: 'text-gray-900 dark:text-gray-100',
      gone: 'text-gray-900 dark:text-gray-100',
      'bad-request': 'text-gray-900 dark:text-gray-100',
      unknown: 'text-gray-900 dark:text-gray-100',
    },
    size: {
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl',
    },
  },
  defaultVariants: {
    errorType: 'unknown',
    size: 'md',
  },
});

/**
 * Page error description variants
 */
export const pageErrorDescriptionVariants = cva('mx-auto max-w-prose', {
  variants: {
    errorType: {
      'not-found': 'text-gray-600 dark:text-gray-400',
      unauthorized: 'text-gray-600 dark:text-gray-400',
      forbidden: 'text-gray-600 dark:text-gray-400',
      'server-error': 'text-gray-600 dark:text-gray-400',
      'service-unavailable': 'text-gray-600 dark:text-gray-400',
      maintenance: 'text-gray-600 dark:text-gray-400',
      timeout: 'text-gray-600 dark:text-gray-400',
      gone: 'text-gray-600 dark:text-gray-400',
      'bad-request': 'text-gray-600 dark:text-gray-400',
      unknown: 'text-gray-600 dark:text-gray-400',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    errorType: 'unknown',
    size: 'md',
  },
});

/**
 * Page error icon container variants
 */
export const pageErrorIconVariants = cva('mx-auto mb-6', {
  variants: {
    errorType: {
      'not-found': 'text-blue-500 dark:text-blue-400',
      unauthorized: 'text-yellow-500 dark:text-yellow-400',
      forbidden: 'text-red-500 dark:text-red-400',
      'server-error': 'text-red-500 dark:text-red-400',
      'service-unavailable': 'text-orange-500 dark:text-orange-400',
      maintenance: 'text-blue-500 dark:text-blue-400',
      timeout: 'text-orange-500 dark:text-orange-400',
      gone: 'text-gray-500 dark:text-gray-400',
      'bad-request': 'text-yellow-500 dark:text-yellow-400',
      unknown: 'text-gray-500 dark:text-gray-400',
    },
    size: {
      sm: 'h-16 w-16',
      md: 'h-24 w-24',
      lg: 'h-32 w-32',
    },
  },
  defaultVariants: {
    errorType: 'unknown',
    size: 'md',
  },
});

/**
 * Page error actions container variants
 */
export const pageErrorActionsVariants = cva(
  'flex flex-wrap items-center justify-center gap-4',
  {
    variants: {
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
    },
  }
);

/**
 * Page error button variants
 */
export const pageErrorButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary:
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600',
        secondary:
          'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 dark:bg-red-700 dark:hover:bg-red-600',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600 dark:bg-green-700 dark:hover:bg-green-600',
        ghost:
          'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);

/**
 * Page error details container variants
 */
export const pageErrorDetailsVariants = cva(
  'mx-auto mt-8 max-w-2xl rounded-lg border p-6 text-left',
  {
    variants: {
      errorType: {
        'not-found':
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        unauthorized:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        forbidden:
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        'server-error':
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        'service-unavailable':
          'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
        maintenance:
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        timeout:
          'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
        gone: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950',
        'bad-request':
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        unknown:
          'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950',
      },
    },
    defaultVariants: {
      errorType: 'unknown',
    },
  }
);

/**
 * Page error details title variants
 */
export const pageErrorDetailsTitleVariants = cva('mb-3 font-semibold', {
  variants: {
    errorType: {
      'not-found': 'text-blue-900 dark:text-blue-100',
      unauthorized: 'text-yellow-900 dark:text-yellow-100',
      forbidden: 'text-red-900 dark:text-red-100',
      'server-error': 'text-red-900 dark:text-red-100',
      'service-unavailable': 'text-orange-900 dark:text-orange-100',
      maintenance: 'text-blue-900 dark:text-blue-100',
      timeout: 'text-orange-900 dark:text-orange-100',
      gone: 'text-gray-900 dark:text-gray-100',
      'bad-request': 'text-yellow-900 dark:text-yellow-100',
      unknown: 'text-gray-900 dark:text-gray-100',
    },
  },
  defaultVariants: {
    errorType: 'unknown',
  },
});

/**
 * Page error details text variants
 */
export const pageErrorDetailsTextVariants = cva('font-mono text-sm', {
  variants: {
    errorType: {
      'not-found': 'text-blue-700 dark:text-blue-300',
      unauthorized: 'text-yellow-700 dark:text-yellow-300',
      forbidden: 'text-red-700 dark:text-red-300',
      'server-error': 'text-red-700 dark:text-red-300',
      'service-unavailable': 'text-orange-700 dark:text-orange-300',
      maintenance: 'text-blue-700 dark:text-blue-300',
      timeout: 'text-orange-700 dark:text-orange-300',
      gone: 'text-gray-700 dark:text-gray-300',
      'bad-request': 'text-yellow-700 dark:text-yellow-300',
      unknown: 'text-gray-700 dark:text-gray-300',
    },
  },
  defaultVariants: {
    errorType: 'unknown',
  },
});

/**
 * Retry countdown variants
 */
export const retryCountdownVariants = cva(
  'mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
  {
    variants: {
      errorType: {
        'not-found':
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        unauthorized:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        forbidden: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        'server-error':
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        'service-unavailable':
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        maintenance:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        timeout:
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        gone: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
        'bad-request':
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        unknown:
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
      },
    },
    defaultVariants: {
      errorType: 'unknown',
    },
  }
);
