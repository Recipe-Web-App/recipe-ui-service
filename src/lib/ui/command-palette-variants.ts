import { cva } from 'class-variance-authority';

/**
 * CommandPalette variants using class-variance-authority
 *
 * Provides consistent styling variants for the command palette modal,
 * content areas, and interactive elements.
 */
export const commandPaletteVariants = cva(
  // Base styles for the modal overlay
  [
    'fixed',
    'inset-0',
    'z-50',
    'flex',
    'items-start',
    'justify-center',
    'bg-black/30',
    'animate-in',
    'fade-in-0',
  ],
  {
    variants: {
      position: {
        center: ['items-center'],
        top: ['items-start', 'pt-16'],
      },
    },
    defaultVariants: {
      position: 'center',
    },
  }
);

/**
 * CommandPalette content container variants
 */
export const commandPaletteContentVariants = cva(
  // Base styles for the content container
  [
    'relative',
    'flex',
    'w-full',
    'flex-col',
    'overflow-hidden',
    'rounded-lg',
    'border',
    'bg-white',
    'dark:bg-gray-900',
    'text-gray-900',
    'dark:text-gray-100',
    'shadow-2xl',
    'animate-in',
    'zoom-in-95',
    'slide-in-from-top-2',
  ],
  {
    variants: {
      size: {
        sm: ['max-w-sm'],
        md: ['max-w-md'],
        lg: ['max-w-lg'],
        xl: ['max-w-xl'],
      },
      variant: {
        default: ['border-border'],
        compact: ['border-border', 'shadow-lg'],
        spotlight: [
          'border-border',
          'shadow-2xl',
          'ring-1',
          'ring-border',
          'bg-background/95',
          'backdrop-blur-md',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * Search input variants
 */
export const commandPaletteSearchVariants = cva(
  // Base styles for search input
  [
    'flex',
    'h-12',
    'w-full',
    'rounded-none',
    'border-0',
    'border-b',
    'border-border',
    'bg-white',
    'dark:bg-gray-900',
    'px-4',
    'py-3',
    'text-sm',
    'outline-none',
    'placeholder:text-muted-foreground',
    'focus:border-primary',
    'focus:outline-none',
    'focus:ring-0',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['h-10', 'px-3', 'py-2', 'text-sm'],
        spotlight: ['h-14', 'px-6', 'py-4', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command group variants
 */
export const commandPaletteGroupVariants = cva(
  // Base styles for command groups
  ['overflow-hidden'],
  {
    variants: {
      variant: {
        default: [],
        compact: [],
        spotlight: [],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command group label variants
 */
export const commandPaletteGroupLabelVariants = cva(
  // Base styles for group labels
  [
    'px-4',
    'py-2',
    'text-xs',
    'font-medium',
    'text-muted-foreground',
    'uppercase',
    'tracking-wider',
  ],
  {
    variants: {
      variant: {
        default: ['bg-muted/50'],
        compact: ['px-3', 'py-1.5', 'bg-muted/30'],
        spotlight: ['px-6', 'py-3', 'bg-muted/20', 'backdrop-blur-sm'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item variants
 */
export const commandPaletteItemVariants = cva(
  // Base styles for command items
  [
    'flex',
    'cursor-pointer',
    'select-none',
    'items-center',
    'gap-3',
    'px-4',
    'py-3',
    'text-sm',
    'outline-none',
    'transition-colors',
    'hover:bg-accent',
    'hover:text-accent-foreground',
    'focus:bg-accent',
    'focus:text-accent-foreground',
    'data-[highlighted=true]:bg-accent',
    'data-[highlighted=true]:text-accent-foreground',
    'data-[disabled=true]:cursor-not-allowed',
    'data-[disabled=true]:opacity-50',
    'data-[disabled=true]:hover:bg-transparent',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['px-3', 'py-2', 'text-sm'],
        spotlight: ['px-6', 'py-4', 'text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item icon variants
 */
export const commandPaletteItemIconVariants = cva(
  // Base styles for command icons
  ['h-4', 'w-4', 'shrink-0', 'text-muted-foreground'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['h-3.5', 'w-3.5'],
        spotlight: ['h-5', 'w-5'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item content variants
 */
export const commandPaletteItemContentVariants = cva(
  // Base styles for command content area
  ['flex', 'flex-1', 'flex-col', 'gap-0.5', 'overflow-hidden'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['gap-0'],
        spotlight: ['gap-1'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item label variants
 */
export const commandPaletteItemLabelVariants = cva(
  // Base styles for command labels
  ['truncate', 'font-medium'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['text-sm'],
        spotlight: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item description variants
 */
export const commandPaletteItemDescriptionVariants = cva(
  // Base styles for command descriptions
  ['truncate', 'text-xs', 'text-muted-foreground'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['text-xs'],
        spotlight: ['text-sm'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Command item shortcut variants
 */
export const commandPaletteItemShortcutVariants = cva(
  // Base styles for keyboard shortcuts
  [
    'flex',
    'shrink-0',
    'items-center',
    'gap-0.5',
    'text-xs',
    'text-muted-foreground',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['gap-0.5', 'text-xs'],
        spotlight: ['gap-1', 'text-sm'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Shortcut key variants
 */
export const commandPaletteShortcutKeyVariants = cva(
  // Base styles for individual shortcut keys
  [
    'inline-flex',
    'h-5',
    'min-w-[1.25rem]',
    'items-center',
    'justify-center',
    'rounded',
    'border',
    'bg-muted',
    'px-1',
    'font-mono',
    'text-xs',
    'font-medium',
    'text-muted-foreground',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['h-4', 'min-w-[1rem]', 'text-xs'],
        spotlight: ['h-6', 'min-w-[1.5rem]', 'text-sm'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Empty state variants
 */
export const commandPaletteEmptyVariants = cva(
  // Base styles for empty state
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-2',
    'py-12',
    'text-center',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['py-8'],
        spotlight: ['py-16'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Empty state icon variants
 */
export const commandPaletteEmptyIconVariants = cva(
  // Base styles for empty state icon
  ['h-8', 'w-8', 'text-muted-foreground/50'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['h-6', 'w-6'],
        spotlight: ['h-10', 'w-10'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Empty state text variants
 */
export const commandPaletteEmptyTextVariants = cva(
  // Base styles for empty state text
  ['text-sm', 'text-muted-foreground'],
  {
    variants: {
      variant: {
        default: [],
        compact: ['text-xs'],
        spotlight: ['text-base'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Separator variants
 */
export const commandPaletteSeparatorVariants = cva(
  // Base styles for separators
  ['h-px', 'bg-border'],
  {
    variants: {
      variant: {
        default: [],
        compact: [],
        spotlight: ['bg-border/50'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Content area variants (scrollable list)
 */
export const commandPaletteContentAreaVariants = cva(
  // Base styles for scrollable content area
  [
    'max-h-80',
    'overflow-y-auto',
    'overflow-x-hidden',
    'bg-white',
    'dark:bg-gray-900',
  ],
  {
    variants: {
      variant: {
        default: [],
        compact: ['max-h-64'],
        spotlight: ['max-h-96'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
