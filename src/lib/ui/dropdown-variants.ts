import { cva } from 'class-variance-authority';

/**
 * Dropdown trigger variants using class-variance-authority
 *
 * Provides styling for dropdown trigger buttons that open the dropdown menu.
 */
export const dropdownTriggerVariants = cva(
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
          'data-[state=open]:bg-primary/80',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'shadow-sm',
          'hover:bg-secondary/80',
          'data-[state=open]:bg-secondary/90',
        ],
        outline: [
          'border',
          'border-input',
          'bg-background',
          'shadow-sm',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'data-[state=open]:bg-accent',
        ],
        ghost: [
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'data-[state=open]:bg-accent',
        ],
      },
      size: {
        sm: ['h-8', 'rounded-md', 'px-3', 'text-xs'],
        default: ['h-9', 'px-4', 'py-2', 'text-sm'],
        lg: ['h-10', 'rounded-md', 'px-8', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Dropdown content variants using class-variance-authority
 *
 * Provides styling for the dropdown menu content container.
 */
export const dropdownContentVariants = cva(
  [
    'z-50',
    'min-w-[8rem]',
    'overflow-hidden',
    'rounded-md',
    'border',
    'border-border',
    'bg-card',
    'text-card-foreground',
    'shadow-md',
    'p-1',
    // Animation classes for enter/exit
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      variant: {
        default: [],
        secondary: ['bg-muted', 'text-muted-foreground'],
      },
      size: {
        sm: ['min-w-[6rem]', 'text-xs'],
        default: ['min-w-[8rem]', 'text-sm'],
        lg: ['min-w-[12rem]', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Dropdown item variants using class-variance-authority
 *
 * Provides styling for individual dropdown menu items.
 */
export const dropdownItemVariants = cva(
  [
    'relative',
    'flex',
    'cursor-default',
    'select-none',
    'items-center',
    'gap-2',
    'rounded-sm',
    'px-2',
    'py-1.5',
    'text-sm',
    'outline-none',
    'transition-all',
    'duration-150',
    'ease-in-out',
    'focus:bg-accent',
    'focus:text-accent-foreground',
    'focus:ring-1',
    'focus:ring-ring',
    'focus:ring-offset-0',
    'data-[disabled]:pointer-events-none',
    'data-[disabled]:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'hover:shadow-sm',
          'hover:scale-[1.02]',
          'hover:translate-x-0.5',
        ],
        destructive: [
          'text-destructive',
          'hover:bg-destructive/10',
          'hover:text-destructive',
          'hover:shadow-sm',
          'hover:scale-[1.02]',
          'hover:translate-x-0.5',
          'focus:bg-destructive/10',
          'focus:text-destructive',
          'focus:ring-destructive/20',
          'dark:hover:bg-destructive/5',
          'dark:focus:bg-destructive/5',
        ],
      },
      inset: {
        true: ['pl-8'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Dropdown label variants using class-variance-authority
 *
 * Provides styling for dropdown section labels.
 */
export const dropdownLabelVariants = cva([
  'px-2',
  'py-1.5',
  'text-sm',
  'font-semibold',
  'text-muted-foreground',
]);

/**
 * Dropdown separator variants using class-variance-authority
 *
 * Provides styling for dropdown section separators.
 */
export const dropdownSeparatorVariants = cva([
  '-mx-1',
  'my-1',
  'h-px',
  'bg-border',
]);

/**
 * Dropdown shortcut variants using class-variance-authority
 *
 * Provides styling for keyboard shortcuts displayed in dropdown items.
 */
export const dropdownShortcutVariants = cva([
  'ml-auto',
  'text-xs',
  'tracking-widest',
  'text-muted-foreground',
]);
