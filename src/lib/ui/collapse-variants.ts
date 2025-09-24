import { cva } from 'class-variance-authority';

/**
 * Collapse container variants using class-variance-authority
 *
 * Provides styling for collapsible containers with smooth animations.
 */
export const collapseVariants = cva(
  ['w-full', 'transition-all', 'duration-300', 'ease-in-out'],
  {
    variants: {
      variant: {
        default: ['border', 'border-gray-200', 'rounded-lg', 'bg-white'],
        outlined: [
          'border-2',
          'border-gray-300',
          'rounded-lg',
          'bg-transparent',
        ],
        elevated: [
          'border',
          'border-gray-200',
          'rounded-lg',
          'bg-white',
          'shadow-md',
        ],
        minimal: ['bg-transparent', 'border-0', 'rounded-none'],
        card: ['border', 'border-gray-300', 'rounded-lg', 'bg-gray-50'],
      },
      size: {
        sm: ['text-sm'],
        default: ['text-base'],
        lg: ['text-lg'],
      },
      state: {
        open: [],
        closed: [],
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
 * Collapse trigger (header) variants using class-variance-authority
 *
 * Provides styling for collapse triggers with icons and states.
 */
export const collapseTriggerVariants = cva(
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
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        outlined: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        elevated: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        minimal: ['px-2', 'py-2', 'text-gray-900', 'hover:text-blue-600'],
        card: [
          'px-4',
          'py-3',
          'text-gray-800',
          'hover:text-blue-600',
          'hover:bg-gray-100',
        ],
      },
      size: {
        sm: ['py-2', 'text-sm'],
        default: ['py-3', 'text-base'],
        lg: ['py-4', 'text-lg'],
      },
      disabled: {
        true: [
          'cursor-not-allowed',
          'opacity-50',
          'hover:text-gray-900',
          'hover:bg-transparent',
        ],
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
 * Collapse content variants using class-variance-authority
 *
 * Provides styling for collapse content areas with smooth transitions.
 */
export const collapseContentVariants = cva(
  ['overflow-hidden', 'transition-all', 'ease-in-out'],
  {
    variants: {
      variant: {
        default: ['px-4', 'text-gray-700', 'border-t', 'border-gray-100'],
        outlined: ['px-4', 'text-gray-700', 'border-t', 'border-gray-200'],
        elevated: ['px-4', 'text-gray-700', 'border-t', 'border-gray-100'],
        minimal: ['px-2', 'text-gray-700'],
        card: ['px-4', 'text-gray-600', 'border-t', 'border-gray-200'],
      },
      size: {
        sm: ['text-sm', 'py-2'],
        default: ['text-base', 'py-3'],
        lg: ['text-lg', 'py-4'],
      },
      animationSpeed: {
        fast: ['duration-150'],
        normal: ['duration-300'],
        slow: ['duration-500'],
      },
      state: {
        open: ['opacity-100', 'max-h-screen'],
        closed: ['opacity-0', 'max-h-0', 'py-0', 'border-t-0'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animationSpeed: 'normal',
      state: 'closed',
    },
  }
);

/**
 * Collapse icon variants using class-variance-authority
 *
 * Provides styling for collapse expand/collapse icons.
 */
export const collapseIconVariants = cva(
  ['transition-transform', 'ease-in-out', 'flex-shrink-0'],
  {
    variants: {
      size: {
        sm: ['h-4', 'w-4'],
        default: ['h-5', 'w-5'],
        lg: ['h-6', 'w-6'],
      },
      animationSpeed: {
        fast: ['duration-150'],
        normal: ['duration-200'],
        slow: ['duration-300'],
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
      animationSpeed: 'normal',
      state: 'closed',
      position: 'right',
    },
  }
);

/**
 * Recipe section collapse variants using class-variance-authority
 *
 * Specialized styling for recipe ingredients and instructions sections.
 */
export const recipeSectionCollapseVariants = cva(
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
        equipment: [
          'border-l-indigo-500',
          'bg-indigo-50',
          'hover:bg-indigo-100',
        ],
        timeline: ['border-l-red-500', 'bg-red-50', 'hover:bg-red-100'],
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
 * Styling for ingredient lists and instruction steps within collapse.
 */
export const recipeListCollapseVariants = cva(['space-y-2', 'mt-3'], {
  variants: {
    type: {
      ingredients: ['list-none'],
      instructions: ['list-none', 'counter-reset: step-counter'],
      checklist: ['list-none'],
      equipment: ['list-none'],
      notes: ['list-none'],
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
export const recipeListItemCollapseVariants = cva(
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
        equipment: ['hover:bg-indigo-100', 'rounded-md', 'p-2', '-m-2'],
        notes: ['hover:bg-yellow-100', 'rounded-md', 'p-2', '-m-2'],
      },
      state: {
        default: [],
        checked: ['opacity-60', 'line-through'],
        highlighted: ['bg-yellow-100', 'border-yellow-300', 'border'],
        active: ['bg-blue-50', 'border-blue-300', 'border'],
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
 * Styling for step numbers in instruction lists within collapse.
 */
export const recipeStepNumberCollapseVariants = cva(
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
        upcoming: ['bg-gray-400'],
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
 * Styling for ingredient checkboxes in shopping lists within collapse.
 */
export const ingredientCheckboxCollapseVariants = cva(
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
      state: {
        default: [],
        checked: ['bg-green-500', 'border-green-500'],
        indeterminate: ['bg-gray-400', 'border-gray-400'],
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);
