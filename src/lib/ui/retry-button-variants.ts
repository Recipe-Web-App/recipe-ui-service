import { cva } from 'class-variance-authority';

/**
 * Retry icon animation variants
 *
 * These variants control the visual state of the retry icon (RefreshCw)
 * based on the button's retry state. The button styling itself is handled
 * by the base Button component variants.
 */
export const retryIconVariants = cva('transition-all duration-200', {
  variants: {
    state: {
      /** Default idle state - no animation */
      idle: '',

      /** Retrying state - spinning animation */
      retrying: 'animate-spin',

      /** Cooldown state - reduced opacity */
      cooldown: 'opacity-50',

      /** Disabled/max attempts state - very reduced opacity */
      disabled: 'opacity-30',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

/**
 * Retry attempt counter badge variants
 *
 * Optional visual badge for showing attempt count
 */
export const retryCounterVariants = cva(
  'inline-flex items-center justify-center rounded-full text-[10px] font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        destructive: 'bg-destructive/10 text-destructive',
        outline: 'bg-background text-foreground border border-border',
        secondary: 'bg-secondary/10 text-secondary-foreground',
        ghost: 'bg-muted text-muted-foreground',
        link: 'bg-primary/10 text-primary',
      },
      size: {
        sm: 'h-4 w-4 min-w-[16px]',
        default: 'h-5 w-5 min-w-[20px]',
        lg: 'h-6 w-6 min-w-[24px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Cooldown countdown text variants
 *
 * Styling for the countdown timer text shown during cooldown
 */
export const cooldownTextVariants = cva('text-xs font-mono tabular-nums', {
  variants: {
    emphasis: {
      low: 'opacity-70',
      medium: 'opacity-90',
      high: 'opacity-100 font-semibold',
    },
  },
  defaultVariants: {
    emphasis: 'medium',
  },
});
