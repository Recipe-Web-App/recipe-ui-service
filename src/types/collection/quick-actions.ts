/**
 * Collection quick action types
 */
export enum CollectionQuickActionType {
  FAVORITE = 'favorite',
  SHARE = 'share',
  ADD_RECIPES = 'add_recipes',
  QUICK_VIEW = 'quick_view',
}

/**
 * Collection quick action handler types
 */
export interface CollectionQuickActionHandlers {
  onFavorite?: (collectionId: number) => void;
  onShare?: (collectionId: number) => void;
  onAddRecipes?: (collectionId: number) => void;
  onQuickView?: (collectionId: number) => void;
}

/**
 * Collection quick action configuration
 */
export interface CollectionQuickAction {
  type: CollectionQuickActionType;
  icon: string; // Lucide icon name
  label: string;
  ariaLabel: string;
  handler?: (collectionId: number) => void;
  requiresOwnership?: boolean;
  requiresCollaborator?: boolean;
}
