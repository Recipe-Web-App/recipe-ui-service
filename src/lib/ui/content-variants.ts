import { cva } from 'class-variance-authority';

/**
 * Base content variants using class-variance-authority
 *
 * Provides common styling foundation for all content components.
 */
export const contentVariants = cva(['relative'], {
  variants: {
    variant: {
      default: ['bg-background', 'text-foreground'],
      card: [
        'bg-card',
        'text-card-foreground',
        'border',
        'border-border',
        'rounded-lg',
        'shadow-sm',
      ],
      ghost: ['bg-transparent'],
      muted: ['bg-muted', 'text-muted-foreground'],
    },
    size: {
      sm: ['text-sm'],
      default: ['text-base'],
      lg: ['text-lg'],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Content pane variants using class-variance-authority
 *
 * Provides styling for the main content container with different layouts and view modes.
 */
export const contentPaneVariants = cva(
  [
    'flex',
    'flex-1',
    'flex-col',
    'min-h-0',
    'transition-all',
    'duration-200',
    'ease-in-out',
  ],
  {
    variants: {
      variant: {
        default: ['bg-background'],
        minimal: ['bg-transparent'],
        focused: [
          'bg-card',
          'rounded-lg',
          'border',
          'border-border',
          'shadow-sm',
        ],
      },
      viewMode: {
        grid: ['gap-6'],
        list: ['gap-4'],
        card: ['gap-6'],
        table: ['gap-0'],
      },
      contentWidth: {
        full: ['w-full'],
        contained: ['w-full'],
      },
      scrollable: {
        true: ['overflow-auto'],
        false: ['overflow-hidden'],
      },
      padding: {
        true: ['p-6'],
        false: ['p-0'],
      },
    },
    compoundVariants: [
      // Mobile padding adjustments
      {
        padding: true,
        class: ['sm:p-6', 'p-4'],
      },
      // Grid view specific styling
      {
        viewMode: 'grid',
        class: [
          'grid',
          'grid-cols-1',
          'sm:grid-cols-2',
          'lg:grid-cols-3',
          'xl:grid-cols-4',
        ],
      },
      // List view specific styling
      {
        viewMode: 'list',
        class: ['flex', 'flex-col'],
      },
      // Card view specific styling
      {
        viewMode: 'card',
        class: ['grid', 'grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3'],
      },
      // Table view specific styling
      {
        viewMode: 'table',
        class: ['block', 'w-full'],
      },
    ],
    defaultVariants: {
      variant: 'default',
      viewMode: 'grid',
      contentWidth: 'contained',
      scrollable: true,
      padding: true,
    },
  }
);

/**
 * Content header variants using class-variance-authority
 *
 * Provides styling for content headers with titles, breadcrumbs, and actions.
 */
export const contentHeaderVariants = cva(
  ['flex', 'flex-col', 'gap-4', 'mb-6', 'transition-all', 'duration-200'],
  {
    variants: {
      variant: {
        default: ['pb-4'],
        compact: ['pb-2', 'mb-4'],
        breadcrumb: ['pb-0', 'mb-4'],
        sticky: [
          'sticky',
          'top-0',
          'z-10',
          'bg-background/95',
          'backdrop-blur',
          'border-b',
          'border-border',
          'pb-4',
          'mb-6',
        ],
      },
      align: {
        left: ['items-start'],
        center: ['items-center', 'text-center'],
        between: ['items-start'],
      },
      showDivider: {
        true: ['border-b', 'border-border'],
        false: [],
      },
    },
    compoundVariants: [
      // Responsive adjustments for mobile
      {
        variant: 'default',
        class: ['sm:flex-row', 'sm:items-center', 'sm:justify-between'],
      },
      {
        align: 'between',
        class: ['sm:flex-row', 'sm:items-center', 'sm:justify-between'],
      },
    ],
    defaultVariants: {
      variant: 'default',
      align: 'left',
      showDivider: false,
    },
  }
);

/**
 * Content skeleton variants using class-variance-authority
 *
 * Provides styling for loading skeletons that match different view modes.
 */
export const contentSkeletonVariants = cva(['animate-pulse', 'space-y-4'], {
  variants: {
    variant: {
      default: ['bg-muted', 'rounded'],
      card: ['bg-card', 'border', 'border-border', 'rounded-lg', 'p-4'],
      list: ['bg-background'],
      table: ['bg-background', 'border', 'border-border', 'rounded-lg'],
    },
    viewMode: {
      grid: [
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        'gap-6',
      ],
      list: ['flex', 'flex-col', 'gap-4'],
      card: [
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'xl:grid-cols-3',
        'gap-6',
      ],
      table: ['block', 'w-full', 'space-y-2'],
    },
    showHeader: {
      true: ['space-y-6'],
      false: ['space-y-4'],
    },
  },
  compoundVariants: [
    // Grid skeleton items
    {
      viewMode: 'grid',
      variant: 'card',
      class: ['h-64'],
    },
    // List skeleton items
    {
      viewMode: 'list',
      class: ['space-y-3'],
    },
    // Card skeleton items
    {
      viewMode: 'card',
      variant: 'card',
      class: ['h-80'],
    },
    // Table skeleton rows
    {
      viewMode: 'table',
      class: ['space-y-2'],
    },
  ],
  defaultVariants: {
    variant: 'default',
    viewMode: 'grid',
    showHeader: true,
  },
});

/**
 * Content error variants using class-variance-authority
 *
 * Provides styling for error states with different error types and recovery options.
 */
export const contentErrorVariants = cva(
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'text-center',
    'space-y-4',
    'p-8',
    'rounded-lg',
  ],
  {
    variants: {
      variant: {
        default: ['bg-muted/50', 'text-muted-foreground'],
        muted: ['bg-muted', 'text-muted-foreground'],
        destructive: ['bg-destructive/5', 'text-destructive'],
        warning: [
          'bg-citrus/10',
          'text-foreground',
          'border',
          'border-citrus/30',
        ],
        info: [
          'bg-primary/10',
          'text-foreground',
          'border',
          'border-primary/20',
        ],
        network: [
          'bg-destructive/10',
          'text-foreground',
          'border',
          'border-destructive/20',
        ],
        '404': ['bg-muted', 'text-muted-foreground'],
        '500': ['bg-destructive/10', 'text-foreground'],
        unauthorized: ['bg-citrus/10', 'text-foreground'],
        validation: ['bg-accent/10', 'text-foreground'],
        generic: ['bg-muted', 'text-muted-foreground'],
      },
      size: {
        sm: ['p-4', 'space-y-2'],
        default: ['p-8', 'space-y-4'],
        lg: ['p-12', 'space-y-6'],
      },
      fullHeight: {
        true: ['min-h-[50vh]', 'justify-center'],
        false: ['py-8'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullHeight: false,
    },
  }
);

/**
 * Content section variants using class-variance-authority
 *
 * Provides styling for content sections with optional collapsible functionality.
 */
export const contentSectionVariants = cva(
  ['space-y-4', 'transition-all', 'duration-200'],
  {
    variants: {
      variant: {
        default: [],
        card: ['bg-card', 'border', 'border-border', 'rounded-lg'],
        ghost: ['bg-transparent'],
        muted: ['bg-muted', 'text-muted-foreground', 'rounded-lg'],
      },
      collapsible: {
        true: ['overflow-hidden'],
        false: [],
      },
      collapsed: {
        true: ['max-h-12'],
        false: ['max-h-none'],
      },
      padding: {
        true: ['p-6'],
        false: ['p-0'],
      },
    },
    compoundVariants: [
      // Card variant with padding
      {
        variant: 'card',
        padding: true,
        class: ['p-6'],
      },
      // Mobile padding adjustments
      {
        padding: true,
        class: ['sm:p-6', 'p-4'],
      },
    ],
    defaultVariants: {
      variant: 'default',
      collapsible: false,
      collapsed: false,
      padding: false,
    },
  }
);

/**
 * Content grid variants using class-variance-authority
 *
 * Provides styling for content grids with responsive columns and spacing.
 */
export const contentGridVariants = cva(['grid', 'w-full'], {
  variants: {
    columns: {
      1: ['grid-cols-1'],
      2: ['grid-cols-1', 'md:grid-cols-2'],
      3: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
      4: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4'],
      5: [
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        '2xl:grid-cols-5',
      ],
      6: [
        'grid-cols-2',
        'sm:grid-cols-3',
        'lg:grid-cols-4',
        'xl:grid-cols-5',
        '2xl:grid-cols-6',
      ],
    },
    gap: {
      sm: ['gap-2'],
      md: ['gap-4'],
      lg: ['gap-6'],
      xl: ['gap-8'],
    },
    responsive: {
      true: ['auto-fit'],
      false: [],
    },
  },
  compoundVariants: [
    // Auto-fit responsive grids
    {
      responsive: true,
      columns: 1,
      class: ['grid-cols-1'],
    },
    {
      responsive: true,
      columns: 2,
      class: ['grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'],
    },
    {
      responsive: true,
      columns: 3,
      class: ['grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'],
    },
    {
      responsive: true,
      columns: 4,
      class: ['grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'],
    },
  ],
  defaultVariants: {
    columns: 3,
    gap: 'lg',
    responsive: false,
  },
});

/**
 * Content list variants using class-variance-authority
 *
 * Provides styling for content lists with dividers and spacing options.
 */
export const contentListVariants = cva(['flex', 'flex-col'], {
  variants: {
    divided: {
      true: ['divide-y', 'divide-border'],
      false: [],
    },
    spacing: {
      sm: ['gap-2'],
      md: ['gap-4'],
      lg: ['gap-6'],
    },
    hover: {
      true: [
        '[&>*:hover]:bg-muted/50',
        '[&>*]:transition-colors',
        '[&>*]:rounded',
      ],
      false: [],
    },
  },
  compoundVariants: [
    // Remove gap when divided
    {
      divided: true,
      spacing: 'sm',
      class: ['gap-0'],
    },
    {
      divided: true,
      spacing: 'md',
      class: ['gap-0'],
    },
    {
      divided: true,
      spacing: 'lg',
      class: ['gap-0'],
    },
  ],
  defaultVariants: {
    divided: false,
    spacing: 'md',
    hover: false,
  },
});

/**
 * Content actions variants using class-variance-authority
 *
 * Provides styling for content action bars and button groups.
 */
export const contentActionsVariants = cva(
  ['flex', 'items-center', 'gap-3', 'transition-all', 'duration-200'],
  {
    variants: {
      align: {
        left: ['justify-start'],
        center: ['justify-center'],
        right: ['justify-end'],
        between: ['justify-between'],
      },
      sticky: {
        true: [
          'sticky',
          'bottom-0',
          'z-10',
          'bg-background/95',
          'backdrop-blur',
          'border-t',
          'border-border',
          'p-4',
          'mt-6',
        ],
        false: [],
      },
      border: {
        true: ['border-t', 'border-border', 'pt-4'],
        false: [],
      },
      responsive: {
        true: ['flex-col', 'sm:flex-row', 'gap-2', 'sm:gap-3'],
        false: [],
      },
    },
    compoundVariants: [
      // Sticky with responsive
      {
        sticky: true,
        responsive: true,
        class: ['flex-col', 'sm:flex-row'],
      },
    ],
    defaultVariants: {
      align: 'left',
      sticky: false,
      border: false,
      responsive: false,
    },
  }
);
