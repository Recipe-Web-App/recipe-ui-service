import * as React from 'react';
import {
  type BrowseGridProps,
  type BrowseGridColumns,
} from '@/types/ui/browse-grid';
import {
  type CollectionCardCollection,
  type CollectionCardProps,
} from '@/types/ui/collection-card';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

/**
 * Collection-specific browse grid props
 *
 * A specialized version of BrowseGridProps that works specifically with collections,
 * providing type-safe collection actions and CollectionCard configuration.
 */
export interface CollectionBrowseGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // Data
  /** Array of collections to display in the grid */
  collections: CollectionCardCollection[];

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of collections across all pages */
  totalItems?: number;
  /** Number of collections per page */
  pageSize?: number;
  /** Callback fired when page changes */
  onPageChange?: (page: number) => void;
  /** Callback fired when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  // States
  /** Whether the grid is in a loading state */
  loading?: boolean;
  /** Error to display (Error object or string message) */
  error?: Error | string | null;

  // Collection Card Configuration
  /** Visual variant for all collection cards */
  cardVariant?: CollectionCardProps['variant'];
  /** Size for all collection cards */
  cardSize?: CollectionCardProps['size'];
  /** Whether to show quick actions on cards */
  showQuickActions?: boolean;
  /** Whether to show menu on cards */
  showMenu?: boolean;
  /** Whether to show author information on cards */
  showAuthor?: boolean;

  // Collection Actions (applied to ALL cards)
  /** Callback when a collection card is clicked */
  onCollectionClick?: (collection: CollectionCardCollection) => void;
  /** Callback when favorite is clicked */
  onFavorite?: (collection: CollectionCardCollection) => void;
  /** Callback when share is clicked */
  onShare?: (collection: CollectionCardCollection) => void;
  /** Callback when add recipes is clicked */
  onAddRecipes?: (collection: CollectionCardCollection) => void;
  /** Callback when quick view is clicked */
  onQuickView?: (collection: CollectionCardCollection) => void;
  /** Callback when edit is clicked (owner/collaborator only) */
  onEdit?: (collection: CollectionCardCollection) => void;
  /** Callback when delete is clicked (owner only) */
  onDelete?: (collection: CollectionCardCollection) => void;
  /** Callback when duplicate is clicked */
  onDuplicate?: (collection: CollectionCardCollection) => void;
  /** Callback when manage collaborators is clicked (owner only) */
  onManageCollaborators?: (collection: CollectionCardCollection) => void;
  /** Callback when report is clicked (non-owner only) */
  onReport?: (collection: CollectionCardCollection) => void;

  // Ownership and Collaboration
  /**
   * Determines which collections are owned by the current user.
   * - boolean: All collections have the same ownership status
   * - function: Determines ownership per collection
   */
  isOwner?: boolean | ((collection: CollectionCardCollection) => boolean);
  /**
   * Determines which collections the current user can collaborate on.
   * - boolean: All collections have the same collaborator status
   * - function: Determines collaborator status per collection
   */
  isCollaborator?:
    | boolean
    | ((collection: CollectionCardCollection) => boolean);

  // Grid Configuration
  /** Custom column configuration for responsive breakpoints */
  columns?: BrowseGridColumns;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Spacing variant for the grid container */
  spacing?: 'compact' | 'default' | 'comfortable';

  // Empty State
  /** Message to display when there are no collections */
  emptyMessage?: string;
  /** Detailed description for empty state */
  emptyDescription?: string;
  /** Icon or element to display in empty state */
  emptyIcon?: React.ReactNode;
  /** Action buttons for empty state */
  emptyActions?: React.ReactNode;

  // Error Handling
  /** Callback fired when retry button is clicked in error state */
  onRetry?: () => void;

  // Styling
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the grid element */
  gridClassName?: string;
  /** Additional CSS classes for the pagination wrapper */
  paginationClassName?: string;

  // Pagination Options
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean;
  /** Additional props to pass to the Pagination component */
  paginationProps?: BrowseGridProps<CollectionCardCollection>['paginationProps'];

  // Skeleton
  /** Number of skeleton items to show during loading (default: 12) */
  skeletonCount?: number;

  // Accessibility
  /** Accessible label for the grid region */
  'aria-label'?: string;
  /** Accessible description for the grid region */
  'aria-describedby'?: string;
}

/**
 * Collection browse action handlers
 *
 * Consolidated interface for all collection action handlers
 */
export interface CollectionBrowseActions {
  onCollectionClick?: (collection: CollectionCardCollection) => void;
  onFavorite?: (collection: CollectionCardCollection) => void;
  onShare?: (collection: CollectionCardCollection) => void;
  onAddRecipes?: (collection: CollectionCardCollection) => void;
  onQuickView?: (collection: CollectionCardCollection) => void;
  onEdit?: (collection: CollectionCardCollection) => void;
  onDelete?: (collection: CollectionCardCollection) => void;
  onDuplicate?: (collection: CollectionCardCollection) => void;
  onManageCollaborators?: (collection: CollectionCardCollection) => void;
  onReport?: (collection: CollectionCardCollection) => void;
}

/**
 * Collection filtering and sorting helpers
 */

/**
 * Filter collections by visibility
 *
 * @param collections - Array of collections to filter
 * @param visibility - Visibility level to filter by
 * @returns Filtered array of collections
 *
 * @example
 * const publicCollections = filterCollectionsByVisibility(
 *   allCollections,
 *   CollectionVisibility.PUBLIC
 * );
 */
export function filterCollectionsByVisibility(
  collections: CollectionCardCollection[],
  visibility: CollectionVisibility
): CollectionCardCollection[] {
  return collections.filter(collection => collection.visibility === visibility);
}

/**
 * Filter collections by collaboration mode
 *
 * @param collections - Array of collections to filter
 * @param mode - Collaboration mode to filter by
 * @returns Filtered array of collections
 *
 * @example
 * const openCollections = filterCollectionsByCollaborationMode(
 *   allCollections,
 *   CollaborationMode.ALL_USERS
 * );
 */
export function filterCollectionsByCollaborationMode(
  collections: CollectionCardCollection[],
  mode: CollaborationMode
): CollectionCardCollection[] {
  return collections.filter(
    collection => collection.collaborationMode === mode
  );
}

/**
 * Filter collections by minimum recipe count
 *
 * @param collections - Array of collections to filter
 * @param minRecipeCount - Minimum number of recipes
 * @returns Filtered array of collections
 *
 * @example
 * // Get collections with at least 10 recipes
 * const largeCollections = filterCollectionsByMinRecipeCount(allCollections, 10);
 */
export function filterCollectionsByMinRecipeCount(
  collections: CollectionCardCollection[],
  minRecipeCount: number
): CollectionCardCollection[] {
  return collections.filter(
    collection => collection.recipeCount >= minRecipeCount
  );
}

/**
 * Filter collections by maximum recipe count
 *
 * @param collections - Array of collections to filter
 * @param maxRecipeCount - Maximum number of recipes
 * @returns Filtered array of collections
 *
 * @example
 * // Get small collections with at most 5 recipes
 * const smallCollections = filterCollectionsByMaxRecipeCount(allCollections, 5);
 */
export function filterCollectionsByMaxRecipeCount(
  collections: CollectionCardCollection[],
  maxRecipeCount: number
): CollectionCardCollection[] {
  return collections.filter(
    collection => collection.recipeCount <= maxRecipeCount
  );
}

/**
 * Filter collections by recipe count range
 *
 * @param collections - Array of collections to filter
 * @param minRecipeCount - Minimum number of recipes
 * @param maxRecipeCount - Maximum number of recipes
 * @returns Filtered array of collections
 *
 * @example
 * // Get collections with 5-15 recipes
 * const mediumCollections = filterCollectionsByRecipeCountRange(allCollections, 5, 15);
 */
export function filterCollectionsByRecipeCountRange(
  collections: CollectionCardCollection[],
  minRecipeCount: number,
  maxRecipeCount: number
): CollectionCardCollection[] {
  return collections.filter(
    collection =>
      collection.recipeCount >= minRecipeCount &&
      collection.recipeCount <= maxRecipeCount
  );
}

/**
 * Filter collections that are favorited
 *
 * @param collections - Array of collections to filter
 * @returns Filtered array of favorited collections
 *
 * @example
 * const favoriteCollections = filterFavoritedCollections(allCollections);
 */
export function filterFavoritedCollections(
  collections: CollectionCardCollection[]
): CollectionCardCollection[] {
  return collections.filter(collection => collection.isFavorited === true);
}

/**
 * Filter collections by minimum collaborator count
 *
 * @param collections - Array of collections to filter
 * @param minCollaboratorCount - Minimum number of collaborators
 * @returns Filtered array of collections
 *
 * @example
 * // Get collaborative collections with at least 3 collaborators
 * const collaborativeCollections = filterCollectionsByMinCollaboratorCount(allCollections, 3);
 */
export function filterCollectionsByMinCollaboratorCount(
  collections: CollectionCardCollection[],
  minCollaboratorCount: number
): CollectionCardCollection[] {
  return collections.filter(
    collection => collection.collaboratorCount >= minCollaboratorCount
  );
}

/**
 * Sort collections alphabetically by name
 *
 * @param collections - Array of collections to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of collections
 *
 * @example
 * // A-Z
 * const alphabetical = sortCollectionsByName(allCollections, 'asc');
 */
export function sortCollectionsByName(
  collections: CollectionCardCollection[],
  order: 'asc' | 'desc' = 'asc'
): CollectionCardCollection[] {
  return [...collections].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort collections by date created
 *
 * @param collections - Array of collections to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of collections
 *
 * @example
 * // Newest first
 * const newestCollections = sortCollectionsByDate(allCollections, 'desc');
 */
export function sortCollectionsByDate(
  collections: CollectionCardCollection[],
  order: 'asc' | 'desc' = 'desc'
): CollectionCardCollection[] {
  return [...collections].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort collections by date updated
 *
 * @param collections - Array of collections to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of collections
 *
 * @example
 * // Recently updated first
 * const recentlyUpdated = sortCollectionsByUpdatedDate(allCollections, 'desc');
 */
export function sortCollectionsByUpdatedDate(
  collections: CollectionCardCollection[],
  order: 'asc' | 'desc' = 'desc'
): CollectionCardCollection[] {
  return [...collections].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort collections by recipe count
 *
 * @param collections - Array of collections to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of collections
 *
 * @example
 * // Largest collections first
 * const largestFirst = sortCollectionsByRecipeCount(allCollections, 'desc');
 */
export function sortCollectionsByRecipeCount(
  collections: CollectionCardCollection[],
  order: 'asc' | 'desc' = 'desc'
): CollectionCardCollection[] {
  return [...collections].sort((a, b) => {
    return order === 'asc'
      ? a.recipeCount - b.recipeCount
      : b.recipeCount - a.recipeCount;
  });
}

/**
 * Sort collections by collaborator count
 *
 * @param collections - Array of collections to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of collections
 *
 * @example
 * // Most collaborative collections first
 * const mostCollaborative = sortCollectionsByCollaboratorCount(allCollections, 'desc');
 */
export function sortCollectionsByCollaboratorCount(
  collections: CollectionCardCollection[],
  order: 'asc' | 'desc' = 'desc'
): CollectionCardCollection[] {
  return [...collections].sort((a, b) => {
    return order === 'asc'
      ? a.collaboratorCount - b.collaboratorCount
      : b.collaboratorCount - a.collaboratorCount;
  });
}
