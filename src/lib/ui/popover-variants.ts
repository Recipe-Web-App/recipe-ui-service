import { cva } from 'class-variance-authority';

/**
 * Popover content variants using class-variance-authority
 *
 * Provides styling for popover content containers with contextual information.
 */
export const popoverContentVariants = cva(
  [
    'relative',
    'z-50',
    'rounded-md',
    'border',
    'shadow-md',
    'outline-none',
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
        default: [
          'bg-white',
          'text-gray-900',
          'border-gray-200',
          'dark:bg-gray-900',
          'dark:text-gray-100',
          'dark:border-gray-800',
        ],
        light: [
          'bg-white',
          'text-gray-900',
          'border-gray-200',
          'shadow-lg',
          'dark:bg-gray-950',
          'dark:text-gray-100',
          'dark:border-gray-800',
        ],
        accent: [
          'bg-blue-50',
          'text-blue-900',
          'border-blue-200',
          'dark:bg-blue-950',
          'dark:text-blue-100',
          'dark:border-blue-800',
        ],
        success: [
          'bg-green-50',
          'text-green-900',
          'border-green-200',
          'dark:bg-green-950',
          'dark:text-green-100',
          'dark:border-green-800',
        ],
        warning: [
          'bg-yellow-50',
          'text-yellow-900',
          'border-yellow-200',
          'dark:bg-yellow-950',
          'dark:text-yellow-100',
          'dark:border-yellow-800',
        ],
        error: [
          'bg-red-50',
          'text-red-900',
          'border-red-200',
          'dark:bg-red-950',
          'dark:text-red-100',
          'dark:border-red-800',
        ],
        info: [
          'bg-blue-50',
          'text-blue-900',
          'border-blue-200',
          'dark:bg-blue-950',
          'dark:text-blue-100',
          'dark:border-blue-800',
        ],
      },
      size: {
        sm: ['p-2', 'text-sm', 'min-w-[200px]', 'max-w-[280px]'],
        default: ['p-4', 'text-sm', 'min-w-[240px]', 'max-w-[360px]'],
        lg: ['p-6', 'text-base', 'min-w-[320px]', 'max-w-[480px]'],
        xl: ['p-8', 'text-base', 'min-w-[400px]', 'max-w-[600px]'],
        full: ['p-6', 'text-base', 'w-[calc(100vw-2rem)]', 'max-w-[720px]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Popover arrow variants using class-variance-authority
 *
 * Provides styling for popover arrows that point to the trigger element.
 */
export const popoverArrowVariants = cva(['fill-current'], {
  variants: {
    variant: {
      default: ['text-gray-200'],
      light: ['text-gray-200'],
      accent: ['text-blue-200'],
      success: ['text-green-200'],
      warning: ['text-yellow-200'],
      error: ['text-red-200'],
      info: ['text-blue-200'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Popover trigger variants using class-variance-authority
 *
 * Provides styling for elements that trigger popovers on interaction.
 */
export const popoverTriggerVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-blue-600',
          'text-white',
          'hover:bg-blue-700',
          'focus-visible:ring-blue-600',
          'dark:bg-blue-600',
          'dark:hover:bg-blue-700',
        ],
        outline: [
          'border',
          'border-gray-300',
          'bg-transparent',
          'hover:bg-gray-100',
          'focus-visible:ring-gray-400',
          'dark:border-gray-700',
          'dark:hover:bg-gray-800',
        ],
        ghost: [
          'hover:bg-gray-100',
          'hover:text-gray-900',
          'focus-visible:ring-gray-400',
          'dark:hover:bg-gray-800',
          'dark:hover:text-gray-100',
        ],
        link: [
          'text-blue-600',
          'underline-offset-4',
          'hover:underline',
          'focus-visible:ring-blue-600',
          'dark:text-blue-400',
        ],
      },
      size: {
        sm: ['h-8', 'px-3', 'text-xs'],
        default: ['h-10', 'px-4', 'py-2', 'text-sm'],
        lg: ['h-11', 'px-8', 'text-base'],
        icon: ['h-10', 'w-10'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Popover close button variants
 *
 * Provides styling for the close button within popovers.
 */
export const popoverCloseVariants = cva([
  'absolute',
  'right-2',
  'top-2',
  'inline-flex',
  'h-6',
  'w-6',
  'items-center',
  'justify-center',
  'rounded-sm',
  'opacity-70',
  'ring-offset-white',
  'transition-opacity',
  'hover:opacity-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-gray-400',
  'focus:ring-offset-2',
  'disabled:pointer-events-none',
  'dark:ring-offset-gray-950',
  'dark:focus:ring-gray-800',
]);
