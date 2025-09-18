import { cva } from 'class-variance-authority';

/**
 * Divider variants using class-variance-authority
 *
 * Comprehensive divider component system for recipe applications
 * with flexible styling, orientations, and recipe-specific variants.
 */

// Main Divider variants
export const dividerVariants = cva(['flex-shrink-0'], {
  variants: {
    orientation: {
      horizontal: ['w-full', 'h-px', 'border-t'],
      vertical: ['h-full', 'w-px', 'border-l'],
    },
    style: {
      solid: ['border-solid'],
      dashed: ['border-dashed'],
      dotted: ['border-dotted'],
      double: ['border-double', 'border-t-[3px]'],
    },
    weight: {
      thin: [],
      normal: ['border-t-[1.5px]'],
      thick: ['border-t-2'],
    },
    length: {
      short: ['max-w-16'],
      normal: [],
      long: ['min-w-32'],
      full: ['w-full'],
    },
    spacing: {
      tight: ['my-1'],
      normal: ['my-3'],
      loose: ['my-6'],
    },
    color: {
      default: ['border-border'],
      muted: ['border-muted'],
      primary: ['border-primary'],
      secondary: ['border-secondary'],
      accent: ['border-accent'],
      destructive: ['border-destructive'],
    },
  },
  compoundVariants: [
    // Vertical orientation adjustments
    {
      orientation: 'vertical',
      style: 'double',
      className: ['border-l-[3px]', 'border-t-0'],
    },
    {
      orientation: 'vertical',
      weight: 'normal',
      className: ['border-l-[1.5px]', 'border-t-0'],
    },
    {
      orientation: 'vertical',
      weight: 'thick',
      className: ['border-l-2', 'border-t-0'],
    },
    {
      orientation: 'vertical',
      spacing: 'tight',
      className: ['mx-1', 'my-0'],
    },
    {
      orientation: 'vertical',
      spacing: 'normal',
      className: ['mx-3', 'my-0'],
    },
    {
      orientation: 'vertical',
      spacing: 'loose',
      className: ['mx-6', 'my-0'],
    },
    {
      orientation: 'vertical',
      length: 'short',
      className: ['max-h-16', 'max-w-none'],
    },
    {
      orientation: 'vertical',
      length: 'long',
      className: ['min-h-32', 'min-w-0'],
    },
    {
      orientation: 'vertical',
      length: 'full',
      className: ['h-full', 'w-px'],
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    style: 'solid',
    weight: 'thin',
    length: 'full',
    spacing: 'normal',
    color: 'default',
  },
});

// Divider with text variants
export const dividerWithTextVariants = cva(
  ['relative', 'flex', 'items-center'],
  {
    variants: {
      orientation: {
        horizontal: ['w-full'],
        vertical: ['h-full', 'flex-col'],
      },
      textPosition: {
        start: ['justify-start'],
        center: ['justify-center'],
        end: ['justify-end'],
      },
      spacing: {
        tight: ['gap-2'],
        normal: ['gap-4'],
        loose: ['gap-6'],
      },
    },
    compoundVariants: [
      {
        orientation: 'vertical',
        textPosition: 'start',
        className: ['justify-start', 'items-center'],
      },
      {
        orientation: 'vertical',
        textPosition: 'center',
        className: ['justify-center', 'items-center'],
      },
      {
        orientation: 'vertical',
        textPosition: 'end',
        className: ['justify-end', 'items-center'],
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      textPosition: 'center',
      spacing: 'normal',
    },
  }
);

// Divider text content variants
export const dividerTextVariants = cva(
  ['flex-shrink-0', 'bg-background', 'px-3'],
  {
    variants: {
      size: {
        sm: ['text-xs', 'px-2'],
        md: ['text-sm', 'px-3'],
        lg: ['text-base', 'px-4'],
      },
      color: {
        default: ['text-foreground'],
        muted: ['text-muted-foreground'],
        primary: ['text-primary'],
        secondary: ['text-secondary'],
        accent: ['text-accent-foreground'],
      },
      weight: {
        normal: ['font-normal'],
        medium: ['font-medium'],
        semibold: ['font-semibold'],
      },
      transform: {
        none: [],
        uppercase: ['uppercase'],
        lowercase: ['lowercase'],
        capitalize: ['capitalize'],
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        weight: 'medium',
        className: ['tracking-wide'],
      },
      {
        transform: 'uppercase',
        size: 'sm',
        className: ['tracking-wider'],
      },
    ],
    defaultVariants: {
      size: 'md',
      color: 'muted',
      weight: 'medium',
      transform: 'none',
    },
  }
);

// Recipe-specific divider variants
export const recipeDividerVariants = cva(['relative'], {
  variants: {
    context: {
      'ingredient-group': [
        'my-4',
        'border-primary/20',
        'before:absolute',
        'before:left-0',
        'before:top-1/2',
        'before:h-2',
        'before:w-2',
        'before:rounded-full',
        'before:bg-primary/40',
        'before:-translate-y-1/2',
        'pl-4',
      ],
      'instruction-step': [
        'my-6',
        'border-secondary/30',
        'relative',
        'after:absolute',
        'after:right-0',
        'after:top-1/2',
        'after:h-1',
        'after:w-8',
        'after:bg-gradient-to-r',
        'after:from-secondary/50',
        'after:to-transparent',
        'after:-translate-y-1/2',
      ],
      'nutrition-group': [
        'my-3',
        'border-accent/25',
        'bg-gradient-to-r',
        'from-accent/5',
        'via-transparent',
        'to-accent/5',
        'h-px',
      ],
      'recipe-section': [
        'my-8',
        'border-border',
        'relative',
        'before:absolute',
        'before:left-1/2',
        'before:top-1/2',
        'before:h-3',
        'before:w-3',
        'before:rounded-full',
        'before:bg-background',
        'before:border-2',
        'before:border-border',
        'before:-translate-x-1/2',
        'before:-translate-y-1/2',
      ],
      'metadata-section': ['my-4', 'border-muted', 'opacity-60'],
    },
    emphasis: {
      subtle: ['opacity-40'],
      normal: ['opacity-100'],
      strong: ['opacity-100', 'border-2'],
    },
  },
  defaultVariants: {
    context: 'recipe-section',
    emphasis: 'normal',
  },
});

// Icon divider variants
export const dividerIconVariants = cva(
  [
    'flex-shrink-0',
    'bg-background',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
  ],
  {
    variants: {
      size: {
        sm: ['h-6', 'w-6', 'p-1'],
        md: ['h-8', 'w-8', 'p-1.5'],
        lg: ['h-10', 'w-10', 'p-2'],
      },
      variant: {
        default: ['border', 'border-border'],
        filled: ['bg-primary', 'text-primary-foreground'],
        ghost: ['border-transparent'],
        outline: ['border-2', 'border-primary', 'text-primary'],
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
