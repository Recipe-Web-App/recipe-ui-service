import { cva } from 'class-variance-authority';

/**
 * BrowseList container variants
 *
 * Defines the styling for the main container that wraps the list and pagination
 */
export const browseListVariants = cva('flex flex-col', {
  variants: {
    spacing: {
      compact: 'space-y-3',
      default: 'space-y-6',
      comfortable: 'space-y-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * BrowseList content (list) variants
 *
 * Defines the list layout with configurable spacing and dividers
 */
export const browseListContentVariants = cva('w-full', {
  variants: {
    spacing: {
      compact: 'space-y-1',
      default: 'space-y-2',
      comfortable: 'space-y-3',
    },
    dividers: {
      true: 'divide-y divide-border',
      false: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
    dividers: false,
  },
});

/**
 * BrowseList pagination wrapper variants
 *
 * Defines the styling for the pagination controls wrapper
 */
export const browseListPaginationVariants = cva(
  'flex w-full items-center justify-center',
  {
    variants: {
      position: {
        top: 'order-first',
        bottom: 'order-last',
        both: '', // When showing pagination at both top and bottom
      },
      spacing: {
        compact: 'pt-3',
        default: 'pt-6',
        comfortable: 'pt-8',
      },
    },
    defaultVariants: {
      position: 'bottom',
      spacing: 'default',
    },
  }
);

/**
 * BrowseList state message variants
 *
 * Defines styling for loading, empty, and error state messages
 */
export const browseListStateVariants = cva(
  'flex min-h-[300px] w-full items-center justify-center',
  {
    variants: {
      type: {
        loading: 'animate-pulse',
        empty: '',
        error: '',
      },
    },
    defaultVariants: {
      type: 'empty',
    },
  }
);

/**
 * BrowseList error message variants
 */
export const browseListErrorVariants = cva(
  'flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
