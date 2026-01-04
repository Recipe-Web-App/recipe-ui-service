'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FolderOpen } from 'lucide-react';
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
import { CollectionDraftBanner } from '@/components/collection/CollectionDraftBanner';
import {
  useMyCollections,
  useDeleteCollection,
  useFavoriteCollections,
  useFavoriteCollection,
  useUnfavoriteCollection,
} from '@/hooks/recipe-management';
import { useToastStore } from '@/stores/ui/toast-store';
import type { CollectionFilterValues } from '@/types/collection/filters';
import { DEFAULT_COLLECTION_FILTER_VALUES } from '@/types/collection/filters';
import type { CollectionCardCollection } from '@/types/ui/collection-card';
import type { CollectionDto } from '@/types/recipe-management/collection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Convert CollectionDto to CollectionCardCollection for display
 */
function mapCollectionToCardCollection(
  collection: CollectionDto,
  favoritedIds: Set<number>
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
    ownerName: 'You',
    ownerAvatar: undefined,
    recipeImages: [], // TODO: Add media integration
    isFavorited: favoritedIds.has(collection.collectionId),
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

    // Favorited filter
    if (filters.showOnlyFavorited && !collection.isFavorited) {
      return false;
    }

    return true;
  });
}

/**
 * Browse My Collections Page
 *
 * Displays all collections created by the current user with filtering,
 * pagination, and action support.
 *
 * Route: /collections/my-collections
 */
export default function MyCollectionsPage() {
  const router = useRouter();
  const { addSuccessToast, addErrorToast, addInfoToast } = useToastStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState<CollectionFilterValues>(
    DEFAULT_COLLECTION_FILTER_VALUES
  );

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<CollectionCardCollection | null>(null);

  // Fetch collections with TanStack Query
  // Note: Using a large page size to get all user collections, then filter client-side
  const { data, isLoading, error, refetch } = useMyCollections({
    page: 0,
    size: 100, // Get all for client-side filtering
  });

  // Fetch user's favorited collections to detect favorite status
  const { data: favoritesData } = useFavoriteCollections({
    page: 0,
    size: 100,
  });

  // Delete mutation
  const deleteCollectionMutation = useDeleteCollection();

  // Favorite mutations
  const favoriteCollectionMutation = useFavoriteCollection();
  const unfavoriteCollectionMutation = useUnfavoriteCollection();

  // Get collections from data
  const dataContent = data?.content;

  // Create a Set of favorited collection IDs for efficient lookup
  const favoritedIds = useMemo(() => {
    if (!favoritesData?.content) return new Set<number>();
    return new Set(favoritesData.content.map(c => c.collectionId));
  }, [favoritesData?.content]);

  // Map and filter collections
  const allCollections = useMemo(() => {
    if (!dataContent) return [];
    return dataContent.map(c => mapCollectionToCardCollection(c, favoritedIds));
  }, [dataContent, favoritedIds]);

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
      router.push(`/collections/${collection.collectionId}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (collection: CollectionCardCollection) => {
      router.push(`/collections/${collection.collectionId}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback((collection: CollectionCardCollection) => {
    setCollectionToDelete(collection);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!collectionToDelete) return;

    setShowDeleteConfirm(false);

    try {
      await deleteCollectionMutation.mutateAsync(
        collectionToDelete.collectionId
      );
      addSuccessToast(
        `Collection "${collectionToDelete.name}" has been deleted.`
      );
      void refetch();
    } catch {
      addErrorToast('Failed to delete collection. Please try again.');
    } finally {
      setCollectionToDelete(null);
    }
  }, [
    collectionToDelete,
    deleteCollectionMutation,
    addSuccessToast,
    addErrorToast,
    refetch,
  ]);

  const handleFavorite = useCallback(
    async (collection: CollectionCardCollection) => {
      try {
        if (collection.isFavorited) {
          await unfavoriteCollectionMutation.mutateAsync(
            collection.collectionId
          );
          addSuccessToast(`"${collection.name}" removed from favorites.`);
        } else {
          await favoriteCollectionMutation.mutateAsync(collection.collectionId);
          addSuccessToast(`"${collection.name}" added to favorites.`);
        }
        void refetch();
      } catch {
        addErrorToast('Failed to update favorites. Please try again.');
      }
    },
    [
      favoriteCollectionMutation,
      unfavoriteCollectionMutation,
      addSuccessToast,
      addErrorToast,
      refetch,
    ]
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

  // Check if error is an Error object
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Empty state checks - only show empty state when no error and no collections
  const hasNoCollections = !isLoading && !error && allCollections.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Draft Banner */}
      <CollectionDraftBanner className="mb-2" />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Collections</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? 'Loading your collections...'
              : `${filteredCollections.length} collection${filteredCollections.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onValueChange={setViewMode} size="md" />
          <Button asChild>
            <Link href="/collections/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
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
                <FolderOpen className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No collections yet</EmptyStateTitle>
              <EmptyStateDescription>
                You haven&apos;t created any collections yet. Create your first
                collection to organize your favorite recipes!
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button asChild>
                  <Link href="/collections/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Collection
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
              isOwner={true}
              onCollectionClick={handleCollectionClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
              onShare={handleShare}
              onAddRecipes={handleAddRecipes}
              onManageCollaborators={handleManageCollaborators}
              onDuplicate={handleDuplicate}
              showQuickActions
              showMenu
            />
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the collection &ldquo;
              {collectionToDelete?.name}&rdquo;? This action cannot be undone.
              All recipes in this collection will remain in your recipe library.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteCollectionMutation.isPending}
            >
              {deleteCollectionMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
