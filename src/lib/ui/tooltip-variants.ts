import { cva } from 'class-variance-authority';

/**
 * Tooltip content variants using class-variance-authority
 *
 * Provides styling for tooltip content containers with contextual help information.
 */
export const tooltipContentVariants = cva(
  [
    'z-50',
    'overflow-hidden',
    'rounded-md',
    'border',
    'px-3',
    'py-1.5',
    'text-sm',
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
      variant: {
        default: ['bg-popover', 'text-popover-foreground', 'border-border'],
        light: [
          'bg-card',
          'text-card-foreground',
          'border-border',
          'shadow-lg',
        ],
        accent: ['bg-primary', 'text-primary-foreground', 'border-primary'],
        success: ['bg-basil', 'text-foreground', 'border-basil'],
        warning: ['bg-citrus', 'text-foreground', 'border-citrus'],
        error: [
          'bg-destructive',
          'text-destructive-foreground',
          'border-destructive',
        ],
        info: ['bg-primary', 'text-primary-foreground', 'border-primary'],
      },
      size: {
        sm: ['px-2', 'py-1', 'text-xs', 'max-w-[200px]'],
        default: ['px-3', 'py-1.5', 'text-sm', 'max-w-[300px]'],
        lg: ['px-4', 'py-2', 'text-base', 'max-w-[400px]'],
        xl: ['px-4', 'py-3', 'text-base', 'max-w-[500px]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Tooltip arrow variants using class-variance-authority
 *
 * Provides styling for tooltip arrows that point to the trigger element.
 */
export const tooltipArrowVariants = cva(['fill-current'], {
  variants: {
    variant: {
      default: ['text-popover'],
      light: ['text-card'],
      accent: ['text-primary'],
      success: ['text-basil'],
      warning: ['text-citrus'],
      error: ['text-destructive'],
      info: ['text-primary'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Tooltip trigger variants using class-variance-authority
 *
 * Provides styling for elements that trigger tooltips on hover/focus.
 */
export const tooltipTriggerVariants = cva(
  [
    'cursor-help',
    'transition-colors',
    'duration-200',
    'outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'rounded-sm',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-muted-foreground',
          'hover:text-foreground',
          'focus-visible:text-foreground',
        ],
        subtle: [
          'text-muted-foreground/70',
          'hover:text-muted-foreground',
          'focus-visible:text-muted-foreground',
        ],
        accent: [
          'text-primary',
          'hover:text-primary/80',
          'focus-visible:text-primary/80',
        ],
        cooking: [
          'text-accent',
          'hover:text-accent/80',
          'focus-visible:text-accent/80',
          'underline',
          'decoration-dotted',
          'underline-offset-2',
        ],
        term: [
          'text-secondary',
          'hover:text-secondary/80',
          'focus-visible:text-secondary/80',
          'border-b',
          'border-dotted',
          'border-secondary/40',
        ],
      },
      size: {
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Icon tooltip variants for icon-only triggers
 *
 * Provides styling for icon elements that show tooltips.
 */
export const iconTooltipVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'transition-all',
    'duration-200',
    'cursor-help',
    'outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-muted-foreground',
          'hover:text-foreground',
          'hover:bg-muted',
          'focus-visible:text-foreground',
          'focus-visible:bg-muted',
        ],
        subtle: [
          'text-muted-foreground/70',
          'hover:text-muted-foreground',
          'hover:bg-muted/50',
          'focus-visible:text-muted-foreground',
          'focus-visible:bg-muted/50',
        ],
        accent: [
          'text-primary',
          'hover:text-primary/80',
          'hover:bg-primary/10',
          'focus-visible:text-primary/80',
          'focus-visible:bg-primary/10',
        ],
        success: [
          'text-basil',
          'hover:text-basil/80',
          'hover:bg-basil/10',
          'focus-visible:text-basil/80',
          'focus-visible:bg-basil/10',
        ],
        warning: [
          'text-citrus',
          'hover:text-citrus/80',
          'hover:bg-citrus/10',
          'focus-visible:text-citrus/80',
          'focus-visible:bg-citrus/10',
        ],
        error: [
          'text-destructive',
          'hover:text-destructive/80',
          'hover:bg-destructive/10',
          'focus-visible:text-destructive/80',
          'focus-visible:bg-destructive/10',
        ],
      },
      size: {
        sm: ['h-4', 'w-4', 'p-0.5'],
        default: ['h-5', 'w-5', 'p-1'],
        lg: ['h-6', 'w-6', 'p-1.5'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
