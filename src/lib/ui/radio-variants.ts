import { cva } from 'class-variance-authority';

// Main radio group container variants
export const radioGroupVariants = cva(
  'group inline-flex items-center focus-within:outline-none',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row gap-4',
        vertical: 'flex-col items-start gap-3',
        'reverse-horizontal': 'flex-row-reverse gap-4',
        'reverse-vertical': 'flex-col-reverse items-start gap-3',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      disabled: false,
    },
  }
);

// Radio input (circle) variants
export const radioInputVariants = cva(
  'peer relative inline-flex shrink-0 items-center justify-center rounded-full border-2 text-current transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 text-xs',
        md: 'h-5 w-5 text-sm',
        lg: 'h-6 w-6 text-base',
        xl: 'h-7 w-7 text-lg',
      },
      variant: {
        default: [
          'border-input bg-background text-primary-foreground',
          'hover:border-primary/40',
          'focus:ring-primary/20',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        ],
        success: [
          'border-input bg-background text-white',
          'hover:border-success/40',
          'focus:ring-success/20',
          'data-[state=checked]:border-success data-[state=checked]:bg-success',
        ],
        warning: [
          'border-input bg-background text-neutral-800',
          'hover:border-warning/40',
          'focus:ring-warning/20',
          'data-[state=checked]:border-warning data-[state=checked]:bg-warning',
        ],
        danger: [
          'border-input bg-background text-destructive-foreground',
          'hover:border-destructive/40',
          'focus:ring-destructive/20',
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
        ],
        info: [
          'border-input bg-background text-primary-foreground',
          'hover:border-primary/40',
          'focus:ring-primary/20',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        ],
        subtle: [
          'border-border bg-muted text-muted-foreground',
          'hover:border-border hover:bg-muted/80',
          'focus:ring-ring/20',
          'data-[state=checked]:border-muted-foreground data-[state=checked]:bg-muted-foreground data-[state=checked]:text-background',
        ],
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      disabled: false,
    },
  }
);

// Radio label variants
export const radioLabelVariants = cva(
  'text-foreground font-medium leading-6 transition-colors',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      required: {
        true: "after:content-['*'] after:ml-1 after:text-destructive",
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      required: false,
    },
  }
);

// Radio description variants
export const radioDescriptionVariants = cva('text-muted-foreground leading-5', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Radio error message variants
export const radioErrorVariants = cva('text-destructive font-medium', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Radio field wrapper variants
export const radioFieldVariants = cva('space-y-2', {
  variants: {
    error: {
      true: 'text-destructive',
      false: '',
    },
  },
  defaultVariants: {
    error: false,
  },
});

// Radio group container variants for recipe filters
export const recipeRadioGroupVariants = cva(
  'rounded-lg border bg-card p-4 shadow-sm',
  {
    variants: {
      variant: {
        categories: 'border-primary/20 bg-primary/10',
        dietary: 'border-success/20 bg-success/10',
        difficulty: 'border-warning/30 bg-warning/10',
        time: 'border-secondary/20 bg-secondary/10',
        options: 'border-border bg-muted',
      },
      layout: {
        vertical: 'space-y-3',
        horizontal: 'space-y-0 flex flex-wrap gap-4',
        grid: 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4',
      },
    },
    defaultVariants: {
      variant: 'options',
      layout: 'vertical',
    },
  }
);

// Radio group title variants
export const radioGroupTitleVariants = cva(
  'font-semibold text-gray-900 dark:text-gray-100 mb-3',
  {
    variants: {
      variant: {
        categories: 'text-blue-900 dark:text-blue-100',
        dietary: 'text-green-900 dark:text-green-100',
        difficulty: 'text-amber-900 dark:text-amber-100',
        time: 'text-purple-900 dark:text-purple-100',
        options: 'text-gray-900 dark:text-gray-100',
      },
    },
    defaultVariants: {
      variant: 'options',
    },
  }
);

// Recipe-specific radio variants for different contexts
export const recipeRadioVariants = cva('', {
  variants: {
    context: {
      cuisine: [
        'data-[state=checked]:border-warning data-[state=checked]:bg-warning',
        'focus:ring-warning/20',
      ],
      'dietary-restriction': [
        'data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500',
        'focus:ring-green-500',
      ],
      difficulty: [
        'data-[state=checked]:border-warning data-[state=checked]:bg-warning',
        'focus:ring-warning/20',
      ],
      'preparation-time': [
        'data-[state=checked]:border-secondary data-[state=checked]:bg-secondary',
        'focus:ring-secondary/20',
      ],
      'meal-type': [
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
        'focus:ring-primary/20',
      ],
      'serving-size': [
        'data-[state=checked]:border-success data-[state=checked]:bg-success',
        'focus:ring-success/20',
      ],
    },
  },
  defaultVariants: {
    context: 'cuisine',
  },
});

// Animated radio variants
export const animatedRadioVariants = cva('', {
  variants: {
    animation: {
      none: '',
      scale:
        'transition-transform duration-200 hover:scale-105 data-[state=checked]:scale-110',
      bounce:
        'transition-all duration-300 hover:animate-pulse data-[state=checked]:animate-bounce',
      pulse:
        'transition-all duration-200 hover:animate-pulse data-[state=checked]:animate-pulse',
      glow: [
        'transition-all duration-300',
        'data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/25',
        'hover:shadow-md hover:shadow-primary/20',
      ],
    },
    loading: {
      true: [
        'opacity-75 cursor-wait',
        'after:absolute after:inset-0 after:rounded-full after:border-2 after:border-border after:border-t-primary after:animate-spin',
      ],
      false: '',
    },
  },
  defaultVariants: {
    animation: 'none',
    loading: false,
  },
});

// Radio icon/indicator variants
export const radioIconVariants = cva(
  'absolute inset-0 flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
      state: {
        checked: 'opacity-100 scale-100',
        unchecked: 'opacity-0 scale-75',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'unchecked',
    },
  }
);

// Radio option card variants (for recipe selection cards)
export const radioCardVariants = cva(
  'relative rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer hover:shadow-md',
  {
    variants: {
      selected: {
        true: 'border-primary bg-primary/10 shadow-md',
        false: 'border-border bg-background hover:border-primary/40',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'md',
      disabled: false,
    },
  }
);
