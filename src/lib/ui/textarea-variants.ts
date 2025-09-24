import { cva } from 'class-variance-authority';

/**
 * Textarea variants using class-variance-authority
 *
 * Provides styling for textarea components with consistent spacing, sizing, and states.
 */
export const textareaVariants = cva(
  [
    'flex',
    'w-full',
    'rounded-md',
    'border',
    'bg-white',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-white',
    'placeholder:text-gray-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'resize-none',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300',
          'focus:border-blue-500',
          'focus:ring-blue-500',
        ],
        destructive: [
          'border-red-300',
          'text-red-900',
          'focus:border-red-500',
          'focus:ring-red-500',
          'bg-red-50',
        ],
        success: [
          'border-green-300',
          'text-green-900',
          'focus:border-green-500',
          'focus:ring-green-500',
          'bg-green-50',
        ],
        warning: [
          'border-yellow-300',
          'text-yellow-900',
          'focus:border-yellow-500',
          'focus:ring-yellow-500',
          'bg-yellow-50',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'focus:border-gray-300',
          'focus:ring-gray-300',
        ],
      },
      size: {
        sm: ['text-xs', 'px-2', 'py-1', 'min-h-[2.5rem]'],
        default: ['text-sm', 'px-3', 'py-2', 'min-h-[3rem]'],
        lg: ['text-base', 'px-4', 'py-3', 'min-h-[3.5rem]'],
      },
      resize: {
        none: ['resize-none'],
        vertical: ['resize-y'],
        horizontal: ['resize-x'],
        both: ['resize'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      resize: 'vertical',
    },
  }
);

/**
 * Textarea label variants using class-variance-authority
 *
 * Provides styling for textarea labels with proper spacing and emphasis.
 */
export const textareaLabelVariants = cva(
  ['block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
      required: {
        true: ['after:content-["*"]', 'after:ml-1', 'after:text-red-500'],
        false: [],
      },
      disabled: {
        true: ['text-gray-400', 'cursor-not-allowed'],
        false: ['text-gray-700'],
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
      disabled: false,
    },
  }
);

/**
 * Textarea helper text variants using class-variance-authority
 *
 * Provides styling for helper text, error messages, and character counts.
 */
export const textareaHelperVariants = cva(['text-xs', 'mt-1'], {
  variants: {
    variant: {
      default: ['text-gray-500'],
      error: ['text-red-600'],
      success: ['text-green-600'],
      warning: ['text-yellow-600'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Recipe textarea variants using class-variance-authority
 *
 * Specialized styling for recipe-specific textarea use cases.
 */
export const recipeTextareaVariants = cva(
  [
    'w-full',
    'rounded-lg',
    'border-2',
    'p-4',
    'text-sm',
    'leading-relaxed',
    'transition-all',
    'duration-200',
    'resize-vertical',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ],
  {
    variants: {
      type: {
        description: [
          'min-h-[6rem]',
          'border-blue-200',
          'bg-blue-50',
          'text-blue-900',
          'placeholder:text-blue-500',
          'focus:border-blue-400',
          'focus:ring-blue-500',
          'focus:bg-blue-100',
        ],
        notes: [
          'min-h-[4rem]',
          'border-yellow-200',
          'bg-yellow-50',
          'text-yellow-900',
          'placeholder:text-yellow-500',
          'focus:border-yellow-400',
          'focus:ring-yellow-500',
          'focus:bg-yellow-100',
        ],
        instructions: [
          'min-h-[8rem]',
          'border-green-200',
          'bg-green-50',
          'text-green-900',
          'placeholder:text-green-500',
          'focus:border-green-400',
          'focus:ring-green-500',
          'focus:bg-green-100',
        ],
        tips: [
          'min-h-[4rem]',
          'border-purple-200',
          'bg-purple-50',
          'text-purple-900',
          'placeholder:text-purple-500',
          'focus:border-purple-400',
          'focus:ring-purple-500',
          'focus:bg-purple-100',
        ],
        review: [
          'min-h-[5rem]',
          'border-orange-200',
          'bg-orange-50',
          'text-orange-900',
          'placeholder:text-orange-500',
          'focus:border-orange-400',
          'focus:ring-orange-500',
          'focus:bg-orange-100',
        ],
      },
      state: {
        default: [],
        focused: ['ring-2', 'ring-offset-2'],
        error: [
          'border-red-400',
          'bg-red-50',
          'text-red-900',
          'focus:border-red-500',
          'focus:ring-red-500',
        ],
        success: [
          'border-green-400',
          'bg-green-50',
          'text-green-900',
          'focus:border-green-500',
          'focus:ring-green-500',
        ],
      },
    },
    defaultVariants: {
      type: 'description',
      state: 'default',
    },
  }
);

/**
 * Character counter variants using class-variance-authority
 *
 * Provides styling for character count displays with warning states.
 */
export const characterCounterVariants = cva(
  ['text-xs', 'font-medium', 'tabular-nums'],
  {
    variants: {
      state: {
        default: ['text-gray-500'],
        warning: ['text-yellow-600'],
        error: ['text-red-600'],
        success: ['text-green-600'],
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

/**
 * Textarea container variants using class-variance-authority
 *
 * Provides styling for textarea wrapper containers with proper spacing.
 */
export const textareaContainerVariants = cva(['space-y-1'], {
  variants: {
    fullWidth: {
      true: ['w-full'],
      false: ['w-auto'],
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
