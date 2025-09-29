import { cva } from 'class-variance-authority';

/**
 * Card variants using class-variance-authority
 *
 * This follows the industry standard approach for creating type-safe,
 * maintainable component variants with Tailwind CSS.
 */
export const cardVariants = cva(
  // Base styles - applied to all cards
  [
    'bg-card',
    'text-card-foreground',
    'rounded-lg',
    'border',
    'overflow-hidden',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['border-border', 'shadow-sm'],
        elevated: ['border-border/50', 'shadow-md', 'hover:shadow-lg'],
        outlined: ['border-border', 'bg-transparent', 'shadow-none'],
        ghost: ['border-transparent', 'bg-transparent', 'shadow-none'],
        interactive: [
          'border-border',
          'shadow-sm',
          'hover:shadow-md',
          'hover:bg-card/80',
          'cursor-pointer',
          'hover:border-primary/20',
          'hover:ring-1',
          'hover:ring-primary/10',
          'active:scale-[0.98]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary/50',
          'focus-visible:ring-offset-2',
        ],
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Card header variants for compound component
 */
export const cardHeaderVariants = cva(['flex', 'flex-col', 'space-y-1.5']);

/**
 * Card content variants for compound component
 */
export const cardContentVariants = cva(['flex', 'flex-col', 'space-y-4']);

/**
 * Card footer variants for compound component
 */
export const cardFooterVariants = cva([
  'flex',
  'items-center',
  'justify-between',
  'pt-4',
]);

/**
 * Card title variants for typography consistency
 */
export const cardTitleVariants = cva([
  'text-xl',
  'font-semibold',
  'leading-none',
  'tracking-tight',
]);

/**
 * Card description variants for typography consistency
 */
export const cardDescriptionVariants = cva([
  'text-sm',
  'text-muted-foreground',
]);
