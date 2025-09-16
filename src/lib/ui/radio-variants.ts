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
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-blue-500',
          'data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-blue-400 dark:data-[state=checked]:bg-blue-500',
        ],
        success: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-green-500',
          'data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-green-400 dark:data-[state=checked]:bg-green-500',
        ],
        warning: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-amber-500',
          'data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-amber-400 dark:data-[state=checked]:bg-amber-500',
        ],
        danger: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-red-500',
          'data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-red-400 dark:data-[state=checked]:bg-red-500',
        ],
        info: [
          'border-gray-300 bg-white text-white',
          'hover:border-gray-400',
          'focus:ring-cyan-500',
          'data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500',
          'dark:border-gray-600 dark:bg-gray-800',
          'dark:hover:border-gray-500',
          'dark:data-[state=checked]:border-cyan-400 dark:data-[state=checked]:bg-cyan-500',
        ],
        subtle: [
          'border-gray-200 bg-gray-50 text-gray-700',
          'hover:border-gray-300 hover:bg-gray-100',
          'focus:ring-gray-500',
          'data-[state=checked]:border-gray-400 data-[state=checked]:bg-gray-300',
          'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300',
          'dark:hover:border-gray-600 dark:hover:bg-gray-800',
          'dark:data-[state=checked]:border-gray-500 dark:data-[state=checked]:bg-gray-700',
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
  'text-gray-900 dark:text-gray-100 font-medium leading-6 transition-colors',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      required: {
        true: "after:content-['*'] after:ml-1 after:text-red-500",
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
export const radioDescriptionVariants = cva(
  'text-gray-600 dark:text-gray-400 leading-5',
  {
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
  }
);

// Radio error message variants
export const radioErrorVariants = cva(
  'text-red-600 dark:text-red-400 font-medium',
  {
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
  }
);

// Radio field wrapper variants
export const radioFieldVariants = cva('space-y-2', {
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

// Radio group container variants for recipe filters
export const recipeRadioGroupVariants = cva(
  'rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800',
  {
    variants: {
      variant: {
        categories:
          'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        dietary:
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        difficulty:
          'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950',
        time: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
        options:
          'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
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
        'data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500',
        'focus:ring-orange-500',
      ],
      'dietary-restriction': [
        'data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500',
        'focus:ring-green-500',
      ],
      difficulty: [
        'data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500',
        'focus:ring-amber-500',
      ],
      'preparation-time': [
        'data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500',
        'focus:ring-purple-500',
      ],
      'meal-type': [
        'data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500',
        'focus:ring-blue-500',
      ],
      'serving-size': [
        'data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500',
        'focus:ring-teal-500',
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
        'data-[state=checked]:shadow-lg data-[state=checked]:shadow-blue-500/25',
        'hover:shadow-md hover:shadow-blue-500/20',
      ],
    },
    loading: {
      true: [
        'opacity-75 cursor-wait',
        'after:absolute after:inset-0 after:rounded-full after:border-2 after:border-gray-300 after:border-t-blue-500 after:animate-spin',
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
        true: 'border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-950',
        false:
          'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
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
