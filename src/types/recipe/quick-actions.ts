import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import type {
  QuickActionsProps,
  QuickActionPosition,
} from '@/types/ui/quick-actions';

/**
 * Recipe-specific quick action handlers
 * All handlers are optional - if not provided, placeholder implementations are used
 */
export interface RecipeQuickActionHandlers {
  /**
   * Handler for favorite/unfavorite action
   * @param recipe - The recipe being favorited/unfavorited
   * @note Currently uses placeholder implementation (toast notification)
   * @note Will be replaced with useFavoriteRecipe/useUnfavoriteRecipe hooks when API is ready
   */
  onFavorite?: (recipe: RecipeCardRecipe) => void;

  /**
   * Handler for share action
   * @param recipe - The recipe being shared
   * @note If not provided, opens ShareRecipeModal via modal-store
   */
  onShare?: (recipe: RecipeCardRecipe) => void;

  /**
   * Handler for add to collection action
   * @param recipe - The recipe being added to a collection
   * @note Currently uses placeholder implementation (toast notification)
   * @note Will be replaced with real collection API when available
   */
  onAddToCollection?: (recipe: RecipeCardRecipe) => void;

  /**
   * Handler for quick view action
   * @param recipe - The recipe being previewed
   * @note If not provided, opens QuickViewRecipeModal via modal-store
   */
  onQuickView?: (recipe: RecipeCardRecipe) => void;
}

/**
 * Props for RecipeQuickActions component
 */
export interface RecipeQuickActionsProps
  extends Omit<QuickActionsProps, 'actions'> {
  /**
   * The recipe data to display actions for
   */
  recipe: RecipeCardRecipe;

  /**
   * Optional action handlers
   * If not provided, default placeholder implementations are used
   */
  handlers?: RecipeQuickActionHandlers;

  /**
   * Position of the quick actions overlay (default: 'top-right')
   */
  position?: QuickActionPosition;

  /**
   * Size of the action buttons (default: 'md')
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Maximum number of visible actions before overflow menu (default: 3)
   */
  maxVisible?: number;

  /**
   * Whether to show actions on hover (default: true)
   */
  showOnHover?: boolean;

  /**
   * Whether to show actions on focus (default: true)
   */
  showOnFocus?: boolean;

  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Additional CSS class for the overlay
   */
  overlayClassName?: string;

  /**
   * Additional CSS class for action buttons
   */
  actionClassName?: string;

  /**
   * ARIA label for the quick actions container
   */
  'aria-label'?: string;

  /**
   * ARIA description for the quick actions container
   */
  'aria-describedby'?: string;
}

/**
 * Default props for RecipeQuickActions
 */
export const DEFAULT_RECIPE_QUICK_ACTIONS_PROPS = {
  position: 'top-right' as const,
  size: 'md' as const,
  maxVisible: 3,
  showOnHover: true,
  showOnFocus: true,
  'aria-label': 'Recipe quick actions',
} satisfies Partial<RecipeQuickActionsProps>;
