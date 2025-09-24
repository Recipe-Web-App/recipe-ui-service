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
        default: ['border-gray-200', 'dark:border-gray-800'],
        simple: ['border-none'],
        lined: [
          'border-gray-200',
          'border-separate',
          'border-spacing-0',
          'dark:border-gray-800',
        ],
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
        true: ['border', 'border-gray-200', 'dark:border-gray-800'],
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
export const tableHeaderVariants = cva(
  ['border-b', 'border-gray-200', 'dark:border-gray-800'],
  {
    variants: {
      variant: {
        default: ['bg-gray-50', 'dark:bg-gray-900'],
        minimal: ['bg-transparent'],
        accent: ['bg-blue-50', 'dark:bg-blue-950'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Table body variants
 */
export const tableBodyVariants = cva(['[&_tr:last-child]:border-0']);

/**
 * Table footer variants
 */
export const tableFooterVariants = cva(
  [
    'border-t',
    'border-gray-200',
    'bg-gray-50',
    'font-medium',
    'dark:border-gray-800',
    'dark:bg-gray-900',
  ],
  {
    variants: {
      variant: {
        default: [],
        minimal: ['bg-transparent', 'dark:bg-transparent'],
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
  ['border-b', 'border-gray-200', 'transition-colors', 'dark:border-gray-800'],
  {
    variants: {
      variant: {
        default: ['hover:bg-gray-50', 'dark:hover:bg-gray-900'],
        interactive: [
          'hover:bg-gray-50',
          'data-[state=selected]:bg-gray-100',
          'focus-visible:bg-gray-50',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-blue-500',
          'focus-visible:ring-offset-2',
          'dark:hover:bg-gray-900',
          'dark:data-[state=selected]:bg-gray-800',
          'dark:focus-visible:bg-gray-900',
        ],
        striped: [
          'odd:bg-gray-50',
          'even:bg-white',
          'hover:bg-gray-100',
          'dark:odd:bg-gray-900',
          'dark:even:bg-gray-950',
          'dark:hover:bg-gray-800',
        ],
        highlighted: [
          'bg-yellow-50',
          'border-yellow-200',
          'dark:bg-yellow-950',
          'dark:border-yellow-800',
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
    'text-gray-900',
    'dark:text-gray-100',
    '[&:has([role=checkbox])]:pr-0',
  ],
  {
    variants: {
      variant: {
        default: [],
        sortable: [
          'cursor-pointer',
          'hover:bg-gray-100',
          'focus:bg-gray-100',
          'focus:outline-none',
          'dark:hover:bg-gray-800',
          'dark:focus:bg-gray-800',
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
          'hover:bg-gray-100',
          'focus:bg-gray-100',
          'focus:outline-none',
          'transition-colors',
          'dark:hover:bg-gray-800',
          'dark:focus:bg-gray-800',
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
        muted: ['text-gray-600', 'dark:text-gray-400'],
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
  ['mt-4', 'text-sm', 'text-gray-500', 'dark:text-gray-400'],
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
