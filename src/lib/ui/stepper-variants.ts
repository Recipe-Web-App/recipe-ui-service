import { cva } from 'class-variance-authority';

/**
 * Stepper container variants using class-variance-authority
 */
export const stepperVariants = cva(['flex', 'items-start', 'w-full'], {
  variants: {
    orientation: {
      horizontal: ['flex-row', 'space-x-4', 'overflow-x-auto', 'pb-2'],
      vertical: ['flex-col', 'space-y-4'],
    },
    variant: {
      default: ['bg-background'],
      compact: ['bg-background', 'p-2'],
      elevated: ['bg-card', 'border', 'rounded-lg', 'p-4', 'shadow-sm'],
      bordered: ['bg-background', 'border', 'rounded-lg', 'p-4'],
    },
    size: {
      sm: ['text-sm'],
      default: ['text-base'],
      lg: ['text-lg'],
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    size: 'default',
  },
});

/**
 * Stepper item variants for individual step containers
 */
export const stepperItemVariants = cva(
  ['flex', 'items-start', 'transition-all', 'duration-200'],
  {
    variants: {
      orientation: {
        horizontal: [
          'flex-col',
          'items-center',
          'text-center',
          'flex-1',
          'min-w-0',
          'max-w-48',
          'justify-start',
        ],
        vertical: ['flex-row', 'items-start', 'w-full'],
      },
      state: {
        pending: ['text-muted-foreground'],
        active: ['text-primary'],
        completed: ['text-green-600'],
        error: ['text-destructive'],
        skipped: ['text-muted-foreground/60'],
      },
      size: {
        sm: ['gap-2'],
        default: ['gap-3'],
        lg: ['gap-4'],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      state: 'pending',
      size: 'default',
    },
  }
);

/**
 * Step indicator variants for numbered circles and icons
 */
export const stepIndicatorVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-semibold',
    'transition-all',
    'duration-200',
    'flex-shrink-0',
    'border-2',
  ],
  {
    variants: {
      state: {
        pending: [
          'bg-muted',
          'border-muted-foreground/30',
          'text-muted-foreground',
        ],
        active: [
          'bg-primary',
          'border-primary',
          'text-primary-foreground',
          'shadow-sm',
        ],
        completed: ['bg-green-600', 'border-green-600', 'text-white'],
        error: [
          'bg-destructive',
          'border-destructive',
          'text-destructive-foreground',
        ],
        skipped: [
          'bg-muted/50',
          'border-muted-foreground/20',
          'text-muted-foreground/60',
        ],
      },
      size: {
        sm: ['h-6', 'w-6', 'text-xs'],
        default: ['h-8', 'w-8', 'text-sm'],
        lg: ['h-10', 'w-10', 'text-base'],
      },
      variant: {
        numbered: [],
        dotted: ['h-3', 'w-3', 'border-0'],
        icon: [],
      },
    },
    defaultVariants: {
      state: 'pending',
      size: 'default',
      variant: 'numbered',
    },
  }
);

/**
 * Step connector variants for lines between steps
 */
export const stepConnectorVariants = cva(['transition-all', 'duration-200'], {
  variants: {
    orientation: {
      horizontal: ['flex-1', 'h-0.5', 'mx-2'],
      vertical: ['w-0.5', 'flex-1', 'my-2', 'ml-4'],
    },
    state: {
      pending: ['bg-muted'],
      active: ['bg-primary/30'],
      completed: ['bg-green-600'],
      error: ['bg-destructive'],
      skipped: ['bg-muted/50'],
    },
    variant: {
      solid: [],
      dashed: ['border-dashed', 'border-t-2', 'bg-transparent'],
      dotted: ['border-dotted', 'border-t-2', 'bg-transparent'],
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    state: 'pending',
    variant: 'solid',
  },
});

/**
 * Step header variants for title and description areas
 */
export const stepHeaderVariants = cva(['transition-all', 'duration-200'], {
  variants: {
    orientation: {
      horizontal: ['text-center'],
      vertical: ['flex-1', 'ml-3'],
    },
    state: {
      pending: ['text-muted-foreground'],
      active: ['text-foreground'],
      completed: ['text-foreground'],
      error: ['text-destructive'],
      skipped: ['text-muted-foreground/60'],
    },
    size: {
      sm: ['space-y-0.5'],
      default: ['space-y-1'],
      lg: ['space-y-2'],
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    state: 'pending',
    size: 'default',
  },
});

/**
 * Step title variants
 */
export const stepTitleVariants = cva(
  ['font-medium', 'transition-colors', 'duration-200'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
      state: {
        pending: ['text-muted-foreground'],
        active: ['text-foreground', 'font-semibold'],
        completed: ['text-foreground'],
        error: ['text-destructive'],
        skipped: ['text-muted-foreground/60'],
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'pending',
    },
  }
);

/**
 * Step description variants
 */
export const stepDescriptionVariants = cva(
  ['transition-colors', 'duration-200'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        default: ['text-xs'],
        lg: ['text-sm'],
      },
      state: {
        pending: ['text-muted-foreground/80'],
        active: ['text-muted-foreground'],
        completed: ['text-muted-foreground/80'],
        error: ['text-destructive/80'],
        skipped: ['text-muted-foreground/40'],
      },
      orientation: {
        horizontal: [],
        vertical: ['mt-0.5'],
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'pending',
      orientation: 'horizontal',
    },
  }
);

/**
 * Step content variants for collapsible content areas
 */
export const stepContentVariants = cva(
  ['transition-all', 'duration-300', 'ease-in-out'],
  {
    variants: {
      orientation: {
        horizontal: ['w-full', 'mt-4'],
        vertical: ['w-full', 'mt-2', 'ml-11'],
      },
      state: {
        hidden: ['hidden'],
        visible: ['block'],
        collapsed: ['overflow-hidden', 'max-h-0'],
        expanded: ['overflow-visible', 'max-h-none'],
      },
      variant: {
        default: ['p-4', 'bg-muted/50', 'rounded-lg'],
        minimal: ['py-2'],
        bordered: ['p-4', 'border', 'rounded-lg', 'bg-card'],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      state: 'hidden',
      variant: 'default',
    },
  }
);

/**
 * Step controls variants for navigation buttons
 */
export const stepControlsVariants = cva(
  ['flex', 'gap-2', 'justify-between', 'items-center', 'mt-6'],
  {
    variants: {
      alignment: {
        left: ['justify-start'],
        center: ['justify-center'],
        right: ['justify-end'],
        between: ['justify-between'],
      },
      size: {
        sm: ['gap-1', 'mt-4'],
        default: ['gap-2', 'mt-6'],
        lg: ['gap-3', 'mt-8'],
      },
    },
    defaultVariants: {
      alignment: 'between',
      size: 'default',
    },
  }
);

/**
 * Step progress variants for linear progress indicator
 */
export const stepProgressVariants = cva(
  [
    'w-full',
    'bg-muted',
    'rounded-full',
    'overflow-hidden',
    'transition-all',
    'duration-300',
  ],
  {
    variants: {
      size: {
        sm: ['h-1'],
        default: ['h-2'],
        lg: ['h-3'],
      },
      variant: {
        default: ['mb-6'],
        embedded: ['mb-4'],
        floating: ['fixed', 'top-0', 'left-0', 'z-50', 'rounded-none'],
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Recipe stepper variants for cooking-specific workflows
 */
export const recipeStepperVariants = cva(
  ['flex', 'flex-col', 'gap-4', 'p-4', 'rounded-lg', 'border'],
  {
    variants: {
      workflow: {
        creation: [
          'bg-blue-50',
          'border-blue-200',
          'dark:bg-blue-950',
          'dark:border-blue-800',
        ],
        cooking: [
          'bg-orange-50',
          'border-orange-200',
          'dark:bg-orange-950',
          'dark:border-orange-800',
        ],
        planning: [
          'bg-green-50',
          'border-green-200',
          'dark:bg-green-950',
          'dark:border-green-800',
        ],
        importing: [
          'bg-purple-50',
          'border-purple-200',
          'dark:bg-purple-950',
          'dark:border-purple-800',
        ],
      },
      emphasis: {
        subtle: ['opacity-80'],
        normal: [],
        strong: ['shadow-md', 'border-2'],
      },
    },
    defaultVariants: {
      workflow: 'creation',
      emphasis: 'normal',
    },
  }
);

/**
 * Cooking step timer variants
 */
export const cookingTimerVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1',
    'px-2',
    'py-1',
    'rounded-md',
    'text-xs',
    'font-medium',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      state: {
        idle: ['bg-muted', 'text-muted-foreground'],
        running: ['bg-orange-100', 'text-orange-700', 'animate-pulse'],
        paused: ['bg-yellow-100', 'text-yellow-700'],
        completed: ['bg-green-100', 'text-green-700'],
        expired: ['bg-red-100', 'text-red-700'],
      },
    },
    defaultVariants: {
      state: 'idle',
    },
  }
);
