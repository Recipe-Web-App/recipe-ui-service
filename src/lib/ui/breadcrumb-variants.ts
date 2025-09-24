import { cva } from 'class-variance-authority';

/**
 * Breadcrumb container variants using class-variance-authority
 */
export const breadcrumbVariants = cva(
  // Base styles - applied to all breadcrumbs
  ['flex', 'items-center', 'text-muted-foreground'],
  {
    variants: {
      size: {
        sm: ['text-xs', 'space-x-0.5'],
        default: ['text-sm', 'space-x-1'],
        lg: ['text-base', 'space-x-2'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Breadcrumb list variants for the nav element
 */
export const breadcrumbListVariants = cva(
  ['flex', 'flex-wrap', 'items-center', 'break-words', 'text-muted-foreground'],
  {
    variants: {
      size: {
        sm: ['gap-1', 'text-xs', 'sm:gap-1.5'],
        default: ['gap-1.5', 'text-sm', 'sm:gap-2.5'],
        lg: ['gap-2', 'text-base', 'sm:gap-3'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Breadcrumb item variants for individual breadcrumb elements
 */
export const breadcrumbItemVariants = cva(
  ['inline-flex', 'items-center', 'gap-1.5'],
  {
    variants: {
      size: {
        sm: ['gap-1', 'text-xs'],
        default: ['gap-1.5', 'text-sm'],
        lg: ['gap-2', 'text-base'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Breadcrumb link variants for navigatable breadcrumb items
 */
export const breadcrumbLinkVariants = cva(
  [
    'transition-colors',
    'hover:text-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-1',
    'rounded-sm',
    'underline-offset-4',
    'hover:underline',
  ],
  {
    variants: {
      variant: {
        default: ['text-muted-foreground', 'hover:text-foreground'],
        solid: [
          'text-foreground',
          'font-medium',
          'px-2',
          'py-1',
          'rounded',
          'hover:bg-muted',
          'hover:no-underline',
        ],
        ghost: [
          'text-muted-foreground',
          'hover:text-foreground',
          'hover:bg-muted',
          'px-2',
          'py-1',
          'rounded',
          'hover:no-underline',
        ],
        minimal: [
          'text-muted-foreground',
          'hover:text-foreground',
          'hover:no-underline',
        ],
      },
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Breadcrumb page variants for the current page (non-clickable)
 */
export const breadcrumbPageVariants = cva(['font-normal', 'text-foreground'], {
  variants: {
    variant: {
      default: ['text-foreground'],
      emphasized: ['font-medium', 'text-foreground'],
      subtle: ['text-muted-foreground'],
    },
    size: {
      sm: ['text-xs'],
      default: ['text-sm'],
      lg: ['text-base'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Breadcrumb separator variants
 */
export const breadcrumbSeparatorVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    '[&>svg]:size-3.5',
    'text-muted-foreground/70',
  ],
  {
    variants: {
      variant: {
        chevron: [],
        slash: ['rotate-12'],
        arrow: [],
        dot: ['[&>svg]:size-1.5'],
      },
      size: {
        sm: ['[&>svg]:size-3'],
        default: ['[&>svg]:size-3.5'],
        lg: ['[&>svg]:size-4'],
      },
    },
    defaultVariants: {
      variant: 'chevron',
      size: 'default',
    },
  }
);

/**
 * Breadcrumb ellipsis variants for overflow indication
 */
export const breadcrumbEllipsisVariants = cva(
  [
    'flex',
    'h-9',
    'w-9',
    'items-center',
    'justify-center',
    'rounded-md',
    'hover:bg-muted',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-1',
    'transition-colors',
    'cursor-pointer',
    '[&>svg]:size-4',
  ],
  {
    variants: {
      size: {
        sm: ['h-7', 'w-7', '[&>svg]:size-3'],
        default: ['h-9', 'w-9', '[&>svg]:size-4'],
        lg: ['h-10', 'w-10', '[&>svg]:size-5'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe-specific breadcrumb variants for cooking workflow
 */
export const recipeBreadcrumbVariants = cva(
  [
    'flex',
    'items-center',
    'gap-2',
    'px-3',
    'py-2',
    'rounded-lg',
    'border',
    'bg-background',
  ],
  {
    variants: {
      workflow: {
        planning: [
          'border-blue-200',
          'bg-blue-50',
          'text-blue-800',
          'dark:border-blue-800',
          'dark:bg-blue-950',
          'dark:text-blue-200',
        ],
        shopping: [
          'border-green-200',
          'bg-green-50',
          'text-green-800',
          'dark:border-green-800',
          'dark:bg-green-950',
          'dark:text-green-200',
        ],
        cooking: [
          'border-orange-200',
          'bg-orange-50',
          'text-orange-800',
          'dark:border-orange-800',
          'dark:bg-orange-950',
          'dark:text-orange-200',
        ],
        serving: [
          'border-purple-200',
          'bg-purple-50',
          'text-purple-800',
          'dark:border-purple-800',
          'dark:bg-purple-950',
          'dark:text-purple-200',
        ],
      },
      emphasis: {
        subtle: ['opacity-70'],
        normal: [],
        strong: ['font-medium', 'shadow-sm'],
      },
    },
    defaultVariants: {
      workflow: 'cooking',
      emphasis: 'normal',
    },
  }
);
