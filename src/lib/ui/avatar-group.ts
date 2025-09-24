import { cva } from 'class-variance-authority';

/**
 * Avatar group container variants
 * Provides different layout modes and spacing options
 */
export const avatarGroupVariants = cva(['relative', 'flex', 'items-center'], {
  variants: {
    layout: {
      stacked: ['flex-row', '-space-x-2'],
      grid: ['flex-wrap', 'gap-2'],
      inline: ['flex-row', 'gap-2'],
    },
    size: {
      xs: [],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    },
    animated: {
      true: ['group'],
      false: [],
    },
  },
  compoundVariants: [
    // Stacked layout with size-specific overlaps
    {
      layout: 'stacked',
      size: 'xs',
      className: '-space-x-1',
    },
    {
      layout: 'stacked',
      size: 'sm',
      className: '-space-x-1.5',
    },
    {
      layout: 'stacked',
      size: 'md',
      className: '-space-x-2',
    },
    {
      layout: 'stacked',
      size: 'lg',
      className: '-space-x-2.5',
    },
    {
      layout: 'stacked',
      size: 'xl',
      className: '-space-x-3',
    },
    // Grid layout with size-specific gaps
    {
      layout: 'grid',
      size: 'xs',
      className: 'gap-1',
    },
    {
      layout: 'grid',
      size: 'sm',
      className: 'gap-1.5',
    },
    {
      layout: 'grid',
      size: 'md',
      className: 'gap-2',
    },
    {
      layout: 'grid',
      size: 'lg',
      className: 'gap-2.5',
    },
    {
      layout: 'grid',
      size: 'xl',
      className: 'gap-3',
    },
    // Inline layout with size-specific gaps
    {
      layout: 'inline',
      size: 'xs',
      className: 'gap-1',
    },
    {
      layout: 'inline',
      size: 'sm',
      className: 'gap-1.5',
    },
    {
      layout: 'inline',
      size: 'md',
      className: 'gap-2',
    },
    {
      layout: 'inline',
      size: 'lg',
      className: 'gap-2.5',
    },
    {
      layout: 'inline',
      size: 'xl',
      className: 'gap-3',
    },
  ],
  defaultVariants: {
    layout: 'stacked',
    size: 'md',
    animated: false,
  },
});

/**
 * Avatar item variants for individual avatars within a group
 * Handles hover effects and z-index stacking
 */
export const avatarGroupItemVariants = cva(
  ['relative', 'transition-all', 'duration-200'],
  {
    variants: {
      layout: {
        stacked: ['ring-2', 'ring-white', 'dark:ring-gray-900', 'hover:z-10'],
        grid: [],
        inline: [],
      },
      animated: {
        true: ['hover:scale-110', 'hover:shadow-lg', 'cursor-pointer'],
        false: [],
      },
      clickable: {
        true: ['cursor-pointer'],
        false: [],
      },
    },
    compoundVariants: [
      {
        layout: 'stacked',
        animated: true,
        className: 'hover:-translate-y-1',
      },
    ],
    defaultVariants: {
      layout: 'stacked',
      animated: false,
      clickable: false,
    },
  }
);

/**
 * Overflow indicator variants
 * Styles the "+N more" indicator
 */
export const avatarGroupOverflowVariants = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'font-medium',
    'bg-gray-100',
    'dark:bg-gray-800',
    'text-gray-600',
    'dark:text-gray-300',
    'border-2',
    'border-gray-200',
    'dark:border-gray-700',
    'rounded-full',
  ],
  {
    variants: {
      size: {
        xs: ['h-6', 'w-6', 'text-[10px]'],
        sm: ['h-8', 'w-8', 'text-xs'],
        md: ['h-10', 'w-10', 'text-sm'],
        lg: ['h-12', 'w-12', 'text-base'],
        xl: ['h-16', 'w-16', 'text-lg'],
      },
      clickable: {
        true: [
          'cursor-pointer',
          'hover:bg-gray-200',
          'dark:hover:bg-gray-700',
          'transition-colors',
        ],
        false: [],
      },
      layout: {
        stacked: ['ring-2', 'ring-white', 'dark:ring-gray-900'],
        grid: [],
        inline: [],
      },
    },
    defaultVariants: {
      size: 'md',
      clickable: false,
      layout: 'stacked',
    },
  }
);

/**
 * Tooltip variants for user information
 */
export const avatarGroupTooltipVariants = cva(
  [
    'absolute',
    'z-50',
    'px-2',
    'py-1',
    'text-xs',
    'font-medium',
    'text-white',
    'bg-gray-900',
    'dark:bg-gray-700',
    'rounded',
    'shadow-lg',
    'whitespace-nowrap',
    'pointer-events-none',
    'opacity-0',
    'transition-opacity',
    'duration-200',
  ],
  {
    variants: {
      position: {
        top: ['bottom-full', 'left-1/2', '-translate-x-1/2', 'mb-2'],
        bottom: ['top-full', 'left-1/2', '-translate-x-1/2', 'mt-2'],
      },
      visible: {
        true: ['opacity-100'],
        false: ['opacity-0'],
      },
    },
    defaultVariants: {
      position: 'top',
      visible: false,
    },
  }
);

/**
 * Avatar group label variants for context information
 */
export const avatarGroupLabelVariants = cva(
  ['text-sm', 'text-gray-600', 'dark:text-gray-400'],
  {
    variants: {
      position: {
        before: ['mr-2'],
        after: ['ml-2'],
      },
      size: {
        xs: ['text-xs'],
        sm: ['text-xs'],
        md: ['text-sm'],
        lg: ['text-base'],
        xl: ['text-lg'],
      },
    },
    defaultVariants: {
      position: 'after',
      size: 'md',
    },
  }
);
