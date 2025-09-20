import { cva } from 'class-variance-authority';

/**
 * File upload variants using class-variance-authority
 *
 * Drag-and-drop upload zones with file validation, preview support, and progress tracking.
 * Perfect for recipe images, documents, and user-generated content.
 */
export const fileUploadVariants = cva(
  // Base styles - applied to all file upload zones
  [
    'relative',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-full',
    'rounded-lg',
    'border-2',
    'transition-all',
    'cursor-pointer',
    'group',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-input',
          'bg-background',
          'hover:bg-accent/50',
          'hover:border-accent-foreground/50',
        ],
        outlined: [
          'border-input',
          'bg-transparent',
          'hover:bg-accent/30',
          'hover:border-accent-foreground/50',
        ],
        filled: [
          'border-primary/20',
          'bg-primary/5',
          'hover:bg-primary/10',
          'hover:border-primary/50',
        ],
        dashed: [
          'border-dashed',
          'border-input',
          'bg-transparent',
          'hover:bg-accent/30',
          'hover:border-accent-foreground/50',
        ],
      },
      size: {
        sm: ['p-4', 'min-h-[120px]'],
        md: ['p-6', 'min-h-[160px]'],
        lg: ['p-8', 'min-h-[200px]'],
      },
      state: {
        idle: [],
        active: ['border-primary', 'bg-primary/10', 'scale-[1.02]'],
        success: ['border-green-500', 'bg-green-500/10'],
        error: ['border-destructive', 'bg-destructive/10'],
      },
    },
    defaultVariants: {
      variant: 'dashed',
      size: 'md',
      state: 'idle',
    },
  }
);

/**
 * File upload icon variants
 */
export const fileUploadIconVariants = cva(
  ['transition-all', 'group-hover:scale-110'],
  {
    variants: {
      size: {
        sm: ['h-8', 'w-8'],
        md: ['h-10', 'w-10'],
        lg: ['h-12', 'w-12'],
      },
      state: {
        idle: ['text-muted-foreground'],
        active: ['text-primary', 'animate-pulse'],
        success: ['text-green-500'],
        error: ['text-destructive'],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'idle',
    },
  }
);

/**
 * File upload text variants
 */
export const fileUploadTextVariants = cva(
  ['text-center', 'transition-colors'],
  {
    variants: {
      size: {
        sm: ['text-xs', 'mt-2'],
        md: ['text-sm', 'mt-3'],
        lg: ['text-base', 'mt-4'],
      },
      variant: {
        label: ['font-medium', 'text-foreground'],
        description: ['text-muted-foreground', 'mt-1'],
        error: ['text-destructive', 'mt-2'],
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'label',
    },
  }
);

/**
 * File item variants for file list display
 */
export const fileItemVariants = cva(
  [
    'flex',
    'items-center',
    'gap-3',
    'w-full',
    'rounded-md',
    'border',
    'transition-all',
    'group/item',
  ],
  {
    variants: {
      size: {
        sm: ['p-2', 'text-xs'],
        md: ['p-3', 'text-sm'],
        lg: ['p-4', 'text-base'],
      },
      state: {
        idle: ['border-input', 'bg-background', 'hover:bg-accent'],
        uploading: ['border-blue-500/50', 'bg-blue-500/5'],
        success: ['border-green-500/50', 'bg-green-500/5'],
        error: ['border-destructive/50', 'bg-destructive/5'],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'idle',
    },
  }
);

/**
 * File item preview variants
 */
export const filePreviewVariants = cva(
  [
    'relative',
    'overflow-hidden',
    'rounded',
    'bg-muted',
    'flex',
    'items-center',
    'justify-center',
  ],
  {
    variants: {
      size: {
        sm: ['h-8', 'w-8'],
        md: ['h-10', 'w-10'],
        lg: ['h-12', 'w-12'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * File progress bar variants
 */
export const fileProgressVariants = cva(
  [
    'relative',
    'w-full',
    'overflow-hidden',
    'rounded-full',
    'bg-gray-200',
    'dark:bg-gray-700',
  ],
  {
    variants: {
      size: {
        sm: ['h-2'],
        md: ['h-3'],
        lg: ['h-4'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * File progress fill variants
 */
export const fileProgressFillVariants = cva(
  [
    'absolute',
    'top-0',
    'left-0',
    'h-full',
    'transition-all',
    'duration-300',
    'ease-out',
    'rounded-full',
  ],
  {
    variants: {
      state: {
        active: ['bg-blue-500'],
        success: ['bg-green-500'],
        error: ['bg-red-500'],
      },
    },
    defaultVariants: {
      state: 'active',
    },
  }
);

/**
 * Delete button variants for file items
 */
export const fileDeleteButtonVariants = cva(
  [
    'p-1',
    'rounded',
    'transition-all',
    'opacity-0',
    'group-hover/item:opacity-100',
    'hover:scale-110',
    'focus-visible:opacity-100',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: ['h-6', 'w-6'],
        md: ['h-7', 'w-7'],
        lg: ['h-8', 'w-8'],
      },
      variant: {
        default: [
          'text-muted-foreground',
          'hover:text-foreground',
          'hover:bg-accent',
        ],
        destructive: [
          'text-destructive',
          'hover:bg-destructive',
          'hover:text-destructive-foreground',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
