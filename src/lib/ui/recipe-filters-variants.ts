import { cva } from 'class-variance-authority';

/**
 * Recipe filters container variants
 *
 * RecipeFilters wraps FilterPanel, so most styling comes from filter-panel-variants.
 * These variants are for RecipeFilters-specific styling needs.
 */
export const recipeFiltersVariants = cva('w-full', {
  variants: {
    layout: {
      sidebar: 'lg:max-w-xs xl:max-w-sm',
      inline: 'w-full',
      drawer: 'w-full h-full',
    },
    density: {
      compact: 'space-y-2',
      comfortable: 'space-y-4',
      spacious: 'space-y-6',
    },
  },
  defaultVariants: {
    layout: 'sidebar',
    density: 'comfortable',
  },
});

/**
 * Mobile filter trigger button variants
 */
export const recipeFiltersTriggerVariants = cva(
  'flex items-center justify-between w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
        filled:
          'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow',
        ghost:
          'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-md',
        md: 'px-4 py-2.5 text-base rounded-lg',
        lg: 'px-5 py-3 text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Recipe filter result count badge variants
 */
export const recipeFiltersResultBadgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        accent: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Recipe filter drawer content variants
 */
export const recipeFiltersDrawerContentVariants = cva(
  'flex flex-col bg-white dark:bg-gray-900',
  {
    variants: {
      size: {
        sm: 'max-h-[60vh]',
        md: 'max-h-[75vh]',
        full: 'h-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Recipe filter empty state variants
 */
export const recipeFiltersEmptyVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-4 px-3',
        md: 'py-8 px-4',
        lg: 'py-12 px-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
