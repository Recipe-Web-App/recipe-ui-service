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
        default: ['bg-popover', 'text-popover-foreground', 'border-border'],
        light: [
          'bg-card',
          'text-card-foreground',
          'border-border',
          'shadow-lg',
        ],
        accent: [
          'bg-primary/10',
          'text-primary-foreground',
          'border-primary/20',
        ],
        success: ['bg-basil/10', 'text-foreground', 'border-basil/20'],
        warning: ['bg-citrus/10', 'text-foreground', 'border-citrus/30'],
        error: [
          'bg-destructive/10',
          'text-foreground',
          'border-destructive/20',
        ],
        info: ['bg-primary/10', 'text-primary-foreground', 'border-primary/20'],
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
      default: ['text-border'],
      light: ['text-border'],
      accent: ['text-primary/20'],
      success: ['text-basil/20'],
      warning: ['text-citrus/30'],
      error: ['text-destructive/20'],
      info: ['text-primary/20'],
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
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary/90',
          'focus-visible:ring-primary',
        ],
        outline: [
          'border',
          'border-input',
          'bg-transparent',
          'hover:bg-accent',
          'focus-visible:ring-ring',
        ],
        ghost: [
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'focus-visible:ring-ring',
        ],
        link: [
          'text-primary',
          'underline-offset-4',
          'hover:underline',
          'focus-visible:ring-primary',
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
  'ring-offset-background',
  'transition-opacity',
  'hover:opacity-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-ring',
  'focus:ring-offset-2',
  'disabled:pointer-events-none',
]);
