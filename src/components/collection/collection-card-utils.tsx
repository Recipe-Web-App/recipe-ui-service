import {
  Heart,
  Share2,
  Plus,
  Eye,
  Edit,
  Users,
  FolderOpen,
  Copy,
  Trash2,
  Flag,
} from 'lucide-react';
import {
  CollectionQuickActionType,
  type CollectionQuickAction,
  type CollectionQuickActionHandlers,
} from '@/types/collection/quick-actions';
import {
  CollectionMenuActionType,
  type CollectionMenuAction,
  type CollectionMenuActionHandlers,
} from '@/types/collection/menu';

/**
 * Get all available collection quick actions
 */
export const getCollectionQuickActionsList = (
  collectionId: number,
  handlers: CollectionQuickActionHandlers,
  isOwner: boolean = false,
  isCollaborator: boolean = false
): CollectionQuickAction[] => {
  const actions: CollectionQuickAction[] = [];

  // Favorite action (available to all)
  if (handlers.onFavorite) {
    actions.push({
      type: CollectionQuickActionType.FAVORITE,
      icon: 'Heart',
      label: 'Favorite',
      ariaLabel: 'Favorite this collection',
      handler: handlers.onFavorite,
    });
  }

  // Share action (available to all)
  if (handlers.onShare) {
    actions.push({
      type: CollectionQuickActionType.SHARE,
      icon: 'Share2',
      label: 'Share',
      ariaLabel: 'Share this collection',
      handler: handlers.onShare,
    });
  }

  // Add recipes action (owner or collaborator only)
  if (handlers.onAddRecipes && (isOwner || isCollaborator)) {
    actions.push({
      type: CollectionQuickActionType.ADD_RECIPES,
      icon: 'Plus',
      label: 'Add Recipes',
      ariaLabel: 'Add recipes to this collection',
      handler: handlers.onAddRecipes,
      requiresOwnership: false,
      requiresCollaborator: true,
    });
  }

  // Quick view action (available to all)
  if (handlers.onQuickView) {
    actions.push({
      type: CollectionQuickActionType.QUICK_VIEW,
      icon: 'Eye',
      label: 'Quick View',
      ariaLabel: 'Quick view of collection details',
      handler: handlers.onQuickView,
    });
  }

  return actions;
};

/**
 * Get collection menu actions based on ownership
 */
export const getCollectionMenuActions = (
  collectionId: number,
  handlers: CollectionMenuActionHandlers,
  isOwner: boolean = false,
  isCollaborator: boolean = false
): CollectionMenuAction[] => {
  const actions: CollectionMenuAction[] = [];

  // View details (available to all)
  if (handlers.onClick) {
    actions.push({
      type: CollectionMenuActionType.VIEW_DETAILS,
      icon: 'Eye',
      label: 'View Details',
      handler: handlers.onClick,
    });
  }

  if (isOwner) {
    // Owner actions
    if (handlers.onEdit) {
      actions.push({
        type: CollectionMenuActionType.EDIT,
        icon: 'Edit',
        label: 'Edit Collection',
        handler: handlers.onEdit,
        requiresOwnership: true,
      });
    }

    if (handlers.onManageRecipes) {
      actions.push({
        type: CollectionMenuActionType.MANAGE_RECIPES,
        icon: 'FolderOpen',
        label: 'Manage Recipes',
        handler: handlers.onManageRecipes,
        requiresOwnership: false,
        requiresCollaborator: true,
      });
    }

    if (handlers.onManageCollaborators) {
      actions.push({
        type: CollectionMenuActionType.MANAGE_COLLABORATORS,
        icon: 'Users',
        label: 'Manage Collaborators',
        handler: handlers.onManageCollaborators,
        requiresOwnership: true,
      });
    }

    if (handlers.onShare) {
      actions.push({
        type: CollectionMenuActionType.SHARE,
        icon: 'Share2',
        label: 'Share',
        handler: handlers.onShare,
      });
    }

    if (handlers.onDelete) {
      actions.push({
        type: CollectionMenuActionType.DELETE,
        icon: 'Trash2',
        label: 'Delete Collection',
        handler: handlers.onDelete,
        requiresOwnership: true,
        variant: 'destructive',
        separator: true,
      });
    }
  } else if (isCollaborator) {
    // Collaborator actions
    if (handlers.onManageRecipes) {
      actions.push({
        type: CollectionMenuActionType.MANAGE_RECIPES,
        icon: 'FolderOpen',
        label: 'Manage Recipes',
        handler: handlers.onManageRecipes,
        requiresCollaborator: true,
      });
    }

    if (handlers.onDuplicate) {
      actions.push({
        type: CollectionMenuActionType.DUPLICATE,
        icon: 'Copy',
        label: 'Copy to My Collections',
        handler: handlers.onDuplicate,
      });
    }

    if (handlers.onShare) {
      actions.push({
        type: CollectionMenuActionType.SHARE,
        icon: 'Share2',
        label: 'Share',
        handler: handlers.onShare,
      });
    }
  } else {
    // Non-owner, non-collaborator actions
    if (handlers.onDuplicate) {
      actions.push({
        type: CollectionMenuActionType.DUPLICATE,
        icon: 'Copy',
        label: 'Copy to My Collections',
        handler: handlers.onDuplicate,
      });
    }

    if (handlers.onShare) {
      actions.push({
        type: CollectionMenuActionType.SHARE,
        icon: 'Share2',
        label: 'Share',
        handler: handlers.onShare,
      });
    }

    if (handlers.onReport) {
      actions.push({
        type: CollectionMenuActionType.REPORT,
        icon: 'Flag',
        label: 'Report Collection',
        handler: handlers.onReport,
        variant: 'destructive',
        separator: true,
      });
    }
  }

  return actions;
};

/**
 * Get all collection actions (quick actions + menu actions combined)
 */
export const getAllCollectionActions = (
  collectionId: number,
  quickActionHandlers: CollectionQuickActionHandlers,
  menuActionHandlers: CollectionMenuActionHandlers,
  isOwner: boolean = false,
  isCollaborator: boolean = false
): {
  quickActions: CollectionQuickAction[];
  menuActions: CollectionMenuAction[];
} => {
  return {
    quickActions: getCollectionQuickActionsList(
      collectionId,
      quickActionHandlers,
      isOwner,
      isCollaborator
    ),
    menuActions: getCollectionMenuActions(
      collectionId,
      menuActionHandlers,
      isOwner,
      isCollaborator
    ),
  };
};

/**
 * Icon registry for collection actions
 */
export const collectionActionIcons = {
  Heart,
  Share2,
  Plus,
  Eye,
  Edit,
  Users,
  FolderOpen,
  Copy,
  Trash2,
  Flag,
};
