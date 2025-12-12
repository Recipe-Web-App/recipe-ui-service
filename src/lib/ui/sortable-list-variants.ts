import { cva } from 'class-variance-authority';

/**
 * Sortable List variants using class-variance-authority
 *
 * Drag-and-drop sortable list component for reordering items.
 * Used for recipe ingredients and instructions.
 */

// Main Sortable List container variants
export const sortableListVariants = cva(['w-full', 'space-y-2'], {
  variants: {
    variant: {
      default: [],
      bordered: ['border', 'border-border', 'rounded-lg', 'p-2'],
      card: [
        'bg-card',
        'border',
        'border-border',
        'rounded-lg',
        'shadow-sm',
        'p-3',
      ],
    },
    size: {
      sm: ['space-y-1'],
      md: ['space-y-2'],
      lg: ['space-y-3'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Sortable Item variants
export const sortableItemVariants = cva(
  [
    'relative',
    'flex',
    'items-center',
    'gap-2',
    'bg-background',
    'border',
    'border-border',
    'rounded-lg',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['hover:border-primary/50'],
        ghost: ['border-transparent', 'hover:bg-accent'],
        card: ['shadow-sm', 'hover:shadow-md'],
      },
      size: {
        sm: ['px-2', 'py-1.5', 'text-sm'],
        md: ['px-3', 'py-2', 'text-base'],
        lg: ['px-4', 'py-3', 'text-lg'],
      },
      isDragging: {
        true: [
          'z-50',
          'shadow-lg',
          'border-primary',
          'ring-2',
          'ring-primary/20',
          'cursor-grabbing',
        ],
        false: [],
      },
      isOverlay: {
        true: ['opacity-90', 'cursor-grabbing'],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      isDragging: false,
      isOverlay: false,
    },
  }
);

// Drag Handle variants
export const dragHandleVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'flex-shrink-0',
    'cursor-grab',
    'touch-none',
    'select-none',
    'text-muted-foreground',
    'hover:text-foreground',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'rounded-md',
  ],
  {
    variants: {
      size: {
        sm: ['w-5', 'h-5', 'p-0.5'],
        md: ['w-6', 'h-6', 'p-1'],
        lg: ['w-8', 'h-8', 'p-1.5'],
      },
      isDragging: {
        true: ['cursor-grabbing', 'text-primary'],
        false: [],
      },
      disabled: {
        true: ['cursor-not-allowed', 'opacity-50', 'pointer-events-none'],
        false: [],
      },
    },
    defaultVariants: {
      size: 'md',
      isDragging: false,
      disabled: false,
    },
  }
);

// Sortable Item Content variants
export const sortableItemContentVariants = cva(['flex-1', 'min-w-0'], {
  variants: {
    layout: {
      row: ['flex', 'items-center', 'gap-2'],
      column: ['flex', 'flex-col', 'gap-1'],
      grid: ['grid', 'gap-2'],
    },
    alignment: {
      start: ['items-start', 'justify-start'],
      center: ['items-center', 'justify-center'],
      end: ['items-end', 'justify-end'],
      between: ['items-center', 'justify-between'],
    },
  },
  defaultVariants: {
    layout: 'row',
    alignment: 'start',
  },
});

// Sortable Item Actions variants
export const sortableItemActionsVariants = cva(
  ['flex', 'items-center', 'gap-1', 'flex-shrink-0'],
  {
    variants: {
      position: {
        end: ['order-last', 'ml-auto'],
        start: ['order-first', 'mr-auto'],
      },
      size: {
        sm: ['gap-0.5'],
        md: ['gap-1'],
        lg: ['gap-2'],
      },
    },
    defaultVariants: {
      position: 'end',
      size: 'md',
    },
  }
);

// Empty state variants for sortable list
export const sortableEmptyVariants = cva(
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'py-8',
    'text-center',
    'text-muted-foreground',
    'border-2',
    'border-dashed',
    'border-border',
    'rounded-lg',
  ],
  {
    variants: {
      size: {
        sm: ['py-4', 'text-sm'],
        md: ['py-8', 'text-base'],
        lg: ['py-12', 'text-lg'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Drop indicator variants
export const dropIndicatorVariants = cva(
  ['absolute', 'left-0', 'right-0', 'h-0.5', 'bg-primary', 'rounded-full'],
  {
    variants: {
      position: {
        before: ['top-0', '-translate-y-1/2'],
        after: ['bottom-0', 'translate-y-1/2'],
      },
    },
    defaultVariants: {
      position: 'before',
    },
  }
);
