import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { chipVariants } from '@/lib/ui/chip-variants';

/**
 * Base props for Chip component
 */
export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'color'>,
    VariantProps<typeof chipVariants> {
  /**
   * The content to display in the chip
   */
  children: ReactNode;

  /**
   * Callback when the chip is clicked (makes it interactive)
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Callback when the delete button is clicked
   */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Whether the chip is selected (for selectable chips)
   */
  selected?: boolean;

  /**
   * Whether the chip is disabled
   */
  disabled?: boolean;

  /**
   * Icon to display at the start of the chip
   */
  icon?: ReactNode;

  /**
   * Avatar/image to display at the start of the chip
   */
  avatar?: ReactNode;

  /**
   * Custom delete icon (defaults to X)
   */
  deleteIcon?: ReactNode;

  /**
   * Accessibility label for the delete button
   */
  deleteLabel?: string;

  /**
   * Whether to render as a child element (polymorphic)
   */
  asChild?: boolean;
}

/**
 * Props for ChipGroup container
 */
export interface ChipGroupProps {
  /**
   * The chips to display
   */
  children: ReactNode;

  /**
   * Maximum number of chips to display before showing "+X more"
   */
  maxDisplay?: number;

  /**
   * Spacing between chips
   */
  spacing?: 'tight' | 'normal' | 'loose';

  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Props for interactive chip input
 */
export interface ChipInputProps {
  /**
   * Current chip values
   */
  value: string[];

  /**
   * Callback when chips change
   */
  onChange: (value: string[]) => void;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Maximum number of chips allowed
   */
  maxChips?: number;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Validation function for new chips
   */
  validate?: (value: string) => boolean | string;

  /**
   * Suggestions to show while typing
   */
  suggestions?: string[];

  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Recipe-specific chip contexts
 */
export type RecipeChipContext =
  | 'ingredient'
  | 'dietary'
  | 'category'
  | 'tag'
  | 'filter'
  | 'step'
  | 'quantity';

/**
 * Props for recipe-specific chip
 */
export interface RecipeChipProps extends Omit<ChipProps, 'variant' | 'color'> {
  /**
   * The recipe context for automatic styling
   */
  context: RecipeChipContext;

  /**
   * Whether to show an icon based on context
   */
  showIcon?: boolean;
}
