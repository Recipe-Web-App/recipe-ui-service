'use client';

import * as React from 'react';
import { CollectionBrowseGrid } from '@/components/collection/CollectionBrowseGrid';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { CollectionCardCollection } from '@/types/ui/collection-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function CollectionBrowseGridDemo() {
  // State for interactive controls
  const [showQuickActions, setShowQuickActions] = React.useState(true);
  const [showMenu, setShowMenu] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Sample collections
  const sampleCollections: CollectionCardCollection[] = [
    {
      collectionId: 1,
      userId: 'user-123',
      name: 'Italian Classics',
      description:
        'Traditional Italian recipes passed down through generations.',
      visibility: CollectionVisibility.PUBLIC,
      collaborationMode: CollaborationMode.OWNER_ONLY,
      recipeCount: 12,
      collaboratorCount: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      ownerName: 'Chef Mario',
      ownerAvatar: 'https://i.pravatar.cc/150?img=1',
      recipeImages: [
        'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400',
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
      ],
      isFavorited: false,
    },
    {
      collectionId: 2,
      userId: 'user-456',
      name: 'Asian Fusion',
      description: 'Creative fusion dishes combining Asian flavors.',
      visibility: CollectionVisibility.PUBLIC,
      collaborationMode: CollaborationMode.ALL_USERS,
      recipeCount: 24,
      collaboratorCount: 8,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      ownerName: 'Chef Lee',
      ownerAvatar: 'https://i.pravatar.cc/150?img=2',
      recipeImages: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
      ],
      isFavorited: true,
    },
    {
      collectionId: 3,
      userId: 'user-789',
      name: 'Weekend Brunch',
      description: 'Perfect recipes for lazy weekend brunches.',
      visibility: CollectionVisibility.FRIENDS_ONLY,
      collaborationMode: CollaborationMode.SPECIFIC_USERS,
      recipeCount: 8,
      collaboratorCount: 3,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-22T00:00:00Z',
      ownerName: 'Chef Emma',
      ownerAvatar: 'https://i.pravatar.cc/150?img=3',
      recipeImages: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
      ],
      isFavorited: false,
    },
    {
      collectionId: 4,
      userId: 'user-123',
      name: 'Summer BBQ Favorites',
      description: 'Best recipes for summer grilling season.',
      visibility: CollectionVisibility.PUBLIC,
      collaborationMode: CollaborationMode.OWNER_ONLY,
      recipeCount: 15,
      collaboratorCount: 0,
      createdAt: '2023-12-15T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
      ownerName: 'Chef Mario',
      ownerAvatar: 'https://i.pravatar.cc/150?img=1',
      recipeImages: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
        'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      ],
      isFavorited: true,
    },
    {
      collectionId: 5,
      userId: 'user-456',
      name: 'Healthy Meal Prep',
      description: 'Nutritious recipes perfect for weekly meal preparation.',
      visibility: CollectionVisibility.PUBLIC,
      collaborationMode: CollaborationMode.ALL_USERS,
      recipeCount: 30,
      collaboratorCount: 12,
      createdAt: '2023-11-20T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z',
      ownerName: 'Chef Lee',
      ownerAvatar: 'https://i.pravatar.cc/150?img=2',
      recipeImages: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
        'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400',
      ],
      isFavorited: false,
    },
    {
      collectionId: 6,
      userId: 'user-789',
      name: 'Comfort Food Classics',
      description: 'Heartwarming dishes that remind you of home.',
      visibility: CollectionVisibility.PRIVATE,
      collaborationMode: CollaborationMode.OWNER_ONLY,
      recipeCount: 18,
      collaboratorCount: 0,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z',
      ownerName: 'Chef Emma',
      ownerAvatar: 'https://i.pravatar.cc/150?img=3',
      recipeImages: [
        'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400',
        'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
      ],
      isFavorited: true,
    },
  ];

  // Action handlers
  const handleCollectionClick = (collection: CollectionCardCollection) => {
    console.log(`Clicked: ${collection.name}`);
    alert(`Clicked: ${collection.name}`);
  };

  const handleFavorite = (collection: CollectionCardCollection) => {
    console.log(`Favorited: ${collection.name}`);
    alert(`Favorited: ${collection.name}`);
  };

  const handleShare = (collection: CollectionCardCollection) => {
    console.log(`Sharing: ${collection.name}`);
    alert(`Sharing: ${collection.name}`);
  };

  const handleAddRecipes = (collection: CollectionCardCollection) => {
    console.log(`Add recipes to: ${collection.name}`);
    alert(`Add recipes to: ${collection.name}`);
  };

  const handleQuickView = (collection: CollectionCardCollection) => {
    console.log(`Quick view: ${collection.name}`);
    alert(`Quick view: ${collection.name}`);
  };

  const handleEdit = (collection: CollectionCardCollection) => {
    console.log(`Editing: ${collection.name}`);
    alert(`Editing: ${collection.name}`);
  };

  const handleDelete = (collection: CollectionCardCollection) => {
    console.log(`Delete: ${collection.name}`);
    alert(`Delete: ${collection.name}`);
  };

  const handleManageCollaborators = (collection: CollectionCardCollection) => {
    console.log(`Manage collaborators: ${collection.name}`);
    alert(`Manage collaborators: ${collection.name}`);
  };

  const handleRetry = () => {
    console.log('Retrying...');
    alert('Retrying...');
    setHasError(false);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const simulateError = () => {
    setHasError(true);
  };

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          CollectionBrowseGrid Component
        </h1>
        <p className="text-muted-foreground text-lg">
          A responsive grid component for browsing recipe collections with
          comprehensive features including pagination, loading states, quick
          actions, and dual ownership support.
        </p>
      </header>

      <div className="border-border my-8 border-t" />

      {/* 1. Basic Usage */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Basic Usage</h2>
          <p className="text-muted-foreground">
            Default grid with sample collections
          </p>
        </div>
        <CollectionBrowseGrid
          collections={sampleCollections.slice(0, 3)}
          onCollectionClick={handleCollectionClick}
          onFavorite={handleFavorite}
          onShare={handleShare}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 2. Variants */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Card Variants</h2>
          <p className="text-muted-foreground">
            Different visual styles for collection cards
          </p>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Default</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              cardVariant="default"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Elevated</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              cardVariant="elevated"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Outlined</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              cardVariant="outlined"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Interactive</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              cardVariant="interactive"
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* 3. Sizes */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Card Sizes</h2>
          <p className="text-muted-foreground">Different card size options</p>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Small</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 3)}
              cardSize="sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Default</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 3)}
              cardSize="default"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Large</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 3)}
              cardSize="lg"
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* 4. With Quick Actions */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">With Quick Actions</h2>
          <p className="text-muted-foreground">
            Hover overlay with quick action buttons
          </p>
        </div>
        <CollectionBrowseGrid
          collections={sampleCollections.slice(0, 3)}
          showQuickActions={true}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onAddRecipes={handleAddRecipes}
          onQuickView={handleQuickView}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 5. With Menu */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">With Menu</h2>
          <p className="text-muted-foreground">
            Three-dot menu with contextual actions
          </p>
        </div>
        <CollectionBrowseGrid
          collections={sampleCollections.slice(0, 3)}
          showMenu={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageCollaborators={handleManageCollaborators}
          isOwner={true}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 6. Ownership States */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Ownership States</h2>
          <p className="text-muted-foreground">
            Owner, collaborator, and viewer states with different action sets
          </p>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Owner (All Actions)</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              isOwner={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageCollaborators={handleManageCollaborators}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Collaborator (Limited Actions)
            </h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              isOwner={false}
              isCollaborator={true}
              onEdit={handleEdit}
              onManageCollaborators={handleManageCollaborators}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Viewer (View Only)</h3>
            <CollectionBrowseGrid
              collections={sampleCollections.slice(0, 2)}
              isOwner={false}
              isCollaborator={false}
              onFavorite={handleFavorite}
              onShare={handleShare}
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* 7. Loading State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Loading State</h2>
          <p className="text-muted-foreground">
            Skeleton placeholders during data fetch
          </p>
        </div>
        <Button onClick={simulateLoading}>Simulate Loading</Button>
        <CollectionBrowseGrid collections={[]} loading={isLoading} />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 8. Empty State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Empty State</h2>
          <p className="text-muted-foreground">
            Displayed when no collections are found
          </p>
        </div>
        <CollectionBrowseGrid
          collections={[]}
          emptyMessage="No collections found"
          emptyDescription="Try creating a new collection to get started"
          emptyActions={
            <Button
              onClick={() => {
                console.log('Create collection clicked');
                alert('Create collection clicked');
              }}
            >
              Create Collection
            </Button>
          }
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 9. Error State */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Error State</h2>
          <p className="text-muted-foreground">
            Error display with retry functionality
          </p>
        </div>
        <Button onClick={simulateError}>Simulate Error</Button>
        <CollectionBrowseGrid
          collections={[]}
          error={
            hasError ? 'Failed to load collections. Please try again.' : null
          }
          onRetry={handleRetry}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 10. Pagination */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Pagination</h2>
          <p className="text-muted-foreground">
            Multi-page navigation for large datasets
          </p>
        </div>
        <CollectionBrowseGrid
          collections={sampleCollections.slice(0, 3)}
          currentPage={currentPage}
          totalPages={3}
          totalItems={18}
          pageSize={3}
          onPageChange={setCurrentPage}
          onCollectionClick={handleCollectionClick}
        />
      </section>

      <div className="border-border my-8 border-t" />

      {/* 11. Custom Configuration */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Custom Configuration</h2>
          <p className="text-muted-foreground">
            Custom grid columns, gap, and spacing
          </p>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Wide Layout (3 columns max)
            </h3>
            <CollectionBrowseGrid
              collections={sampleCollections}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="lg"
              spacing="comfortable"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Compact Layout (6 columns)
            </h3>
            <CollectionBrowseGrid
              collections={sampleCollections}
              columns={{ mobile: 2, tablet: 4, desktop: 6 }}
              gap="sm"
              spacing="compact"
              cardSize="sm"
            />
          </div>
        </div>
      </section>

      <div className="border-border my-8 border-t" />

      {/* 12. Interactive Controls */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Interactive Controls</h2>
          <p className="text-muted-foreground">
            Toggle features to see how they affect the grid
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
            <CardDescription>
              Adjust settings to see how they affect the grid
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="quick-actions" className="text-sm font-medium">
                Show Quick Actions
              </label>
              <Switch
                id="quick-actions"
                checked={showQuickActions}
                onCheckedChange={setShowQuickActions}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="menu" className="text-sm font-medium">
                Show Menu
              </label>
              <Switch
                id="menu"
                checked={showMenu}
                onCheckedChange={setShowMenu}
              />
            </div>
          </CardContent>
        </Card>
        <CollectionBrowseGrid
          collections={sampleCollections.slice(0, 3)}
          showQuickActions={showQuickActions}
          showMenu={showMenu}
          onCollectionClick={handleCollectionClick}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onAddRecipes={handleAddRecipes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isOwner={true}
        />
      </section>
    </div>
  );
}
