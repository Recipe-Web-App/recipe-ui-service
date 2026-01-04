import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import FavoriteCollectionsPage from '@/app/(main)/collections/favorites/page';
import type {
  CollectionDto,
  PageCollectionDto,
} from '@/types/recipe-management';
import type {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management';

expect.extend(toHaveNoViolations);

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock recipe-management hooks
const mockRefetch = jest.fn();
const mockUnfavoriteMutateAsync = jest.fn();

jest.mock('@/hooks/recipe-management', () => ({
  useFavoriteCollections: jest.fn(),
  useUnfavoriteCollection: jest.fn(),
}));

// Mock toast store
const mockAddSuccessToast = jest.fn();
const mockAddErrorToast = jest.fn();
const mockAddInfoToast = jest.fn();
jest.mock('@/stores/ui/toast-store', () => ({
  useToastStore: () => ({
    addSuccessToast: mockAddSuccessToast,
    addErrorToast: mockAddErrorToast,
    addInfoToast: mockAddInfoToast,
  }),
}));

// Mock auth store
const mockAuthStore = {
  user: { id: 'current-user-123' },
  authUser: { user_id: 'current-user-123' },
};
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <span data-testid="heart-icon">Heart</span>,
  Search: () => <span data-testid="search-icon">Search</span>,
  Grid3X3: () => <span data-testid="grid-icon">Grid</span>,
  List: () => <span data-testid="list-icon">List</span>,
}));

// Mock child components
jest.mock('@/components/ui/view-toggle', () => ({
  ViewToggle: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (val: 'grid' | 'list') => void;
  }) => (
    <div data-testid="view-toggle">
      <button
        data-testid="view-toggle-grid"
        onClick={() => onValueChange('grid')}
        data-active={value === 'grid'}
      >
        Grid
      </button>
      <button
        data-testid="view-toggle-list"
        onClick={() => onValueChange('list')}
        data-active={value === 'list'}
      >
        List
      </button>
    </div>
  ),
}));

jest.mock('@/components/collection/CollectionFilters', () => ({
  CollectionFilters: ({
    values,
    onFilterChange,
    totalResults,
  }: {
    values: Record<string, unknown>;
    onFilterChange: (val: Record<string, unknown>) => void;
    totalResults: number;
  }) => (
    <div data-testid="collection-filters">
      <span data-testid="filter-result-count">{totalResults} results</span>
      <input
        data-testid="search-input"
        value={(values.search as string) || ''}
        onChange={e => onFilterChange({ ...values, search: e.target.value })}
        placeholder="Search collections"
      />
      <button
        data-testid="clear-filters"
        onClick={() =>
          onFilterChange({
            search: '',
            showOnlyFavorited: false,
          })
        }
      >
        Clear
      </button>
    </div>
  ),
}));

jest.mock('@/components/collection/CollectionBrowseGrid', () => ({
  CollectionBrowseGrid: ({
    collections,
    loading,
    error,
    onRetry,
    currentPage,
    totalPages,
    onPageChange,
    emptyMessage,
    onCollectionClick,
    onEdit,
    onFavorite,
    onShare,
    onAddRecipes,
    onManageCollaborators,
    onDuplicate,
    onQuickView,
    isOwner,
  }: {
    collections: Array<{
      collectionId: number;
      name: string;
      userId: string;
    }>;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    emptyMessage?: string;
    onCollectionClick?: (collection: { collectionId: number }) => void;
    onEdit?: (collection: { collectionId: number }) => void;
    onFavorite?: (collection: { collectionId: number; name: string }) => void;
    onShare?: (collection: { collectionId: number }) => void;
    onAddRecipes?: (collection: { collectionId: number }) => void;
    onManageCollaborators?: (collection: { collectionId: number }) => void;
    onDuplicate?: (collection: { collectionId: number }) => void;
    onQuickView?: (collection: { collectionId: number }) => void;
    isOwner?: boolean | ((collection: { userId: string }) => boolean);
  }) => {
    if (loading) {
      return (
        <div data-testid="collection-grid-loading">Loading collections...</div>
      );
    }
    if (error) {
      return (
        <div data-testid="collection-grid-error">
          <span>{error}</span>
          {onRetry && (
            <button data-testid="retry-button" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      );
    }
    if (!collections || collections.length === 0) {
      return <div data-testid="collection-grid-empty">{emptyMessage}</div>;
    }

    // Helper to determine ownership
    const checkOwnership = (collection: { userId: string }) => {
      if (typeof isOwner === 'function') {
        return isOwner(collection);
      }
      return isOwner ?? false;
    };

    return (
      <div data-testid="collection-browse-grid">
        {collections.map(collection => (
          <div
            key={collection.collectionId}
            data-testid={`collection-card-${collection.collectionId}`}
            data-is-owner={checkOwnership(collection)}
          >
            <span onClick={() => onCollectionClick?.(collection)}>
              {collection.name}
            </span>
            <button
              onClick={() => onEdit?.(collection)}
              data-testid={`edit-${collection.collectionId}`}
            >
              Edit
            </button>
            <button
              onClick={() =>
                onFavorite?.(
                  collection as { collectionId: number; name: string }
                )
              }
              data-testid={`unfavorite-${collection.collectionId}`}
            >
              Unfavorite
            </button>
            <button onClick={() => onShare?.(collection)}>Share</button>
            <button onClick={() => onAddRecipes?.(collection)}>
              Add Recipes
            </button>
            <button onClick={() => onManageCollaborators?.(collection)}>
              Manage Collaborators
            </button>
            <button onClick={() => onDuplicate?.(collection)}>Duplicate</button>
            <button onClick={() => onQuickView?.(collection)}>
              Quick View
            </button>
          </div>
        ))}
        {totalPages > 1 && (
          <div data-testid="pagination">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              data-testid="next-page"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
            <button
              data-testid="prev-page"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
          </div>
        )}
      </div>
    );
  },
}));

// Import the mocked hooks
import {
  useFavoriteCollections,
  useUnfavoriteCollection,
} from '@/hooks/recipe-management';

// Sample collection data - note: these are from different users (favorites page)
const createMockCollection = (
  overrides: Partial<CollectionDto> = {}
): CollectionDto => ({
  collectionId: 1,
  userId: 'other-user-456', // Default to another user (not current user)
  name: 'Test Collection',
  description: 'A test collection for recipes',
  visibility: 'PUBLIC' as CollectionVisibility,
  collaborationMode: 'VIEW_ONLY' as CollaborationMode,
  recipeCount: 5,
  collaboratorCount: 0,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
  ...overrides,
});

const mockCollections: CollectionDto[] = [
  createMockCollection({
    collectionId: 1,
    name: 'Italian Favorites',
    userId: 'other-user-456',
  }),
  createMockCollection({
    collectionId: 2,
    name: 'Quick Meals',
    userId: 'other-user-789',
  }),
  createMockCollection({
    collectionId: 3,
    name: 'My Own Collection',
    userId: 'current-user-123', // This one is owned by current user
  }),
];

const mockPageData: PageCollectionDto = {
  content: mockCollections,
  number: 0,
  size: 10,
  totalElements: 3,
  totalPages: 1,
  last: true,
  first: true,
  numberOfElements: 3,
  empty: false,
  sort: { sorted: false, unsorted: true, empty: true },
};

describe('FavoriteCollectionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnfavoriteMutateAsync.mockResolvedValue(undefined);

    // Reset auth store to default
    mockAuthStore.user = { id: 'current-user-123' };
    mockAuthStore.authUser = { user_id: 'current-user-123' };

    // Default mock for useFavoriteCollections
    (useFavoriteCollections as jest.Mock).mockReturnValue({
      data: mockPageData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    // Default mock for useUnfavoriteCollection
    (useUnfavoriteCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockUnfavoriteMutateAsync,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('renders the page with header and browse button', () => {
      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('Favorite Collections')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /browse collections/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
    });

    it('displays collection count in subtitle', () => {
      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('3 collections')).toBeInTheDocument();
    });

    it('displays singular "collection" when only one', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: {
          ...mockPageData,
          content: [mockCollections[0]],
          totalElements: 1,
          numberOfElements: 1,
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('1 collection')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('Loading your favorites...')).toBeInTheDocument();
      expect(screen.getByTestId('collection-grid-loading')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const error = new Error('Failed to load favorites');
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByTestId('collection-grid-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load favorites')).toBeInTheDocument();
    });

    it('shows empty state when no favorites exist', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(
        screen.getByText('No favorite collections yet')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/haven't favorited any collections yet/i)
      ).toBeInTheDocument();
      // There are two "Browse Collections" links: header and empty state CTA
      const browseLinks = screen.getAllByRole('link', {
        name: /browse collections/i,
      });
      expect(browseLinks.length).toBeGreaterThanOrEqual(1);
      expect(browseLinks[0]).toHaveAttribute('href', '/collections');
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });

    it('renders collection grid by default', () => {
      render(<FavoriteCollectionsPage />);

      expect(screen.getByTestId('collection-browse-grid')).toBeInTheDocument();
    });

    it('shows filters sidebar when collections exist', () => {
      render(<FavoriteCollectionsPage />);

      expect(screen.getByTestId('collection-filters')).toBeInTheDocument();
    });

    it('hides filters sidebar when no collections exist', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(
        screen.queryByTestId('collection-filters')
      ).not.toBeInTheDocument();
    });

    it('does not show draft banner (favorites page has no drafts)', () => {
      render(<FavoriteCollectionsPage />);

      expect(screen.queryByTestId('draft-banner')).not.toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('defaults to grid view', () => {
      render(<FavoriteCollectionsPage />);

      const gridButton = screen.getByTestId('view-toggle-grid');
      expect(gridButton).toHaveAttribute('data-active', 'true');
    });

    it('switches to list view when list button clicked', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      await user.click(screen.getByTestId('view-toggle-list'));

      // Grid should still render (view mode state changes but same component)
      expect(screen.getByTestId('collection-browse-grid')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('updates collection count when filters change', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Italian');

      await waitFor(() => {
        expect(screen.getByTestId('filter-result-count')).toHaveTextContent(
          '1 results'
        );
      });
    });

    it('shows "No collections match your filters" when filters exclude all', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'NonexistentCollection');

      await waitFor(() => {
        expect(screen.getByTestId('collection-grid-empty')).toHaveTextContent(
          'No collections match your filters'
        );
      });
    });

    it('resets to page 1 when filters change', async () => {
      // Set up multi-page data
      const manyCollections = Array.from({ length: 25 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
          userId: 'other-user-456',
        })
      );

      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      // Navigate to page 2
      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);

      // Apply a filter - should reset to page 1
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Collection 1');

      // Should be back on page 1 (or filters reset pagination)
      expect(screen.queryByText('Page 2')).not.toBeInTheDocument();
    });
  });

  describe('Collection Actions', () => {
    it('navigates to collection detail when collection is clicked', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const collectionName = screen.getByText('Italian Favorites');
      await user.click(collectionName);

      expect(mockPush).toHaveBeenCalledWith('/collections/1?from=favorites');
    });

    it('navigates to edit page when Edit is clicked', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const editButton = screen.getByTestId('edit-1');
      await user.click(editButton);

      expect(mockPush).toHaveBeenCalledWith('/collections/1/edit');
    });

    it('unfavorites collection and shows success toast', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const unfavoriteButton = screen.getByTestId('unfavorite-1');
      await user.click(unfavoriteButton);

      await waitFor(() => {
        expect(mockUnfavoriteMutateAsync).toHaveBeenCalledWith(1);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        '"Italian Favorites" removed from favorites.'
      );

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('shows error toast when unfavorite fails', async () => {
      mockUnfavoriteMutateAsync.mockRejectedValue(
        new Error('Unfavorite failed')
      );
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const unfavoriteButton = screen.getByTestId('unfavorite-1');
      await user.click(unfavoriteButton);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith(
          'Failed to remove from favorites. Please try again.'
        );
      });
    });

    it('navigates to add recipes page when clicked', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const addRecipesButtons = screen.getAllByText('Add Recipes');
      await user.click(addRecipesButtons[0]);

      expect(mockPush).toHaveBeenCalledWith('/collections/1/edit?tab=recipes');
    });

    it('navigates to manage collaborators page when clicked', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const collaboratorButtons = screen.getAllByText('Manage Collaborators');
      await user.click(collaboratorButtons[0]);

      expect(mockPush).toHaveBeenCalledWith(
        '/collections/1/edit?tab=collaborators'
      );
    });

    it('shows coming soon toast for share action', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const shareButtons = screen.getAllByText('Share');
      await user.click(shareButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Share functionality will be available soon.'
      );
    });

    it('shows coming soon toast for duplicate action', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const duplicateButtons = screen.getAllByText('Duplicate');
      await user.click(duplicateButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Duplicate functionality will be available soon.'
      );
    });

    it('shows coming soon toast for quick view action', async () => {
      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const quickViewButtons = screen.getAllByText('Quick View');
      await user.click(quickViewButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Quick view functionality will be available soon.'
      );
    });
  });

  describe('Ownership Detection', () => {
    it('correctly identifies owned collections', () => {
      render(<FavoriteCollectionsPage />);

      // Collection 3 is owned by current-user-123
      const ownedCollection = screen.getByTestId('collection-card-3');
      expect(ownedCollection).toHaveAttribute('data-is-owner', 'true');

      // Collections 1 and 2 are owned by other users
      const otherCollection1 = screen.getByTestId('collection-card-1');
      expect(otherCollection1).toHaveAttribute('data-is-owner', 'false');

      const otherCollection2 = screen.getByTestId('collection-card-2');
      expect(otherCollection2).toHaveAttribute('data-is-owner', 'false');
    });

    it('handles null user ID gracefully', () => {
      mockAuthStore.user = null as unknown as { id: string };
      mockAuthStore.authUser = null as unknown as { user_id: string };

      render(<FavoriteCollectionsPage />);

      // All collections should show as not owned
      const collection = screen.getByTestId('collection-card-1');
      expect(collection).toHaveAttribute('data-is-owner', 'false');
    });
  });

  describe('Pagination', () => {
    it('shows pagination when multiple pages exist', () => {
      const manyCollections = Array.from({ length: 25 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
          userId: 'other-user-456',
        })
      );

      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      const manyCollections = Array.from({ length: 25 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
          userId: 'other-user-456',
        })
      );

      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      await user.click(screen.getByTestId('next-page'));

      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('calls refetch when retry button is clicked', async () => {
      const error = new Error('Network error');
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      await user.click(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('handles string error message', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'String error message',
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('String error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<FavoriteCollectionsPage />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<FavoriteCollectionsPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Favorite Collections');
    });

    it('browse collections link is accessible', () => {
      render(<FavoriteCollectionsPage />);

      const browseLink = screen.getByRole('link', {
        name: /browse collections/i,
      });
      expect(browseLink).toHaveAttribute('href', '/collections');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined data content gracefully', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { content: undefined },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(
        screen.getByText('No favorite collections yet')
      ).toBeInTheDocument();
    });

    it('handles null data gracefully', () => {
      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(
        screen.getByText('No favorite collections yet')
      ).toBeInTheDocument();
    });

    it('handles collections without optional fields', () => {
      const minimalCollection: CollectionDto = {
        collectionId: 999,
        userId: 'user-1',
        name: 'Minimal Collection',
        visibility: 'PUBLIC' as CollectionVisibility,
        collaborationMode: 'VIEW_ONLY' as CollaborationMode,
        recipeCount: 0,
        collaboratorCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [minimalCollection] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<FavoriteCollectionsPage />);

      expect(screen.getByText('Minimal Collection')).toBeInTheDocument();
    });

    it('filters by description as well as name', async () => {
      const collectionWithDescription = createMockCollection({
        collectionId: 10,
        name: 'Generic Name',
        description: 'This is about pasta recipes',
        userId: 'other-user-456',
      });

      (useFavoriteCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [collectionWithDescription] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<FavoriteCollectionsPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'pasta');

      await waitFor(() => {
        expect(screen.getByTestId('filter-result-count')).toHaveTextContent(
          '1 results'
        );
      });
    });
  });
});
