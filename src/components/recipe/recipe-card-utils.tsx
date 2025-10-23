import {
  Heart,
  Share2,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Flag,
  ExternalLink,
  CalendarPlus,
} from 'lucide-react';
import {
  type RecipeCardActions,
  type RecipeCardMenuItem,
} from '@/types/ui/recipe-card';
import { type QuickActionsProps } from '@/types/ui/quick-actions';
import {
  type RecipeMenuAction,
  type RecipeMenuActions,
} from '@/types/recipe/menu';

/**
 * Get all recipe actions (quick actions + menu items) for QuickActions component
 * Returns actions in priority order: quick actions first, then menu items
 */
export function getAllRecipeActions(
  handlers: RecipeCardActions,
  isFavorite: boolean = false,
  isOwner: boolean = false
): QuickActionsProps['actions'] {
  const {
    onFavorite,
    onShare,
    onAddToCollection,
    onQuickView,
    onEdit,
    onDuplicate,
    onDelete,
    onReport,
  } = handlers;

  const actions: QuickActionsProps['actions'] = [];

  // Quick actions (shown first, typically visible buttons)
  if (onFavorite) {
    actions.push({
      id: 'favorite',
      label: isFavorite ? 'Unfavorite' : 'Favorite',
      icon: Heart,
      onClick: onFavorite,
      variant: 'default',
    });
  }

  if (onShare) {
    actions.push({
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: onShare,
    });
  }

  if (onAddToCollection) {
    actions.push({
      id: 'add-to-collection',
      label: 'Add to collection',
      icon: Plus,
      onClick: onAddToCollection,
    });
  }

  if (onQuickView) {
    actions.push({
      id: 'quick-view',
      label: 'Quick view',
      icon: Eye,
      onClick: onQuickView,
    });
  }

  // Menu actions (shown in overflow menu)
  // Owner actions
  if (isOwner && onEdit) {
    actions.push({
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: onEdit,
    });
  }

  if (isOwner && onDuplicate) {
    actions.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      onClick: onDuplicate,
    });
  }

  // Delete action (owner only)
  if (isOwner && onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      variant: 'destructive',
    });
  }

  // Report action (non-owner only)
  if (!isOwner && onReport) {
    actions.push({
      id: 'report',
      label: 'Report',
      icon: Flag,
      onClick: onReport,
      variant: 'destructive',
    });
  }

  return actions;
}

/**
 * Get quick actions for recipe card with proper icon components
 * @deprecated Use getAllRecipeActions instead
 */
export function getRecipeQuickActions(
  handlers: RecipeCardActions,
  isFavorite: boolean = false
): QuickActionsProps['actions'] {
  const { onFavorite, onShare, onAddToCollection, onQuickView } = handlers;

  const actions: QuickActionsProps['actions'] = [];

  if (onFavorite) {
    actions.push({
      id: 'favorite',
      label: isFavorite ? 'Unfavorite' : 'Favorite',
      icon: Heart,
      onClick: onFavorite,
      variant: 'default',
    });
  }

  if (onShare) {
    actions.push({
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: onShare,
    });
  }

  if (onAddToCollection) {
    actions.push({
      id: 'add-to-collection',
      label: 'Add to collection',
      icon: Plus,
      onClick: onAddToCollection,
    });
  }

  if (onQuickView) {
    actions.push({
      id: 'quick-view',
      label: 'Quick view',
      icon: Eye,
      onClick: onQuickView,
    });
  }

  return actions;
}

/**
 * Get menu items for recipe card with proper icon components
 * @deprecated Use getAllRecipeActions instead
 */
export function getRecipeMenuItems(
  handlers: RecipeCardActions,
  isOwner: boolean = false
): RecipeCardMenuItem[] {
  const { onEdit, onDelete, onDuplicate, onShare, onReport } = handlers;

  const items: RecipeCardMenuItem[] = [];

  // Owner actions
  if (isOwner && onEdit) {
    items.push({
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: onEdit,
    });
  }

  if (isOwner && onDuplicate) {
    items.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      onClick: onDuplicate,
    });
  }

  // Share action (available for all if handler exists)
  if (onShare) {
    items.push({
      id: 'share-menu',
      label: 'Share',
      icon: Share2,
      onClick: onShare,
    });
  }

  // Delete action (owner only)
  if (isOwner && onDelete) {
    items.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      variant: 'destructive',
    });
  }

  // Report action (non-owner only)
  if (!isOwner && onReport) {
    items.push({
      id: 'report',
      label: 'Report',
      icon: Flag,
      onClick: onReport,
      variant: 'destructive',
    });
  }

  return items;
}

/**
 * Get recipe menu actions for RecipeMenu component
 * Returns menu actions based on ownership and available handlers
 * This is the primary function for RecipeMenu - replaces menu functionality in QuickActions
 */
export function getRecipeMenuActions(
  handlers: RecipeMenuActions,
  isOwner: boolean = false
): RecipeMenuAction[] {
  const {
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    onShare,
    onAddToCollection,
    onCopyLink,
    onAddToMealPlan,
    onReport,
  } = handlers;

  const actions: RecipeMenuAction[] = [];

  // View action (always available if handler exists)
  if (onView) {
    actions.push({
      id: 'view',
      label: 'View details',
      icon: Eye,
      onClick: onView,
      variant: 'default',
    });
  }

  // Owner-only actions
  if (isOwner) {
    if (onEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit',
        icon: Edit,
        onClick: onEdit,
        variant: 'default',
      });
    }

    if (onDuplicate) {
      actions.push({
        id: 'duplicate',
        label: 'Duplicate',
        icon: Copy,
        onClick: onDuplicate,
        variant: 'default',
      });
    }
  }

  // Universal actions
  if (onShare) {
    actions.push({
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: onShare,
      variant: 'default',
    });
  }

  if (onAddToCollection) {
    actions.push({
      id: 'add-to-collection',
      label: 'Add to collection',
      icon: Plus,
      onClick: onAddToCollection,
      variant: 'default',
    });
  }

  if (onCopyLink) {
    actions.push({
      id: 'copy-link',
      label: 'Copy link',
      icon: ExternalLink,
      onClick: onCopyLink,
      variant: 'default',
    });
  }

  if (onAddToMealPlan) {
    actions.push({
      id: 'add-to-meal-plan',
      label: 'Add to meal plan',
      icon: CalendarPlus,
      onClick: onAddToMealPlan,
      variant: 'default',
    });
  }

  // Destructive actions (separated by ownership)
  if (isOwner && onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      variant: 'destructive',
    });
  }

  if (!isOwner && onReport) {
    actions.push({
      id: 'report',
      label: 'Report',
      icon: Flag,
      onClick: onReport,
      variant: 'destructive',
    });
  }

  return actions;
}
