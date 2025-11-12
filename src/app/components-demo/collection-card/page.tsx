'use client';

import * as React from 'react';
import {
  CollectionCard,
  CollectionCardSkeleton,
} from '@/components/collection/CollectionCard';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { CollectionCardCollection } from '@/types/ui/collection-card';
import type { CollectionQuickActionHandlers } from '@/types/collection/quick-actions';
import type { CollectionMenuActionHandlers } from '@/types/collection/menu';

export default function CollectionCardDemo() {
  // Sample collections with different configurations
  const publicCollection: CollectionCardCollection = {
    collectionId: 1,
    userId: 'user-123',
    name: 'Italian Classics',
    description:
      'A curated collection of traditional Italian recipes passed down through generations.',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 12,
    collaboratorCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    recipeImages: [
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    ],
  };

  const privateCollection: CollectionCardCollection = {
    collectionId: 2,
    userId: 'user-123',
    name: 'Family Secrets',
    description: 'Private family recipes not shared with anyone.',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 8,
    collaboratorCount: 0,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    recipeImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    ],
  };

  const collaborativeCollection: CollectionCardCollection = {
    collectionId: 3,
    userId: 'user-456',
    name: 'Team Favorites',
    description:
      'A collaborative collection where our team shares their favorite recipes.',
    visibility: CollectionVisibility.FRIENDS_ONLY,
    collaborationMode: CollaborationMode.SPECIFIC_USERS,
    recipeCount: 24,
    collaboratorCount: 5,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    recipeImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    ],
  };

  const emptyCollection: CollectionCardCollection = {
    collectionId: 4,
    userId: 'user-789',
    name: 'Weekend Experiments',
    description: 'New recipes I want to try on weekends.',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 0,
    collaboratorCount: 0,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  };

  // Mock handlers for quick actions
  const createQuickActionHandlers = (
    collectionId: number
  ): CollectionQuickActionHandlers => ({
    onFavorite: () => {
      console.log(`Favorite collection ${collectionId}`);
      alert(`Favorited collection ${collectionId}`);
    },
    onShare: () => {
      console.log(`Share collection ${collectionId}`);
      alert(`Share collection ${collectionId}`);
    },
    onAddRecipes: () => {
      console.log(`Add recipes to collection ${collectionId}`);
      alert(`Add recipes to collection ${collectionId}`);
    },
    onQuickView: () => {
      console.log(`Quick view collection ${collectionId}`);
      alert(`Quick view collection ${collectionId}`);
    },
  });

  // Mock handlers for menu actions
  const createMenuActionHandlers = (
    collectionId: number
  ): CollectionMenuActionHandlers => ({
    onEdit: () => {
      console.log(`Edit collection ${collectionId}`);
      alert(`Edit collection ${collectionId}`);
    },
    onDelete: () => {
      console.log(`Delete collection ${collectionId}`);
      if (
        confirm(`Are you sure you want to delete collection ${collectionId}?`)
      ) {
        alert(`Deleted collection ${collectionId}`);
      }
    },
    onManageRecipes: () => {
      console.log(`Manage recipes in collection ${collectionId}`);
      alert(`Manage recipes in collection ${collectionId}`);
    },
    onManageCollaborators: () => {
      console.log(`Manage collaborators for collection ${collectionId}`);
      alert(`Manage collaborators for collection ${collectionId}`);
    },
    onShare: () => {
      console.log(`Share collection ${collectionId}`);
      alert(`Share collection ${collectionId}`);
    },
    onDuplicate: () => {
      console.log(`Duplicate collection ${collectionId}`);
      alert(`Duplicated collection ${collectionId}`);
    },
    onReport: () => {
      console.log(`Report collection ${collectionId}`);
      alert(`Report collection ${collectionId}`);
    },
  });

  // Card click handler
  const handleCardClick = (collectionId: number) => {
    console.log(`Clicked collection card ${collectionId}`);
    alert(`Viewing collection ${collectionId}`);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">CollectionCard Component</h1>
        <p className="text-muted-foreground">
          A card component for displaying recipe collections with a 2x2 mosaic
          image grid, quick actions, and menu options.
        </p>
      </header>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Usage</h2>
        <p className="text-muted-foreground">
          Simple collection card with basic information
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard collection={publicCollection} />
          <CollectionCard collection={privateCollection} />
          <CollectionCard collection={collaborativeCollection} />
        </div>
      </section>

      {/* With Click Handler */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Interactive Cards</h2>
        <p className="text-muted-foreground">
          Cards with onClick handlers - click to view details
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            collection={publicCollection}
            onClick={handleCardClick}
            variant="interactive"
          />
          <CollectionCard
            collection={privateCollection}
            onClick={handleCardClick}
            variant="interactive"
          />
        </div>
      </section>

      {/* With Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">With Quick Actions</h2>
        <p className="text-muted-foreground">
          Hover over cards to see quick action buttons
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            collection={publicCollection}
            quickActionHandlers={createQuickActionHandlers(
              publicCollection.collectionId
            )}
          />
          <CollectionCard
            collection={collaborativeCollection}
            quickActionHandlers={createQuickActionHandlers(
              collaborativeCollection.collectionId
            )}
            isOwner
          />
        </div>
      </section>

      {/* With Menu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">With Menu Actions</h2>
        <p className="text-muted-foreground">
          Click the three-dot menu for more options
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            collection={publicCollection}
            menuActionHandlers={createMenuActionHandlers(
              publicCollection.collectionId
            )}
            isOwner
          />
          <CollectionCard
            collection={collaborativeCollection}
            menuActionHandlers={createMenuActionHandlers(
              collaborativeCollection.collectionId
            )}
            isCollaborator
          />
        </div>
      </section>

      {/* Full Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Full-Featured Cards</h2>
        <p className="text-muted-foreground">
          Cards with both quick actions and menu (hover and click menu icon)
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            collection={publicCollection}
            quickActionHandlers={createQuickActionHandlers(
              publicCollection.collectionId
            )}
            menuActionHandlers={createMenuActionHandlers(
              publicCollection.collectionId
            )}
            onClick={handleCardClick}
            isOwner
          />
          <CollectionCard
            collection={collaborativeCollection}
            quickActionHandlers={createQuickActionHandlers(
              collaborativeCollection.collectionId
            )}
            menuActionHandlers={createMenuActionHandlers(
              collaborativeCollection.collectionId
            )}
            onClick={handleCardClick}
            isCollaborator
          />
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Variants</h2>
        <p className="text-muted-foreground">
          Different visual styles for various use cases
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Default</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard collection={publicCollection} variant="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Elevated</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard
                collection={publicCollection}
                variant="elevated"
              />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Outlined</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard
                collection={publicCollection}
                variant="outlined"
              />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Ghost</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard collection={publicCollection} variant="ghost" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Interactive (clickable)</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard
                collection={publicCollection}
                variant="interactive"
                onClick={handleCardClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sizes</h2>
        <p className="text-muted-foreground">Different size options</p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Small</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <CollectionCard collection={publicCollection} size="sm" />
              <CollectionCard collection={privateCollection} size="sm" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Default</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCard collection={publicCollection} size="default" />
              <CollectionCard collection={privateCollection} size="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Large</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <CollectionCard collection={publicCollection} size="lg" />
              <CollectionCard collection={privateCollection} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Edge Cases */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Edge Cases</h2>
        <p className="text-muted-foreground">
          Handling collections with minimal or no data
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCard collection={emptyCollection} />
          <CollectionCard
            collection={{
              ...publicCollection,
              description: undefined,
            }}
          />
          <CollectionCard
            collection={{
              ...publicCollection,
              name: 'Collection With a Very Long Name That Should Be Handled Gracefully',
              description:
                'This is a collection with an extremely long description that should wrap properly and not break the card layout. It contains a lot of text to demonstrate how the card handles overflow content.',
            }}
          />
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State</h2>
        <p className="text-muted-foreground">
          Skeleton loaders for collections being loaded
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CollectionCardSkeleton />
          <CollectionCardSkeleton />
          <CollectionCardSkeleton />
        </div>
      </section>

      {/* Loading State Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading State Sizes</h2>
        <p className="text-muted-foreground">
          Skeleton loaders in different sizes
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Small Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <CollectionCardSkeleton size="sm" />
              <CollectionCardSkeleton size="sm" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Default Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CollectionCardSkeleton size="default" />
              <CollectionCardSkeleton size="default" />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Large Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <CollectionCardSkeleton size="lg" />
              <CollectionCardSkeleton size="lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
