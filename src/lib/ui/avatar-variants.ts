import { cva } from 'class-variance-authority';

/**
 * Avatar container variants using class-variance-authority
 *
 * Provides styling for avatar containers with consistent sizing and layout.
 */
export const avatarVariants = cva(
  [
    'relative',
    'flex',
    'shrink-0',
    'overflow-hidden',
    'rounded-full',
    'bg-muted',
    'border',
    'border-border',
  ],
  {
    variants: {
      size: {
        xs: ['h-6', 'w-6'],
        sm: ['h-8', 'w-8'],
        default: ['h-10', 'w-10'],
        lg: ['h-12', 'w-12'],
        xl: ['h-16', 'w-16'],
        '2xl': ['h-20', 'w-20'],
        '3xl': ['h-24', 'w-24'],
      },
      variant: {
        default: ['border-border'],
        outlined: ['border-2', 'border-border'],
        success: ['border-2', 'border-basil'],
        warning: ['border-2', 'border-citrus'],
        error: ['border-2', 'border-destructive'],
        accent: ['border-2', 'border-primary'],
        chef: ['border-2', 'border-accent', 'shadow-sm'],
        premium: ['border-2', 'border-secondary', 'shadow-md'],
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Avatar image variants using class-variance-authority
 *
 * Provides styling for avatar images with proper aspect ratio and object fit.
 */
export const avatarImageVariants = cva([
  'aspect-square',
  'h-full',
  'w-full',
  'object-cover',
  'rounded-full',
]);

/**
 * Avatar fallback variants using class-variance-authority
 *
 * Provides styling for avatar fallbacks (initials or icons) when no image is available.
 */
export const avatarFallbackVariants = cva(
  [
    'flex',
    'h-full',
    'w-full',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-medium',
    'text-white',
    'select-none',
  ],
  {
    variants: {
      size: {
        xs: ['text-xs'],
        sm: ['text-xs'],
        default: ['text-sm'],
        lg: ['text-base'],
        xl: ['text-lg'],
        '2xl': ['text-xl'],
        '3xl': ['text-2xl'],
      },
      variant: {
        default: ['bg-muted-foreground'],
        user: ['bg-primary'],
        chef: ['bg-accent'],
        admin: ['bg-secondary'],
        guest: ['bg-muted-foreground/70'],
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Avatar status indicator variants using class-variance-authority
 *
 * Provides styling for status indicators (online, offline, verified, etc.).
 */
export const avatarStatusVariants = cva(
  [
    'absolute',
    'rounded-full',
    'border-2',
    'border-background',
    'bg-muted-foreground',
  ],
  {
    variants: {
      size: {
        xs: ['h-2', 'w-2', 'bottom-0', 'right-0'],
        sm: ['h-2.5', 'w-2.5', 'bottom-0', 'right-0'],
        default: ['h-3', 'w-3', 'bottom-0', 'right-0'],
        lg: ['h-3.5', 'w-3.5', 'bottom-0', 'right-0'],
        xl: ['h-4', 'w-4', 'bottom-0.5', 'right-0.5'],
        '2xl': ['h-5', 'w-5', 'bottom-0.5', 'right-0.5'],
        '3xl': ['h-6', 'w-6', 'bottom-1', 'right-1'],
      },
      status: {
        online: ['bg-basil'],
        offline: ['bg-muted-foreground/70'],
        away: ['bg-citrus'],
        busy: ['bg-destructive'],
        verified: ['bg-primary'],
        chef: ['bg-accent'],
        premium: ['bg-secondary'],
      },
    },
    defaultVariants: {
      size: 'default',
      status: 'offline',
    },
  }
);

/**
 * Avatar group variants using class-variance-authority
 *
 * Provides styling for groups of avatars with proper spacing and overlap.
 */
export const avatarGroupVariants = cva(['flex', '-space-x-1'], {
  variants: {
    size: {
      xs: ['-space-x-0.5'],
      sm: ['-space-x-0.5'],
      default: ['-space-x-1'],
      lg: ['-space-x-1.5'],
      xl: ['-space-x-2'],
      '2xl': ['-space-x-2.5'],
      '3xl': ['-space-x-3'],
    },
    max: {
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    },
  },
  defaultVariants: {
    size: 'default',
    max: 4,
  },
});

/**
 * Recipe author card variants using class-variance-authority
 *
 * Provides styling for recipe author information cards with avatars.
 */
export const recipeAuthorVariants = cva(
  [
    'flex',
    'items-center',
    'gap-3',
    'rounded-lg',
    'p-3',
    'transition-colors',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['bg-muted/50', 'hover:bg-muted'],
        outlined: [
          'border',
          'border-border',
          'bg-background',
          'hover:border-border/70',
        ],
        chef: [
          'bg-accent/10',
          'border',
          'border-accent/20',
          'hover:bg-accent/15',
        ],
        premium: [
          'bg-secondary/10',
          'border',
          'border-secondary/20',
          'hover:bg-secondary/15',
        ],
        simple: ['bg-transparent'],
      },
      size: {
        sm: ['gap-2', 'p-2'],
        default: ['gap-3', 'p-3'],
        lg: ['gap-4', 'p-4'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
