import { cva } from 'class-variance-authority';

/**
 * Accordion root container variants using class-variance-authority
 *
 * Provides styling for accordion containers with consistent spacing and layout.
 */
export const accordionVariants = cva(
  [
    'w-full',
    'divide-y',
    'divide-gray-200',
    'border',
    'border-gray-200',
    'rounded-lg',
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: ['bg-white'],
        outlined: ['bg-transparent', 'border-2'],
        elevated: ['bg-white', 'shadow-md'],
        minimal: ['bg-transparent', 'border-0', 'divide-y-0', 'rounded-none'],
        card: ['bg-gray-50', 'border-gray-300'],
      },
      size: {
        sm: ['text-sm'],
        default: ['text-base'],
        lg: ['text-lg'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Accordion item variants using class-variance-authority
 *
 * Provides styling for individual accordion items.
 */
export const accordionItemVariants = cva(
  ['group', 'transition-colors', 'duration-200'],
  {
    variants: {
      variant: {
        default: ['hover:bg-gray-50'],
        outlined: ['hover:bg-gray-50'],
        elevated: ['hover:bg-gray-50'],
        minimal: ['hover:bg-gray-50', 'rounded-lg', 'px-2'],
        card: ['hover:bg-gray-100'],
      },
      state: {
        open: [],
        closed: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'closed',
    },
  }
);

/**
 * Accordion trigger (header) variants using class-variance-authority
 *
 * Provides styling for accordion headers/triggers with icons and states.
 */
export const accordionTriggerVariants = cva(
  [
    'flex',
    'w-full',
    'items-center',
    'justify-between',
    'text-left',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
    'group',
  ],
  {
    variants: {
      variant: {
        default: ['px-4', 'py-3', 'text-gray-900', 'hover:text-blue-600'],
        outlined: ['px-4', 'py-3', 'text-gray-900', 'hover:text-blue-600'],
        elevated: ['px-4', 'py-3', 'text-gray-900', 'hover:text-blue-600'],
        minimal: ['px-2', 'py-2', 'text-gray-900', 'hover:text-blue-600'],
        card: ['px-4', 'py-3', 'text-gray-800', 'hover:text-blue-600'],
      },
      size: {
        sm: ['py-2', 'text-sm'],
        default: ['py-3', 'text-base'],
        lg: ['py-4', 'text-lg'],
      },
      disabled: {
        true: ['cursor-not-allowed', 'opacity-50', 'hover:text-gray-900'],
        false: ['cursor-pointer'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

/**
 * Accordion content variants using class-variance-authority
 *
 * Provides styling for accordion content areas with proper spacing.
 */
export const accordionContentVariants = cva(
  ['overflow-hidden', 'transition-all', 'duration-300', 'ease-in-out'],
  {
    variants: {
      variant: {
        default: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-100',
        ],
        outlined: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-200',
        ],
        elevated: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-100',
        ],
        minimal: ['px-2', 'pb-3', 'text-gray-700'],
        card: ['px-4', 'pb-4', 'text-gray-600', 'border-t', 'border-gray-200'],
      },
      size: {
        sm: ['text-sm', 'py-2'],
        default: ['text-base', 'py-3'],
        lg: ['text-lg', 'py-4'],
      },
      state: {
        open: ['opacity-100'],
        closed: ['opacity-0', 'max-h-0', 'py-0', 'overflow-hidden'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'closed',
    },
  }
);

/**
 * Accordion icon variants using class-variance-authority
 *
 * Provides styling for accordion expand/collapse icons.
 */
export const accordionIconVariants = cva(
  ['transition-transform', 'duration-200', 'ease-in-out', 'flex-shrink-0'],
  {
    variants: {
      size: {
        sm: ['h-4', 'w-4'],
        default: ['h-5', 'w-5'],
        lg: ['h-6', 'w-6'],
      },
      state: {
        open: ['rotate-180'],
        closed: ['rotate-0'],
      },
      position: {
        left: ['mr-2'],
        right: ['ml-2'],
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'closed',
      position: 'right',
    },
  }
);

/**
 * Recipe section accordion variants using class-variance-authority
 *
 * Specialized styling for recipe ingredients and instructions sections.
 */
export const recipeSectionVariants = cva(
  ['border-l-4', 'transition-all', 'duration-200'],
  {
    variants: {
      section: {
        ingredients: [
          'border-l-green-500',
          'bg-green-50',
          'hover:bg-green-100',
        ],
        instructions: ['border-l-blue-500', 'bg-blue-50', 'hover:bg-blue-100'],
        nutrition: [
          'border-l-purple-500',
          'bg-purple-50',
          'hover:bg-purple-100',
        ],
        notes: ['border-l-yellow-500', 'bg-yellow-50', 'hover:bg-yellow-100'],
        tips: ['border-l-orange-500', 'bg-orange-50', 'hover:bg-orange-100'],
        variations: ['border-l-pink-500', 'bg-pink-50', 'hover:bg-pink-100'],
      },
      state: {
        open: ['shadow-sm'],
        closed: [],
      },
    },
    defaultVariants: {
      section: 'ingredients',
      state: 'closed',
    },
  }
);

/**
 * Recipe list variants using class-variance-authority
 *
 * Styling for ingredient lists and instruction steps within accordions.
 */
export const recipeListVariants = cva(['space-y-2', 'mt-3'], {
  variants: {
    type: {
      ingredients: ['list-none'],
      instructions: ['list-none', 'counter-reset: step-counter'],
      checklist: ['list-none'],
    },
    layout: {
      compact: ['space-y-1'],
      default: ['space-y-2'],
      spacious: ['space-y-3'],
    },
  },
  defaultVariants: {
    type: 'ingredients',
    layout: 'default',
  },
});

/**
 * Recipe list item variants using class-variance-authority
 *
 * Styling for individual ingredients and instruction steps.
 */
export const recipeListItemVariants = cva(
  ['flex', 'items-start', 'gap-3', 'transition-colors', 'duration-150'],
  {
    variants: {
      type: {
        ingredients: ['hover:bg-green-100', 'rounded-md', 'p-2', '-m-2'],
        instructions: [
          'hover:bg-blue-100',
          'rounded-md',
          'p-2',
          '-m-2',
          'counter-increment: step-counter',
        ],
        checklist: ['hover:bg-gray-100', 'rounded-md', 'p-2', '-m-2'],
      },
      state: {
        default: [],
        checked: ['opacity-60', 'line-through'],
        highlighted: ['bg-yellow-100', 'border-yellow-300', 'border'],
      },
    },
    defaultVariants: {
      type: 'ingredients',
      state: 'default',
    },
  }
);

/**
 * Recipe step number variants using class-variance-authority
 *
 * Styling for step numbers in instruction lists.
 */
export const recipeStepNumberVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-semibold',
    'text-white',
    'flex-shrink-0',
    'text-sm',
  ],
  {
    variants: {
      variant: {
        default: ['bg-blue-500', 'h-6', 'w-6'],
        large: ['bg-blue-500', 'h-8', 'w-8'],
        minimal: ['bg-gray-300', 'text-gray-700', 'h-6', 'w-6'],
      },
      state: {
        default: [],
        active: ['bg-blue-600', 'shadow-md'],
        completed: ['bg-green-500'],
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
    },
  }
);

/**
 * Ingredient checkbox variants using class-variance-authority
 *
 * Styling for ingredient checkboxes in shopping lists.
 */
export const ingredientCheckboxVariants = cva(
  [
    'rounded',
    'border-2',
    'border-gray-300',
    'text-green-600',
    'focus:ring-green-500',
    'focus:ring-2',
    'focus:ring-offset-2',
    'transition-colors',
    'duration-150',
  ],
  {
    variants: {
      size: {
        sm: ['h-4', 'w-4'],
        default: ['h-5', 'w-5'],
        lg: ['h-6', 'w-6'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);
