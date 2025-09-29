import { cva } from 'class-variance-authority';

/**
 * Chip variants using class-variance-authority
 *
 * Interactive tags that extend badge functionality with actions like delete,
 * selection, and click handling. Perfect for ingredient management, filters, and tags.
 */
export const chipVariants = cva(
  // Base styles - applied to all chips
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'border',
    'font-medium',
    'transition-all',
    'select-none',
    'whitespace-nowrap',
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
          'border-input',
          'bg-background',
          'text-foreground',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ],
        outlined: [
          'border-input',
          'bg-transparent',
          'text-foreground',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ],
        filled: [
          'border-transparent',
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary/90',
        ],
      },
      size: {
        sm: ['h-7', 'px-2.5', 'text-xs', 'gap-1'],
        md: ['h-8', 'px-3', 'text-sm', 'gap-1.5'],
        lg: ['h-9', 'px-4', 'text-sm', 'gap-2'],
      },
      color: {
        default: [],
        primary: [
          'border-primary/20',
          'bg-primary/10',
          'text-primary',
          'hover:bg-primary/20',
        ],
        secondary: [
          'border-secondary/20',
          'bg-secondary/10',
          'text-secondary-foreground',
          'hover:bg-secondary/20',
        ],
        success: [
          'border-basil/20',
          'bg-basil/10',
          'text-foreground',
          'hover:bg-basil/20',
        ],
        warning: [
          'border-citrus/30',
          'bg-citrus/10',
          'text-foreground',
          'hover:bg-citrus/20',
        ],
        destructive: [
          'border-destructive/20',
          'bg-destructive/10',
          'text-foreground',
          'hover:bg-destructive/20',
        ],
        info: [
          'border-primary/20',
          'bg-primary/10',
          'text-foreground',
          'hover:bg-primary/20',
        ],
      },
      clickable: {
        true: ['cursor-pointer', 'hover:shadow-sm', 'active:scale-95'],
        false: [],
      },
      selected: {
        true: ['ring-2', 'ring-primary', 'ring-offset-2'],
        false: [],
      },
    },
    compoundVariants: [
      // Selected state overrides for filled variant
      {
        variant: 'filled',
        selected: true,
        className: ['bg-primary', 'text-primary-foreground', 'border-primary'],
      },
      // Selected state overrides for outlined variant
      {
        variant: 'outlined',
        selected: true,
        className: ['bg-primary/10', 'border-primary', 'text-primary'],
      },
      // Clickable and not disabled adds hover effects
      {
        clickable: true,
        className: ['hover:shadow-md', 'transition-shadow'],
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      color: 'default',
      clickable: false,
      selected: false,
    },
  }
);

/**
 * Delete button variants for chips
 */
export const chipDeleteVariants = cva(
  [
    'ml-1',
    '-mr-0.5',
    'rounded-full',
    'hover:bg-muted',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-0',
    'transition-colors',
  ],
  {
    variants: {
      size: {
        sm: ['h-4', 'w-4'],
        md: ['h-4.5', 'w-4.5'],
        lg: ['h-5', 'w-5'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Icon wrapper variants for chips
 */
export const chipIconVariants = cva([], {
  variants: {
    size: {
      sm: ['h-3', 'w-3'],
      md: ['h-3.5', 'w-3.5'],
      lg: ['h-4', 'w-4'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/**
 * Avatar wrapper variants for chips
 */
export const chipAvatarVariants = cva(['-ml-1', 'rounded-full'], {
  variants: {
    size: {
      sm: ['h-5', 'w-5'],
      md: ['h-6', 'w-6'],
      lg: ['h-7', 'w-7'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
