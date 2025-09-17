import { cva } from 'class-variance-authority';

/**
 * DatePicker variants using class-variance-authority
 *
 * Provides styling for date picker components with different visual styles and behaviors.
 */

/**
 * Main datepicker container variants
 */
export const datepickerVariants = cva('relative inline-flex items-center', {
  variants: {
    variant: {
      default: 'border border-input bg-background',
      outlined: 'border-2 border-input bg-background',
      filled: 'border border-transparent bg-muted',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      default: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    },
    state: {
      default: 'border-input text-foreground',
      error:
        'border-destructive text-destructive focus-visible:ring-destructive',
      success: 'border-green-500 text-green-700 focus-visible:ring-green-500',
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  compoundVariants: [
    {
      variant: 'outlined',
      state: 'error',
      class: 'border-destructive',
    },
    {
      variant: 'outlined',
      state: 'success',
      class: 'border-green-500',
    },
    {
      variant: 'filled',
      state: 'error',
      class: 'bg-destructive/10',
    },
    {
      variant: 'filled',
      state: 'success',
      class: 'bg-green-50',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    state: 'default',
    fullWidth: false,
  },
});

/**
 * DatePicker input field variants
 */
export const datepickerInputVariants = cva(
  'flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * DatePicker trigger button variants
 */
export const datepickerTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        outlined:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
        filled: 'border border-transparent bg-muted hover:bg-muted/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: '',
        error: 'border-destructive text-destructive',
        success: 'border-green-500 text-green-700',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

/**
 * Calendar popover variants
 */
export const calendarPopoverVariants = cva(
  'z-50 rounded-md border bg-white dark:bg-gray-900 p-4 text-popover-foreground shadow-md outline-none',
  {
    variants: {
      size: {
        sm: 'w-64 p-3',
        default: 'w-72 p-4',
        lg: 'w-80 p-5',
      },
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-lg',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Calendar header variants
 */
export const calendarHeaderVariants = cva(
  'flex items-center justify-between space-x-1 mb-4',
  {
    variants: {
      size: {
        sm: 'mb-3',
        default: 'mb-4',
        lg: 'mb-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Calendar navigation button variants
 */
export const calendarNavButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        default: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Calendar grid variants
 */
export const calendarGridVariants = cva('w-full border-collapse select-none', {
  variants: {
    spacing: {
      compact: 'border-spacing-0',
      default: 'border-spacing-1',
      spacious: 'border-spacing-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

/**
 * Calendar cell variants (days)
 */
export const calendarCellVariants = cva(
  'relative flex items-center justify-center whitespace-nowrap rounded-md text-sm font-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:hover:bg-transparent',
  {
    variants: {
      size: {
        sm: 'h-7 w-7 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
      variant: {
        default:
          'hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:font-medium cursor-pointer',
        today:
          'bg-accent text-accent-foreground font-semibold hover:bg-accent/80 hover:scale-110',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105',
        inRange: 'bg-accent/50 text-accent-foreground hover:bg-accent/70',
        rangeStart:
          'bg-primary text-primary-foreground rounded-r-none hover:bg-primary/90',
        rangeEnd:
          'bg-primary text-primary-foreground rounded-l-none hover:bg-primary/90',
        outside: 'text-muted-foreground opacity-50 hover:opacity-70',
        disabled:
          'text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent hover:scale-100',
        weekend:
          'text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:scale-110',
      },
      state: {
        default: '',
        hover: 'bg-accent text-accent-foreground',
        pressed: 'bg-accent/80',
      },
    },
    compoundVariants: [
      {
        variant: 'selected',
        state: 'hover',
        class: 'bg-primary/90',
      },
      {
        variant: 'today',
        state: 'hover',
        class: 'bg-accent/80',
      },
    ],
    defaultVariants: {
      size: 'default',
      variant: 'default',
      state: 'default',
    },
  }
);

/**
 * Calendar week header variants
 */
export const calendarWeekHeaderVariants = cva(
  'text-center text-muted-foreground font-medium',
  {
    variants: {
      size: {
        sm: 'h-6 w-7 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Time picker variants
 */
export const timePickerVariants = cva(
  'flex items-center space-x-2 mt-4 pt-4 border-t border-border',
  {
    variants: {
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col space-x-0 space-y-2',
      },
      size: {
        sm: 'mt-3 pt-3',
        default: 'mt-4 pt-4',
        lg: 'mt-5 pt-5',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      size: 'default',
    },
  }
);

/**
 * Time input variants
 */
export const timeInputVariants = cva(
  'flex items-center justify-center rounded-md border border-input bg-background px-2 py-1 text-sm font-mono focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-7 px-1.5 text-xs',
        default: 'h-8 px-2 text-sm',
        lg: 'h-10 px-3 text-base',
      },
      state: {
        default: 'border-input',
        error: 'border-destructive',
        success: 'border-green-500',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

/**
 * Preset buttons variants (for quick date selection)
 */
export const datePresetVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-7 px-2 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-9 px-4 text-sm',
      },
      active: {
        true: 'bg-primary text-primary-foreground hover:bg-primary/90',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm',
      active: false,
    },
  }
);

/**
 * Label and helper text variants
 */
export const datepickerLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      state: {
        default: 'text-foreground',
        error: 'text-destructive',
        success: 'text-green-700',
        disabled: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

export const datepickerHelperVariants = cva('text-xs mt-1', {
  variants: {
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
      success: 'text-green-600',
      disabled: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

/**
 * Icon variants for calendar and time icons
 */
export const datepickerIconVariants = cva('flex-shrink-0', {
  variants: {
    position: {
      left: 'mr-2',
      right: 'ml-2',
    },
    size: {
      sm: 'h-3 w-3',
      default: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
      success: 'text-green-600',
      disabled: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    position: 'right',
    size: 'default',
    state: 'default',
  },
});
