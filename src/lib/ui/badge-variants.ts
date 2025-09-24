import { cva } from 'class-variance-authority';

/**
 * Badge variants using class-variance-authority
 *
 * This is the industry standard approach for creating type-safe,
 * maintainable component variants with Tailwind CSS.
 */
export const badgeVariants = cva(
  // Base styles - applied to all badges
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'border',
    'px-2.5',
    'py-0.5',
    'text-xs',
    'font-semibold',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-2',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-transparent',
          'bg-gray-900',
          'text-white',
          'shadow',
          'hover:bg-gray-900/80',
        ],
        secondary: [
          'border-transparent',
          'bg-secondary',
          'text-secondary-foreground',
          'hover:bg-secondary/80',
        ],
        destructive: [
          'border-transparent',
          'bg-red-500',
          'text-white',
          'shadow',
          'hover:bg-red-500/80',
        ],
        outline: [
          'border-input',
          'bg-background',
          'text-foreground',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ],
        success: [
          'border-transparent',
          'bg-green-500',
          'text-white',
          'shadow',
          'hover:bg-green-500/80',
        ],
        warning: [
          'border-transparent',
          'bg-yellow-500',
          'text-white',
          'shadow',
          'hover:bg-yellow-500/80',
        ],
        info: [
          'border-transparent',
          'bg-blue-500',
          'text-white',
          'shadow',
          'hover:bg-blue-500/80',
        ],
      },
      size: {
        sm: ['text-xs', 'h-5', 'px-2', 'py-0', 'min-w-[1.25rem]'],
        default: ['text-xs', 'h-6', 'px-2.5', 'py-0.5', 'min-w-[1.5rem]'],
        lg: ['text-sm', 'h-7', 'px-3', 'py-1', 'min-w-[1.75rem]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
