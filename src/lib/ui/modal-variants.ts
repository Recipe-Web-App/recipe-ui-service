import { cva } from 'class-variance-authority';

/**
 * Modal overlay variants using class-variance-authority
 *
 * Provides different overlay styles for various modal types.
 */
export const modalOverlayVariants = cva(['fixed', 'inset-0', 'z-40'], {
  variants: {
    variant: {
      default: ['bg-black/50', 'backdrop-blur-sm'],
      light: ['bg-black/20', 'backdrop-blur-sm'],
      dark: ['bg-black/70', 'backdrop-blur-md'],
      none: ['bg-transparent'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Modal content variants using class-variance-authority
 *
 * Provides different content container styles and sizes.
 */
export const modalContentVariants = cva(
  [
    'fixed',
    'top-1/2',
    'left-1/2',
    'transform',
    '-translate-x-1/2',
    '-translate-y-1/2',
    'z-50',
    'w-full',
    'mx-4',
    'bg-card',
    'text-card-foreground',
    'border',
    'border-border',
    'shadow-lg',
    'focus:outline-none',
  ],
  {
    variants: {
      variant: {
        default: ['rounded-lg'],
        fullscreen: [
          '!fixed',
          '!inset-0',
          '!transform-none',
          '!translate-x-0',
          '!translate-y-0',
          '!w-screen',
          '!h-screen',
          '!max-w-none',
          '!mx-0',
          '!my-0',
          'rounded-none',
          '!border-0',
          '!bg-background',
        ],
        drawer: [
          'rounded-t-lg',
          'rounded-b-none',
          'top-auto',
          'bottom-0',
          'left-0',
          'transform-none',
          '-translate-x-0',
          '-translate-y-0',
          'w-screen',
          'max-w-none',
          'mx-0',
        ],
        sheet: [
          'rounded-l-lg',
          'rounded-r-none',
          'min-h-screen',
          'inset-y-0',
          'left-auto',
          'right-0',
          'top-0',
          'transform-none',
          '-translate-x-0',
          '-translate-y-0',
          'w-auto',
          'max-w-md',
        ],
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Modal header variants for compound component
 */
export const modalHeaderVariants = cva([
  'flex',
  'flex-col',
  'space-y-1.5',
  'text-center',
  'sm:text-left',
  'p-6',
  'pb-4',
]);

/**
 * Modal body variants for compound component
 */
export const modalBodyVariants = cva(['px-6', 'py-2'], {
  variants: {
    scrollable: {
      true: ['overflow-y-auto', 'max-h-[60vh]', 'overscroll-contain'],
      false: [],
    },
  },
  defaultVariants: {
    scrollable: false,
  },
});

/**
 * Modal footer variants for compound component
 */
export const modalFooterVariants = cva([
  'flex',
  'flex-col-reverse',
  'sm:flex-row',
  'sm:justify-end',
  'p-6',
  'pt-4',
  'gap-2',
]);

/**
 * Modal title variants for typography consistency
 */
export const modalTitleVariants = cva([
  'text-lg',
  'font-semibold',
  'leading-none',
  'tracking-tight',
]);

/**
 * Modal description variants for typography consistency
 */
export const modalDescriptionVariants = cva([
  'text-sm',
  'text-muted-foreground',
]);

/**
 * Modal close button variants
 */
export const modalCloseVariants = cva(
  [
    'absolute',
    'right-4',
    'top-4',
    'rounded-sm',
    'opacity-70',
    'ring-offset-background',
    'transition-opacity',
    'hover:opacity-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'focus:ring-offset-2',
    'disabled:pointer-events-none',
    'data-[state=open]:bg-accent',
    'data-[state=open]:text-muted-foreground',
  ],
  {
    variants: {
      variant: {
        default: ['h-4', 'w-4'],
        icon: [
          'h-8',
          'w-8',
          'p-1.5',
          'bg-transparent',
          'border-0',
          'hover:bg-accent',
          'rounded-md',
          'flex',
          'items-center',
          'justify-center',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
