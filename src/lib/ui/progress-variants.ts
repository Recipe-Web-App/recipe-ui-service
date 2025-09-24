import { cva } from 'class-variance-authority';

/**
 * Progress container variants using class-variance-authority
 *
 * Provides styling for progress bar containers with consistent sizing and layout.
 */
export const progressVariants = cva(
  [
    'relative',
    'w-full',
    'overflow-hidden',
    'rounded-full',
    'bg-gray-200',
    'transition-all',
    'duration-300',
  ],
  {
    variants: {
      size: {
        xs: ['h-1'],
        sm: ['h-2'],
        default: ['h-3'],
        lg: ['h-4'],
        xl: ['h-6'],
        '2xl': ['h-8'],
      },
      variant: {
        default: ['bg-gray-200'],
        subtle: ['bg-gray-100'],
        outlined: ['bg-transparent', 'border', 'border-gray-300'],
        elevated: ['bg-gray-200', 'shadow-sm'],
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Progress bar variants using class-variance-authority
 *
 * Provides styling for the actual progress bar with different states and colors.
 */
export const progressBarVariants = cva(
  ['h-full', 'rounded-full', 'transition-all', 'duration-500', 'ease-out'],
  {
    variants: {
      variant: {
        default: ['bg-blue-600'],
        success: ['bg-green-600'],
        warning: ['bg-yellow-500'],
        error: ['bg-red-600'],
        info: ['bg-blue-500'],
        cooking: ['bg-orange-500'],
        upload: ['bg-blue-600'],
        download: ['bg-purple-600'],
      },
      animation: {
        none: [],
        pulse: ['animate-pulse'],
        shimmer: [
          'bg-gradient-to-r',
          'from-current',
          'via-white/20',
          'to-current',
          'bg-[length:200%_100%]',
          'animate-[shimmer_2s_infinite]',
        ],
        glow: [
          'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
          'animate-[glow_2s_ease-in-out_infinite_alternate]',
        ],
      },
      state: {
        active: [],
        paused: ['opacity-75'],
        completed: ['bg-green-600'],
        error: ['bg-red-600'],
      },
    },
    defaultVariants: {
      variant: 'default',
      animation: 'none',
      state: 'active',
    },
  }
);

/**
 * Progress label variants using class-variance-authority
 *
 * Provides styling for progress labels and percentage displays.
 */
export const progressLabelVariants = cva(
  [
    'text-sm',
    'font-medium',
    'text-gray-700',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      position: {
        above: ['mb-2'],
        below: ['mt-2'],
        inline: [
          'absolute',
          'inset-0',
          'flex',
          'items-center',
          'justify-center',
        ],
        side: ['flex', 'items-center', 'justify-between', 'mb-2'],
      },
      size: {
        xs: ['text-xs'],
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
        xl: ['text-lg'],
        '2xl': ['text-xl'],
      },
      variant: {
        default: ['text-gray-700'],
        light: ['text-white'],
        dark: ['text-gray-900'],
        contrast: ['text-white', 'font-semibold', 'drop-shadow-sm'],
      },
    },
    defaultVariants: {
      position: 'above',
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Cooking progress step variants using class-variance-authority
 *
 * Provides styling for multi-step cooking progress indicators.
 */
export const cookingStepVariants = cva(
  [
    'flex',
    'items-center',
    'gap-3',
    'p-3',
    'rounded-lg',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      state: {
        pending: ['bg-gray-50', 'text-gray-600'],
        active: [
          'bg-orange-50',
          'text-orange-900',
          'border',
          'border-orange-200',
        ],
        completed: ['bg-green-50', 'text-green-900'],
        skipped: ['bg-gray-50', 'text-gray-400'],
      },
      size: {
        sm: ['p-2', 'gap-2'],
        default: ['p-3', 'gap-3'],
        lg: ['p-4', 'gap-4'],
      },
    },
    defaultVariants: {
      state: 'pending',
      size: 'default',
    },
  }
);

/**
 * Cooking step indicator variants using class-variance-authority
 *
 * Provides styling for step number indicators in cooking progress.
 */
export const stepIndicatorVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-semibold',
    'flex-shrink-0',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      state: {
        pending: ['bg-gray-200', 'text-gray-600'],
        active: ['bg-orange-500', 'text-white', 'shadow-md'],
        completed: ['bg-green-500', 'text-white'],
        skipped: ['bg-gray-100', 'text-gray-400'],
      },
      size: {
        sm: ['h-6', 'w-6', 'text-xs'],
        default: ['h-8', 'w-8', 'text-sm'],
        lg: ['h-10', 'w-10', 'text-base'],
      },
    },
    defaultVariants: {
      state: 'pending',
      size: 'default',
    },
  }
);

/**
 * Upload progress variants using class-variance-authority
 *
 * Provides styling for file upload progress indicators.
 */
export const uploadProgressVariants = cva(
  ['border', 'rounded-lg', 'p-4', 'transition-all', 'duration-200'],
  {
    variants: {
      state: {
        uploading: ['border-blue-200', 'bg-blue-50'],
        completed: ['border-green-200', 'bg-green-50'],
        error: ['border-red-200', 'bg-red-50'],
        paused: ['border-yellow-200', 'bg-yellow-50'],
      },
      variant: {
        default: [],
        compact: ['p-2'],
        detailed: ['p-6'],
      },
    },
    defaultVariants: {
      state: 'uploading',
      variant: 'default',
    },
  }
);

/**
 * Timer progress variants using class-variance-authority
 *
 * Provides styling for cooking timers and countdown indicators.
 */
export const timerProgressVariants = cva(
  [
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'border-4',
    'transition-all',
    'duration-300',
  ],
  {
    variants: {
      state: {
        running: ['border-orange-500', 'text-orange-900'],
        paused: ['border-yellow-500', 'text-yellow-900'],
        completed: ['border-green-500', 'text-green-900'],
        warning: ['border-red-500', 'text-red-900', 'animate-pulse'],
      },
      size: {
        sm: ['h-16', 'w-16', 'text-sm'],
        default: ['h-24', 'w-24', 'text-lg'],
        lg: ['h-32', 'w-32', 'text-xl'],
        xl: ['h-40', 'w-40', 'text-2xl'],
      },
    },
    defaultVariants: {
      state: 'running',
      size: 'default',
    },
  }
);
