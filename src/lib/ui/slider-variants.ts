import { cva } from 'class-variance-authority';

/**
 * Slider variants using class-variance-authority
 *
 * Provides styling for slider components with different visual styles and behaviors.
 */

/**
 * Main slider root container variants
 */
export const sliderVariants = cva(
  'relative flex touch-none select-none pointer-events-auto',
  {
    variants: {
      orientation: {
        horizontal: 'w-full flex-row items-center',
        vertical: 'h-full flex-col justify-center items-center',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      // Horizontal size variants
      {
        orientation: 'horizontal',
        size: 'sm',
        class: 'h-3',
      },
      {
        orientation: 'horizontal',
        size: 'default',
        class: 'h-4',
      },
      {
        orientation: 'horizontal',
        size: 'lg',
        class: 'h-5',
      },
      // Vertical size variants
      {
        orientation: 'vertical',
        size: 'sm',
        class: 'w-3',
      },
      {
        orientation: 'vertical',
        size: 'default',
        class: 'w-4',
      },
      {
        orientation: 'vertical',
        size: 'lg',
        class: 'w-5',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'default',
      disabled: false,
    },
  }
);

/**
 * Slider track (background bar) variants
 */
export const sliderTrackVariants = cva(
  'relative overflow-hidden rounded-full bg-muted border',
  {
    variants: {
      orientation: {
        horizontal: 'h-2 w-full',
        vertical: 'w-2 h-full',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      variant: {
        default: 'bg-muted border-border',
        success: 'bg-green-100 border-green-200',
        warning: 'bg-yellow-100 border-yellow-200',
        danger: 'bg-red-100 border-red-200',
        info: 'bg-blue-100 border-blue-200',
      },
    },
    compoundVariants: [
      // Horizontal size variants
      {
        orientation: 'horizontal',
        size: 'sm',
        class: 'h-1.5',
      },
      {
        orientation: 'horizontal',
        size: 'default',
        class: 'h-2',
      },
      {
        orientation: 'horizontal',
        size: 'lg',
        class: 'h-2.5',
      },
      // Vertical size variants
      {
        orientation: 'vertical',
        size: 'sm',
        class: 'w-1.5',
      },
      {
        orientation: 'vertical',
        size: 'default',
        class: 'w-2',
      },
      {
        orientation: 'vertical',
        size: 'lg',
        class: 'w-2.5',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Slider range (filled portion) variants
 */
export const sliderRangeVariants = cva('absolute rounded-full', {
  variants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
    variant: {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
    },
    gradient: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Gradient variants
    {
      variant: 'default',
      gradient: true,
      class: 'bg-gradient-to-r from-primary to-primary/80',
    },
    {
      variant: 'success',
      gradient: true,
      class: 'bg-gradient-to-r from-green-500 to-green-400',
    },
    {
      variant: 'warning',
      gradient: true,
      class: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    },
    {
      variant: 'danger',
      gradient: true,
      class: 'bg-gradient-to-r from-red-500 to-red-400',
    },
    {
      variant: 'info',
      gradient: true,
      class: 'bg-gradient-to-r from-blue-500 to-blue-400',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    gradient: false,
  },
});

/**
 * Slider thumb (draggable handle) variants
 */
export const sliderThumbVariants = cva(
  'block rounded-full border-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      variant: {
        default: 'bg-slate-900 border-slate-900',
        success: 'bg-green-500 border-green-500',
        warning: 'bg-yellow-500 border-yellow-500',
        danger: 'bg-red-500 border-red-500',
        info: 'bg-blue-500 border-blue-500',
      },
      interactive: {
        true: 'hover:scale-110 active:scale-95',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      interactive: true,
    },
  }
);

/**
 * Slider label variants
 */
export const sliderLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      position: {
        top: 'mb-2',
        bottom: 'mt-2',
        left: 'mr-2',
        right: 'ml-2',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      position: 'top',
      size: 'default',
    },
  }
);

/**
 * Slider value display variants
 */
export const sliderValueVariants = cva(
  'inline-flex items-center justify-center rounded border bg-background px-2 py-1 text-xs font-medium',
  {
    variants: {
      position: {
        tooltip: 'absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap',
        inline: 'ml-2',
        bottom: 'mt-2 w-16 mx-auto text-center',
        floating:
          'absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground shadow-md',
      },
      variant: {
        default: 'border-border text-foreground',
        success: 'border-green-200 bg-green-50 text-green-700',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
        danger: 'border-red-200 bg-red-50 text-red-700',
        info: 'border-blue-200 bg-blue-50 text-blue-700',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        default: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      position: 'inline',
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Slider tick marks variants
 */
export const sliderTickVariants = cva(
  'absolute rounded-full bg-muted-foreground',
  {
    variants: {
      orientation: {
        horizontal: 'h-1 w-0.5 -translate-x-1/2',
        vertical: 'h-0.5 w-1 -translate-y-1/2',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      position: {
        above: '',
        below: '',
        center: '',
      },
    },
    compoundVariants: [
      // Horizontal tick positioning
      {
        orientation: 'horizontal',
        position: 'above',
        class: '-top-3',
      },
      {
        orientation: 'horizontal',
        position: 'below',
        class: '-bottom-3',
      },
      {
        orientation: 'horizontal',
        position: 'center',
        class: 'top-1/2 -translate-y-1/2',
      },
      // Vertical tick positioning
      {
        orientation: 'vertical',
        position: 'above',
        class: '-left-3',
      },
      {
        orientation: 'vertical',
        position: 'below',
        class: '-right-3',
      },
      {
        orientation: 'vertical',
        position: 'center',
        class: 'left-1/2 -translate-x-1/2',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'default',
      position: 'below',
    },
  }
);

/**
 * Slider step labels variants
 */
export const sliderStepLabelVariants = cva(
  'absolute text-xs text-muted-foreground',
  {
    variants: {
      orientation: {
        horizontal: '-translate-x-1/2',
        vertical: '-translate-y-1/2',
      },
      position: {
        above: '',
        below: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        position: 'above',
        class: '-top-6',
      },
      {
        orientation: 'horizontal',
        position: 'below',
        class: '-bottom-6',
      },
      {
        orientation: 'vertical',
        position: 'above',
        class: '-left-8',
      },
      {
        orientation: 'vertical',
        position: 'below',
        class: '-right-8',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      position: 'below',
    },
  }
);
