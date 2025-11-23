import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Recipe menu trigger button variants
 * Styling for the three-dot menu trigger button
 */
export const recipeMenuTriggerVariants = cva(
  [
    // Base styles
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
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
          'active:bg-primary/80',
        ],
        ghost: [
          'bg-transparent',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'active:bg-accent/80',
        ],
        outline: [
          'border',
          'border-input',
          'bg-background',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'active:bg-accent/80',
        ],
      },
      size: {
        sm: ['h-8', 'w-8', 'text-xs'],
        md: ['h-9', 'w-9', 'text-sm'],
        lg: ['h-10', 'w-10', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  }
);

/**
 * Recipe menu item variants
 * Styling for individual menu items
 */
export const recipeMenuItemVariants = cva(
  [
    // Base styles from dropdown
    'relative',
    'flex',
    'cursor-default',
    'select-none',
    'items-center',
    'rounded-sm',
    'px-2',
    'py-1.5',
    'text-sm',
    'outline-none',
    'transition-colors',
    'focus:bg-accent',
    'focus:text-accent-foreground',
    'data-[disabled]:pointer-events-none',
    'data-[disabled]:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: ['hover:bg-accent', 'hover:text-accent-foreground'],
        destructive: [
          'text-destructive',
          'hover:bg-destructive/10',
          'hover:text-destructive',
          'focus:bg-destructive/10',
          'focus:text-destructive',
        ],
      },
      hasIcon: {
        true: ['gap-2'],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      hasIcon: true,
    },
  }
);

/**
 * Recipe menu icon variants
 * Styling for icons in menu items
 */
export const recipeMenuIconVariants = cva(['flex-shrink-0'], {
  variants: {
    size: {
      sm: ['h-3.5', 'w-3.5'],
      md: ['h-4', 'w-4'],
      lg: ['h-5', 'w-5'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/**
 * Recipe menu separator variants
 * Styling for separators between menu sections
 */
export const recipeMenuSeparatorVariants = cva([
  '-mx-1',
  'my-1',
  'h-px',
  'bg-muted',
]);

/**
 * Recipe menu label variants
 * Styling for section labels in the menu
 */
export const recipeMenuLabelVariants = cva([
  'px-2',
  'py-1.5',
  'text-xs',
  'font-semibold',
  'text-muted-foreground',
]);

/**
 * Recipe menu shortcut variants
 * Styling for keyboard shortcuts displayed in menu items
 */
export const recipeMenuShortcutVariants = cva([
  'ml-auto',
  'text-xs',
  'tracking-widest',
  'opacity-60',
]);

// Export variant types
export type RecipeMenuTriggerVariants = VariantProps<
  typeof recipeMenuTriggerVariants
>;
export type RecipeMenuItemVariants = VariantProps<
  typeof recipeMenuItemVariants
>;
export type RecipeMenuIconVariants = VariantProps<
  typeof recipeMenuIconVariants
>;
