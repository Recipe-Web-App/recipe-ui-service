import { cva } from 'class-variance-authority';

/**
 * FAB base variants using class-variance-authority
 */
export const fabVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'rounded-full',
    'shadow-lg',
    'hover:shadow-xl',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'active:scale-95',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-primary/25',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'hover:bg-secondary/80',
          'shadow-secondary/25',
        ],
        destructive: [
          'bg-destructive',
          'text-destructive-foreground',
          'hover:bg-destructive/90',
          'shadow-destructive/25',
        ],
        success: [
          'bg-green-600',
          'text-white',
          'hover:bg-green-700',
          'shadow-green-600/25',
          'dark:bg-green-500',
          'dark:hover:bg-green-600',
        ],
        outline: [
          'bg-background',
          'border-2',
          'border-input',
          'hover:bg-accent',
          'hover:text-accent-foreground',
          'shadow-sm',
        ],
        surface: [
          'bg-surface',
          'text-surface-foreground',
          'hover:bg-surface/80',
          'shadow-sm',
        ],
      },
      size: {
        sm: ['h-10', 'w-10', '[&_svg]:h-4', '[&_svg]:w-4'],
        md: ['h-14', 'w-14', '[&_svg]:h-5', '[&_svg]:w-5'],
        lg: ['h-16', 'w-16', '[&_svg]:h-6', '[&_svg]:w-6'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * Extended FAB variants (with label)
 */
export const extendedFabVariants = cva(
  ['px-4', 'gap-2', 'min-w-[48px]', 'w-auto'],
  {
    variants: {
      size: {
        sm: ['h-10', 'text-sm', 'px-3'],
        md: ['h-12', 'text-base', 'px-4'],
        lg: ['h-14', 'text-lg', 'px-6'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * FAB position variants
 */
export const fabPositionVariants = cva(['fixed', 'z-50'], {
  variants: {
    position: {
      'bottom-right': ['bottom-0', 'right-0'],
      'bottom-left': ['bottom-0', 'left-0'],
      'top-right': ['top-0', 'right-0'],
      'top-left': ['top-0', 'left-0'],
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
});

/**
 * Speed dial action variants
 */
export const speedDialActionVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'bg-background',
    'text-foreground',
    'shadow-md',
    'border',
    'border-border',
    'transition-all',
    'duration-200',
    'hover:shadow-lg',
    'hover:scale-105',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        sm: ['h-8', 'w-8', '[&_svg]:h-4', '[&_svg]:w-4'],
        md: ['h-10', 'w-10', '[&_svg]:h-5', '[&_svg]:w-5'],
        lg: ['h-12', 'w-12', '[&_svg]:h-6', '[&_svg]:w-6'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Speed dial label variants
 */
export const speedDialLabelVariants = cva(
  [
    'absolute',
    'whitespace-nowrap',
    'bg-popover',
    'text-popover-foreground',
    'px-2',
    'py-1',
    'rounded-md',
    'text-sm',
    'shadow-md',
    'border',
    'border-border',
    'pointer-events-none',
  ],
  {
    variants: {
      direction: {
        up: ['right-full', 'mr-3', 'top-1/2', '-translate-y-1/2'],
        down: ['right-full', 'mr-3', 'top-1/2', '-translate-y-1/2'],
        left: ['bottom-full', 'mb-2', 'left-1/2', '-translate-x-1/2'],
        right: ['bottom-full', 'mb-2', 'left-1/2', '-translate-x-1/2'],
      },
    },
    defaultVariants: {
      direction: 'up',
    },
  }
);

/**
 * Speed dial container variants
 */
export const speedDialContainerVariants = cva(['absolute', 'flex', 'gap-2'], {
  variants: {
    direction: {
      up: ['bottom-full', 'mb-4', 'flex-col-reverse', 'items-center'],
      down: ['top-full', 'mt-4', 'flex-col', 'items-center'],
      left: ['right-full', 'mr-4', 'flex-row-reverse', 'items-center'],
      right: ['left-full', 'ml-4', 'flex-row', 'items-center'],
    },
  },
  defaultVariants: {
    direction: 'up',
  },
});

/**
 * FAB group container variants
 */
export const fabGroupVariants = cva(['fixed', 'z-50', 'flex'], {
  variants: {
    position: {
      'bottom-right': ['bottom-0', 'right-0'],
      'bottom-left': ['bottom-0', 'left-0'],
      'top-right': ['top-0', 'right-0'],
      'top-left': ['top-0', 'left-0'],
    },
    direction: {
      vertical: ['flex-col'],
      horizontal: ['flex-row'],
    },
  },
  defaultVariants: {
    position: 'bottom-right',
    direction: 'vertical',
  },
});
