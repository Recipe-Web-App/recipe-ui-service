import { cva } from 'class-variance-authority';

/**
 * Tabs list variants using class-variance-authority
 *
 * Provides styling for the container holding tab triggers.
 */
export const tabsListVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-lg',
    'bg-gray-100',
    'p-1',
    'text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: [],
        line: [
          'bg-transparent',
          'border-b',
          'border-gray-200',
          'rounded-none',
          'p-0',
        ],
        pills: ['bg-gray-50', 'border', 'border-gray-200'],
      },
      size: {
        sm: ['h-8', 'text-xs'],
        default: ['h-9', 'text-sm'],
        lg: ['h-10', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Tabs trigger variants using class-variance-authority
 *
 * Provides styling for individual tab trigger buttons.
 */
export const tabsTriggerVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'whitespace-nowrap',
    'rounded-md',
    'px-3',
    'py-1',
    'font-medium',
    'ring-offset-background',
    'transition-all',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'data-[state=active]:bg-background',
    'data-[state=active]:text-foreground',
    'data-[state=active]:shadow',
  ],
  {
    variants: {
      variant: {
        default: [
          'hover:bg-gray-50',
          'hover:text-gray-900',
          'data-[state=active]:bg-white',
          'data-[state=active]:text-gray-900',
        ],
        line: [
          'rounded-none',
          'border-b-2',
          'border-transparent',
          'bg-transparent',
          'pb-2',
          'shadow-none',
          'hover:text-gray-900',
          'data-[state=active]:border-blue-500',
          'data-[state=active]:bg-transparent',
          'data-[state=active]:text-blue-600',
          'data-[state=active]:shadow-none',
        ],
        pills: [
          'rounded-full',
          'hover:bg-blue-50',
          'hover:text-blue-700',
          'data-[state=active]:bg-blue-500',
          'data-[state=active]:text-white',
        ],
      },
      size: {
        sm: ['h-6', 'px-2', 'text-xs'],
        default: ['h-7', 'px-3', 'text-sm'],
        lg: ['h-8', 'px-4', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Tabs content variants using class-variance-authority
 *
 * Provides styling for tab content panels.
 */
export const tabsContentVariants = cva(
  [
    'mt-2',
    'ring-offset-background',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: ['rounded-md', 'border', 'border-gray-200', 'p-4'],
        line: ['pt-4'],
        pills: ['rounded-lg', 'bg-gray-50', 'p-4'],
        card: [
          'rounded-lg',
          'border',
          'border-gray-200',
          'bg-white',
          'p-6',
          'shadow-sm',
        ],
      },
      size: {
        sm: ['text-sm'],
        default: ['text-base'],
        lg: ['text-lg'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
