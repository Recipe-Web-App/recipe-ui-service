'use client';

import * as React from 'react';
import { BrowseGrid } from '@/components/ui/browse-grid';
import {
  CollectionCard,
  CollectionCardSkeleton,
} from '@/components/collection/CollectionCard';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type CollectionBrowseGridProps } from '@/types/collection/browse-grid';
import { type CollectionCardCollection } from '@/types/ui/collection-card';
import { type CollectionQuickActionHandlers } from '@/types/collection/quick-actions';
import { type CollectionMenuActionHandlers } from '@/types/collection/menu';

/**
 * CollectionBrowseGrid Component
 *
 * A collection-specific grid component that wraps BrowseGrid with CollectionCard,
 * providing a streamlined API for browsing collections throughout the application.
 *
 * **Features:**
 * - Type-safe collection grid with CollectionCard integration
 * - Collection-specific action handlers (favorite, share, add recipes, etc.)
 * - Dual ownership support (owner and collaborator)
 * - Loading state with CollectionCard skeletons
 * - Empty state with collection-specific defaults
 * - Error handling with retry functionality
 * - Responsive grid layout (2/3/4 columns)
 * - Full pagination support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CollectionBrowseGrid
 *   collections={collections}
 *   loading={isLoading}
 *   onCollectionClick={(collection) => router.push(`/collections/${collection.collectionId}`)}
 *   onFavorite={(collection) => toggleFavorite(collection.collectionId)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pagination and dual ownership
 * <CollectionBrowseGrid
 *   collections={collections}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   isOwner={(collection) => collection.userId === currentUserId}
 *   isCollaborator={(collection) => collection.collaboratorIds?.includes(currentUserId)}
 *   onEdit={(collection) => router.push(`/collections/${collection.collectionId}/edit`)}
 *   onManageCollaborators={(collection) => openCollaboratorsModal(collection.collectionId)}
 *   onDelete={(collection) => deleteCollection(collection.collectionId)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With TanStack Query
 * const { data, isLoading, error, refetch } = useCollections(filters);
 *
 * <CollectionBrowseGrid
 *   collections={data?.collections ?? []}
 *   loading={isLoading}
 *   error={error}
 *   onRetry={refetch}
 *   currentPage={filters.page}
 *   totalPages={data?.totalPages}
 *   onPageChange={(page) => setFilters({ ...filters, page })}
 * />
 * ```
 */
export const CollectionBrowseGrid = React.forwardRef<
  HTMLDivElement,
  CollectionBrowseGridProps
>(
  (
    {
      // Data
      collections,

      // Pagination
      currentPage,
      totalPages,
      totalItems,
      pageSize = 12,
      onPageChange,
      onPageSizeChange,

      // States
      loading = false,
      error = null,

      // Collection Card Configuration
      cardVariant = 'elevated',
      cardSize = 'default',
      showQuickActions = true,
      showMenu = true,

      // Collection Actions
      onCollectionClick,
      onFavorite,
      onShare,
      onAddRecipes,
      onQuickView,
      onEdit,
      onDelete,
      onDuplicate,
      onManageCollaborators,
      onReport,

      // Ownership and Collaboration
      isOwner = false,
      isCollaborator = false,

      // Grid Configuration
      columns,
      gap = 'md',
      spacing = 'default',

      // Empty State
      emptyMessage = 'No collections found',
      emptyDescription = 'Try adjusting your filters or search terms to find more collections.',
      emptyIcon,
      emptyActions,

      // Error Handling
      onRetry,

      // Styling
      className,
      gridClassName,
      paginationClassName,

      // Pagination Options
      showPagination = true,
      paginationProps,

      // Skeleton
      skeletonCount = 12,

      // Accessibility
      'aria-label': ariaLabel = 'Browse collections',
      'aria-describedby': ariaDescribedBy,

      ...props
    },
    ref
  ) => {
    /**
     * Determine if a specific collection is owned by the current user
     */
    const isCollectionOwner = React.useCallback(
      (collection: CollectionCardCollection): boolean => {
        if (typeof isOwner === 'function') {
          return isOwner(collection);
        }
        return isOwner;
      },
      [isOwner]
    );

    /**
     * Determine if the current user is a collaborator for a specific collection
     */
    const isCollectionCollaborator = React.useCallback(
      (collection: CollectionCardCollection): boolean => {
        if (typeof isCollaborator === 'function') {
          return isCollaborator(collection);
        }
        return isCollaborator;
      },
      [isCollaborator]
    );

    /**
     * Build quick action handlers for a collection card
     */
    const buildQuickActionHandlers = React.useCallback(
      (
        collection: CollectionCardCollection
      ): CollectionQuickActionHandlers | undefined => {
        // Only return handlers if showQuickActions is true
        if (!showQuickActions) {
          return undefined;
        }

        return {
          onFavorite: onFavorite ? () => onFavorite(collection) : undefined,
          onShare: onShare ? () => onShare(collection) : undefined,
          onAddRecipes: onAddRecipes
            ? () => onAddRecipes(collection)
            : undefined,
          onQuickView: onQuickView ? () => onQuickView(collection) : undefined,
        };
      },
      [showQuickActions, onFavorite, onShare, onAddRecipes, onQuickView]
    );

    /**
     * Build menu action handlers for a collection card
     */
    const buildMenuActionHandlers = React.useCallback(
      (
        collection: CollectionCardCollection
      ): CollectionMenuActionHandlers | undefined => {
        // Only return handlers if showMenu is true
        if (!showMenu) {
          return undefined;
        }

        return {
          onClick: onCollectionClick
            ? () => onCollectionClick(collection)
            : undefined,
          onEdit: onEdit ? () => onEdit(collection) : undefined,
          onManageRecipes: onAddRecipes
            ? () => onAddRecipes(collection)
            : undefined,
          onManageCollaborators: onManageCollaborators
            ? () => onManageCollaborators(collection)
            : undefined,
          onShare: onShare ? () => onShare(collection) : undefined,
          onDuplicate: onDuplicate ? () => onDuplicate(collection) : undefined,
          onDelete: onDelete ? () => onDelete(collection) : undefined,
          onReport: onReport ? () => onReport(collection) : undefined,
        };
      },
      [
        showMenu,
        onCollectionClick,
        onEdit,
        onAddRecipes,
        onManageCollaborators,
        onShare,
        onDuplicate,
        onDelete,
        onReport,
      ]
    );

    /**
     * Render a single collection card
     */
    const renderCollectionCard = React.useCallback(
      (collection: CollectionCardCollection, index: number) => {
        const owned = isCollectionOwner(collection);
        const collaborator = isCollectionCollaborator(collection);

        return (
          <CollectionCard
            key={collection.collectionId}
            collection={collection}
            variant={cardVariant}
            size={cardSize}
            isOwner={owned}
            isCollaborator={collaborator}
            quickActionHandlers={buildQuickActionHandlers(collection)}
            menuActionHandlers={buildMenuActionHandlers(collection)}
            onClick={
              onCollectionClick
                ? () => onCollectionClick(collection)
                : undefined
            }
            aria-label={`Collection: ${collection.name}`}
            aria-posinset={index + 1}
            aria-setsize={collections?.length ?? 0}
          />
        );
      },
      [
        isCollectionOwner,
        isCollectionCollaborator,
        cardVariant,
        cardSize,
        buildQuickActionHandlers,
        buildMenuActionHandlers,
        onCollectionClick,
        collections?.length,
      ]
    );

    /**
     * Custom skeleton renderer using CollectionCardSkeleton
     */
    const renderSkeleton = React.useCallback(() => {
      return <CollectionCardSkeleton size={cardSize} />;
    }, [cardSize]);

    /**
     * Default empty state icon
     */
    const defaultEmptyIcon = React.useMemo(
      () => (
        <FolderOpen
          className="text-muted-foreground h-16 w-16"
          aria-hidden="true"
        />
      ),
      []
    );

    /**
     * Default empty state actions
     */
    const defaultEmptyActions = React.useMemo(() => {
      // Only show default action if there's a retry handler
      // (implies this is an error or refetchable state)
      if (onRetry) {
        return (
          <Button variant="default" onClick={onRetry}>
            Refresh Collections
          </Button>
        );
      }
      return undefined;
    }, [onRetry]);

    return (
      <BrowseGrid<CollectionCardCollection>
        ref={ref}
        // Data
        items={collections}
        renderItem={renderCollectionCard}
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        // States
        loading={loading}
        error={error}
        // Empty State
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon ?? defaultEmptyIcon}
        emptyActions={emptyActions ?? defaultEmptyActions}
        // Grid Configuration
        columns={columns}
        gap={gap}
        spacing={spacing}
        // Skeleton
        skeletonCount={skeletonCount}
        renderSkeleton={renderSkeleton}
        // Styling
        className={className}
        gridClassName={gridClassName}
        paginationClassName={paginationClassName}
        // Pagination Options
        showPagination={showPagination}
        paginationProps={paginationProps}
        // Error Handling
        onRetry={onRetry}
        // Accessibility
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );
  }
);

CollectionBrowseGrid.displayName = 'CollectionBrowseGrid';

export type { CollectionBrowseGridProps };
