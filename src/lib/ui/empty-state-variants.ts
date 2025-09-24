import { cva } from 'class-variance-authority';

/**
 * EmptyState variants using class-variance-authority
 *
 * This follows the industry standard approach for creating type-safe,
 * maintainable component variants with Tailwind CSS.
 */
export const emptyStateVariants = cva(
  // Base styles - applied to all empty states
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'text-center',
    'rounded-lg',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-card',
          'border',
          'border-border',
          'text-card-foreground',
          'p-8',
        ],
        search: [
          'bg-muted/30',
          'border',
          'border-dashed',
          'border-border',
          'text-muted-foreground',
          'p-8',
        ],
        minimal: ['bg-transparent', 'text-muted-foreground', 'p-6'],
        illustrated: [
          'bg-gradient-to-br',
          'from-muted/20',
          'to-muted/10',
          'border',
          'border-border/50',
          'text-card-foreground',
          'p-10',
        ],
        error: [
          'bg-destructive/5',
          'border',
          'border-destructive/20',
          'text-destructive-foreground',
          'p-8',
        ],
      },
      size: {
        sm: ['min-h-48', 'max-w-sm', 'gap-3'],
        md: ['min-h-64', 'max-w-md', 'gap-4'],
        lg: ['min-h-80', 'max-w-lg', 'gap-6'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * EmptyState icon variants for visual elements
 */
export const emptyStateIconVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'text-muted-foreground',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['text-muted-foreground'],
        search: ['text-muted-foreground/80'],
        minimal: ['text-muted-foreground/60'],
        illustrated: ['text-primary/80'],
        error: ['text-destructive'],
      },
      size: {
        sm: ['text-4xl', 'mb-2'],
        md: ['text-5xl', 'mb-3'],
        lg: ['text-6xl', 'mb-4'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * EmptyState title variants for typography consistency
 */
export const emptyStateTitleVariants = cva(
  [
    'font-semibold',
    'tracking-tight',
    'text-center',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['text-foreground'],
        search: ['text-foreground'],
        minimal: ['text-muted-foreground'],
        illustrated: ['text-foreground'],
        error: ['text-destructive'],
      },
      size: {
        sm: ['text-lg', 'leading-tight'],
        md: ['text-xl', 'leading-tight'],
        lg: ['text-2xl', 'leading-tight'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * EmptyState description variants for typography consistency
 */
export const emptyStateDescriptionVariants = cva(
  [
    'text-center',
    'leading-relaxed',
    'transition-colors',
    'duration-200',
    'max-w-prose',
  ],
  {
    variants: {
      variant: {
        default: ['text-muted-foreground'],
        search: ['text-muted-foreground/80'],
        minimal: ['text-muted-foreground/70'],
        illustrated: ['text-muted-foreground'],
        error: ['text-destructive/80'],
      },
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-lg'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * EmptyState actions variants for button layout
 */
export const emptyStateActionsVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'gap-3',
    'w-full',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      layout: {
        horizontal: ['flex-row', 'flex-wrap'],
        vertical: ['flex-col', 'items-stretch'],
        stacked: ['flex-col', 'items-center', 'gap-2'],
      },
      size: {
        sm: ['gap-2'],
        md: ['gap-3'],
        lg: ['gap-4'],
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      size: 'md',
    },
  }
);
