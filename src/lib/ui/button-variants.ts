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
        default: [
          'bg-primary',
          'text-primary-foreground',
          'shadow',
          'hover:bg-primary/90',
        ],
        destructive: [
          'bg-destructive',
          'text-destructive-foreground',
          'shadow-sm',
          'hover:bg-destructive/90',
        ],
        outline: [
          'border',
          'border-input',
          'bg-background',
          'shadow-sm',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'shadow-sm',
          'hover:bg-secondary/80',
        ],
        ghost: ['hover:bg-accent', 'hover:text-accent-foreground'],
        link: ['text-primary', 'underline-offset-4', 'hover:underline'],
      },
      size: {
        default: ['h-9', 'px-4', 'py-2', 'text-button-base'],
        sm: ['h-8', 'rounded-md', 'px-3', 'text-button-sm'],
        lg: ['h-10', 'rounded-md', 'px-8', 'text-button-lg'],
        icon: ['h-9', 'w-9'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
