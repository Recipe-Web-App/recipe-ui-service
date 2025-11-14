'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterPanel } from '@/components/ui/filter-panel';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useSearchFilterStore } from '@/stores/ui/search-filter-store';
import type { FilterConfig } from '@/types/ui/filter-panel';
import {
  type CollectionFiltersProps,
  type CollectionFilterValues,
  DEFAULT_COLLECTION_FILTER_VALUES,
  COLLECTION_FILTER_CONSTANTS,
  collectionFiltersToFilterValues,
  filterValuesToCollectionFilters,
} from '@/types/collection/filters';

/**
 * CollectionFilters Component
 *
 * Entity-specific filter panel for collection browsing that wraps the generic
 * FilterPanel component with collection-specific filtering options.
 *
 * Features:
 * - Responsive: Drawer on mobile (<768px), inline panel on desktop/tablet
 * - Session-only state persistence via search-filter store
 * - Collection-specific filters: search, visibility, ownership, collaboration, favorites
 * - Toggle-based filters for simplified UX
 * - Integration with FilterPanel for consistent UX
 *
 * @example
 * ```tsx
 * <CollectionFilters
 *   collections={collections}
 *   values={filterValues}
 *   onFilterChange={setFilterValues}
 *   totalResults={12}
 *   showResultCount
 * />
 * ```
 */
export const CollectionFilters = React.forwardRef<
  HTMLDivElement,
  CollectionFiltersProps
>(
  (
    {
      collections: _collections,
      values = DEFAULT_COLLECTION_FILTER_VALUES,
      onFilterChange,
      className,
      collapsible = true,
      defaultCollapsed = false,
      totalResults,
      showResultCount = false,
      loadingResults = false,
      title = 'Filter Collections',
      variant = 'default',
      size = 'md',
      position = 'sidebar',
      showHeader = true,
      showFooter = true,
      ...props
    },
    ref
  ) => {
    // Mobile drawer state
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Check if mobile viewport
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Integration with search-filter store (for session state)
    const { setQuery } = useSearchFilterStore();

    // Build filter configuration dynamically
    const filterConfig: FilterConfig[] = React.useMemo(() => {
      return [
        // Search filter
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search collections...',
          debounceDelay: COLLECTION_FILTER_CONSTANTS.SEARCH_DEBOUNCE_DELAY,
          showSearchIcon: true,
          showClearButton: true,
        },
        // Public & followed users filter
        {
          type: 'checkbox',
          id: 'showPublicAndFollowed',
          label: 'Visibility',
          description: 'Filter by collection visibility',
          options: [
            {
              id: 'showPublicAndFollowed',
              label: 'Public & from followed users',
              description:
                'Show public collections and collections from users you follow',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: false,
        },
        // My collections filter
        {
          type: 'checkbox',
          id: 'showMyCollections',
          label: 'Ownership',
          description: 'Filter by collection ownership',
          options: [
            {
              id: 'showMyCollections',
              label: 'My collections only',
              description: 'Show only collections you own',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: false,
        },
        // Collaboration filters
        {
          type: 'checkbox',
          id: 'collaboration',
          label: 'Collaboration',
          description: 'Filter by collaboration status',
          options: [
            {
              id: 'showCollaborating',
              label: 'Collections I collaborate on',
              description: 'Show collections where you are a collaborator',
            },
            {
              id: 'showNotCollaborating',
              label: "Collections I don't collaborate on",
              description: 'Show collections where you are not a collaborator',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: true,
        },
        // Favorited filter
        {
          type: 'checkbox',
          id: 'showOnlyFavorited',
          label: 'Favorites',
          description: 'Filter by favorite status',
          options: [
            {
              id: 'showOnlyFavorited',
              label: 'Favorited collections only',
              description: 'Show only collections you have favorited',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: false,
        },
      ];
    }, []);

    // Convert CollectionFilterValues to generic FilterValues
    const filterValues = React.useMemo(() => {
      const genericValues = collectionFiltersToFilterValues(values);

      // Convert individual boolean toggles to arrays for checkbox filters
      return {
        search: genericValues.search,
        showPublicAndFollowed: genericValues.showPublicAndFollowed
          ? ['showPublicAndFollowed']
          : [],
        showMyCollections: genericValues.showMyCollections
          ? ['showMyCollections']
          : [],
        collaboration: [
          ...(genericValues.showCollaborating ? ['showCollaborating'] : []),
          ...(genericValues.showNotCollaborating
            ? ['showNotCollaborating']
            : []),
        ],
        showOnlyFavorited: genericValues.showOnlyFavorited
          ? ['showOnlyFavorited']
          : [],
      };
    }, [values]);

    // Handle filter value changes
    const handleFilterChange = React.useCallback(
      (newValues: Record<string, unknown>) => {
        // Convert arrays back to booleans
        const convertedValues = {
          search: newValues.search,
          showPublicAndFollowed: Array.isArray(newValues.showPublicAndFollowed)
            ? newValues.showPublicAndFollowed.includes('showPublicAndFollowed')
            : false,
          showMyCollections: Array.isArray(newValues.showMyCollections)
            ? newValues.showMyCollections.includes('showMyCollections')
            : false,
          showCollaborating: Array.isArray(newValues.collaboration)
            ? newValues.collaboration.includes('showCollaborating')
            : false,
          showNotCollaborating: Array.isArray(newValues.collaboration)
            ? newValues.collaboration.includes('showNotCollaborating')
            : false,
          showOnlyFavorited: Array.isArray(newValues.showOnlyFavorited)
            ? newValues.showOnlyFavorited.includes('showOnlyFavorited')
            : false,
        };

        const collectionFilters =
          filterValuesToCollectionFilters(convertedValues);
        onFilterChange(collectionFilters);

        // Sync search query to store
        if (typeof newValues.search === 'string') {
          setQuery(newValues.search);
        }
      },
      [onFilterChange, setQuery]
    );

    // Handle clear all filters
    const handleClear = React.useCallback(() => {
      onFilterChange(DEFAULT_COLLECTION_FILTER_VALUES);
      setQuery('');
    }, [onFilterChange, setQuery]);

    // Handle reset filters
    const handleReset = React.useCallback(() => {
      onFilterChange(DEFAULT_COLLECTION_FILTER_VALUES);
    }, [onFilterChange]);

    // Render filter panel
    const renderFilterPanel = () => (
      <FilterPanel
        ref={isMobile ? undefined : ref}
        filters={filterConfig}
        values={filterValues}
        onValuesChange={handleFilterChange}
        title={title}
        collapsible={collapsible && !isMobile}
        defaultCollapsed={defaultCollapsed}
        showHeader={showHeader}
        showFooter={showFooter}
        onClear={handleClear}
        onReset={handleReset}
        totalResults={totalResults}
        showResultCount={showResultCount}
        loadingResults={loadingResults}
        variant={variant}
        size={size}
        position={isMobile ? 'drawer' : position}
        className={isMobile ? 'h-full' : className}
        aria-label="Collection filters"
        {...props}
      />
    );

    // Mobile: Render drawer with trigger button
    if (isMobile) {
      return (
        <div ref={ref} className={cn('w-full', className)}>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="w-full"
                aria-label="Open filters"
              >
                <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                Filters
                {totalResults !== undefined && (
                  <span className="text-muted-foreground ml-2">
                    ({totalResults} {totalResults === 1 ? 'result' : 'results'})
                  </span>
                )}
              </Button>
            </DrawerTrigger>

            <DrawerOverlay />

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Collection Filters</DrawerTitle>
              </DrawerHeader>

              <DrawerBody className="overflow-y-auto">
                {renderFilterPanel()}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      );
    }

    // Desktop/Tablet: Render inline filter panel
    return renderFilterPanel();
  }
);

CollectionFilters.displayName = 'CollectionFilters';

export type { CollectionFiltersProps, CollectionFilterValues };
