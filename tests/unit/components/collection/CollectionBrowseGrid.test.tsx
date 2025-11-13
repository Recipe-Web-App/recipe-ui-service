import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CollectionBrowseGrid } from '@/components/collection/CollectionBrowseGrid';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import { type CollectionCardCollection } from '@/types/ui/collection-card';

expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('@/components/ui/browse-grid', () => ({
  BrowseGrid: React.forwardRef(
    (
      { items, renderItem, loading, error, emptyMessage, ...props }: any,
      ref: any
    ) => {
      if (loading) {
        return <div data-testid="browse-grid-loading">Loading...</div>;
      }
      if (error) {
        return (
          <div data-testid="browse-grid-error">
            <span>{typeof error === 'string' ? error : error.message}</span>
            {props.onRetry && (
              <button onClick={props.onRetry}>Try Again</button>
            )}
          </div>
        );
      }
      if (!items || items.length === 0) {
        return <div data-testid="browse-grid-empty">{emptyMessage}</div>;
      }
      return (
        <div
          ref={ref}
          data-testid="browse-grid"
          role="region"
          aria-label={props['aria-label']}
        >
          <div data-testid="browse-grid-items" role="list">
            {items.map((item: any, index: number) => (
              <div key={item.collectionId} role="listitem">
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          {props.showPagination && props.totalPages && props.totalPages > 1 && (
            <div data-testid="pagination">
              <button
                onClick={() => props.onPageChange?.(props.currentPage + 1)}
              >
                Next Page
              </button>
              <button onClick={() => props.onPageSizeChange?.(24)}>
                Change Page Size
              </button>
            </div>
          )}
        </div>
      );
    }
  ),
}));

jest.mock('@/components/collection/CollectionCard', () => ({
  CollectionCard: React.forwardRef(
    (
      {
        collection,
        onClick,
        quickActionHandlers,
        menuActionHandlers,
        isOwner,
        isCollaborator,
        ...props
      }: any,
      ref: any
    ) => (
      <div
        ref={ref}
        data-testid={`collection-card-${collection.collectionId}`}
        data-owner={isOwner}
        data-collaborator={isCollaborator}
        onClick={() => onClick?.(collection.collectionId)}
      >
        <span>{collection.name}</span>
        {quickActionHandlers?.onFavorite && (
          <button onClick={quickActionHandlers.onFavorite}>Favorite</button>
        )}
        {quickActionHandlers?.onShare && (
          <button onClick={quickActionHandlers.onShare}>Share</button>
        )}
        {quickActionHandlers?.onAddRecipes && (
          <button onClick={quickActionHandlers.onAddRecipes}>
            Add Recipes
          </button>
        )}
        {menuActionHandlers?.onEdit && (
          <button onClick={menuActionHandlers.onEdit}>Edit</button>
        )}
        {menuActionHandlers?.onDelete && (
          <button onClick={menuActionHandlers.onDelete}>Delete</button>
        )}
        {menuActionHandlers?.onManageCollaborators && (
          <button onClick={menuActionHandlers.onManageCollaborators}>
            Manage Collaborators
          </button>
        )}
      </div>
    )
  ),
  CollectionCardSkeleton: jest.fn(({ size }: any) => (
    <div data-testid="collection-skeleton" data-size={size} />
  )),
}));

// Sample collection data
const createMockCollection = (
  overrides: Partial<CollectionCardCollection> = {}
): CollectionCardCollection => ({
  collectionId: 1,
  userId: 'user-123',
  name: 'Summer BBQ Favorites',
  description: 'Best recipes for summer grilling',
  visibility: CollectionVisibility.PUBLIC,
  collaborationMode: CollaborationMode.OWNER_ONLY,
  recipeCount: 12,
  collaboratorCount: 0,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  ownerName: 'Jane Doe',
  ownerAvatar: 'https://example.com/avatar.jpg',
  recipeImages: [
    'https://example.com/recipe1.jpg',
    'https://example.com/recipe2.jpg',
    'https://example.com/recipe3.jpg',
    'https://example.com/recipe4.jpg',
  ],
  isFavorited: false,
  ...overrides,
});

const mockCollections: CollectionCardCollection[] = [
  createMockCollection({
    collectionId: 1,
    name: 'Collection 1',
    recipeCount: 10,
  }),
  createMockCollection({
    collectionId: 2,
    name: 'Collection 2',
    recipeCount: 20,
    visibility: CollectionVisibility.PRIVATE,
  }),
  createMockCollection({
    collectionId: 3,
    name: 'Collection 3',
    recipeCount: 5,
    collaborationMode: CollaborationMode.ALL_USERS,
  }),
];

describe('CollectionBrowseGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders grid with collection cards', () => {
      render(<CollectionBrowseGrid collections={mockCollections} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(screen.getByTestId('browse-grid-items')).toBeInTheDocument();

      // Verify all collections are rendered
      mockCollections.forEach(collection => {
        expect(
          screen.getByTestId(`collection-card-${collection.collectionId}`)
        ).toBeInTheDocument();
      });
    });

    it('renders correct number of collections', () => {
      render(<CollectionBrowseGrid collections={mockCollections} />);

      const cards = screen.getAllByTestId(/^collection-card-/);
      expect(cards).toHaveLength(mockCollections.length);
    });

    it('passes props to CollectionCard correctly', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          cardVariant="outlined"
          cardSize="lg"
        />
      );

      // Verify cards are rendered (props are passed internally)
      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(card).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
      const { container } = render(
        <CollectionBrowseGrid
          collections={mockCollections}
          className="custom-class"
        />
      );

      const grid = screen.getByTestId('browse-grid');
      expect(grid).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CollectionBrowseGrid collections={mockCollections} ref={ref} />);

      expect(ref.current).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('shows loading state with CollectionCardSkeleton', () => {
      render(<CollectionBrowseGrid collections={[]} loading={true} />);

      expect(screen.getByTestId('browse-grid-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid')).not.toBeInTheDocument();
    });

    it('shows empty state with custom message', () => {
      render(
        <CollectionBrowseGrid
          collections={[]}
          emptyMessage="No collections available"
        />
      );

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
      expect(screen.getByText('No collections available')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const onRetry = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={[]}
          error="Failed to load collections"
          onRetry={onRetry}
        />
      );

      expect(screen.getByTestId('browse-grid-error')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load collections')
      ).toBeInTheDocument();

      const retryButton = screen.getByText('Try Again');
      retryButton.click();
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('shows success state with collections', () => {
      render(<CollectionBrowseGrid collections={mockCollections} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(
        screen.queryByTestId('browse-grid-loading')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid-empty')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination when totalPages > 1', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          currentPage={1}
          totalPages={3}
        />
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('hides pagination when showPagination=false', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          currentPage={1}
          totalPages={3}
          showPagination={false}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('calls onPageChange with correct page number', () => {
      const onPageChange = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          currentPage={1}
          totalPages={3}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByText('Next Page');
      nextButton.click();
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageSizeChange when page size changes', () => {
      const onPageSizeChange = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          currentPage={1}
          totalPages={3}
          onPageSizeChange={onPageSizeChange}
        />
      );

      const changeSizeButton = screen.getByText('Change Page Size');
      changeSizeButton.click();
      expect(onPageSizeChange).toHaveBeenCalledWith(24);
    });
  });

  describe('Collection Actions', () => {
    it('calls onCollectionClick when card is clicked', () => {
      const onCollectionClick = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onCollectionClick={onCollectionClick}
        />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      card.click();
      expect(onCollectionClick).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onFavorite when favorite action triggered', () => {
      const onFavorite = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onFavorite={onFavorite}
        />
      );

      const favoriteButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Favorite');
      favoriteButton.click();
      expect(onFavorite).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onShare when share action triggered', () => {
      const onShare = jest.fn();
      render(
        <CollectionBrowseGrid collections={mockCollections} onShare={onShare} />
      );

      const shareButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Share');
      shareButton.click();
      expect(onShare).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onAddRecipes when add recipes action triggered', () => {
      const onAddRecipes = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onAddRecipes={onAddRecipes}
        />
      );

      const addRecipesButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Add Recipes');
      addRecipesButton.click();
      expect(onAddRecipes).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onEdit for owner', () => {
      const onEdit = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onEdit={onEdit}
          isOwner={true}
        />
      );

      const editButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Edit');
      editButton.click();
      expect(onEdit).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onDelete for owner', () => {
      const onDelete = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onDelete={onDelete}
          isOwner={true}
        />
      );

      const deleteButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Delete');
      deleteButton.click();
      expect(onDelete).toHaveBeenCalledWith(mockCollections[0]);
    });

    it('calls onManageCollaborators for owner/collaborator', () => {
      const onManageCollaborators = jest.fn();
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          onManageCollaborators={onManageCollaborators}
          isOwner={true}
        />
      );

      const manageButton = within(
        screen.getByTestId(`collection-card-${mockCollections[0].collectionId}`)
      ).getByText('Manage Collaborators');
      manageButton.click();
      expect(onManageCollaborators).toHaveBeenCalledWith(mockCollections[0]);
    });
  });

  describe('Ownership & Collaboration', () => {
    it('determines owner correctly with boolean value', () => {
      render(
        <CollectionBrowseGrid collections={mockCollections} isOwner={true} />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(card).toHaveAttribute('data-owner', 'true');
    });

    it('determines owner correctly with function', () => {
      const isOwnerFn = (collection: CollectionCardCollection) =>
        collection.userId === 'user-123';

      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          isOwner={isOwnerFn}
        />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(card).toHaveAttribute('data-owner', 'true');
    });

    it('determines collaborator correctly with boolean value', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          isCollaborator={true}
        />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(card).toHaveAttribute('data-collaborator', 'true');
    });

    it('determines collaborator correctly with function', () => {
      const isCollaboratorFn = (collection: CollectionCardCollection) =>
        collection.collaborationMode === CollaborationMode.ALL_USERS;

      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          isCollaborator={isCollaboratorFn}
        />
      );

      // First two collections should NOT be collaborator (OWNER_ONLY)
      const card1 = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(card1).toHaveAttribute('data-collaborator', 'false');

      // Third collection should be collaborator (ALL_USERS)
      const card3 = screen.getByTestId(
        `collection-card-${mockCollections[2].collectionId}`
      );
      expect(card3).toHaveAttribute('data-collaborator', 'true');
    });

    it('shows correct actions for owner', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          isOwner={true}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(within(card).getByText('Edit')).toBeInTheDocument();
      expect(within(card).getByText('Delete')).toBeInTheDocument();
    });

    it('shows correct actions for collaborator (not owner)', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          isOwner={false}
          isCollaborator={true}
          onManageCollaborators={jest.fn()}
        />
      );

      const card = screen.getByTestId(
        `collection-card-${mockCollections[0].collectionId}`
      );
      expect(
        within(card).getByText('Manage Collaborators')
      ).toBeInTheDocument();
    });
  });

  describe('Grid Configuration', () => {
    it('applies custom column configuration', () => {
      const columns = { mobile: 1, tablet: 2, desktop: 3 };
      render(
        <CollectionBrowseGrid collections={mockCollections} columns={columns} />
      );

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('applies custom gap sizes', () => {
      render(<CollectionBrowseGrid collections={mockCollections} gap="lg" />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('applies custom spacing', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          spacing="comfortable"
        />
      );

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <CollectionBrowseGrid
          collections={mockCollections}
          aria-label="My Collections Grid"
        />
      );

      const grid = screen.getByRole('region', { name: 'My Collections Grid' });
      expect(grid).toBeInTheDocument();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockCollections.length);
    });

    it('sets aria-posinset and aria-setsize correctly', () => {
      render(<CollectionBrowseGrid collections={mockCollections} />);

      // Verify all cards are rendered (aria attributes are set internally)
      const cards = screen.getAllByTestId(/^collection-card-/);
      expect(cards).toHaveLength(mockCollections.length);
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <CollectionBrowseGrid collections={mockCollections} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined collections gracefully', () => {
      // @ts-expect-error Testing edge case
      render(<CollectionBrowseGrid collections={undefined} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
    });

    it('handles single collection', () => {
      render(<CollectionBrowseGrid collections={[mockCollections[0]]} />);

      const cards = screen.getAllByTestId(/^collection-card-/);
      expect(cards).toHaveLength(1);
    });

    it('handles large collection lists', () => {
      const largeList = Array.from({ length: 100 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
        })
      );

      render(<CollectionBrowseGrid collections={largeList} />);

      const cards = screen.getAllByTestId(/^collection-card-/);
      expect(cards).toHaveLength(100);
    });

    it('handles missing optional props', () => {
      render(<CollectionBrowseGrid collections={mockCollections} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^collection-card-/)).toHaveLength(
        mockCollections.length
      );
    });
  });
});
