import { cva } from 'class-variance-authority';

/**
 * Quick actions container variants
 * Container is absolutely positioned relative to parent card
 */
export const quickActionsVariants = cva(
  [
    'absolute',
    'z-10',
    'opacity-0',
    'transition-opacity',
    'duration-150',
    'ease-in-out',
    'pointer-events-none',
    'group-hover:opacity-100',
    'group-hover:pointer-events-auto',
    'group-focus-within:opacity-100',
    'group-focus-within:pointer-events-auto',
  ],
  {
    variants: {
      position: {
        'top-right': 'top-2 right-2',
        'top-left': 'top-2 left-2',
        'bottom-right': 'bottom-2 right-2',
        'bottom-left': 'bottom-2 left-2',
      },
      size: {
        sm: 'gap-1',
        md: 'gap-1.5',
        lg: 'gap-2',
      },
    },
    defaultVariants: {
      position: 'top-right',
      size: 'md',
    },
  }
);

/**
 * Quick actions overlay background variants
 * Optional semi-transparent background behind the actions
 */
export const quickActionsOverlayVariants = cva(
  [
    'rounded-md',
    'backdrop-blur-sm',
    'bg-white/80',
    'dark:bg-gray-900/80',
    'shadow-lg',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
  ],
  {
    variants: {
      size: {
        sm: 'p-1',
        md: 'p-1.5',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Quick actions grid layout variants
 * Auto-adapts to number of actions (1x1, 2x1, 2x2, 3x1, 3x2)
 */
export const quickActionsGridVariants = cva(['grid'], {
  variants: {
    layout: {
      '1x1': 'grid-cols-1 grid-rows-1',
      '2x1': 'grid-cols-2 grid-rows-1',
      '2x2': 'grid-cols-2 grid-rows-2',
      '3x1': 'grid-cols-3 grid-rows-1',
      '3x2': 'grid-cols-3 grid-rows-2',
    },
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    layout: '2x2',
    size: 'md',
  },
});

/**
 * Individual quick action button variants
 */
export const quickActionButtonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'transition-all',
    'duration-150',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'active:scale-95',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white',
          'dark:bg-gray-800',
          'text-gray-700',
          'dark:text-gray-200',
          'hover:bg-gray-100',
          'dark:hover:bg-gray-700',
          'hover:text-gray-900',
          'dark:hover:text-white',
          'border',
          'border-gray-200',
          'dark:border-gray-700',
          'shadow-sm',
          'hover:shadow-md',
        ],
        destructive: [
          'bg-red-500',
          'dark:bg-red-600',
          'text-white',
          'hover:bg-red-600',
          'dark:hover:bg-red-700',
          'shadow-sm',
          'hover:shadow-md',
        ],
        ghost: [
          'bg-transparent',
          'text-gray-700',
          'dark:text-gray-200',
          'hover:bg-gray-100',
          'dark:hover:bg-gray-800',
          'hover:text-gray-900',
          'dark:hover:text-white',
        ],
      },
      size: {
        sm: ['h-7', 'w-7', '[&_svg]:size-3.5'],
        md: ['h-8', 'w-8', '[&_svg]:size-4'],
        lg: ['h-9', 'w-9', '[&_svg]:size-5'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Overflow menu trigger button variants (three-dot icon)
 */
export const overflowMenuTriggerVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'transition-all',
    'duration-150',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'active:scale-95',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        sm: ['h-7', 'w-7', '[&_svg]:size-3.5'],
        md: ['h-8', 'w-8', '[&_svg]:size-4'],
        lg: ['h-9', 'w-9', '[&_svg]:size-5'],
      },
      state: {
        default: [
          'bg-gray-100',
          'dark:bg-gray-700',
          'text-gray-600',
          'dark:text-gray-400',
          'hover:bg-gray-200',
          'dark:hover:bg-gray-600',
          'hover:text-gray-900',
          'dark:hover:text-white',
          'border',
          'border-gray-200',
          'dark:border-gray-700',
        ],
        open: [
          'bg-gray-200',
          'dark:bg-gray-600',
          'text-gray-900',
          'dark:text-white',
          'border',
          'border-gray-300',
          'dark:border-gray-500',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

/**
 * Overflow menu content variants (dropdown menu)
 */
export const overflowMenuContentVariants = cva(
  [
    'z-50',
    'min-w-32',
    'overflow-hidden',
    'rounded-md',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'bg-white',
    'dark:bg-gray-800',
    'shadow-lg',
    'animate-in',
    'fade-in-0',
    'zoom-in-95',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      size: {
        sm: 'p-1',
        md: 'p-1.5',
        lg: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Overflow menu item variants
 */
export const overflowMenuItemVariants = cva(
  [
    'relative',
    'flex',
    'cursor-pointer',
    'select-none',
    'items-center',
    'gap-2',
    'rounded-sm',
    'outline-none',
    'transition-colors',
    'focus:bg-gray-100',
    'focus:text-gray-900',
    'dark:focus:bg-gray-700',
    'dark:focus:text-white',
    'data-[disabled]:pointer-events-none',
    'data-[disabled]:opacity-50',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-gray-700',
          'dark:text-gray-200',
          'hover:bg-gray-100',
          'dark:hover:bg-gray-700',
        ],
        destructive: [
          'text-red-600',
          'dark:text-red-400',
          'hover:bg-red-50',
          'dark:hover:bg-red-900/20',
          'focus:bg-red-50',
          'dark:focus:bg-red-900/20',
          'focus:text-red-700',
          'dark:focus:text-red-300',
        ],
        ghost: [
          'text-gray-700',
          'dark:text-gray-200',
          'hover:bg-gray-50',
          'dark:hover:bg-gray-800',
          'focus:bg-gray-50',
          'dark:focus:bg-gray-800',
        ],
      },
      size: {
        sm: 'px-2 py-1.5 text-xs',
        md: 'px-2.5 py-2 text-sm',
        lg: 'px-3 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Action tooltip variants
 */
export const actionTooltipVariants = cva(
  [
    'z-50',
    'overflow-hidden',
    'rounded-md',
    'bg-gray-900',
    'dark:bg-gray-700',
    'px-2',
    'py-1',
    'text-xs',
    'text-white',
    'shadow-md',
    'animate-in',
    'fade-in-0',
    'zoom-in-95',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
        lg: 'text-sm px-2.5 py-1.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
