import { cva } from 'class-variance-authority';

// Main switch container variants
export const switchVariants = cva(
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

// Switch track (background) variants
export const switchTrackVariants = cva(
  'relative inline-flex shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
        xl: 'h-8 w-16',
      },
      variant: {
        default: [
          'data-[state=unchecked]:bg-input',
          'data-[state=checked]:bg-primary',
          'focus:ring-primary/20',
        ],
        success: [
          'data-[state=unchecked]:bg-input',
          'data-[state=checked]:bg-success',
          'focus:ring-success/20',
        ],
        warning: [
          'data-[state=unchecked]:bg-input',
          'data-[state=checked]:bg-warning',
          'focus:ring-warning/20',
        ],
        danger: [
          'data-[state=unchecked]:bg-input',
          'data-[state=checked]:bg-destructive',
          'focus:ring-destructive/20',
        ],
        info: [
          'data-[state=unchecked]:bg-input',
          'data-[state=checked]:bg-primary',
          'focus:ring-primary/20',
        ],
        subtle: [
          'data-[state=unchecked]:bg-muted',
          'data-[state=checked]:bg-muted-foreground',
          'focus:ring-ring/20',
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

// Switch thumb (handle) variants
export const switchThumbVariants = cva(
  'pointer-events-none inline-flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-4.5',
        md: 'h-5 w-5 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-5.5',
        lg: 'h-6 w-6 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-7.5',
        xl: 'h-7 w-7 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-8.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Switch label variants
export const switchLabelVariants = cva(
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

// Switch description variants
export const switchDescriptionVariants = cva('text-muted-foreground', {
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

// Switch icon variants (optional icons inside thumb)
export const switchIconVariants = cva(
  'absolute inset-0 flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm',
        xl: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Recipe-specific switch group variants
export const recipeSwitchGroupVariants = cva(
  'space-y-4 rounded-lg border p-4',
  {
    variants: {
      variant: {
        preferences: 'border-success/20 bg-success/10',
        dietary: 'border-warning/30 bg-warning/10',
        notifications: 'border-primary/20 bg-primary/10',
        privacy: 'border-destructive/20 bg-destructive/10',
        features: 'border-secondary/20 bg-secondary/10',
      },
    },
    defaultVariants: {
      variant: 'preferences',
    },
  }
);

// Recipe-specific switch variants
export const recipeSwitchVariants = cva('', {
  variants: {
    context: {
      'auto-save': 'data-[state=checked]:bg-success',
      'public-profile': 'data-[state=checked]:bg-primary',
      'email-notifications': 'data-[state=checked]:bg-secondary',
      'weekly-meal-plan': 'data-[state=checked]:bg-warning',
      'dietary-restrictions': 'data-[state=checked]:bg-warning',
      'metric-units': 'data-[state=checked]:bg-success',
      'dark-mode': 'data-[state=checked]:bg-muted-foreground',
      'show-nutrition': 'data-[state=checked]:bg-accent',
      'recipe-suggestions': 'data-[state=checked]:bg-primary',
      'shopping-list': 'data-[state=checked]:bg-accent',
    },
  },
});

// Switch group title variants
export const switchGroupTitleVariants = cva('text-lg font-semibold mb-3', {
  variants: {
    variant: {
      preferences: 'text-success',
      dietary: 'text-neutral-800 dark:text-warning',
      notifications: 'text-primary',
      privacy: 'text-destructive',
      features: 'text-secondary-foreground',
    },
  },
  defaultVariants: {
    variant: 'preferences',
  },
});

// Animated switch variants (with loading state)
export const animatedSwitchVariants = cva('', {
  variants: {
    loading: {
      true: 'relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shimmer',
      false: '',
    },
  },
  defaultVariants: {
    loading: false,
  },
});

// Compound switch variants (for form fields)
export const switchFieldVariants = cva('space-y-1', {
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

// Switch error message variants
export const switchErrorVariants = cva('text-sm text-destructive mt-1', {
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
