import { cva } from 'class-variance-authority';

/**
 * Table variants using class-variance-authority
 *
 * Provides styling for table components with different visual styles and behaviors.
 */
export const tableVariants = cva(
  ['w-full', 'caption-bottom', 'text-sm', 'border-collapse'],
  {
    variants: {
      variant: {
        default: ['border-border'],
        simple: ['border-none'],
        lined: ['border-border', 'border-separate', 'border-spacing-0'],
      },
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
      striped: {
        true: [],
        false: [],
      },
      hover: {
        true: [],
        false: [],
      },
      bordered: {
        true: ['border', 'border-border'],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      striped: false,
      hover: false,
      bordered: false,
    },
  }
);

/**
 * Table header variants
 */
export const tableHeaderVariants = cva(['border-b', 'border-border'], {
  variants: {
    variant: {
      default: ['bg-muted'],
      minimal: ['bg-transparent'],
      accent: ['bg-primary/10', 'text-primary'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Table body variants
 */
export const tableBodyVariants = cva(['[&_tr:last-child]:border-0']);

/**
 * Table footer variants
 */
export const tableFooterVariants = cva(
  ['border-t', 'border-border', 'bg-muted', 'font-medium'],
  {
    variants: {
      variant: {
        default: [],
        minimal: ['bg-transparent'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Table row variants
 */
export const tableRowVariants = cva(
  ['border-b', 'border-border', 'transition-colors'],
  {
    variants: {
      variant: {
        default: ['hover:bg-muted/50'],
        interactive: [
          'hover:bg-muted/50',
          'data-[state=selected]:bg-accent',
          'data-[state=selected]:text-accent-foreground',
          'focus-visible:bg-muted/50',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
        ],
        striped: ['odd:bg-muted/30', 'even:bg-background', 'hover:bg-muted/50'],
        highlighted: [
          'bg-warning/10',
          'border-warning/30',
          'text-neutral-800',
          'dark:text-warning',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Table head cell variants
 */
export const tableHeadVariants = cva(
  [
    'h-10',
    'px-4',
    'text-left',
    'align-middle',
    'font-semibold',
    'text-foreground',
    '[&:has([role=checkbox])]:pr-0',
  ],
  {
    variants: {
      variant: {
        default: [],
        sortable: [
          'cursor-pointer',
          'hover:bg-muted',
          'focus:bg-muted',
          'focus:outline-none',
        ],
      },
      align: {
        left: ['text-left'],
        center: ['text-center'],
        right: ['text-right'],
      },
      size: {
        sm: ['h-8', 'px-2', 'text-xs'],
        default: ['h-10', 'px-4', 'text-sm'],
        lg: ['h-12', 'px-6', 'text-base'],
      },
      sortable: {
        true: [
          'cursor-pointer',
          'select-none',
          'hover:bg-muted',
          'focus:bg-muted',
          'focus:outline-none',
          'transition-colors',
        ],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'left',
      size: 'default',
      sortable: false,
    },
  }
);

/**
 * Table data cell variants
 */
export const tableCellVariants = cva(
  ['px-4', 'py-3', 'align-middle', '[&:has([role=checkbox])]:pr-0'],
  {
    variants: {
      align: {
        left: ['text-left'],
        center: ['text-center'],
        right: ['text-right'],
      },
      size: {
        sm: ['px-2', 'py-2', 'text-xs'],
        default: ['px-4', 'py-3', 'text-sm'],
        lg: ['px-6', 'py-4', 'text-base'],
      },
      variant: {
        default: [],
        numeric: ['font-mono', 'text-right'],
        emphasized: ['font-semibold'],
        muted: ['text-muted-foreground'],
      },
    },
    defaultVariants: {
      align: 'left',
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Table caption variants
 */
export const tableCaptionVariants = cva(
  ['mt-4', 'text-sm', 'text-muted-foreground'],
  {
    variants: {
      side: {
        top: ['caption-top', 'mb-4', 'mt-0'],
        bottom: ['caption-bottom', 'mt-4'],
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  }
);
