import { cva } from 'class-variance-authority';

// Main checkbox container variants
export const checkboxVariants = cva(
  'group inline-flex items-center focus-within:outline-none',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col items-start',
        'reverse-horizontal': 'flex-row-reverse',
        'reverse-vertical': 'flex-col-reverse items-start',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      disabled: false,
    },
  }
);

// Checkbox input (box) variants
export const checkboxInputVariants = cva(
  'peer inline-flex shrink-0 items-center justify-center rounded border-2 text-current transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
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
          'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        ],
        success: [
          'border-input bg-background text-white',
          'hover:border-success/40',
          'focus:ring-success/20',
          'data-[state=checked]:border-success data-[state=checked]:bg-success',
          'data-[state=indeterminate]:border-success data-[state=indeterminate]:bg-success',
        ],
        warning: [
          'border-input bg-background text-neutral-800',
          'hover:border-warning/40',
          'focus:ring-warning/20',
          'data-[state=checked]:border-warning data-[state=checked]:bg-warning',
          'data-[state=indeterminate]:border-warning data-[state=indeterminate]:bg-warning',
        ],
        danger: [
          'border-input bg-background text-destructive-foreground',
          'hover:border-destructive/40',
          'focus:ring-destructive/20',
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
          'data-[state=indeterminate]:border-destructive data-[state=indeterminate]:bg-destructive',
        ],
        info: [
          'border-input bg-background text-primary-foreground',
          'hover:border-primary/40',
          'focus:ring-primary/20',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
          'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        ],
        subtle: [
          'border-border bg-muted text-muted-foreground',
          'hover:border-border hover:bg-muted/80',
          'focus:ring-ring/20',
          'data-[state=checked]:border-muted-foreground data-[state=checked]:bg-muted-foreground data-[state=checked]:text-background',
          'data-[state=indeterminate]:border-muted-foreground data-[state=indeterminate]:bg-muted-foreground data-[state=indeterminate]:text-background',
        ],
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      disabled: false,
    },
  }
);

// Checkbox label variants
export const checkboxLabelVariants = cva(
  'select-none font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      required: false,
    },
  }
);

// Checkbox description variants
export const checkboxDescriptionVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
      xl: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Checkbox error message variants
export const checkboxErrorVariants = cva('text-sm text-destructive mt-1', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      xl: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Checkbox field variants (form field wrapper)
export const checkboxFieldVariants = cva('space-y-1', {
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

// Filter checkbox group variants (for multi-select filters)
export const filterCheckboxGroupVariants = cva(
  'space-y-3 rounded-lg border p-4',
  {
    variants: {
      variant: {
        filters: 'border-primary/20 bg-primary/10',
        categories: 'border-success/20 bg-success/10',
        tags: 'border-secondary/20 bg-secondary/10',
        options: 'border-border bg-muted',
        ingredients: 'border-warning/30 bg-warning/10',
        dietary: 'border-warning/30 bg-warning/10',
      },
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row flex-wrap gap-4',
        grid: 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4',
      },
    },
    defaultVariants: {
      variant: 'filters',
      layout: 'vertical',
    },
  }
);

// Filter checkbox group title variants
export const checkboxGroupTitleVariants = cva('text-lg font-semibold mb-3', {
  variants: {
    variant: {
      filters: 'text-primary',
      categories: 'text-success',
      tags: 'text-secondary-foreground',
      options: 'text-foreground',
      ingredients: 'text-neutral-800 dark:text-warning',
      dietary: 'text-neutral-800 dark:text-warning',
    },
  },
  defaultVariants: {
    variant: 'filters',
  },
});

// Recipe-specific checkbox variants (for recipe filters)
export const recipeCheckboxVariants = cva('', {
  variants: {
    context: {
      'recipe-type': 'data-[state=checked]:bg-success',
      cuisine: 'data-[state=checked]:bg-primary',
      'dietary-restriction': 'data-[state=checked]:bg-warning',
      difficulty: 'data-[state=checked]:bg-secondary',
      'cooking-method': 'data-[state=checked]:bg-warning',
      'meal-type': 'data-[state=checked]:bg-accent',
      ingredient: 'data-[state=checked]:bg-success',
      allergen: 'data-[state=checked]:bg-destructive',
      nutrition: 'data-[state=checked]:bg-primary',
      'preparation-time': 'data-[state=checked]:bg-accent',
    },
  },
});

// Animated checkbox variants (with loading/transition states)
export const animatedCheckboxVariants = cva('', {
  variants: {
    loading: {
      true: 'relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shimmer',
      false: '',
    },
    animation: {
      none: '',
      bounce: 'data-[state=checked]:animate-bounce',
      pulse: 'data-[state=checked]:animate-pulse',
      scale:
        'transition-transform hover:scale-105 data-[state=checked]:scale-110',
    },
  },
  defaultVariants: {
    loading: false,
    animation: 'none',
  },
});

// Checkbox icon variants (for custom check marks)
export const checkboxIconVariants = cva(
  'pointer-events-none flex items-center justify-center text-current opacity-0 transition-opacity duration-150',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
      state: {
        checked: 'opacity-100',
        unchecked: 'opacity-0',
        indeterminate: 'opacity-100',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'unchecked',
    },
  }
);

// Search checkbox variants (for searchable filter lists)
export const searchCheckboxVariants = cva(
  'flex items-center justify-between rounded-md border px-3 py-2 transition-colors hover:bg-muted/50',
  {
    variants: {
      selected: {
        true: 'border-primary bg-primary/10',
        false: 'border-border',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);
