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
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-blue-500',
          'data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500',
          'data-[state=indeterminate]:border-blue-500 data-[state=indeterminate]:bg-blue-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-blue-400 dark:data-[state=checked]:bg-blue-500',
          'dark:data-[state=indeterminate]:border-blue-400 dark:data-[state=indeterminate]:bg-blue-500',
        ],
        success: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-green-500',
          'data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500',
          'data-[state=indeterminate]:border-green-500 data-[state=indeterminate]:bg-green-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-green-400 dark:data-[state=checked]:bg-green-500',
          'dark:data-[state=indeterminate]:border-green-400 dark:data-[state=indeterminate]:bg-green-500',
        ],
        warning: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-amber-500',
          'data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500',
          'data-[state=indeterminate]:border-amber-500 data-[state=indeterminate]:bg-amber-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-amber-400 dark:data-[state=checked]:bg-amber-500',
          'dark:data-[state=indeterminate]:border-amber-400 dark:data-[state=indeterminate]:bg-amber-500',
        ],
        danger: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-red-500',
          'data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500',
          'data-[state=indeterminate]:border-red-500 data-[state=indeterminate]:bg-red-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-red-400 dark:data-[state=checked]:bg-red-500',
          'dark:data-[state=indeterminate]:border-red-400 dark:data-[state=indeterminate]:bg-red-500',
        ],
        info: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-sky-500',
          'data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500',
          'data-[state=indeterminate]:border-sky-500 data-[state=indeterminate]:bg-sky-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-sky-400 dark:data-[state=checked]:bg-sky-500',
          'dark:data-[state=indeterminate]:border-sky-400 dark:data-[state=indeterminate]:bg-sky-500',
        ],
        subtle: [
          'border-gray-200 bg-gray-50 text-gray-700',
          'hover:border-gray-300 hover:bg-gray-100',
          'focus:ring-gray-500',
          'data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white',
          'data-[state=indeterminate]:border-gray-600 data-[state=indeterminate]:bg-gray-600 data-[state=indeterminate]:text-white',
          'dark:border-gray-700 dark:bg-gray-900',
          'dark:hover:border-gray-600 dark:hover:bg-gray-800',
          'dark:data-[state=checked]:border-gray-400 dark:data-[state=checked]:bg-gray-500',
          'dark:data-[state=indeterminate]:border-gray-400 dark:data-[state=indeterminate]:bg-gray-500',
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
export const checkboxErrorVariants = cva('text-sm text-red-600 mt-1', {
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
      true: 'text-red-600',
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
        filters:
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        categories:
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        tags: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
        options:
          'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950',
        ingredients:
          'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
        dietary:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
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
      filters: 'text-blue-900 dark:text-blue-100',
      categories: 'text-green-900 dark:text-green-100',
      tags: 'text-purple-900 dark:text-purple-100',
      options: 'text-gray-900 dark:text-gray-100',
      ingredients: 'text-orange-900 dark:text-orange-100',
      dietary: 'text-yellow-900 dark:text-yellow-100',
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
      'recipe-type': 'data-[state=checked]:bg-green-500',
      cuisine: 'data-[state=checked]:bg-blue-500',
      'dietary-restriction': 'data-[state=checked]:bg-yellow-500',
      difficulty: 'data-[state=checked]:bg-purple-500',
      'cooking-method': 'data-[state=checked]:bg-orange-500',
      'meal-type': 'data-[state=checked]:bg-pink-500',
      ingredient: 'data-[state=checked]:bg-teal-500',
      allergen: 'data-[state=checked]:bg-red-500',
      nutrition: 'data-[state=checked]:bg-indigo-500',
      'preparation-time': 'data-[state=checked]:bg-cyan-500',
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
  'flex items-center justify-between rounded-md border px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
  {
    variants: {
      selected: {
        true: 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950',
        false: 'border-gray-200 dark:border-gray-700',
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
