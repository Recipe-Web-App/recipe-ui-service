import { cva } from 'class-variance-authority';

/**
 * ViewToggle container variants
 *
 * Defines the styling for the main toggle button group container
 */
export const viewToggleVariants = cva(
  'inline-flex items-center justify-center rounded-md border border-input bg-background p-1',
  {
    variants: {
      size: {
        sm: 'h-8 gap-0.5',
        md: 'h-10 gap-1',
        lg: 'h-12 gap-1',
      },
      variant: {
        default: 'bg-muted/50',
        outline: 'bg-transparent',
        ghost: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * ViewToggle button variants
 *
 * Defines the styling for individual toggle buttons
 */
export const viewToggleButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      variant: {
        default: '',
        outline: '',
        ghost: '',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Default variant - active state
      {
        variant: 'default',
        active: true,
        className: 'bg-background text-foreground shadow-sm',
      },
      // Default variant - inactive state
      {
        variant: 'default',
        active: false,
        className:
          'bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
      },
      // Outline variant - active state
      {
        variant: 'outline',
        active: true,
        className:
          'border border-input bg-background text-foreground shadow-sm',
      },
      // Outline variant - inactive state
      {
        variant: 'outline',
        active: false,
        className:
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      },
      // Ghost variant - active state
      {
        variant: 'ghost',
        active: true,
        className: 'bg-accent text-accent-foreground',
      },
      // Ghost variant - inactive state
      {
        variant: 'ghost',
        active: false,
        className:
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      active: false,
    },
  }
);
