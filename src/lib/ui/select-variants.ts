import { cva } from 'class-variance-authority';

/**
 * Select trigger variants using class-variance-authority
 *
 * Provides styling for select trigger buttons that open the select dropdown.
 */
export const selectTriggerVariants = cva(
  [
    'flex',
    'h-9',
    'w-full',
    'items-center',
    'justify-between',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'shadow-sm',
    'ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus:outline-none',
    'focus:ring-1',
    'focus:ring-ring',
    'focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    '[&>span]:line-clamp-1',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'hover:border-primary/40',
          'focus:border-primary',
          'focus:ring-primary/20',
        ],
        outline: [
          'border-input',
          'hover:border-primary/40',
          'focus:border-primary',
          'focus:ring-primary/20',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'focus:bg-accent',
          'focus:text-accent-foreground',
          'focus:ring-accent',
        ],
        filled: [
          'border-transparent',
          'bg-muted',
          'hover:bg-muted/80',
          'focus:bg-background',
          'focus:border-primary',
          'focus:ring-primary/20',
        ],
      },
      size: {
        sm: ['h-8', 'px-2', 'text-xs'],
        default: ['h-9', 'px-3', 'text-sm'],
        lg: ['h-10', 'px-4', 'text-base'],
      },
      error: {
        true: [
          'border-destructive',
          'text-destructive',
          'focus:border-destructive',
          'focus:ring-destructive/20',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Select content variants using class-variance-authority
 *
 * Provides styling for the select dropdown content container.
 */
export const selectContentVariants = cva(
  [
    'relative',
    'z-50',
    'max-h-96',
    'min-w-[8rem]',
    'overflow-hidden',
    'rounded-md',
    'border',
    'border-border',
    'bg-card',
    'text-card-foreground',
    'shadow-md',
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
        default: ['bg-card', 'text-card-foreground'],
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
 * Select item variants using class-variance-authority
 *
 * Provides styling for individual select dropdown items.
 */
export const selectItemVariants = cva(
  [
    'relative',
    'flex',
    'w-full',
    'cursor-default',
    'select-none',
    'items-center',
    'gap-2',
    'rounded-sm',
    'py-1.5',
    'pl-2',
    'pr-8',
    'text-sm',
    'outline-none',
    'transition-all',
    'duration-150',
    'ease-in-out',
    'focus:bg-accent',
    'focus:text-accent-foreground',
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
          'data-[highlighted]:bg-accent',
          'data-[highlighted]:text-accent-foreground',
        ],
        destructive: [
          'text-destructive',
          'hover:bg-destructive/10',
          'hover:text-destructive',
          'data-[highlighted]:bg-destructive/10',
          'data-[highlighted]:text-destructive',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Select label variants using class-variance-authority
 *
 * Provides styling for select group labels.
 */
export const selectLabelVariants = cva([
  'px-2',
  'py-1.5',
  'text-sm',
  'font-semibold',
  'text-muted-foreground',
]);

/**
 * Select separator variants using class-variance-authority
 *
 * Provides styling for select group separators.
 */
export const selectSeparatorVariants = cva([
  '-mx-1',
  'my-1',
  'h-px',
  'bg-border',
]);

/**
 * Select scroll button variants using class-variance-authority
 *
 * Provides styling for scroll up/down buttons in select.
 */
export const selectScrollButtonVariants = cva([
  'flex',
  'cursor-default',
  'items-center',
  'justify-center',
  'py-1',
  'text-muted-foreground',
]);
