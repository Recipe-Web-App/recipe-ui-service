import { cva } from 'class-variance-authority';

/**
 * Filter panel container variants
 */
export const filterPanelVariants = cva(
  'flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        compact: 'shadow-none border-0',
        full: 'shadow-lg',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      position: {
        sidebar: 'h-fit sticky top-4',
        drawer: 'fixed inset-0 z-50 lg:relative',
        modal: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'sidebar',
    },
  }
);

/**
 * Filter panel header variants
 */
export const filterPanelHeaderVariants = cva(
  'flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50',
  {
    variants: {
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-5 py-4',
      },
      collapsible: {
        true: 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      collapsible: false,
    },
  }
);

/**
 * Filter panel title variants
 */
export const filterPanelTitleVariants = cva(
  'font-semibold text-gray-900 dark:text-gray-100',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter panel badge variants (active filter count)
 */
export const filterPanelBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium',
  {
    variants: {
      size: {
        sm: 'h-5 min-w-5 px-1.5 text-xs',
        md: 'h-6 min-w-6 px-2 text-sm',
        lg: 'h-7 min-w-7 px-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter panel collapse button variants
 */
export const filterPanelCollapseButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
      collapsed: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      collapsed: false,
    },
  }
);

/**
 * Filter panel body variants
 */
export const filterPanelBodyVariants = cva(
  'overflow-y-auto overflow-x-hidden',
  {
    variants: {
      size: {
        sm: 'px-3 py-2 space-y-2',
        md: 'px-4 py-3 space-y-3',
        lg: 'px-5 py-4 space-y-4',
      },
      collapsed: {
        true: 'hidden',
        false: 'block',
      },
      maxHeight: {
        none: 'max-h-none',
        sm: 'max-h-96',
        md: 'max-h-[32rem]',
        lg: 'max-h-[40rem]',
        full: 'max-h-[calc(100vh-12rem)]',
      },
    },
    defaultVariants: {
      size: 'md',
      collapsed: false,
      maxHeight: 'lg',
    },
  }
);

/**
 * Filter panel section variants
 */
export const filterPanelSectionVariants = cva(
  'border-b border-gray-200 dark:border-gray-800 last:border-b-0',
  {
    variants: {
      size: {
        sm: 'pb-2',
        md: 'pb-3',
        lg: 'pb-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter section label variants
 */
export const filterSectionLabelVariants = cva(
  'font-medium text-gray-900 dark:text-gray-100 mb-2 block',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter section description variants
 */
export const filterSectionDescriptionVariants = cva(
  'text-gray-600 dark:text-gray-400 mb-3',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter panel footer variants
 */
export const filterPanelFooterVariants = cva(
  'border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50',
  {
    variants: {
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-5 py-4',
      },
      layout: {
        horizontal: 'flex items-center gap-2',
        vertical: 'flex flex-col gap-2',
        split: 'flex items-center justify-between',
      },
    },
    defaultVariants: {
      size: 'md',
      layout: 'horizontal',
    },
  }
);

/**
 * Filter panel result count variants
 */
export const filterPanelResultCountVariants = cva(
  'text-gray-600 dark:text-gray-400',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      loading: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      loading: false,
    },
  }
);

/**
 * Filter panel actions (buttons) variants
 */
export const filterPanelActionsVariants = cva('flex items-center gap-2', {
  variants: {
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
      stack: 'flex-row flex-wrap',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    size: 'md',
  },
});

/**
 * Filter panel button variants
 */
export const filterPanelButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary:
          'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-500',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500',
        danger:
          'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      intent: 'secondary',
      size: 'md',
      fullWidth: false,
    },
  }
);

/**
 * Filter panel empty state variants
 */
export const filterPanelEmptyVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-6 px-4 space-y-2',
        md: 'py-8 px-6 space-y-3',
        lg: 'py-10 px-8 space-y-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Filter panel divider variants
 */
export const filterPanelDividerVariants = cva(
  'border-t border-gray-200 dark:border-gray-800',
  {
    variants: {
      spacing: {
        none: '',
        sm: 'my-2',
        md: 'my-3',
        lg: 'my-4',
      },
    },
    defaultVariants: {
      spacing: 'md',
    },
  }
);

/**
 * Chevron icon variants (for collapse button)
 */
export const filterPanelChevronVariants = cva(
  'h-5 w-5 transition-transform duration-200',
  {
    variants: {
      collapsed: {
        true: 'rotate-180',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);
