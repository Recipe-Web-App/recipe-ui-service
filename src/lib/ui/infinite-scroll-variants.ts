import { cva } from 'class-variance-authority';

/**
 * InfiniteScroll variants using class-variance-authority
 *
 * Comprehensive infinite scroll component system for recipe applications
 * with flexible styling and recipe-specific variants.
 */

// Main InfiniteScroll container variants
export const infiniteScrollVariants = cva(
  ['relative', 'w-full', 'overflow-hidden', 'scroll-smooth'],
  {
    variants: {
      variant: {
        default: ['space-y-4'],
        compact: ['space-y-2'],
        spacious: ['space-y-6'],
        grid: ['grid', 'gap-4', 'space-y-0'],
        masonry: [
          'columns-1',
          'sm:columns-2',
          'lg:columns-3',
          'xl:columns-4',
          'gap-4',
          'space-y-0',
        ],
        feed: ['space-y-6', 'pb-16'],
      },
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-lg'],
      },
      gridCols: {
        1: ['grid-cols-1'],
        2: ['grid-cols-1', 'sm:grid-cols-2'],
        3: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
        4: [
          'grid-cols-1',
          'sm:grid-cols-2',
          'lg:grid-cols-3',
          'xl:grid-cols-4',
        ],
        5: [
          'grid-cols-1',
          'sm:grid-cols-2',
          'lg:grid-cols-3',
          'xl:grid-cols-4',
          '2xl:grid-cols-5',
        ],
        6: [
          'grid-cols-1',
          'sm:grid-cols-2',
          'lg:grid-cols-3',
          'xl:grid-cols-4',
          '2xl:grid-cols-6',
        ],
      },
      recipeContext: {
        recipes: [
          'recipe-infinite-scroll',
          '[&_.recipe-card]:transition-transform',
          '[&_.recipe-card]:duration-200',
          '[&_.recipe-card:hover]:scale-[1.02]',
        ],
        'search-results': [
          'search-results-infinite-scroll',
          '[&_.search-result]:border-l-2',
          '[&_.search-result]:border-l-transparent',
          '[&_.search-result:hover]:border-l-primary',
        ],
        favorites: [
          'favorites-infinite-scroll',
          '[&_.favorite-recipe]:relative',
          '[&_.favorite-recipe]:overflow-hidden',
        ],
        'meal-plans': [
          'meal-plans-infinite-scroll',
          '[&_.meal-plan-item]:bg-gradient-to-r',
          '[&_.meal-plan-item]:from-background',
          '[&_.meal-plan-item]:to-muted/50',
        ],
      },
      loading: {
        true: ['overflow-hidden'],
        false: [],
      },
      virtualized: {
        true: ['overflow-auto', 'scroll-smooth'],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      loading: false,
      virtualized: false,
    },
  }
);

// InfiniteScroll item wrapper variants
export const infiniteScrollItemVariants = cva(
  ['w-full', 'transition-opacity', 'duration-200'],
  {
    variants: {
      variant: {
        default: [],
        card: [
          'bg-card',
          'border',
          'border-border',
          'rounded-lg',
          'shadow-sm',
          'overflow-hidden',
          'hover:shadow-md',
          'transition-shadow',
          'duration-200',
        ],
        outlined: [
          'border',
          'border-border',
          'rounded-lg',
          'overflow-hidden',
          'hover:border-primary/50',
          'transition-colors',
          'duration-200',
        ],
        elevated: [
          'bg-card',
          'rounded-lg',
          'shadow-md',
          'hover:shadow-lg',
          'transition-shadow',
          'duration-200',
        ],
        minimal: [
          'hover:bg-accent/50',
          'rounded-md',
          'transition-colors',
          'duration-200',
        ],
      },
      size: {
        sm: ['p-2'],
        md: ['p-4'],
        lg: ['p-6'],
      },
      loading: {
        true: ['animate-pulse', 'opacity-50'],
        false: [],
      },
      isFirst: {
        true: [],
        false: [],
      },
      isLast: {
        true: [],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      loading: false,
      isFirst: false,
      isLast: false,
    },
  }
);

// Loading indicator variants
export const infiniteScrollLoadingVariants = cva(
  ['flex', 'items-center', 'justify-center', 'w-full', 'py-8'],
  {
    variants: {
      variant: {
        spinner: ['flex-col', 'gap-3'],
        skeleton: ['flex-col', 'gap-4'],
        dots: ['gap-2'],
        wave: ['gap-1'],
        pulse: ['animate-pulse'],
      },
      size: {
        sm: ['py-4', 'text-sm'],
        md: ['py-8', 'text-base'],
        lg: ['py-12', 'text-lg'],
      },
      position: {
        bottom: ['border-t', 'border-border/50', 'mt-4'],
        center: [
          'absolute',
          'inset-0',
          'bg-background/80',
          'backdrop-blur-sm',
          'z-10',
        ],
        inline: [],
      },
      state: {
        loading: ['text-muted-foreground'],
        loadingMore: [
          'text-muted-foreground',
          'bg-muted/20',
          'rounded-lg',
          'mx-4',
        ],
        error: [
          'text-destructive',
          'bg-destructive/10',
          'border',
          'border-destructive/20',
          'rounded-lg',
        ],
        complete: ['text-muted-foreground', 'opacity-60'],
      },
    },
    defaultVariants: {
      variant: 'spinner',
      size: 'md',
      position: 'bottom',
      state: 'loading',
    },
  }
);

// Error state variants
export const infiniteScrollErrorVariants = cva(
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-full',
    'py-8',
    'px-4',
    'text-center',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-destructive/10',
          'border',
          'border-destructive/20',
          'rounded-lg',
          'text-destructive',
        ],
        minimal: ['text-muted-foreground'],
        card: ['bg-card', 'border', 'border-border', 'rounded-lg', 'shadow-sm'],
        alert: [
          'bg-yellow-50',
          'border',
          'border-yellow-200',
          'rounded-lg',
          'text-yellow-800',
          'dark:bg-yellow-900/20',
          'dark:border-yellow-800',
          'dark:text-yellow-200',
        ],
      },
      size: {
        sm: ['py-4', 'px-3', 'text-sm'],
        md: ['py-8', 'px-4', 'text-base'],
        lg: ['py-12', 'px-6', 'text-lg'],
      },
      retryable: {
        true: [
          'cursor-pointer',
          'hover:bg-destructive/20',
          'transition-colors',
          'duration-200',
        ],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      retryable: true,
    },
  }
);

// Empty state variants
export const infiniteScrollEmptyVariants = cva(
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-full',
    'py-16',
    'px-4',
    'text-center',
  ],
  {
    variants: {
      variant: {
        default: ['text-muted-foreground'],
        card: ['bg-card', 'border', 'border-border', 'rounded-lg', 'shadow-sm'],
        outlined: ['border-2', 'border-dashed', 'border-border', 'rounded-lg'],
        minimal: [],
      },
      size: {
        sm: ['py-8', 'text-sm'],
        md: ['py-16', 'text-base'],
        lg: ['py-24', 'text-lg'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Skeleton loading variants for recipe items
export const recipeSkeletonVariants = cva(
  ['animate-pulse', 'bg-muted', 'rounded'],
  {
    variants: {
      variant: {
        image: [
          'aspect-video',
          'w-full',
          'rounded-t-lg',
          'bg-gradient-to-r',
          'from-muted',
          'to-muted/70',
        ],
        title: ['h-6', 'w-3/4', 'mb-2'],
        description: ['h-4', 'w-full', 'mb-1'],
        metadata: ['h-3', 'w-1/2'],
        rating: ['h-4', 'w-20'],
        author: ['h-4', 'w-24'],
        category: ['h-3', 'w-16', 'rounded-full'],
      },
      size: {
        sm: ['scale-90'],
        md: [],
        lg: ['scale-110'],
      },
    },
    defaultVariants: {
      variant: 'title',
      size: 'md',
    },
  }
);

// Recipe card specific variants
export const recipeCardVariants = cva(
  [
    'recipe-card',
    'w-full',
    'bg-card',
    'border',
    'border-border',
    'rounded-lg',
    'overflow-hidden',
    'shadow-sm',
    'transition-all',
    'duration-200',
  ],
  {
    variants: {
      variant: {
        default: ['hover:shadow-md', 'hover:scale-[1.02]'],
        compact: ['flex', 'flex-row', 'h-24', 'hover:shadow-md'],
        detailed: ['hover:shadow-lg', 'hover:scale-[1.01]'],
        minimal: [
          'border-0',
          'shadow-none',
          'bg-transparent',
          'hover:bg-accent/50',
        ],
      },
      size: {
        sm: ['max-w-sm'],
        md: ['max-w-md'],
        lg: ['max-w-lg'],
        full: ['w-full'],
      },
      interactive: {
        true: [
          'cursor-pointer',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
        ],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'full',
      interactive: true,
    },
  }
);

// Search result item variants
export const searchResultVariants = cva(
  [
    'search-result',
    'w-full',
    'flex',
    'items-start',
    'gap-3',
    'p-4',
    'border-b',
    'border-border',
    'transition-colors',
    'duration-200',
    'last:border-b-0',
  ],
  {
    variants: {
      variant: {
        default: ['hover:bg-accent/50'],
        highlighted: ['bg-primary/5', 'border-l-2', 'border-l-primary', 'pl-3'],
        compact: ['py-2', 'gap-2'],
        card: [
          'bg-card',
          'border',
          'border-border',
          'rounded-lg',
          'border-b',
          'last:border-b',
          'shadow-sm',
        ],
      },
      resultType: {
        recipe: [
          '[&_.result-type-indicator]:bg-green-100',
          '[&_.result-type-indicator]:text-green-800',
          'dark:[&_.result-type-indicator]:bg-green-900/30',
          'dark:[&_.result-type-indicator]:text-green-400',
        ],
        ingredient: [
          '[&_.result-type-indicator]:bg-blue-100',
          '[&_.result-type-indicator]:text-blue-800',
          'dark:[&_.result-type-indicator]:bg-blue-900/30',
          'dark:[&_.result-type-indicator]:text-blue-400',
        ],
        user: [
          '[&_.result-type-indicator]:bg-purple-100',
          '[&_.result-type-indicator]:text-purple-800',
          'dark:[&_.result-type-indicator]:bg-purple-900/30',
          'dark:[&_.result-type-indicator]:text-purple-400',
        ],
        collection: [
          '[&_.result-type-indicator]:bg-orange-100',
          '[&_.result-type-indicator]:text-orange-800',
          'dark:[&_.result-type-indicator]:bg-orange-900/30',
          'dark:[&_.result-type-indicator]:text-orange-400',
        ],
      },
      interactive: {
        true: [
          'cursor-pointer',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
        ],
        false: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: true,
    },
  }
);

// Virtual scroll container variants
export const virtualScrollContainerVariants = cva(
  ['relative', 'overflow-auto', 'scroll-smooth'],
  {
    variants: {
      scrollbarStyle: {
        default: [],
        hidden: [
          'scrollbar-hide',
          '[&::-webkit-scrollbar]:hidden',
          'scrollbar-width-none',
        ],
        minimal: [
          '[&::-webkit-scrollbar]:w-2',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-muted',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50',
        ],
        styled: [
          '[&::-webkit-scrollbar]:w-3',
          '[&::-webkit-scrollbar-track]:bg-muted/30',
          '[&::-webkit-scrollbar-track]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50',
        ],
      },
      height: {
        fixed: ['h-96'],
        screen: ['h-screen'],
        viewport: ['h-[80vh]'],
        auto: ['max-h-screen'],
      },
    },
    defaultVariants: {
      scrollbarStyle: 'minimal',
      height: 'auto',
    },
  }
);

// Loading spinner animation variants
export const spinnerAnimationVariants = cva(['inline-block', 'animate-spin'], {
  variants: {
    variant: {
      default: [
        'w-6',
        'h-6',
        'border-2',
        'border-current',
        'border-t-transparent',
        'rounded-full',
      ],
      dots: ['w-8', 'h-8'],
      wave: ['w-10', 'h-4'],
      pulse: ['w-6', 'h-6', 'bg-current', 'rounded-full', 'animate-pulse'],
    },
    size: {
      sm: ['w-4', 'h-4'],
      md: ['w-6', 'h-6'],
      lg: ['w-8', 'h-8'],
    },
    speed: {
      slow: ['animate-spin', '[animation-duration:2s]'],
      normal: ['animate-spin', '[animation-duration:1s]'],
      fast: ['animate-spin', '[animation-duration:0.5s]'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    speed: 'normal',
  },
});
