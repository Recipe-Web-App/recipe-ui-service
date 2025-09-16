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
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          'data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400',
          'focus:ring-blue-500',
        ],
        success: [
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          'data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-400',
          'focus:ring-green-500',
        ],
        warning: [
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          'data-[state=checked]:bg-amber-500 dark:data-[state=checked]:bg-amber-400',
          'focus:ring-amber-500',
        ],
        danger: [
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          'data-[state=checked]:bg-red-500 dark:data-[state=checked]:bg-red-400',
          'focus:ring-red-500',
        ],
        info: [
          'data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600',
          'data-[state=checked]:bg-sky-500 dark:data-[state=checked]:bg-sky-400',
          'focus:ring-sky-500',
        ],
        subtle: [
          'data-[state=unchecked]:bg-gray-200',
          'data-[state=checked]:bg-gray-600',
          'focus:ring-gray-500',
          'dark:data-[state=unchecked]:bg-gray-700',
          'dark:data-[state=checked]:bg-gray-400',
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
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
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
        preferences:
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        dietary:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        notifications:
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        privacy: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        features:
          'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
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
      'auto-save': 'data-[state=checked]:bg-green-500',
      'public-profile': 'data-[state=checked]:bg-blue-500',
      'email-notifications': 'data-[state=checked]:bg-purple-500',
      'weekly-meal-plan': 'data-[state=checked]:bg-orange-500',
      'dietary-restrictions': 'data-[state=checked]:bg-amber-500',
      'metric-units': 'data-[state=checked]:bg-teal-500',
      'dark-mode': 'data-[state=checked]:bg-slate-500',
      'show-nutrition': 'data-[state=checked]:bg-pink-500',
      'recipe-suggestions': 'data-[state=checked]:bg-indigo-500',
      'shopping-list': 'data-[state=checked]:bg-sky-500',
    },
  },
});

// Switch group title variants
export const switchGroupTitleVariants = cva('text-lg font-semibold mb-3', {
  variants: {
    variant: {
      preferences: 'text-green-900 dark:text-green-100',
      dietary: 'text-yellow-900 dark:text-yellow-100',
      notifications: 'text-blue-900 dark:text-blue-100',
      privacy: 'text-red-900 dark:text-red-100',
      features: 'text-purple-900 dark:text-purple-100',
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
      true: 'text-red-600',
      false: '',
    },
  },
  defaultVariants: {
    error: false,
  },
});

// Switch error message variants
export const switchErrorVariants = cva('text-sm text-red-600 mt-1', {
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
