'use client';

import React, { useState, useMemo } from 'react';
import { CollectionFilters } from '@/components/collection/CollectionFilters';
import { CollectionBrowseGrid } from '@/components/collection/CollectionBrowseGrid';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  CollaborationMode,
  CollectionVisibility,
} from '@/types/recipe-management/common';
import type { CollectionDto } from '@/types/recipe-management/collection';
import type { CollectionFilterValues } from '@/types/collection/filters';
import { DEFAULT_COLLECTION_FILTER_VALUES } from '@/types/collection/filters';

// Sample collection data
const sampleCollections: CollectionDto[] = [
  {
    collectionId: 1,
    userId: 'current-user',
    name: 'My Favorite Desserts',
    description: 'A curated collection of sweet treats',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 12,
    collaboratorCount: 0,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
  },
  {
    collectionId: 2,
    userId: 'followed-user-1',
    name: 'Italian Classics',
    description: 'Traditional Italian recipes passed down through generations',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.ALL_USERS,
    recipeCount: 25,
    collaboratorCount: 3,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    collectionId: 3,
    userId: 'current-user',
    name: 'Quick Weeknight Dinners',
    description: 'Easy recipes for busy weeknights',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 18,
    collaboratorCount: 0,
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
  {
    collectionId: 4,
    userId: 'other-user-1',
    name: 'Vegan Favorites',
    description: 'Plant-based recipes for every meal',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.SPECIFIC_USERS,
    recipeCount: 30,
    collaboratorCount: 5,
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
  {
    collectionId: 5,
    userId: 'followed-user-2',
    name: 'Holiday Baking',
    description: 'Special recipes for festive occasions',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 8,
    collaboratorCount: 0,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
  },
  {
    collectionId: 6,
    userId: 'current-user',
    name: 'Family Favorites',
    description: 'Recipes loved by the whole family',
    visibility: CollectionVisibility.FRIENDS_ONLY,
    collaborationMode: CollaborationMode.ALL_USERS,
    recipeCount: 42,
    collaboratorCount: 2,
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    collectionId: 7,
    userId: 'other-user-2',
    name: 'Summer BBQ',
    description: 'Grilling recipes perfect for outdoor cooking',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 15,
    collaboratorCount: 0,
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-14T13:00:00Z',
  },
  {
    collectionId: 8,
    userId: 'current-user',
    name: 'Meal Prep Sunday',
    description: 'Recipes perfect for batch cooking and meal prepping',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.ALL_USERS,
    recipeCount: 20,
    collaboratorCount: 8,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
  },
  {
    collectionId: 9,
    userId: 'followed-user-1',
    name: 'Comfort Food',
    description: 'Warm and cozy recipes for cold days',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 16,
    collaboratorCount: 0,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    collectionId: 10,
    userId: 'other-user-3',
    name: 'Asian Cuisine Exploration',
    description: 'Authentic recipes from across Asia',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.SPECIFIC_USERS,
    recipeCount: 35,
    collaboratorCount: 4,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
  },
  {
    collectionId: 11,
    userId: 'current-user',
    name: 'Low Carb Collection',
    description: 'Keto and low-carb friendly recipes',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 22,
    collaboratorCount: 0,
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-23T14:00:00Z',
  },
  {
    collectionId: 12,
    userId: 'followed-user-3',
    name: 'Breakfast Champions',
    description: 'Start your day right with these breakfast favorites',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 10,
    collaboratorCount: 0,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
  },
];

// Mock data for which users are followed (for demo purposes)
const followedUsers = ['followed-user-1', 'followed-user-2', 'followed-user-3'];

// Mock data for which collections user collaborates on (for demo purposes)
const collaboratingCollectionIds = [2, 6, 8];

// Mock data for favorited collections (for demo purposes)
const favoritedCollectionIds = [2, 4, 9, 12];

export default function CollectionFiltersDemo() {
  const [filterValues, setFilterValues] = useState<CollectionFilterValues>(
    DEFAULT_COLLECTION_FILTER_VALUES
  );

  // Filter collections based on current filter values
  const filteredCollections = useMemo(() => {
    return sampleCollections.filter(collection => {
      // Search filter
      if (filterValues.search) {
        const searchLower = filterValues.search.toLowerCase();
        const nameMatch = collection.name.toLowerCase().includes(searchLower);
        const descMatch = collection.description
          ?.toLowerCase()
          .includes(searchLower);
        if (!nameMatch && !descMatch) return false;
      }

      // Show public and followed users filter
      if (filterValues.showPublicAndFollowed) {
        const isPublic = collection.visibility === CollectionVisibility.PUBLIC;
        const isFromFollowed = followedUsers.includes(collection.userId);
        if (!(isPublic || isFromFollowed)) return false;
      }

      // Show only my collections filter
      if (filterValues.showMyCollections) {
        if (collection.userId !== 'current-user') return false;
      }

      // Show collections I collaborate on filter
      if (filterValues.showCollaborating) {
        if (!collaboratingCollectionIds.includes(collection.collectionId))
          return false;
      }

      // Show collections I don't collaborate on filter
      if (filterValues.showNotCollaborating) {
        if (collaboratingCollectionIds.includes(collection.collectionId))
          return false;
      }

      // Show only favorited collections filter
      if (filterValues.showOnlyFavorited) {
        if (!favoritedCollectionIds.includes(collection.collectionId))
          return false;
      }

      return true;
    });
  }, [filterValues]);

  // Enrich collections with additional data (deterministic based on collectionId)
  const enrichedCollections = useMemo(
    () =>
      filteredCollections.map(collection => ({
        ...collection,
        recipeImages: Array.from(
          { length: 4 },
          (_, i) =>
            `https://images.unsplash.com/photo-${1500000000000 + collection.collectionId + i * 100}?w=200`
        ),
        isFavorited: favoritedCollectionIds.includes(collection.collectionId),
        ownerName:
          collection.userId === 'current-user'
            ? 'You'
            : followedUsers.includes(collection.userId)
              ? `Chef ${collection.userId}`
              : `User ${collection.userId}`,
        ownerAvatar: `https://i.pravatar.cc/150?u=${collection.userId}`,
      })),
    [filteredCollections]
  );

  const handleFilterChange = (newValues: CollectionFilterValues) => {
    setFilterValues(newValues);
  };

  const handleReset = () => {
    setFilterValues(DEFAULT_COLLECTION_FILTER_VALUES);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          CollectionFilters Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Entity-specific filter panel for collection browsing. Responsive with
          drawer on mobile and inline panel on desktop/tablet.
        </p>
      </div>

      <div className="space-y-8">
        {/* Current State Display */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Current Filter State</CardTitle>
            <CardDescription>
              Active filters and their values (updates in real-time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(filterValues, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Reset Filters
              </button>
              <div className="text-muted-foreground flex items-center text-sm">
                Showing {filteredCollections.length} of{' '}
                {sampleCollections.length} collections
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Live Filter Demo</CardTitle>
            <CardDescription>
              Try the filters to see collections update in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Filter Panel */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <CollectionFilters
                  collections={sampleCollections}
                  values={filterValues}
                  onFilterChange={handleFilterChange}
                  totalResults={filteredCollections.length}
                  showResultCount
                  title="Filter Collections"
                  variant="default"
                  size="md"
                  position="sidebar"
                />
              </div>

              {/* Filtered Collection Grid */}
              <div>
                {enrichedCollections.length > 0 ? (
                  <CollectionBrowseGrid
                    collections={enrichedCollections}
                    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                    gap="md"
                    cardVariant="elevated"
                    cardSize="default"
                  />
                ) : (
                  <div className="bg-muted flex flex-col items-center justify-center rounded-lg p-12 text-center">
                    <p className="text-muted-foreground text-lg font-medium">
                      No collections match your filters
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              CollectionFilters component capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Text Search:</strong> Search collections by name and
                  description with debouncing (300ms)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Visibility Filter:</strong> Toggle to show public
                  collections and collections from followed users
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Ownership Filter:</strong> Toggle to show only your
                  collections
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Collaboration Filters:</strong> Filter by collections
                  you collaborate on or don&apos;t collaborate on
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Favorites Filter:</strong> Toggle to show only
                  favorited collections
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Responsive Design:</strong> Drawer on mobile
                  (&lt;768px), inline panel on desktop/tablet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Session State:</strong> Integrates with search-filter
                  store for session-only persistence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Real-time Updates:</strong> Filtered results update
                  immediately as filters change
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Clear & Reset:</strong> Easy to clear all filters or
                  reset to defaults
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
