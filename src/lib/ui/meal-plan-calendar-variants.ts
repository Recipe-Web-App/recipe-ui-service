/**
 * MealPlanCalendar Component Variants
 *
 * CVA (class-variance-authority) variant definitions for MealPlanCalendar
 * component and its sub-components.
 *
 * @module lib/ui/meal-plan-calendar-variants
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Main calendar container variants
 */
export const mealPlanCalendarVariants = cva(
  'relative flex flex-col gap-4 rounded-lg border bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm',
        compact: 'border-border gap-2',
        detailed: 'border-border shadow-lg',
      },
      size: {
        sm: 'p-2 gap-2',
        default: 'p-4 gap-4',
        lg: 'p-6 gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Calendar header variants (view switcher, navigation)
 */
export const calendarHeaderVariants = cva(
  'flex items-center justify-between border-b pb-3',
  {
    variants: {
      size: {
        sm: 'pb-2',
        default: 'pb-3',
        lg: 'pb-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * View switcher button group variants
 */
export const viewSwitcherVariants = cva(
  'inline-flex items-center justify-center rounded-md bg-muted p-1',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * View switcher button variants
 */
export const viewSwitcherButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      active: {
        true: 'bg-background text-foreground shadow-sm',
        false:
          'text-muted-foreground hover:bg-background/50 hover:text-foreground',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      active: false,
      size: 'default',
    },
  }
);

/**
 * Navigation controls variants
 */
export const navigationControlsVariants = cva('flex items-center gap-2', {
  variants: {
    size: {
      sm: 'gap-1',
      default: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Meal slot container variants
 */
export const mealSlotVariants = cva(
  'relative flex flex-col rounded border transition-all duration-200',
  {
    variants: {
      state: {
        empty: 'border-dashed border-muted-foreground/30 bg-muted/10',
        filled: 'border-border bg-card',
        hover: 'border-primary bg-primary/5',
      },
      mode: {
        view: 'cursor-default',
        edit: 'cursor-pointer hover:border-primary hover:shadow-sm',
      },
      size: {
        sm: 'min-h-16 p-2 gap-1',
        default: 'min-h-24 p-3 gap-2',
        lg: 'min-h-32 p-4 gap-3',
      },
    },
    compoundVariants: [
      {
        state: 'empty',
        mode: 'edit',
        className: 'hover:border-primary/50 hover:bg-muted/30',
      },
    ],
    defaultVariants: {
      state: 'empty',
      mode: 'view',
      size: 'default',
    },
  }
);

/**
 * Meal slot header variants (meal type label, date)
 */
export const mealSlotHeaderVariants = cva(
  'flex items-center justify-between text-xs font-medium text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'text-[10px]',
        default: 'text-xs',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Meal slot content variants (recipe list)
 */
export const mealSlotContentVariants = cva('flex flex-col gap-1', {
  variants: {
    size: {
      sm: 'gap-0.5',
      default: 'gap-1',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Meal slot empty state variants
 */
export const mealSlotEmptyVariants = cva(
  'flex flex-col items-center justify-center gap-1 text-center text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'gap-0.5 text-xs',
        default: 'gap-1 text-sm',
        lg: 'gap-2 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe item variants (within meal slot)
 */
export const recipeItemVariants = cva(
  'flex items-center gap-2 rounded p-1.5 hover:bg-accent transition-colors',
  {
    variants: {
      size: {
        sm: 'gap-1 p-1',
        default: 'gap-2 p-1.5',
        lg: 'gap-3 p-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe thumbnail variants
 */
export const recipeThumbnailVariants = cva(
  'flex-shrink-0 rounded object-cover',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Recipe name variants
 */
export const recipeNameVariants = cva('flex-1 truncate font-medium', {
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
});

/**
 * Week view grid variants
 */
export const weekGridVariants = cva('grid gap-2', {
  variants: {
    showWeekends: {
      true: 'grid-cols-7',
      false: 'grid-cols-5',
    },
    size: {
      sm: 'gap-1',
      default: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    showWeekends: true,
    size: 'default',
  },
});

/**
 * Day header variants (in week/month view)
 */
export const dayHeaderVariants = cva(
  'flex flex-col items-center justify-center rounded-t border-b p-2 font-semibold',
  {
    variants: {
      isToday: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-muted/50 text-foreground',
      },
      isWeekend: {
        true: 'text-muted-foreground',
        false: '',
      },
      size: {
        sm: 'p-1 text-xs',
        default: 'p-2 text-sm',
        lg: 'p-3 text-base',
      },
    },
    compoundVariants: [
      {
        isToday: true,
        isWeekend: true,
        className: 'bg-primary text-primary-foreground',
      },
    ],
    defaultVariants: {
      isToday: false,
      isWeekend: false,
      size: 'default',
    },
  }
);

/**
 * Day column variants (vertical stack of meal slots)
 */
export const dayColumnVariants = cva('flex flex-col gap-2 rounded border p-2', {
  variants: {
    isToday: {
      true: 'border-primary bg-primary/5',
      false: 'border-border bg-card',
    },
    size: {
      sm: 'gap-1 p-1',
      default: 'gap-2 p-2',
      lg: 'gap-3 p-3',
    },
  },
  defaultVariants: {
    isToday: false,
    size: 'default',
  },
});

/**
 * Month view grid variants
 */
export const monthGridVariants = cva('grid grid-cols-7 gap-1', {
  variants: {
    size: {
      sm: 'gap-0.5',
      default: 'gap-1',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Month day cell variants
 */
export const monthDayCellVariants = cva(
  'flex flex-col border rounded min-h-24 p-1',
  {
    variants: {
      isCurrentMonth: {
        true: 'bg-card',
        false: 'bg-muted/30 text-muted-foreground',
      },
      isToday: {
        true: 'border-primary bg-primary/5 ring-2 ring-primary',
        false: 'border-border',
      },
      size: {
        sm: 'min-h-16 p-0.5',
        default: 'min-h-24 p-1',
        lg: 'min-h-32 p-2',
      },
    },
    compoundVariants: [
      {
        isCurrentMonth: false,
        isToday: false,
        className: 'opacity-50',
      },
    ],
    defaultVariants: {
      isCurrentMonth: true,
      isToday: false,
      size: 'default',
    },
  }
);

/**
 * Day view container variants
 */
export const dayViewContainerVariants = cva('flex flex-col gap-4', {
  variants: {
    size: {
      sm: 'gap-2',
      default: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Day view header variants
 */
export const dayViewHeaderVariants = cva('mb-4', {
  variants: {
    size: {
      sm: 'mb-2',
      default: 'mb-4',
      lg: 'mb-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Day view content variants (vertical meal list)
 */
export const dayViewContentVariants = cva('flex flex-col gap-3', {
  variants: {
    size: {
      sm: 'gap-2',
      default: 'gap-3',
      lg: 'gap-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Meal view container variants (horizontal scroll)
 */
export const mealViewContainerVariants = cva(
  'flex gap-4 overflow-x-auto pb-4',
  {
    variants: {
      size: {
        sm: 'gap-2 pb-2',
        default: 'gap-4 pb-4',
        lg: 'gap-6 pb-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Current date label variants
 */
export const currentDateLabelVariants = cva('text-lg font-semibold', {
  variants: {
    size: {
      sm: 'text-base',
      default: 'text-lg',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Export variant props types
 */
export type MealPlanCalendarVariantsProps = VariantProps<
  typeof mealPlanCalendarVariants
>;
export type MealSlotVariantsProps = VariantProps<typeof mealSlotVariants>;
export type WeekGridVariantsProps = VariantProps<typeof weekGridVariants>;
export type MonthGridVariantsProps = VariantProps<typeof monthGridVariants>;
