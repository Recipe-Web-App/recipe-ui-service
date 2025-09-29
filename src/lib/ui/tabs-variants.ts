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
    'bg-muted',
    'p-1',
    'text-muted-foreground',
  ],
  {
    variants: {
      variant: {
        default: [],
        line: [
          'bg-transparent',
          'border-b',
          'border-border',
          'rounded-none',
          'p-0',
        ],
        pills: ['bg-card', 'border', 'border-border'],
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
          'hover:bg-card',
          'hover:text-foreground',
          'data-[state=active]:bg-background',
          'data-[state=active]:text-foreground',
        ],
        line: [
          'rounded-none',
          'border-b-2',
          'border-transparent',
          'bg-transparent',
          'pb-2',
          'shadow-none',
          'hover:text-foreground',
          'data-[state=active]:border-primary',
          'data-[state=active]:bg-transparent',
          'data-[state=active]:text-primary',
          'data-[state=active]:shadow-none',
        ],
        pills: [
          'rounded-full',
          'hover:bg-primary/10',
          'hover:text-primary',
          'data-[state=active]:bg-primary',
          'data-[state=active]:text-primary-foreground',
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
        default: ['rounded-md', 'border', 'border-border', 'p-4'],
        line: ['pt-4'],
        pills: ['rounded-lg', 'bg-muted', 'p-4'],
        card: [
          'rounded-lg',
          'border',
          'border-border',
          'bg-card',
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
