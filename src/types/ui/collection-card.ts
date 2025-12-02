import {
  CollectionVisibility,
  CollaborationMode,
} from '../recipe-management/common';
import type { BadgeProps } from '@/components/ui/badge';
import { Globe, Lock, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Collection data shape for CollectionCard component
 * Based on CollectionDto with additional display fields
 */
export interface CollectionCardCollection {
  collectionId: number;
  userId: string;
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  collaborationMode: CollaborationMode;
  recipeCount: number;
  collaboratorCount: number;
  createdAt: string;
  updatedAt: string;
  // Additional display fields
  ownerName?: string;
  ownerAvatar?: string;
  recipeImages?: string[]; // First 4 recipe images for mosaic
  isFavorited?: boolean;
}

/**
 * Collection card variant types
 */
export type CollectionCardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'ghost'
  | 'interactive';
export type CollectionCardSize = 'sm' | 'default' | 'lg';

/**
 * Collection card props interface
 */
export interface CollectionCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onClick'
> {
  /** Collection data to display */
  collection: CollectionCardCollection;
  /** Visual variant */
  variant?: CollectionCardVariant;
  /** Size variant */
  size?: CollectionCardSize;
  /** Whether the current user owns this collection */
  isOwner?: boolean;
  /** Whether the current user can contribute to this collection */
  isCollaborator?: boolean;
  /** Quick action handlers (hover overlay actions) */
  quickActionHandlers?: import('../collection/quick-actions').CollectionQuickActionHandlers;
  /** Menu action handlers (three-dot menu actions) */
  menuActionHandlers?: import('../collection/menu').CollectionMenuActionHandlers;
  /** Click handler for card */
  onClick?: (collectionId: number) => void;
  /** Custom class name */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * Helper function: Get visibility label
 */
export const getVisibilityLabel = (
  visibility: CollectionVisibility
): string => {
  switch (visibility) {
    case CollectionVisibility.PUBLIC:
      return 'Public';
    case CollectionVisibility.PRIVATE:
      return 'Private';
    case CollectionVisibility.FRIENDS_ONLY:
      return 'Friends Only';
    default:
      return 'Unknown';
  }
};

/**
 * Helper function: Get visibility icon
 */
export const getVisibilityIcon = (
  visibility: CollectionVisibility
): LucideIcon => {
  switch (visibility) {
    case CollectionVisibility.PUBLIC:
      return Globe;
    case CollectionVisibility.PRIVATE:
      return Lock;
    case CollectionVisibility.FRIENDS_ONLY:
      return Users;
    default:
      return Lock;
  }
};

/**
 * Helper function: Get visibility badge variant
 */
export const getVisibilityVariant = (
  visibility: CollectionVisibility
): BadgeProps['variant'] => {
  switch (visibility) {
    case CollectionVisibility.PUBLIC:
      return 'default';
    case CollectionVisibility.PRIVATE:
      return 'secondary';
    case CollectionVisibility.FRIENDS_ONLY:
      return 'outline';
    default:
      return 'secondary';
  }
};

/**
 * Helper function: Get collaboration mode label
 */
export const getCollaborationModeLabel = (mode: CollaborationMode): string => {
  switch (mode) {
    case CollaborationMode.OWNER_ONLY:
      return 'Owner Only';
    case CollaborationMode.ALL_USERS:
      return 'Open Collaboration';
    case CollaborationMode.SPECIFIC_USERS:
      return 'Invited Collaborators';
    default:
      return 'Unknown';
  }
};

/**
 * Helper function: Get collaboration mode badge variant
 */
export const getCollaborationModeVariant = (
  mode: CollaborationMode
): BadgeProps['variant'] => {
  switch (mode) {
    case CollaborationMode.OWNER_ONLY:
      return 'secondary';
    case CollaborationMode.ALL_USERS:
      return 'default';
    case CollaborationMode.SPECIFIC_USERS:
      return 'outline';
    default:
      return 'secondary';
  }
};

/**
 * Helper function: Format collection date
 */
export const formatCollectionDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

/**
 * Helper function: Get recipe count display text
 */
export const getRecipeCountText = (count: number): string => {
  if (count === 0) {
    return 'No recipes';
  } else if (count === 1) {
    return '1 recipe';
  } else {
    return `${count} recipes`;
  }
};

/**
 * Helper function: Get collaborator count display text
 */
export const getCollaboratorCountText = (count: number): string => {
  if (count === 0) {
    return 'No collaborators';
  } else if (count === 1) {
    return '1 collaborator';
  } else {
    return `${count} collaborators`;
  }
};
