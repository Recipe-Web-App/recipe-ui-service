import { cva } from 'class-variance-authority';

/**
 * Disclosure root container variants using class-variance-authority
 *
 * Provides styling for disclosure containers with consistent spacing and layout.
 * Simpler than accordion - designed for single content sections.
 */
export const disclosureVariants = cva(
  ['w-full', 'transition-all', 'duration-200', 'ease-in-out', 'group'],
  {
    variants: {
      variant: {
        default: [
          'border',
          'border-gray-200',
          'rounded-lg',
          'bg-white',
          'shadow-sm',
        ],
        outlined: ['border', 'border-gray-300', 'rounded-lg', 'bg-transparent'],
        minimal: ['border-0', 'rounded-none', 'bg-transparent'],
        elevated: [
          'border',
          'border-gray-200',
          'rounded-lg',
          'bg-white',
          'shadow-md',
          'hover:shadow-lg',
        ],
        card: [
          'border',
          'border-gray-200',
          'rounded-lg',
          'bg-gray-50',
          'shadow-sm',
        ],
      },
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
        lg: ['text-lg'],
      },
      state: {
        open: [],
        closed: [],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'closed',
    },
  }
);

/**
 * Disclosure trigger (button) variants using class-variance-authority
 *
 * Provides styling for disclosure trigger buttons with icons and states.
 */
export const disclosureTriggerVariants = cva(
  [
    'flex',
    'w-full',
    'items-center',
    'justify-between',
    'text-left',
    'font-medium',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
    'group',
  ],
  {
    variants: {
      variant: {
        default: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        outlined: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        minimal: [
          'px-2',
          'py-2',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-100',
          'rounded-md',
        ],
        elevated: [
          'px-4',
          'py-3',
          'text-gray-900',
          'hover:text-blue-600',
          'hover:bg-gray-50',
        ],
        card: [
          'px-4',
          'py-3',
          'text-gray-800',
          'hover:text-blue-600',
          'hover:bg-gray-100',
        ],
      },
      size: {
        sm: ['py-2', 'text-sm', 'px-3'],
        md: ['py-3', 'text-base', 'px-4'],
        lg: ['py-4', 'text-lg', 'px-5'],
      },
      disabled: {
        true: [
          'cursor-not-allowed',
          'opacity-50',
          'hover:text-gray-900',
          'hover:bg-transparent',
        ],
        false: ['cursor-pointer'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
    },
  }
);

/**
 * Disclosure content panel variants using class-variance-authority
 *
 * Provides styling for disclosure content areas with proper spacing and animations.
 */
export const disclosureContentVariants = cva(
  [
    'overflow-hidden',
    'transition-all',
    '[transition-duration:var(--disclosure-duration,300ms)]',
    'ease-in-out',
  ],
  {
    variants: {
      variant: {
        default: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-100',
          'bg-white',
        ],
        outlined: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-200',
          'bg-transparent',
        ],
        minimal: ['px-2', 'pb-3', 'text-gray-700', 'bg-transparent'],
        elevated: [
          'px-4',
          'pb-4',
          'text-gray-700',
          'border-t',
          'border-gray-100',
          'bg-white',
        ],
        card: [
          'px-4',
          'pb-4',
          'text-gray-600',
          'border-t',
          'border-gray-200',
          'bg-gray-50',
        ],
      },
      size: {
        sm: ['text-sm', 'py-2'],
        md: ['text-base', 'py-3'],
        lg: ['text-lg', 'py-4'],
      },
      state: {
        open: ['opacity-100', 'max-h-screen'],
        closed: ['opacity-0', 'max-h-0', 'py-0', 'overflow-hidden'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'closed',
    },
  }
);

/**
 * Disclosure icon variants using class-variance-authority
 *
 * Provides styling for disclosure expand/collapse icons with smooth rotation.
 */
export const disclosureIconVariants = cva(
  ['transition-transform', 'duration-200', 'ease-in-out', 'flex-shrink-0'],
  {
    variants: {
      size: {
        sm: ['h-4', 'w-4'],
        md: ['h-5', 'w-5'],
        lg: ['h-6', 'w-6'],
      },
      state: {
        open: ['rotate-180'],
        closed: ['rotate-0'],
      },
      position: {
        left: ['mr-2'],
        right: ['ml-2'],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'closed',
      position: 'right',
    },
  }
);

/**
 * Recipe-specific disclosure variants using class-variance-authority
 *
 * Specialized styling for recipe-related content sections.
 */
export const recipeDisclosureVariants = cva(
  ['border-l-4', 'transition-all', 'duration-200'],
  {
    variants: {
      context: {
        tips: ['border-l-amber-500', 'bg-amber-50', 'hover:bg-amber-100'],
        notes: ['border-l-blue-500', 'bg-blue-50', 'hover:bg-blue-100'],
        substitutions: [
          'border-l-green-500',
          'bg-green-50',
          'hover:bg-green-100',
        ],
        nutrition: [
          'border-l-purple-500',
          'bg-purple-50',
          'hover:bg-purple-100',
        ],
        equipment: ['border-l-gray-500', 'bg-gray-50', 'hover:bg-gray-100'],
        storage: ['border-l-indigo-500', 'bg-indigo-50', 'hover:bg-indigo-100'],
        variations: ['border-l-pink-500', 'bg-pink-50', 'hover:bg-pink-100'],
        faq: ['border-l-orange-500', 'bg-orange-50', 'hover:bg-orange-100'],
      },
      state: {
        open: ['shadow-sm'],
        closed: [],
      },
    },
    defaultVariants: {
      context: 'tips',
      state: 'closed',
    },
  }
);

/**
 * Kitchen tips disclosure variants using class-variance-authority
 *
 * Styling for cooking tips and techniques with difficulty indicators.
 */
export const kitchenTipsVariants = cva(['relative', 'overflow-hidden'], {
  variants: {
    tipType: {
      cooking: ['border-l-red-500', 'bg-red-50'],
      prep: ['border-l-green-500', 'bg-green-50'],
      storage: ['border-l-blue-500', 'bg-blue-50'],
      technique: ['border-l-purple-500', 'bg-purple-50'],
      safety: ['border-l-yellow-500', 'bg-yellow-50'],
      timing: ['border-l-orange-500', 'bg-orange-50'],
    },
    difficulty: {
      beginner: ['border-l-2'],
      intermediate: ['border-l-3'],
      advanced: ['border-l-4'],
    },
  },
  defaultVariants: {
    tipType: 'cooking',
    difficulty: 'beginner',
  },
});

/**
 * FAQ disclosure variants using class-variance-authority
 *
 * Styling for frequently asked questions with featured highlighting.
 */
export const faqDisclosureVariants = cva(
  ['border', 'border-gray-200', 'rounded-lg', 'transition-all', 'duration-200'],
  {
    variants: {
      featured: {
        true: [
          'border-blue-300',
          'bg-blue-50',
          'shadow-md',
          'ring-1',
          'ring-blue-100',
        ],
        false: ['bg-white', 'hover:bg-gray-50'],
      },
      category: {
        general: [],
        cooking: ['border-l-4', 'border-l-red-500'],
        ingredients: ['border-l-4', 'border-l-green-500'],
        equipment: ['border-l-4', 'border-l-gray-500'],
        storage: ['border-l-4', 'border-l-blue-500'],
        nutrition: ['border-l-4', 'border-l-purple-500'],
      },
    },
    defaultVariants: {
      featured: false,
      category: 'general',
    },
  }
);

/**
 * Disclosure group variants using class-variance-authority
 *
 * Styling for groups of related disclosures.
 */
export const disclosureGroupVariants = cva(['w-full'], {
  variants: {
    spacing: {
      tight: ['space-y-1'],
      normal: ['space-y-2'],
      loose: ['space-y-4'],
    },
  },
  defaultVariants: {
    spacing: 'normal',
  },
});

/**
 * Badge variants for disclosure additional info
 */
export const disclosureBadgeVariants = cva(
  [
    'inline-flex',
    'items-center',
    'px-2',
    'py-1',
    'rounded-full',
    'text-xs',
    'font-medium',
    'ml-2',
  ],
  {
    variants: {
      variant: {
        default: ['bg-gray-100', 'text-gray-800'],
        info: ['bg-blue-100', 'text-blue-800'],
        success: ['bg-green-100', 'text-green-800'],
        warning: ['bg-yellow-100', 'text-yellow-800'],
        error: ['bg-red-100', 'text-red-800'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
