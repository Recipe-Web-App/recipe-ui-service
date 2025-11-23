/**
 * Collection menu action types
 */
export enum CollectionMenuActionType {
  VIEW_DETAILS = 'view_details',
  EDIT = 'edit',
  MANAGE_RECIPES = 'manage_recipes',
  MANAGE_COLLABORATORS = 'manage_collaborators',
  SHARE = 'share',
  DUPLICATE = 'duplicate',
  DELETE = 'delete',
  REPORT = 'report',
}

/**
 * Collection menu action handler types
 */
export interface CollectionMenuActionHandlers {
  onClick?: (collectionId: number) => void;
  onEdit?: (collectionId: number) => void;
  onManageRecipes?: (collectionId: number) => void;
  onManageCollaborators?: (collectionId: number) => void;
  onShare?: (collectionId: number) => void;
  onDuplicate?: (collectionId: number) => void;
  onDelete?: (collectionId: number) => void;
  onReport?: (collectionId: number) => void;
}

/**
 * Collection menu action configuration
 */
export interface CollectionMenuAction {
  type: CollectionMenuActionType;
  icon: string; // Lucide icon name
  label: string;
  handler?: (collectionId: number) => void;
  requiresOwnership?: boolean;
  requiresCollaborator?: boolean;
  variant?: 'default' | 'destructive';
  separator?: boolean; // Add separator before this item
}
