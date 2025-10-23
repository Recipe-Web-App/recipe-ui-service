import type { LucideIcon } from 'lucide-react';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import type {
  DropdownMenuContentProps,
  DropdownMenuTriggerProps,
} from '@/types/ui/dropdown';

/**
 * Recipe menu action definition
 * Represents a single action in the recipe menu
 */
export interface RecipeMenuAction {
  /** Unique identifier for the action */
  id: string;
  /** Display label for the action */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Action handler */
  onClick: () => void;
  /** Visual variant (affects styling) */
  variant?: 'default' | 'destructive';
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Optional keyboard shortcut hint */
  shortcut?: string;
}

/**
 * Recipe menu action handlers
 * All possible actions that can be performed on a recipe
 */
export interface RecipeMenuActions {
  /** Navigate to recipe details */
  onView?: () => void;
  /** Edit the recipe (owner only) */
  onEdit?: () => void;
  /** Delete the recipe (owner only) */
  onDelete?: () => void;
  /** Duplicate the recipe (owner only) */
  onDuplicate?: () => void;
  /** Share the recipe */
  onShare?: () => void;
  /** Add recipe to a collection */
  onAddToCollection?: () => void;
  /** Copy recipe link to clipboard */
  onCopyLink?: () => void;
  /** Add recipe to a meal plan */
  onAddToMealPlan?: () => void;
  /** Report the recipe (non-owner only) */
  onReport?: () => void;
}

/**
 * Recipe menu props
 * Props for the RecipeMenu component
 */
export interface RecipeMenuProps extends RecipeMenuActions {
  /** The recipe data */
  recipe: RecipeDto;
  /** Whether the current user owns this recipe */
  isOwner?: boolean;
  /** Visual variant for the trigger button */
  variant?: 'default' | 'ghost' | 'outline';
  /** Size of the menu trigger and items */
  size?: 'sm' | 'md' | 'lg';
  /** Alignment of the dropdown menu */
  align?: DropdownMenuContentProps['align'];
  /** Side where the menu appears */
  side?: DropdownMenuContentProps['side'];
  /** Whether to show icons next to labels */
  showIcons?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Whether the menu is disabled */
  disabled?: boolean;
  /** ARIA label for the trigger button */
  triggerLabel?: string;
  /** Additional props for the trigger */
  triggerProps?: Omit<
    DropdownMenuTriggerProps,
    'variant' | 'size' | 'className' | 'disabled'
  >;
  /** Additional props for the menu content */
  contentProps?: Omit<
    DropdownMenuContentProps,
    'align' | 'side' | 'variant' | 'size' | 'className'
  >;
}

/**
 * Default props for RecipeMenu
 */
export const DEFAULT_RECIPE_MENU_PROPS = {
  isOwner: false,
  variant: 'ghost' as const,
  size: 'md' as const,
  align: 'end' as const,
  side: 'bottom' as const,
  showIcons: true,
  disabled: false,
  triggerLabel: 'Recipe actions',
} satisfies Partial<RecipeMenuProps>;
