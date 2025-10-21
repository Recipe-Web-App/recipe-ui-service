import { cva } from 'class-variance-authority';

/**
 * BrowseGrid container variants
 *
 * Defines the styling for the main container that wraps the grid and pagination
 */
export const browseGridVariants = cva('flex flex-col', {
  variants: {
    spacing: {
      compact: 'space-y-4',
      default: 'space-y-6',
      comfortable: 'space-y-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * BrowseGrid content (grid) variants
 *
 * Defines the responsive grid layout with configurable gaps
 */
export const browseGridContentVariants = cva('grid w-full', {
  variants: {
    gap: {
      sm: 'gap-3',
      md: 'gap-4 md:gap-6',
      lg: 'gap-6 md:gap-8',
    },
    columns: {
      // Default responsive columns: 2 mobile, 3 tablet, 4 desktop
      default: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      // Compact: more columns for smaller cards
      compact: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
      // Wide: fewer columns for larger cards
      wide: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      // Single column layout
      single: 'grid-cols-1',
      // Custom will be overridden by inline styles
      custom: '',
    },
  },
  defaultVariants: {
    gap: 'md',
    columns: 'default',
  },
});

/**
 * BrowseGrid pagination wrapper variants
 *
 * Defines the styling for the pagination controls wrapper
 */
export const browseGridPaginationVariants = cva(
  'flex w-full items-center justify-center',
  {
    variants: {
      position: {
        top: 'order-first',
        bottom: 'order-last',
        both: '', // When showing pagination at both top and bottom
      },
      spacing: {
        compact: 'pt-4',
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
 * BrowseGrid state message variants
 *
 * Defines styling for loading, empty, and error state messages
 */
export const browseGridStateVariants = cva(
  'flex min-h-[400px] w-full items-center justify-center',
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
 * BrowseGrid error message variants
 */
export const browseGridErrorVariants = cva(
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
