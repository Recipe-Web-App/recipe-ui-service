import { cva } from 'class-variance-authority';

/**
 * Button variants using class-variance-authority
 *
 * This is the industry standard approach for creating type-safe,
 * maintainable component variants with Tailwind CSS.
 */
export const buttonVariants = cva(
  // Base styles - applied to all buttons
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Primary action - Tomato Red
        default: [
          'bg-primary',
          'text-primary-foreground',
          'shadow',
          'hover:bg-primary/90',
          'active:bg-primary/80',
        ],
        // Destructive action - Also Tomato Red
        destructive: [
          'bg-destructive',
          'text-destructive-foreground',
          'shadow-sm',
          'hover:bg-destructive/90',
          'active:bg-destructive/80',
        ],
        // Outlined button - subtle with recipe accent
        outline: [
          'border',
          'border-border',
          'bg-background',
          'shadow-sm',
          'hover:bg-primary/10',
          'hover:text-primary',
          'hover:border-primary/50',
        ],
        // Success action - Basil Green
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'shadow-sm',
          'hover:bg-secondary/90',
          'active:bg-secondary/80',
        ],
        // Ghost button - minimal with recipe theme
        ghost: [
          'hover:bg-primary/10',
          'hover:text-primary',
          'active:bg-primary/20',
        ],
        // Link button - tomato red text
        link: [
          'text-primary',
          'underline-offset-4',
          'hover:underline',
          'hover:text-primary/80',
        ],
        // New: Success variant - Basil Green
        success: [
          'bg-success',
          'text-white',
          'shadow-sm',
          'hover:bg-success/90',
          'active:bg-success/80',
        ],
        // New: Warning variant - Citrus Yellow
        warning: [
          'bg-warning',
          'text-neutral-800',
          'shadow-sm',
          'hover:bg-warning/90',
          'active:bg-warning/80',
        ],
      },
      size: {
        default: ['h-9', 'px-4', 'py-2', 'text-sm'],
        sm: ['h-8', 'rounded-md', 'px-3', 'text-xs'],
        lg: ['h-10', 'rounded-md', 'px-8', 'text-base'],
        icon: ['h-9', 'w-9'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
