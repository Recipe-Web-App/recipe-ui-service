import { cva } from 'class-variance-authority';

/**
 * List variants using class-variance-authority
 *
 * Comprehensive list component system for recipe applications
 * with flexible styling and recipe-specific variants.
 */

// Main List container variants
export const listVariants = cva(['w-full', 'space-y-0'], {
  variants: {
    variant: {
      default: [],
      bordered: ['border', 'border-border', 'rounded-lg', 'overflow-hidden'],
      divided: [
        '[&>*:not(:last-child)]:border-b',
        '[&>*:not(:last-child)]:border-border',
      ],
      card: [
        'bg-card',
        'border',
        'border-border',
        'rounded-lg',
        'shadow-sm',
        'overflow-hidden',
      ],
      inline: ['flex', 'flex-wrap', 'gap-2', 'space-y-0'],
      grid: ['grid', 'gap-2', 'space-y-0'],
    },
    size: {
      sm: ['text-sm'],
      md: ['text-base'],
      lg: ['text-lg'],
    },
    density: {
      compact: ['[&>*]:py-1'],
      comfortable: ['[&>*]:py-2'],
      spacious: ['[&>*]:py-3'],
    },
    gridCols: {
      1: ['grid-cols-1'],
      2: ['grid-cols-1', 'sm:grid-cols-2'],
      3: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
      4: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    density: 'comfortable',
  },
});

// List Item variants
export const listItemVariants = cva(
  [
    'flex',
    'items-center',
    'gap-3',
    'px-4',
    'py-2',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: [],
        interactive: [
          'cursor-pointer',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
        ],
        selected: ['bg-accent', 'text-accent-foreground'],
        disabled: ['opacity-50', 'cursor-not-allowed', 'pointer-events-none'],
        destructive: ['text-destructive', 'hover:bg-destructive/10'],
      },
      size: {
        sm: ['px-2', 'py-1', 'text-sm', 'gap-2'],
        md: ['px-4', 'py-2', 'text-base', 'gap-3'],
        lg: ['px-6', 'py-3', 'text-lg', 'gap-4'],
      },
      alignment: {
        start: ['justify-start'],
        center: ['justify-center'],
        between: ['justify-between'],
        end: ['justify-end'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      alignment: 'start',
    },
  }
);

// List Item Content variants
export const listItemContentVariants = cva(
  ['flex', 'flex-col', 'min-w-0', 'flex-1'],
  {
    variants: {
      alignment: {
        start: ['items-start', 'text-left'],
        center: ['items-center', 'text-center'],
        end: ['items-end', 'text-right'],
      },
    },
    defaultVariants: {
      alignment: 'start',
    },
  }
);

// List Item Title variants
export const listItemTitleVariants = cva(
  ['font-medium', 'leading-none', 'tracking-tight'],
  {
    variants: {
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-lg'],
      },
      truncate: {
        true: [
          'truncate',
          'overflow-hidden',
          'text-ellipsis',
          'whitespace-nowrap',
        ],
        false: [],
      },
    },
    defaultVariants: {
      size: 'md',
      truncate: false,
    },
  }
);

// List Item Description variants
export const listItemDescriptionVariants = cva(
  ['text-muted-foreground', 'mt-1'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        md: ['text-sm'],
        lg: ['text-base'],
      },
      truncate: {
        true: [
          'truncate',
          'overflow-hidden',
          'text-ellipsis',
          'whitespace-nowrap',
        ],
        false: [],
      },
      lines: {
        1: ['line-clamp-1'],
        2: ['line-clamp-2'],
        3: ['line-clamp-3'],
        none: [],
      },
    },
    defaultVariants: {
      size: 'md',
      truncate: false,
      lines: 'none',
    },
  }
);

// List Item Icon variants
export const listItemIconVariants = cva(
  ['flex-shrink-0', 'flex', 'items-center', 'justify-center'],
  {
    variants: {
      position: {
        leading: ['order-first'],
        trailing: ['order-last', 'ml-auto'],
      },
      size: {
        sm: ['w-4', 'h-4'],
        md: ['w-5', 'h-5'],
        lg: ['w-6', 'h-6'],
        xl: ['w-8', 'h-8'],
      },
      variant: {
        default: [],
        muted: ['text-muted-foreground'],
        primary: ['text-primary'],
        destructive: ['text-destructive'],
        success: ['text-green-600'],
        warning: ['text-yellow-600'],
      },
    },
    defaultVariants: {
      position: 'leading',
      size: 'md',
      variant: 'default',
    },
  }
);

// Recipe-specific variants
export const recipeListVariants = cva(['space-y-1'], {
  variants: {
    context: {
      ingredients: [
        '[&>*]:border-l-2',
        '[&>*]:border-l-green-200',
        '[&>*]:pl-4',
      ],
      instructions: [
        '[&>*]:relative',
        '[&>*]:pl-8',
        '[&>*:before]:content-[counter(step-counter)]',
        '[&>*:before]:counter-increment-[step-counter]',
        '[&>*:before]:absolute',
        '[&>*:before]:left-0',
        '[&>*:before]:top-2',
        '[&>*:before]:w-6',
        '[&>*:before]:h-6',
        '[&>*:before]:bg-primary',
        '[&>*:before]:text-primary-foreground',
        '[&>*:before]:rounded-full',
        '[&>*:before]:flex',
        '[&>*:before]:items-center',
        '[&>*:before]:justify-center',
        '[&>*:before]:text-sm',
        '[&>*:before]:font-medium',
        'counter-reset-[step-counter]',
      ],
      nutrition: ['[&>*]:grid', '[&>*]:grid-cols-[1fr_auto]', '[&>*]:gap-4'],
      categories: ['[&>*]:flex', '[&>*]:items-center', '[&>*]:gap-2'],
      reviews: ['[&>*]:border-l-4', '[&>*]:border-l-blue-200', '[&>*]:pl-4'],
    },
    numbered: {
      true: [
        'counter-reset-[list-counter]',
        '[&>*]:counter-increment-[list-counter]',
        '[&>*]:relative',
        '[&>*]:pl-8',
        '[&>*:before]:content-[counter(list-counter)]',
        '[&>*:before]:absolute',
        '[&>*:before]:left-0',
        '[&>*:before]:top-2',
        '[&>*:before]:w-6',
        '[&>*:before]:h-6',
        '[&>*:before]:bg-muted',
        '[&>*:before]:text-muted-foreground',
        '[&>*:before]:rounded-full',
        '[&>*:before]:flex',
        '[&>*:before]:items-center',
        '[&>*:before]:justify-center',
        '[&>*:before]:text-sm',
        '[&>*:before]:font-medium',
      ],
      false: [],
    },
    checkable: {
      true: ['[&>*]:cursor-pointer', '[&>*:hover]:bg-accent'],
      false: [],
    },
  },
  defaultVariants: {
    numbered: false,
    checkable: false,
  },
});

// Shopping list specific variants
export const shoppingListVariants = cva(['space-y-1'], {
  variants: {
    showQuantities: {
      true: [
        '[&>*]:grid',
        '[&>*]:grid-cols-[auto_1fr_auto]',
        '[&>*]:gap-3',
        '[&>*]:items-center',
      ],
      false: [],
    },
    allowChecking: {
      true: [
        '[&>*]:cursor-pointer',
        '[&>*[data-checked="true"]]:opacity-60',
        '[&>*[data-checked="true"]]:line-through',
      ],
      false: [],
    },
    groupByCategory: {
      true: [
        '[&>[data-category]:not([data-category=""])]:mt-6',
        '[&>[data-category]:not([data-category=""]):first-child]:mt-0',
      ],
      false: [],
    },
  },
  defaultVariants: {
    showQuantities: true,
    allowChecking: true,
    groupByCategory: false,
  },
});

// Menu/Navigation list variants
export const menuListVariants = cva(['py-1', 'space-y-0'], {
  variants: {
    variant: {
      default: [],
      sidebar: ['space-y-1', 'p-2'],
      dropdown: [
        'min-w-48',
        'py-1',
        'bg-popover',
        'text-popover-foreground',
        'border',
        'border-border',
        'rounded-md',
        'shadow-md',
      ],
      tabs: ['flex', 'border-b', 'border-border', 'space-y-0', 'space-x-0'],
    },
    size: {
      sm: ['text-sm'],
      md: ['text-base'],
      lg: ['text-lg'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});
