import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import MyCollectionsPage from '@/app/(main)/collections/my-collections/page';
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
const mockDeleteMutateAsync = jest.fn();

jest.mock('@/hooks/recipe-management', () => ({
  useMyCollections: jest.fn(),
  useDeleteCollection: jest.fn(),
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

// Mock collection store for DraftBanner
const mockHasUnsavedDraft = jest.fn().mockReturnValue(false);
const mockClearDraftCollection = jest.fn();
jest.mock('@/stores/collection-store', () => ({
  useCollectionStore: () => ({
    hasUnsavedDraft: mockHasUnsavedDraft,
    draftCollection: null,
    draftLastModified: null,
    clearDraftCollection: mockClearDraftCollection,
  }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon">Plus</span>,
  FolderOpen: () => <span data-testid="folder-icon">FolderOpen</span>,
  Grid3X3: () => <span data-testid="grid-icon">Grid</span>,
  List: () => <span data-testid="list-icon">List</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  X: () => <span data-testid="x-icon">X</span>,
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

jest.mock('@/components/collection/CollectionDraftBanner', () => ({
  CollectionDraftBanner: ({ className }: { className?: string }) => {
    const { useCollectionStore } = jest.requireMock(
      '@/stores/collection-store'
    );
    const { hasUnsavedDraft } = useCollectionStore();
    if (!hasUnsavedDraft()) return null;
    return (
      <div data-testid="draft-banner" className={className}>
        Draft banner shown
      </div>
    );
  },
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
    onDelete,
    onFavorite,
    onShare,
    onAddRecipes,
    onManageCollaborators,
    onDuplicate,
  }: {
    collections: Array<{ collectionId: number; name: string }>;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    emptyMessage?: string;
    onCollectionClick?: (collection: { collectionId: number }) => void;
    onEdit?: (collection: { collectionId: number }) => void;
    onDelete?: (collection: { collectionId: number; name: string }) => void;
    onFavorite?: (collection: { collectionId: number }) => void;
    onShare?: (collection: { collectionId: number }) => void;
    onAddRecipes?: (collection: { collectionId: number }) => void;
    onManageCollaborators?: (collection: { collectionId: number }) => void;
    onDuplicate?: (collection: { collectionId: number }) => void;
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
    return (
      <div data-testid="collection-browse-grid">
        {collections.map(collection => (
          <div
            key={collection.collectionId}
            data-testid={`collection-card-${collection.collectionId}`}
          >
            <span onClick={() => onCollectionClick?.(collection)}>
              {collection.name}
            </span>
            <button onClick={() => onEdit?.(collection)}>Edit</button>
            <button
              onClick={() =>
                onDelete?.(collection as { collectionId: number; name: string })
              }
            >
              Delete
            </button>
            <button onClick={() => onFavorite?.(collection)}>Favorite</button>
            <button onClick={() => onShare?.(collection)}>Share</button>
            <button onClick={() => onAddRecipes?.(collection)}>
              Add Recipes
            </button>
            <button onClick={() => onManageCollaborators?.(collection)}>
              Manage Collaborators
            </button>
            <button onClick={() => onDuplicate?.(collection)}>Duplicate</button>
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

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="dialog" role="dialog">
        {children}
        <button
          data-testid="dialog-backdrop"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    ) : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

// Import the mocked hooks
import {
  useMyCollections,
  useDeleteCollection,
} from '@/hooks/recipe-management';

// Sample collection data
const createMockCollection = (
  overrides: Partial<CollectionDto> = {}
): CollectionDto => ({
  collectionId: 1,
  userId: 'user-123',
  name: 'Test Collection',
  description: 'A test collection for recipes',
  visibility: 'PRIVATE' as CollectionVisibility,
  collaborationMode: 'VIEW_ONLY' as CollaborationMode,
  recipeCount: 5,
  collaboratorCount: 0,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
  ...overrides,
});

const mockCollections: CollectionDto[] = [
  createMockCollection({ collectionId: 1, name: 'Dinner Recipes' }),
  createMockCollection({
    collectionId: 2,
    name: 'Quick Meals',
    visibility: 'PUBLIC' as CollectionVisibility,
  }),
  createMockCollection({
    collectionId: 3,
    name: 'Holiday Favorites',
    collaboratorCount: 3,
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

describe('MyCollectionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasUnsavedDraft.mockReturnValue(false);
    mockDeleteMutateAsync.mockResolvedValue(undefined);

    // Default mock for useMyCollections
    (useMyCollections as jest.Mock).mockReturnValue({
      data: mockPageData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    // Default mock for useDeleteCollection
    (useDeleteCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('renders the page with header and create button', () => {
      render(<MyCollectionsPage />);

      expect(screen.getByText('My Collections')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /create collection/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
    });

    it('displays collection count in subtitle', () => {
      render(<MyCollectionsPage />);

      expect(screen.getByText('3 collections')).toBeInTheDocument();
    });

    it('displays singular "collection" when only one', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
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

      render(<MyCollectionsPage />);

      expect(screen.getByText('1 collection')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(
        screen.getByText('Loading your collections...')
      ).toBeInTheDocument();
      expect(screen.getByTestId('collection-grid-loading')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const error = new Error('Failed to load collections');
      (useMyCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByTestId('collection-grid-error')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load collections')
      ).toBeInTheDocument();
    });

    it('shows empty state when no collections exist', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByText('No collections yet')).toBeInTheDocument();
      expect(
        screen.getByText(/haven't created any collections yet/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /create your first collection/i })
      ).toBeInTheDocument();
    });

    it('renders collection grid by default', () => {
      render(<MyCollectionsPage />);

      expect(screen.getByTestId('collection-browse-grid')).toBeInTheDocument();
    });

    it('shows filters sidebar when collections exist', () => {
      render(<MyCollectionsPage />);

      expect(screen.getByTestId('collection-filters')).toBeInTheDocument();
    });

    it('hides filters sidebar when no collections exist', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(
        screen.queryByTestId('collection-filters')
      ).not.toBeInTheDocument();
    });
  });

  describe('Draft Banner', () => {
    it('does not show draft banner when no draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(false);

      render(<MyCollectionsPage />);

      expect(screen.queryByTestId('draft-banner')).not.toBeInTheDocument();
    });

    it('shows draft banner when draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(true);

      render(<MyCollectionsPage />);

      expect(screen.getByTestId('draft-banner')).toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('defaults to grid view', () => {
      render(<MyCollectionsPage />);

      const gridButton = screen.getByTestId('view-toggle-grid');
      expect(gridButton).toHaveAttribute('data-active', 'true');
    });

    it('switches to list view when list button clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      await user.click(screen.getByTestId('view-toggle-list'));

      // Grid should still render (list mode uses same component in this page)
      expect(screen.getByTestId('collection-browse-grid')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('updates collection count when filters change', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Dinner');

      // The filter count should update based on client-side filtering
      await waitFor(() => {
        expect(screen.getByTestId('filter-result-count')).toHaveTextContent(
          '1 results'
        );
      });
    });

    it('shows "No collections match your filters" when filters exclude all', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

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
        })
      );

      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyCollectionsPage />);

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

      render(<MyCollectionsPage />);

      const collectionName = screen.getByText('Dinner Recipes');
      await user.click(collectionName);

      expect(mockPush).toHaveBeenCalledWith('/collections/1');
    });

    it('navigates to edit page when Edit is clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(mockPush).toHaveBeenCalledWith('/collections/1/edit');
    });

    it('shows delete confirmation dialog when Delete is clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent(
        'Delete Collection'
      );
    });

    it('navigates to add recipes page when clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const addRecipesButtons = screen.getAllByText('Add Recipes');
      await user.click(addRecipesButtons[0]);

      expect(mockPush).toHaveBeenCalledWith('/collections/1/edit?tab=recipes');
    });

    it('navigates to manage collaborators page when clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const collaboratorButtons = screen.getAllByText('Manage Collaborators');
      await user.click(collaboratorButtons[0]);

      expect(mockPush).toHaveBeenCalledWith(
        '/collections/1/edit?tab=collaborators'
      );
    });

    it('shows coming soon toast for favorite action', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const favoriteButtons = screen.getAllByText('Favorite');
      await user.click(favoriteButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Favorite functionality will be available soon.'
      );
    });

    it('shows coming soon toast for share action', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const shareButtons = screen.getAllByText('Share');
      await user.click(shareButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Share functionality will be available soon.'
      );
    });

    it('shows coming soon toast for duplicate action', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      const duplicateButtons = screen.getAllByText('Duplicate');
      await user.click(duplicateButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Duplicate functionality will be available soon.'
      );
    });
  });

  describe('Delete Flow', () => {
    it('deletes collection when confirmed', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      // Click delete on first collection
      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      // Confirm deletion
      const confirmButton = within(
        screen.getByTestId('dialog-footer')
      ).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        'Collection "Dinner Recipes" has been deleted.'
      );

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('cancels delete when Cancel is clicked', async () => {
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      // Click delete
      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      // Cancel
      const cancelButton = within(
        screen.getByTestId('dialog-footer')
      ).getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      expect(mockDeleteMutateAsync).not.toHaveBeenCalled();
    });

    it('shows error toast when delete fails', async () => {
      mockDeleteMutateAsync.mockRejectedValue(new Error('Delete failed'));
      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      // Click delete
      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      // Confirm
      const confirmButton = within(
        screen.getByTestId('dialog-footer')
      ).getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith(
          'Failed to delete collection. Please try again.'
        );
      });
    });
  });

  describe('Pagination', () => {
    it('shows pagination when multiple pages exist', () => {
      const manyCollections = Array.from({ length: 25 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
        })
      );

      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      const manyCollections = Array.from({ length: 25 }, (_, i) =>
        createMockCollection({
          collectionId: i + 1,
          name: `Collection ${i + 1}`,
        })
      );

      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyCollections, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      await user.click(screen.getByTestId('next-page'));

      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('calls refetch when retry button is clicked', async () => {
      const error = new Error('Network error');
      (useMyCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyCollectionsPage />);

      await user.click(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('handles string error message', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'String error message',
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByText('String error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<MyCollectionsPage />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<MyCollectionsPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('My Collections');
    });

    it('create collection link is accessible', () => {
      render(<MyCollectionsPage />);

      const createLink = screen.getByRole('link', {
        name: /create collection/i,
      });
      expect(createLink).toHaveAttribute('href', '/collections/create');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined data content gracefully', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: { content: undefined },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByText('No collections yet')).toBeInTheDocument();
    });

    it('handles null data gracefully', () => {
      (useMyCollections as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByText('No collections yet')).toBeInTheDocument();
    });

    it('handles collections without optional fields', () => {
      const minimalCollection: CollectionDto = {
        collectionId: 999,
        userId: 'user-1',
        name: 'Minimal Collection',
        visibility: 'PRIVATE' as CollectionVisibility,
        collaborationMode: 'VIEW_ONLY' as CollaborationMode,
        recipeCount: 0,
        collaboratorCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      (useMyCollections as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [minimalCollection] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyCollectionsPage />);

      expect(screen.getByText('Minimal Collection')).toBeInTheDocument();
    });
  });
});
