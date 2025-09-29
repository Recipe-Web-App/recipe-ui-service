import { cva } from 'class-variance-authority';

/**
 * Icon base variants
 */
export const iconVariants = cva('inline-flex items-center justify-center', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      success: 'text-basil',
      warning: 'text-citrus',
      info: 'text-primary',
      inherit: 'text-inherit',
    },
    animation: {
      none: '',
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      ping: 'animate-ping',
    },
    state: {
      default: '',
      hover: 'hover:opacity-80 transition-opacity',
      interactive:
        'hover:opacity-80 focus:opacity-60 transition-opacity cursor-pointer',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
    animation: 'none',
    state: 'default',
  },
});

/**
 * Icon container variants for when icons are used within other components
 */
export const iconContainerVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      spacing: {
        none: '',
        xs: 'gap-1',
        sm: 'gap-1.5',
        default: 'gap-2',
        lg: 'gap-2.5',
        xl: 'gap-3',
      },
      background: {
        none: '',
        muted: 'bg-muted rounded-md p-1',
        accent: 'bg-accent rounded-md p-1',
        primary: 'bg-primary text-primary-foreground rounded-md p-1',
        destructive:
          'bg-destructive text-destructive-foreground rounded-md p-1',
        success: 'bg-basil/10 text-foreground rounded-md p-1',
        warning: 'bg-citrus/10 text-foreground rounded-md p-1',
        info: 'bg-primary/10 text-foreground rounded-md p-1',
      },
    },
    defaultVariants: {
      spacing: 'default',
      background: 'none',
    },
  }
);

/**
 * Recipe-specific icon styling variants
 */
export const recipeIconVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      category: {
        cooking: 'text-accent',
        time: 'text-primary',
        difficulty: 'text-secondary',
        serving: 'text-basil',
        temperature: 'text-destructive',
        rating: 'text-citrus',
        nutrition: 'text-basil',
        diet: 'text-primary',
      },
      emphasis: {
        subtle: 'opacity-70',
        normal: 'opacity-100',
        strong: 'opacity-100 font-semibold',
      },
    },
    defaultVariants: {
      category: 'cooking',
      emphasis: 'normal',
    },
  }
);
