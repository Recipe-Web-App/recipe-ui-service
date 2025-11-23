import { type RecipeCardRecipe, type RecipeCardActions } from './recipe-card';

/**
 * RecipeListItem component props
 *
 * A specialized list item component for displaying recipes in a compact,
 * horizontal layout optimized for scanning and quick browsing.
 *
 * @example
 * ```tsx
 * <RecipeListItem
 *   recipe={recipe}
 *   variant="default"
 *   size="default"
 *   onClick={() => router.push(`/recipes/${recipe.recipeId}`)}
 *   onFavorite={() => toggleFavorite(recipe.recipeId)}
 * />
 * ```
 */
export interface RecipeListItemProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Recipe data to display */
  recipe: RecipeCardRecipe;

  /** Visual variant for the list item */
  variant?: 'default' | 'compact' | 'detailed';

  /** Size of the list item */
  size?: 'sm' | 'default' | 'lg';

  /** Whether to show quick actions on hover */
  showQuickActions?: boolean;

  /** Whether to show menu in quick actions */
  showMenu?: boolean;

  /** Whether to show author information */
  showAuthor?: boolean;

  /** Whether to show rating */
  showRating?: boolean;

  /** Whether the current user owns this recipe */
  isOwner?: boolean;

  /** Whether the item is in a loading state */
  loading?: boolean;

  /** Click handler for the entire list item */
  onClick?: () => void;

  /** Handler for favorite action */
  onFavorite?: () => void;

  /** Handler for share action */
  onShare?: () => void;

  /** Handler for add to collection action */
  onAddToCollection?: () => void;

  /** Handler for quick view action */
  onQuickView?: () => void;

  /** Handler for edit action (owner only) */
  onEdit?: () => void;

  /** Handler for delete action (owner only) */
  onDelete?: () => void;

  /** Handler for duplicate action (owner only) */
  onDuplicate?: () => void;

  /** Handler for report action (non-owner only) */
  onReport?: () => void;
}

/**
 * RecipeListItem action handlers
 *
 * Reuses the same action interface as RecipeCard for consistency
 */
export type RecipeListItemActions = RecipeCardActions;

/**
 * RecipeListItem data shape
 *
 * Reuses RecipeCardRecipe to ensure consistency across card and list views
 */
export type RecipeListItemRecipe = RecipeCardRecipe;
