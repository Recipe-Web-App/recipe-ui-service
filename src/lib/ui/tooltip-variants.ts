import { cva } from 'class-variance-authority';

/**
 * Tooltip content variants using class-variance-authority
 *
 * Provides styling for tooltip content containers with contextual help information.
 */
export const tooltipContentVariants = cva(
  [
    'z-50',
    'overflow-hidden',
    'rounded-md',
    'border',
    'px-3',
    'py-1.5',
    'text-sm',
    'shadow-md',
    'animate-in',
    'fade-in-0',
    'zoom-in-95',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      variant: {
        default: ['bg-gray-900', 'text-gray-50', 'border-gray-800'],
        light: ['bg-white', 'text-gray-900', 'border-gray-200', 'shadow-lg'],
        accent: ['bg-blue-900', 'text-blue-50', 'border-blue-800'],
        success: ['bg-green-900', 'text-green-50', 'border-green-800'],
        warning: ['bg-yellow-900', 'text-yellow-50', 'border-yellow-800'],
        error: ['bg-red-900', 'text-red-50', 'border-red-800'],
        info: ['bg-blue-900', 'text-blue-50', 'border-blue-800'],
      },
      size: {
        sm: ['px-2', 'py-1', 'text-xs', 'max-w-[200px]'],
        default: ['px-3', 'py-1.5', 'text-sm', 'max-w-[300px]'],
        lg: ['px-4', 'py-2', 'text-base', 'max-w-[400px]'],
        xl: ['px-4', 'py-3', 'text-base', 'max-w-[500px]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Tooltip arrow variants using class-variance-authority
 *
 * Provides styling for tooltip arrows that point to the trigger element.
 */
export const tooltipArrowVariants = cva(['fill-current'], {
  variants: {
    variant: {
      default: ['text-gray-900'],
      light: ['text-white'],
      accent: ['text-blue-900'],
      success: ['text-green-900'],
      warning: ['text-yellow-900'],
      error: ['text-red-900'],
      info: ['text-blue-900'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Tooltip trigger variants using class-variance-authority
 *
 * Provides styling for elements that trigger tooltips on hover/focus.
 */
export const tooltipTriggerVariants = cva(
  [
    'cursor-help',
    'transition-colors',
    'duration-200',
    'outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-blue-500',
    'focus-visible:ring-offset-2',
    'rounded-sm',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-gray-600',
          'hover:text-gray-900',
          'focus-visible:text-gray-900',
        ],
        subtle: [
          'text-gray-500',
          'hover:text-gray-700',
          'focus-visible:text-gray-700',
        ],
        accent: [
          'text-blue-600',
          'hover:text-blue-800',
          'focus-visible:text-blue-800',
        ],
        cooking: [
          'text-orange-600',
          'hover:text-orange-800',
          'focus-visible:text-orange-800',
          'underline',
          'decoration-dotted',
          'underline-offset-2',
        ],
        term: [
          'text-purple-600',
          'hover:text-purple-800',
          'focus-visible:text-purple-800',
          'border-b',
          'border-dotted',
          'border-purple-400',
        ],
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
 * Icon tooltip variants for icon-only triggers
 *
 * Provides styling for icon elements that show tooltips.
 */
export const iconTooltipVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'transition-all',
    'duration-200',
    'cursor-help',
    'outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-blue-500',
    'focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-gray-500',
          'hover:text-gray-700',
          'hover:bg-gray-100',
          'focus-visible:text-gray-700',
          'focus-visible:bg-gray-100',
        ],
        subtle: [
          'text-gray-400',
          'hover:text-gray-600',
          'hover:bg-gray-50',
          'focus-visible:text-gray-600',
          'focus-visible:bg-gray-50',
        ],
        accent: [
          'text-blue-500',
          'hover:text-blue-700',
          'hover:bg-blue-50',
          'focus-visible:text-blue-700',
          'focus-visible:bg-blue-50',
        ],
        success: [
          'text-green-500',
          'hover:text-green-700',
          'hover:bg-green-50',
          'focus-visible:text-green-700',
          'focus-visible:bg-green-50',
        ],
        warning: [
          'text-yellow-500',
          'hover:text-yellow-700',
          'hover:bg-yellow-50',
          'focus-visible:text-yellow-700',
          'focus-visible:bg-yellow-50',
        ],
        error: [
          'text-red-500',
          'hover:text-red-700',
          'hover:bg-red-50',
          'focus-visible:text-red-700',
          'focus-visible:bg-red-50',
        ],
      },
      size: {
        sm: ['h-4', 'w-4', 'p-0.5'],
        default: ['h-5', 'w-5', 'p-1'],
        lg: ['h-6', 'w-6', 'p-1.5'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
