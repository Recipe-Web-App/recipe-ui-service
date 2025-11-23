import type { CollectionDto } from '@/types/recipe-management/collection';

/**
 * Collection filter values interface
 * Defines the shape of filter state for collection browsing
 */
export interface CollectionFilterValues {
  /** Search term for filtering collection names/descriptions */
  search?: string;
  /** Show public collections and collections from followed users */
  showPublicAndFollowed?: boolean;
  /** Show only collections owned by current user */
  showMyCollections?: boolean;
  /** Show collections where user is a collaborator */
  showCollaborating?: boolean;
  /** Show collections where user is NOT a collaborator */
  showNotCollaborating?: boolean;
  /** Show only collections marked as favorites */
  showOnlyFavorited?: boolean;
}

/**
 * CollectionFilters component props
 */
export interface CollectionFiltersProps {
  /** Array of collections for filtering */
  collections: CollectionDto[];
  /** Current filter values (controlled) */
  values: CollectionFilterValues;
  /** Callback when filter values change */
  onFilterChange: (values: CollectionFilterValues) => void;
  /** Optional className for styling */
  className?: string;
  /** Whether filters are collapsible (mobile) */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Total number of results with current filters */
  totalResults?: number;
  /** Whether to show result count */
  showResultCount?: boolean;
  /** Loading state for results */
  loadingResults?: boolean;
  /** Panel title */
  title?: string;
  /** Panel variant */
  variant?: 'default' | 'compact' | 'full';
  /** Panel size */
  size?: 'sm' | 'md' | 'lg';
  /** Panel position */
  position?: 'sidebar' | 'drawer' | 'modal';
  /** Whether to show header */
  showHeader?: boolean;
  /** Whether to show footer */
  showFooter?: boolean;
}

/**
 * Default filter values
 * Shows all collections by default
 */
export const DEFAULT_COLLECTION_FILTER_VALUES: CollectionFilterValues = {
  search: '',
  showPublicAndFollowed: false,
  showMyCollections: false,
  showCollaborating: false,
  showNotCollaborating: false,
  showOnlyFavorited: false,
};

/**
 * Filter configuration constants
 */
export const COLLECTION_FILTER_CONSTANTS = {
  /** Search debounce delay in ms */
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

/**
 * Convert CollectionFilterValues to generic FilterValues for FilterPanel
 */
export function collectionFiltersToFilterValues(
  values: CollectionFilterValues
): Record<string, unknown> {
  return {
    search: values.search ?? '',
    showPublicAndFollowed: values.showPublicAndFollowed ?? false,
    showMyCollections: values.showMyCollections ?? false,
    showCollaborating: values.showCollaborating ?? false,
    showNotCollaborating: values.showNotCollaborating ?? false,
    showOnlyFavorited: values.showOnlyFavorited ?? false,
  };
}

/**
 * Convert generic FilterValues from FilterPanel to CollectionFilterValues
 */
export function filterValuesToCollectionFilters(
  values: Record<string, unknown>
): CollectionFilterValues {
  return {
    search: typeof values.search === 'string' ? values.search : undefined,
    showPublicAndFollowed:
      typeof values.showPublicAndFollowed === 'boolean'
        ? values.showPublicAndFollowed
        : undefined,
    showMyCollections:
      typeof values.showMyCollections === 'boolean'
        ? values.showMyCollections
        : undefined,
    showCollaborating:
      typeof values.showCollaborating === 'boolean'
        ? values.showCollaborating
        : undefined,
    showNotCollaborating:
      typeof values.showNotCollaborating === 'boolean'
        ? values.showNotCollaborating
        : undefined,
    showOnlyFavorited:
      typeof values.showOnlyFavorited === 'boolean'
        ? values.showOnlyFavorited
        : undefined,
  };
}
