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
    'focus:ring-primary/50',
    'focus:ring-offset-2',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-transparent',
          'bg-primary',
          'text-primary-foreground',
          'shadow',
          'hover:bg-primary/80',
        ],
        secondary: [
          'border-transparent',
          'bg-secondary',
          'text-secondary-foreground',
          'hover:bg-secondary/80',
        ],
        destructive: [
          'border-transparent',
          'bg-destructive',
          'text-destructive-foreground',
          'shadow',
          'hover:bg-destructive/80',
        ],
        outline: [
          'border-border',
          'bg-background',
          'text-foreground',
          'hover:bg-primary/10',
          'hover:text-primary',
        ],
        success: [
          'border-transparent',
          'bg-success',
          'text-white',
          'shadow',
          'hover:bg-success/80',
        ],
        warning: [
          'border-transparent',
          'bg-warning',
          'text-neutral-800',
          'shadow',
          'hover:bg-warning/80',
        ],
        info: [
          'border-transparent',
          'bg-primary',
          'text-primary-foreground',
          'shadow',
          'hover:bg-primary/80',
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
