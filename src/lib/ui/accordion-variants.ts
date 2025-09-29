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
    'divide-border',
    'border',
    'border-border',
    'rounded-lg',
    'overflow-hidden',
  ],
  {
    variants: {
      variant: {
        default: ['bg-card'],
        outlined: ['bg-transparent', 'border-2'],
        elevated: ['bg-card', 'shadow-md'],
        minimal: ['bg-transparent', 'border-0', 'divide-y-0', 'rounded-none'],
        card: ['bg-muted', 'border-border'],
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
        default: ['hover:bg-muted/50'],
        outlined: ['hover:bg-muted/50'],
        elevated: ['hover:bg-muted/50'],
        minimal: ['hover:bg-muted/50', 'rounded-lg', 'px-2'],
        card: ['hover:bg-muted'],
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
    'focus:ring-ring',
    'focus:ring-offset-2',
    'group',
  ],
  {
    variants: {
      variant: {
        default: ['px-4', 'py-3', 'text-foreground', 'hover:text-primary'],
        outlined: ['px-4', 'py-3', 'text-foreground', 'hover:text-primary'],
        elevated: ['px-4', 'py-3', 'text-foreground', 'hover:text-primary'],
        minimal: ['px-2', 'py-2', 'text-foreground', 'hover:text-primary'],
        card: ['px-4', 'py-3', 'text-foreground', 'hover:text-primary'],
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
          'text-muted-foreground',
          'border-t',
          'border-border/50',
        ],
        outlined: [
          'px-4',
          'pb-4',
          'text-muted-foreground',
          'border-t',
          'border-border',
        ],
        elevated: [
          'px-4',
          'pb-4',
          'text-muted-foreground',
          'border-t',
          'border-border/50',
        ],
        minimal: ['px-2', 'pb-3', 'text-muted-foreground'],
        card: [
          'px-4',
          'pb-4',
          'text-muted-foreground',
          'border-t',
          'border-border',
        ],
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
        ingredients: ['border-l-basil', 'bg-basil/10', 'hover:bg-basil/15'],
        instructions: [
          'border-l-primary',
          'bg-primary/10',
          'hover:bg-primary/15',
        ],
        nutrition: [
          'border-l-secondary',
          'bg-secondary/10',
          'hover:bg-secondary/15',
        ],
        notes: ['border-l-citrus', 'bg-citrus/10', 'hover:bg-citrus/15'],
        tips: ['border-l-accent', 'bg-accent/10', 'hover:bg-accent/15'],
        variations: [
          'border-l-secondary',
          'bg-secondary/5',
          'hover:bg-secondary/10',
        ],
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
        ingredients: ['hover:bg-basil/15', 'rounded-md', 'p-2', '-m-2'],
        instructions: [
          'hover:bg-primary/15',
          'rounded-md',
          'p-2',
          '-m-2',
          'counter-increment: step-counter',
        ],
        checklist: ['hover:bg-muted', 'rounded-md', 'p-2', '-m-2'],
      },
      state: {
        default: [],
        checked: ['opacity-60', 'line-through'],
        highlighted: ['bg-citrus/15', 'border-citrus/30', 'border'],
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
        default: ['bg-primary', 'h-6', 'w-6'],
        large: ['bg-primary', 'h-8', 'w-8'],
        minimal: ['bg-muted', 'text-muted-foreground', 'h-6', 'w-6'],
      },
      state: {
        default: [],
        active: ['bg-primary/90', 'shadow-md'],
        completed: ['bg-basil'],
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
    'border-input',
    'text-basil',
    'focus:ring-basil',
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
