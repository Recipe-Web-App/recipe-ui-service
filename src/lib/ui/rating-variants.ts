import { cva } from 'class-variance-authority';

export const ratingVariants = cva(
  'inline-flex items-center gap-1 select-none',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      type: {
        star: '',
        heart: '',
        thumbs: '',
        numeric: 'font-medium',
      },
      variant: {
        default: '',
        accent: '',
        warning: '',
        success: '',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      type: 'star',
      variant: 'default',
      interactive: false,
      disabled: false,
    },
  }
);

export const ratingItemVariants = cva('transition-colors duration-150', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
    type: {
      star: '',
      heart: '',
      thumbs: '',
      numeric: 'min-w-[1.5em] text-center',
    },
    variant: {
      default: '',
      accent: '',
      warning: '',
      success: '',
    },
    state: {
      filled: '',
      unfilled: '',
      hover: '',
      disabled: '',
    },
    interactive: {
      true: 'hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm',
      false: '',
    },
  },
  compoundVariants: [
    // Star variants
    {
      type: 'star',
      variant: 'default',
      state: 'filled',
      className: 'text-yellow-400 fill-current',
    },
    {
      type: 'star',
      variant: 'default',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'star',
      variant: 'default',
      state: 'hover',
      className: 'text-yellow-300 fill-current',
    },
    {
      type: 'star',
      variant: 'accent',
      state: 'filled',
      className: 'text-primary fill-current',
    },
    {
      type: 'star',
      variant: 'accent',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'star',
      variant: 'accent',
      state: 'hover',
      className: 'text-primary/80 fill-current',
    },
    {
      type: 'star',
      variant: 'warning',
      state: 'filled',
      className: 'text-orange-400 fill-current',
    },
    {
      type: 'star',
      variant: 'warning',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'star',
      variant: 'warning',
      state: 'hover',
      className: 'text-orange-300 fill-current',
    },
    {
      type: 'star',
      variant: 'success',
      state: 'filled',
      className: 'text-green-500 fill-current',
    },
    {
      type: 'star',
      variant: 'success',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'star',
      variant: 'success',
      state: 'hover',
      className: 'text-green-400 fill-current',
    },

    // Heart variants
    {
      type: 'heart',
      variant: 'default',
      state: 'filled',
      className: 'text-red-500 fill-current',
    },
    {
      type: 'heart',
      variant: 'default',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'heart',
      variant: 'default',
      state: 'hover',
      className: 'text-red-400 fill-current',
    },
    {
      type: 'heart',
      variant: 'accent',
      state: 'filled',
      className: 'text-primary fill-current',
    },
    {
      type: 'heart',
      variant: 'accent',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'heart',
      variant: 'accent',
      state: 'hover',
      className: 'text-primary/80 fill-current',
    },
    {
      type: 'heart',
      variant: 'warning',
      state: 'filled',
      className: 'text-orange-400 fill-current',
    },
    {
      type: 'heart',
      variant: 'warning',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'heart',
      variant: 'warning',
      state: 'hover',
      className: 'text-orange-300 fill-current',
    },
    {
      type: 'heart',
      variant: 'success',
      state: 'filled',
      className: 'text-green-500 fill-current',
    },
    {
      type: 'heart',
      variant: 'success',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'heart',
      variant: 'success',
      state: 'hover',
      className: 'text-green-400 fill-current',
    },

    // Thumbs variants
    {
      type: 'thumbs',
      variant: 'default',
      state: 'filled',
      className: 'text-blue-500 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'default',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'thumbs',
      variant: 'default',
      state: 'hover',
      className: 'text-blue-400 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'accent',
      state: 'filled',
      className: 'text-primary fill-current',
    },
    {
      type: 'thumbs',
      variant: 'accent',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'thumbs',
      variant: 'accent',
      state: 'hover',
      className: 'text-primary/80 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'warning',
      state: 'filled',
      className: 'text-orange-400 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'warning',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'thumbs',
      variant: 'warning',
      state: 'hover',
      className: 'text-orange-300 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'success',
      state: 'filled',
      className: 'text-green-500 fill-current',
    },
    {
      type: 'thumbs',
      variant: 'success',
      state: 'unfilled',
      className: 'text-gray-300 dark:text-gray-600',
    },
    {
      type: 'thumbs',
      variant: 'success',
      state: 'hover',
      className: 'text-green-400 fill-current',
    },

    // Star hover states
    {
      type: 'star',
      variant: 'default',
      state: 'hover',
      className: 'text-yellow-300 fill-current',
    },
    {
      type: 'star',
      variant: 'accent',
      state: 'hover',
      className: 'text-primary/80 fill-current',
    },
    {
      type: 'star',
      variant: 'warning',
      state: 'hover',
      className: 'text-orange-300 fill-current',
    },
    {
      type: 'star',
      variant: 'success',
      state: 'hover',
      className: 'text-green-400 fill-current',
    },

    // Heart hover states
    {
      type: 'heart',
      variant: 'default',
      state: 'hover',
      className: 'text-red-400 fill-current',
    },
    {
      type: 'heart',
      variant: 'accent',
      state: 'hover',
      className: 'text-primary/80 fill-current',
    },
    {
      type: 'heart',
      variant: 'warning',
      state: 'hover',
      className: 'text-orange-300 fill-current',
    },
    {
      type: 'heart',
      variant: 'success',
      state: 'hover',
      className: 'text-green-400 fill-current',
    },

    // Numeric variants - all have consistent sizing to prevent layout shifts
    {
      type: 'numeric',
      variant: 'default',
      state: 'filled',
      className:
        'text-foreground bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1.5 font-semibold border-2 border-gray-300 dark:border-gray-600 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'default',
      state: 'unfilled',
      className:
        'text-muted-foreground/60 bg-transparent rounded-md px-3 py-1.5 border-2 border-transparent',
    },
    {
      type: 'numeric',
      variant: 'accent',
      state: 'filled',
      className:
        'text-primary-foreground bg-primary rounded-md px-3 py-1.5 font-semibold border-2 border-primary/30 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'accent',
      state: 'unfilled',
      className:
        'text-muted-foreground/60 bg-transparent rounded-md px-3 py-1.5 border-2 border-transparent',
    },
    {
      type: 'numeric',
      variant: 'warning',
      state: 'filled',
      className:
        'text-white bg-orange-500 rounded-md px-3 py-1.5 font-semibold border-2 border-orange-300 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'warning',
      state: 'unfilled',
      className:
        'text-muted-foreground/60 bg-transparent rounded-md px-3 py-1.5 border-2 border-transparent',
    },
    {
      type: 'numeric',
      variant: 'success',
      state: 'filled',
      className:
        'text-white bg-green-500 rounded-md px-3 py-1.5 font-semibold border-2 border-green-300 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'success',
      state: 'unfilled',
      className:
        'text-muted-foreground/60 bg-transparent rounded-md px-3 py-1.5 border-2 border-transparent',
    },

    // Numeric hover states - maintain consistent sizing
    {
      type: 'numeric',
      variant: 'default',
      state: 'hover',
      className:
        'text-foreground bg-gray-200 dark:bg-gray-700 rounded-md px-3 py-1.5 font-medium border-2 border-gray-400 dark:border-gray-500 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'accent',
      state: 'hover',
      className:
        'text-primary-foreground bg-primary/90 rounded-md px-3 py-1.5 font-medium border-2 border-primary/50 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'warning',
      state: 'hover',
      className:
        'text-white bg-orange-600 rounded-md px-3 py-1.5 font-medium border-2 border-orange-400 shadow-sm',
    },
    {
      type: 'numeric',
      variant: 'success',
      state: 'hover',
      className:
        'text-white bg-green-600 rounded-md px-3 py-1.5 font-medium border-2 border-green-400 shadow-sm',
    },

    // Disabled state
    {
      state: 'disabled',
      className: 'opacity-50 cursor-not-allowed',
    },
  ],
  defaultVariants: {
    size: 'md',
    type: 'star',
    variant: 'default',
    state: 'unfilled',
    interactive: false,
  },
});
