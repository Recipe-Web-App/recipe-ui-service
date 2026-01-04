'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/ui/view-toggle';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { CollectionBrowseGrid } from '@/components/collection/CollectionBrowseGrid';
import { CollectionFilters } from '@/components/collection/CollectionFilters';
import {
  useFavoriteCollections,
  useUnfavoriteCollection,
} from '@/hooks/recipe-management';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui/toast-store';
import type { CollectionFilterValues } from '@/types/collection/filters';
import { DEFAULT_COLLECTION_FILTER_VALUES } from '@/types/collection/filters';
import type { CollectionCardCollection } from '@/types/ui/collection-card';
import type { CollectionDto } from '@/types/recipe-management/collection';

/**
 * Convert CollectionDto to CollectionCardCollection for display
 * Note: These are favorited collections from various users, not just the current user
 */
function mapFavoriteCollectionToCardCollection(
  collection: CollectionDto
): CollectionCardCollection {
  return {
    collectionId: collection.collectionId,
    userId: collection.userId,
    name: collection.name,
    description: collection.description,
    visibility: collection.visibility,
    collaborationMode: collection.collaborationMode,
    recipeCount: collection.recipeCount,
    collaboratorCount: collection.collaboratorCount,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    ownerName: 'Chef', // TODO: Fetch actual username when available from API
    ownerAvatar: undefined,
    recipeImages: [], // TODO: Add media integration
    isFavorited: true, // Always true - this is the favorites page
  };
}

/**
 * Filter collections client-side based on filter values
 */
function filterCollections(
  collections: CollectionCardCollection[],
  filters: CollectionFilterValues
): CollectionCardCollection[] {
  return collections.filter(collection => {
    // Search filter - check name and description
    if (filters.search?.trim()) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = collection.name.toLowerCase().includes(searchLower);
      const matchesDescription = collection.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Browse Favorite Collections Page
 *
 * Displays all collections that the current user has favorited,
 * with filtering, pagination, and action support.
 *
 * Route: /collections/favorites
 */
export default function FavoriteCollectionsPage() {
  const router = useRouter();
  const { addSuccessToast, addErrorToast, addInfoToast } = useToastStore();

  // Auth store for ownership detection
  const { user, authUser } = useAuthStore();
  const currentUserId = user?.id ?? authUser?.user_id ?? null;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState<CollectionFilterValues>(
    DEFAULT_COLLECTION_FILTER_VALUES
  );

  // Fetch favorite collections with TanStack Query
  // Note: Using a large page size to get all favorites, then filter client-side
  const { data, isLoading, error, refetch } = useFavoriteCollections({
    page: 0,
    size: 100, // Get all for client-side filtering
  });

  // Unfavorite mutation
  const unfavoriteMutation = useUnfavoriteCollection();

  // Ownership detection - check if current user owns the collection
  const isOwner = useCallback(
    (collection: CollectionCardCollection): boolean => {
      if (!currentUserId) return false;
      return collection.userId === currentUserId;
    },
    [currentUserId]
  );

  // Get collections from data
  const dataContent = data?.content;

  // Map and filter collections
  const allCollections = useMemo(() => {
    if (!dataContent) return [];
    return dataContent.map(mapFavoriteCollectionToCardCollection);
  }, [dataContent]);

  // Apply filters
  const filteredCollections = useMemo(() => {
    return filterCollections(allCollections, filters);
  }, [allCollections, filters]);

  // Paginate
  const totalPages = Math.ceil(filteredCollections.length / pageSize);
  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCollections.slice(start, start + pageSize);
  }, [filteredCollections, currentPage, pageSize]);

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback(
    (newFilters: CollectionFilterValues) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    []
  );

  // Collection action handlers
  const handleCollectionClick = useCallback(
    (collection: CollectionCardCollection) => {
      router.push(`/collections/${collection.collectionId}?from=favorites`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (collection: CollectionCardCollection) => {
      router.push(`/collections/${collection.collectionId}/edit`);
    },
    [router]
  );

  const handleUnfavorite = useCallback(
    async (collection: CollectionCardCollection) => {
      try {
        await unfavoriteMutation.mutateAsync(collection.collectionId);
        addSuccessToast(`"${collection.name}" removed from favorites.`);
        void refetch();
      } catch {
        addErrorToast('Failed to remove from favorites. Please try again.');
      }
    },
    [unfavoriteMutation, addSuccessToast, addErrorToast, refetch]
  );

  const handleShare = useCallback(
    (_collection: CollectionCardCollection) => {
      addInfoToast('Share functionality will be available soon.');
    },
    [addInfoToast]
  );

  const handleAddRecipes = useCallback(
    (collection: CollectionCardCollection) => {
      router.push(`/collections/${collection.collectionId}/edit?tab=recipes`);
    },
    [router]
  );

  const handleManageCollaborators = useCallback(
    (collection: CollectionCardCollection) => {
      router.push(
        `/collections/${collection.collectionId}/edit?tab=collaborators`
      );
    },
    [router]
  );

  const handleDuplicate = useCallback(
    (_collection: CollectionCardCollection) => {
      addInfoToast('Duplicate functionality will be available soon.');
    },
    [addInfoToast]
  );

  const handleQuickView = useCallback(
    (_collection: CollectionCardCollection) => {
      addInfoToast('Quick view functionality will be available soon.');
    },
    [addInfoToast]
  );

  // Check if error is an Error object
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Empty state checks - only show empty state when no error and no collections
  const hasNoCollections = !isLoading && !error && allCollections.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Favorite Collections
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? 'Loading your favorites...'
              : `${filteredCollections.length} collection${filteredCollections.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onValueChange={setViewMode} size="md" />
          <Button asChild>
            <Link href="/collections">
              <Search className="mr-2 h-4 w-4" />
              Browse Collections
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        {!hasNoCollections && (
          <aside className="w-full shrink-0 lg:w-64">
            <CollectionFilters
              collections={data?.content ?? []}
              values={filters}
              onFilterChange={handleFilterChange}
              totalResults={filteredCollections.length}
              showResultCount
              loadingResults={isLoading}
            />
          </aside>
        )}

        {/* Collection Grid */}
        <main className="flex-1">
          {hasNoCollections ? (
            <EmptyState variant="default" size="lg">
              <EmptyStateIcon>
                <Heart className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No favorite collections yet</EmptyStateTitle>
              <EmptyStateDescription>
                You haven&apos;t favorited any collections yet. Browse
                collections and click the heart icon to save your favorites!
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button asChild>
                  <Link href="/collections">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Collections
                  </Link>
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : (
            <CollectionBrowseGrid
              collections={paginatedCollections}
              loading={isLoading}
              error={errorMessage}
              onRetry={() => refetch()}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              emptyMessage="No collections match your filters"
              emptyDescription="Try adjusting your search or filter criteria"
              isOwner={isOwner}
              onCollectionClick={handleCollectionClick}
              onEdit={handleEdit}
              onFavorite={handleUnfavorite}
              onShare={handleShare}
              onAddRecipes={handleAddRecipes}
              onManageCollaborators={handleManageCollaborators}
              onDuplicate={handleDuplicate}
              onQuickView={handleQuickView}
              showQuickActions
              showMenu
            />
          )}
        </main>
      </div>
    </div>
  );
}
