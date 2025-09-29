import { cva } from 'class-variance-authority';

/**
 * Drawer overlay variants using class-variance-authority
 *
 * Provides different overlay styles for various drawer types.
 */
export const drawerOverlayVariants = cva(['fixed', 'inset-0', 'z-40'], {
  variants: {
    variant: {
      default: ['bg-black/50', 'backdrop-blur-sm'],
      light: ['bg-black/20', 'backdrop-blur-sm'],
      dark: ['bg-black/70', 'backdrop-blur-md'],
      minimal: ['bg-black/30'],
      none: ['bg-transparent'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Drawer content variants using class-variance-authority
 *
 * Provides different content container styles, positions, and sizes.
 */
export const drawerContentVariants = cva(
  [
    'fixed',
    'z-50',
    'bg-background',
    'text-foreground',
    'border',
    'border-border',
    'shadow-xl',
    'focus:outline-none',
    'overflow-hidden',
    'transition-transform',
    'duration-300',
    'ease-in-out',
  ],
  {
    variants: {
      position: {
        left: [
          'top-0',
          'left-0',
          'h-full',
          'border-r',
          'border-l-0',
          'border-t-0',
          'border-b-0',
          'rounded-r-lg',
          'data-[state=closed]:-translate-x-full',
          'data-[state=open]:translate-x-0',
        ],
        right: [
          'top-0',
          'right-0',
          'h-full',
          'border-l',
          'border-r-0',
          'border-t-0',
          'border-b-0',
          'rounded-l-lg',
          'data-[state=closed]:translate-x-full',
          'data-[state=open]:translate-x-0',
        ],
        top: [
          'top-0',
          'left-0',
          'right-0',
          'w-full',
          'border-b',
          'border-t-0',
          'border-l-0',
          'border-r-0',
          'rounded-b-lg',
          'data-[state=closed]:-translate-y-full',
          'data-[state=open]:translate-y-0',
        ],
        bottom: [
          'bottom-0',
          'left-0',
          'right-0',
          'w-full',
          'border-t',
          'border-b-0',
          'border-l-0',
          'border-r-0',
          'rounded-t-lg',
          'data-[state=closed]:translate-y-full',
          'data-[state=open]:translate-y-0',
        ],
      },
      size: {
        xs: [],
        sm: [],
        md: [],
        lg: [],
        xl: [],
        full: [],
      },
      variant: {
        default: ['shadow-lg'],
        elevated: ['shadow-xl', 'drop-shadow-lg', 'bg-muted'],
        minimal: ['shadow-sm', 'border-muted'],
        overlay: ['shadow-2xl', 'bg-card'],
      },
    },
    compoundVariants: [
      // Left and Right position sizes
      {
        position: ['left', 'right'],
        size: 'xs',
        class: 'w-60',
      },
      {
        position: ['left', 'right'],
        size: 'sm',
        class: 'w-72',
      },
      {
        position: ['left', 'right'],
        size: 'md',
        class: 'w-96',
      },
      {
        position: ['left', 'right'],
        size: 'lg',
        class: 'w-[32rem]',
      },
      {
        position: ['left', 'right'],
        size: 'xl',
        class: 'w-[40rem]',
      },
      {
        position: ['left', 'right'],
        size: 'full',
        class: 'w-full',
      },
      // Top and Bottom position sizes
      {
        position: ['top', 'bottom'],
        size: 'xs',
        class: 'h-60',
      },
      {
        position: ['top', 'bottom'],
        size: 'sm',
        class: 'h-72',
      },
      {
        position: ['top', 'bottom'],
        size: 'md',
        class: 'h-96',
      },
      {
        position: ['top', 'bottom'],
        size: 'lg',
        class: 'h-[32rem]',
      },
      {
        position: ['top', 'bottom'],
        size: 'xl',
        class: 'h-[40rem]',
      },
      {
        position: ['top', 'bottom'],
        size: 'full',
        class: 'h-full',
      },
    ],
    defaultVariants: {
      position: 'left',
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * Drawer header variants for title and close button areas
 */
export const drawerHeaderVariants = cva(
  ['flex', 'items-center', 'p-4', 'border-b', 'border-border', 'bg-muted'],
  {
    variants: {
      variant: {
        default: ['justify-between'],
        minimal: ['border-b-0', 'bg-transparent', 'pb-2', 'justify-between'],
        prominent: ['p-6', 'bg-card', 'justify-between'],
      },
      layout: {
        default: [],
        withClose: ['pr-16', 'justify-start'],
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'default',
    },
  }
);

/**
 * Drawer body variants for content areas
 */
export const drawerBodyVariants = cva(['flex-1', 'overflow-y-auto', 'p-4'], {
  variants: {
    variant: {
      default: [],
      padded: ['p-6'],
      compact: ['p-2'],
      flush: ['p-0'],
    },
    scrollable: {
      true: ['overflow-y-auto'],
      false: ['overflow-hidden'],
    },
  },
  defaultVariants: {
    variant: 'default',
    scrollable: true,
  },
});

/**
 * Drawer footer variants for action buttons
 */
export const drawerFooterVariants = cva(
  [
    'flex',
    'items-center',
    'gap-2',
    'p-4',
    'border-t',
    'border-border',
    'bg-muted',
  ],
  {
    variants: {
      variant: {
        default: ['justify-end'],
        spaceBetween: ['justify-between'],
        center: ['justify-center'],
        start: ['justify-start'],
      },
      size: {
        sm: ['p-2', 'gap-1'],
        default: ['p-4', 'gap-2'],
        lg: ['p-6', 'gap-3'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Drawer close button variants
 */
export const drawerCloseVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'w-9',
    'h-9',
    'p-2',
    'flex-shrink-0',
    'z-50',
    'bg-background/95',
    'backdrop-blur-md',
    'shadow-md',
    'text-muted-foreground',
    'hover:text-foreground',
    'hover:bg-muted',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-ring',
    'transition-colors',
    'duration-200',
    'border',
    'border-border',
  ],
  {
    variants: {
      variant: {
        default: [],
        ghost: ['hover:bg-transparent'],
        destructive: [
          'text-destructive',
          'hover:text-destructive-foreground',
          'hover:bg-destructive',
        ],
      },
      size: {
        sm: ['w-7', 'h-7', 'p-1.5'],
        default: ['w-9', 'h-9', 'p-2'],
        lg: ['w-11', 'h-11', 'p-2.5'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Navigation drawer variants for recipe-specific navigation
 */
export const navigationDrawerVariants = cva(['flex', 'flex-col', 'h-full'], {
  variants: {
    theme: {
      default: ['bg-card'],
      primary: ['bg-primary/5'],
      secondary: ['bg-secondary/5'],
      accent: ['bg-accent/5'],
    },
  },
  defaultVariants: {
    theme: 'default',
  },
});

/**
 * Navigation menu item variants for drawer navigation
 */
export const navigationItemVariants = cva(
  [
    'flex',
    'items-center',
    'gap-3',
    'px-3',
    'py-2',
    'text-sm',
    'rounded-md',
    'transition-colors',
    'duration-200',
    'cursor-pointer',
  ],
  {
    variants: {
      state: {
        default: ['text-foreground', 'hover:bg-muted', 'hover:text-foreground'],
        active: ['bg-primary', 'text-primary-foreground', 'font-medium'],
        disabled: [
          'text-muted-foreground/50',
          'cursor-not-allowed',
          'hover:bg-transparent',
        ],
      },
      variant: {
        default: [],
        ghost: ['hover:bg-muted/50'],
        subtle: ['hover:bg-muted/30'],
      },
    },
    defaultVariants: {
      state: 'default',
      variant: 'default',
    },
  }
);

/**
 * Recipe drawer variants for recipe-specific content
 */
export const recipeDrawerVariants = cva(['space-y-4'], {
  variants: {
    type: {
      ingredients: ['bg-basil/5'],
      instructions: ['bg-primary/5'],
      shopping: ['bg-accent/10'],
      notes: ['bg-secondary/5'],
    },
  },
  defaultVariants: {
    type: 'ingredients',
  },
});
