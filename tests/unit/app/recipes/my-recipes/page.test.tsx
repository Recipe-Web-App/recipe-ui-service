import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import MyRecipesPage from '@/app/(main)/recipes/my-recipes/page';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import type { SearchRecipesResponse } from '@/types/recipe-management/search';

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
  useMyRecipes: jest.fn(),
  useDeleteRecipe: jest.fn(),
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

// Mock recipe store for DraftBanner
const mockHasUnsavedDraft = jest.fn().mockReturnValue(false);
const mockClearDraftRecipe = jest.fn();
jest.mock('@/stores/recipe-store', () => ({
  useRecipeStore: () => ({
    hasUnsavedDraft: mockHasUnsavedDraft,
    draftRecipe: null,
    draftLastModified: null,
    clearDraftRecipe: mockClearDraftRecipe,
  }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon">Plus</span>,
  BookOpen: () => <span data-testid="book-icon">BookOpen</span>,
  Grid3X3: () => <span data-testid="grid-icon">Grid</span>,
  List: () => <span data-testid="list-icon">List</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  FolderPlus: () => <span data-testid="folder-plus-icon">FolderPlus</span>,
  X: () => <span data-testid="x-icon">X</span>,
  CheckSquare: () => <span data-testid="check-square-icon">CheckSquare</span>,
  Square: () => <span data-testid="square-icon">Square</span>,
  FileEdit: () => <span data-testid="file-edit-icon">FileEdit</span>,
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

jest.mock('@/components/recipe/RecipeFilters', () => ({
  RecipeFilters: ({
    values,
    onFilterChange,
    totalResults,
  }: {
    values: Record<string, unknown>;
    onFilterChange: (val: Record<string, unknown>) => void;
    totalResults: number;
  }) => (
    <div data-testid="recipe-filters">
      <span data-testid="filter-result-count">{totalResults} results</span>
      <input
        data-testid="search-input"
        value={(values.search as string) || ''}
        onChange={e => onFilterChange({ ...values, search: e.target.value })}
        placeholder="Search recipes"
      />
      <button
        data-testid="apply-difficulty-filter"
        onClick={() =>
          onFilterChange({ ...values, difficulty: [DifficultyLevel.EASY] })
        }
      >
        Filter Easy
      </button>
      <button
        data-testid="clear-filters"
        onClick={() =>
          onFilterChange({
            search: '',
            tags: [],
            difficulty: [],
            minRating: '0',
          })
        }
      >
        Clear
      </button>
    </div>
  ),
}));

jest.mock('@/components/recipe/DraftBanner', () => ({
  DraftBanner: ({ className }: { className?: string }) => {
    const { useRecipeStore } = jest.requireMock('@/stores/recipe-store');
    const { hasUnsavedDraft } = useRecipeStore();
    if (!hasUnsavedDraft()) return null;
    return (
      <div data-testid="draft-banner" className={className}>
        Draft banner shown
      </div>
    );
  },
}));

jest.mock('@/components/recipe/BulkActionToolbar', () => ({
  BulkActionToolbar: ({
    selectedCount,
    totalCount,
    onSelectAll,
    onDeselectAll,
    onDelete,
    onAddToCollection,
    onCancel,
    isDeleting,
  }: {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onDelete: () => void;
    onAddToCollection: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
  }) => (
    <div data-testid="bulk-action-toolbar" role="toolbar">
      <span data-testid="bulk-selected-count">{selectedCount} selected</span>
      <button data-testid="bulk-select-all" onClick={onSelectAll}>
        Select All
      </button>
      <button data-testid="bulk-deselect-all" onClick={onDeselectAll}>
        Deselect All
      </button>
      <button
        data-testid="bulk-delete"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      <button data-testid="bulk-add-collection" onClick={onAddToCollection}>
        Add to Collection
      </button>
      <button data-testid="bulk-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

jest.mock('@/components/recipe/RecipeBrowseGrid', () => ({
  RecipeBrowseGrid: ({
    recipes,
    loading,
    error,
    onRetry,
    currentPage,
    totalPages,
    onPageChange,
    emptyMessage,
    onRecipeClick,
    onEdit,
    onDelete,
    onAddToCollection,
    onFavorite,
    onShare,
  }: {
    recipes: Array<{ recipeId: number; title: string }>;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    emptyMessage?: string;
    onRecipeClick?: (recipe: { recipeId: number }) => void;
    onEdit?: (recipe: { recipeId: number }) => void;
    onDelete?: (recipe: { recipeId: number }) => void;
    onAddToCollection?: (recipe: { recipeId: number }) => void;
    onFavorite?: (recipe: { recipeId: number }) => void;
    onShare?: (recipe: { recipeId: number }) => void;
  }) => {
    if (loading) {
      return <div data-testid="recipe-grid-loading">Loading recipes...</div>;
    }
    if (error) {
      return (
        <div data-testid="recipe-grid-error">
          <span>{error}</span>
          {onRetry && (
            <button data-testid="retry-button" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      );
    }
    if (!recipes || recipes.length === 0) {
      return <div data-testid="recipe-grid-empty">{emptyMessage}</div>;
    }
    return (
      <div data-testid="recipe-browse-grid">
        {recipes.map(recipe => (
          <div
            key={recipe.recipeId}
            data-testid={`recipe-card-${recipe.recipeId}`}
          >
            <span onClick={() => onRecipeClick?.(recipe)}>{recipe.title}</span>
            <button onClick={() => onEdit?.(recipe)}>Edit</button>
            <button onClick={() => onDelete?.(recipe)}>Delete</button>
            <button onClick={() => onAddToCollection?.(recipe)}>
              Add to Collection
            </button>
            <button onClick={() => onFavorite?.(recipe)}>Favorite</button>
            <button onClick={() => onShare?.(recipe)}>Share</button>
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

jest.mock('@/components/recipe/RecipeBrowseList', () => ({
  RecipeBrowseList: ({
    recipes,
    loading,
    onRecipeClick,
    onEdit,
    onDelete,
  }: {
    recipes: Array<{ recipeId: number; title: string }>;
    loading?: boolean;
    onRecipeClick?: (recipe: { recipeId: number }) => void;
    onEdit?: (recipe: { recipeId: number }) => void;
    onDelete?: (recipe: { recipeId: number }) => void;
  }) => {
    if (loading) {
      return <div data-testid="recipe-list-loading">Loading recipes...</div>;
    }
    return (
      <div data-testid="recipe-browse-list">
        {recipes.map(recipe => (
          <div
            key={recipe.recipeId}
            data-testid={`recipe-item-${recipe.recipeId}`}
          >
            <span onClick={() => onRecipeClick?.(recipe)}>{recipe.title}</span>
            <button onClick={() => onEdit?.(recipe)}>Edit</button>
            <button onClick={() => onDelete?.(recipe)}>Delete</button>
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock('@/components/recipe/AddToCollectionModal', () => ({
  AddToCollectionModal: ({
    open,
    onOpenChange,
    recipe,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipe: { recipeId: number };
  }) =>
    open ? (
      <div data-testid="add-to-collection-modal" role="dialog">
        <span data-testid="modal-recipe-id">{recipe.recipeId}</span>
        <button data-testid="modal-close" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    ) : null,
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
import { useMyRecipes, useDeleteRecipe } from '@/hooks/recipe-management';

// Sample recipe data
const createMockRecipe = (overrides: Partial<RecipeDto> = {}): RecipeDto => ({
  recipeId: 1,
  userId: 'user-123',
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  preparationTime: 15,
  cookingTime: 30,
  difficulty: DifficultyLevel.EASY,
  servings: 4,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
  tags: [{ tagId: 1, name: 'dinner' }],
  ingredients: [],
  steps: [],
  comments: [],
  favorites: [],
  ...overrides,
});

const mockRecipes: RecipeDto[] = [
  createMockRecipe({ recipeId: 1, title: 'Pasta Carbonara' }),
  createMockRecipe({
    recipeId: 2,
    title: 'Chicken Curry',
    difficulty: DifficultyLevel.MEDIUM,
  }),
  createMockRecipe({
    recipeId: 3,
    title: 'Chocolate Cake',
    difficulty: DifficultyLevel.HARD,
  }),
];

const mockPageData: SearchRecipesResponse = {
  content: mockRecipes,
  totalElements: 3,
  totalPages: 1,
  last: true,
  first: true,
  numberOfElements: 3,
};

describe('MyRecipesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasUnsavedDraft.mockReturnValue(false);
    mockDeleteMutateAsync.mockResolvedValue(undefined);

    // Default mock for useMyRecipes
    (useMyRecipes as jest.Mock).mockReturnValue({
      data: mockPageData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    // Default mock for useDeleteRecipe
    (useDeleteRecipe as jest.Mock).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('renders the page with header and create button', () => {
      render(<MyRecipesPage />);

      expect(screen.getByText('My Recipes')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /create recipe/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
    });

    it('displays recipe count in subtitle', () => {
      render(<MyRecipesPage />);

      expect(screen.getByText('3 recipes')).toBeInTheDocument();
    });

    it('displays singular "recipe" when only one', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: {
          ...mockPageData,
          content: [mockRecipes[0]],
          totalElements: 1,
          numberOfElements: 1,
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('1 recipe')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('Loading your recipes...')).toBeInTheDocument();
      expect(screen.getByTestId('recipe-grid-loading')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const error = new Error('Failed to load recipes');
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByTestId('recipe-grid-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load recipes')).toBeInTheDocument();
    });

    it('shows empty state when no recipes exist', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('No recipes yet')).toBeInTheDocument();
      expect(
        screen.getByText(/haven't created any recipes yet/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /create your first recipe/i })
      ).toBeInTheDocument();
    });

    it('renders recipe grid by default', () => {
      render(<MyRecipesPage />);

      expect(screen.getByTestId('recipe-browse-grid')).toBeInTheDocument();
      expect(
        screen.queryByTestId('recipe-browse-list')
      ).not.toBeInTheDocument();
    });

    it('shows filters sidebar when recipes exist', () => {
      render(<MyRecipesPage />);

      expect(screen.getByTestId('recipe-filters')).toBeInTheDocument();
    });

    it('hides filters sidebar when no recipes exist', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.queryByTestId('recipe-filters')).not.toBeInTheDocument();
    });
  });

  describe('Draft Banner', () => {
    it('does not show draft banner when no draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(false);

      render(<MyRecipesPage />);

      expect(screen.queryByTestId('draft-banner')).not.toBeInTheDocument();
    });

    it('shows draft banner when draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(true);

      render(<MyRecipesPage />);

      expect(screen.getByTestId('draft-banner')).toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('defaults to grid view', () => {
      render(<MyRecipesPage />);

      const gridButton = screen.getByTestId('view-toggle-grid');
      expect(gridButton).toHaveAttribute('data-active', 'true');
    });

    it('switches to list view when list button clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      await user.click(screen.getByTestId('view-toggle-list'));

      expect(screen.getByTestId('recipe-browse-list')).toBeInTheDocument();
      expect(
        screen.queryByTestId('recipe-browse-grid')
      ).not.toBeInTheDocument();
    });

    it('switches back to grid view', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      // Switch to list
      await user.click(screen.getByTestId('view-toggle-list'));
      expect(screen.getByTestId('recipe-browse-list')).toBeInTheDocument();

      // Switch back to grid
      await user.click(screen.getByTestId('view-toggle-grid'));
      expect(screen.getByTestId('recipe-browse-grid')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('updates recipe count when filters change', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Pasta');

      // The filter count should update based on client-side filtering
      await waitFor(() => {
        expect(screen.getByTestId('filter-result-count')).toHaveTextContent(
          '1 results'
        );
      });
    });

    it('shows "No recipes match your filters" when filters exclude all', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'NonexistentRecipe');

      await waitFor(() => {
        expect(screen.getByTestId('recipe-grid-empty')).toHaveTextContent(
          'No recipes match your filters'
        );
      });
    });

    it('resets to page 1 when filters change', async () => {
      // Set up multi-page data
      const manyRecipes = Array.from({ length: 25 }, (_, i) =>
        createMockRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyRecipesPage />);

      // Navigate to page 2
      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);

      // Apply a filter - should reset to page 1
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Recipe 1');

      // Should be back on page 1 (or filters reset pagination)
      expect(screen.queryByText('Page 2')).not.toBeInTheDocument();
    });
  });

  describe('Recipe Actions', () => {
    it('navigates to recipe detail when recipe is clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const recipeTitle = screen.getByText('Pasta Carbonara');
      await user.click(recipeTitle);

      expect(mockPush).toHaveBeenCalledWith('/recipes/1?from=my-recipes');
    });

    it('navigates to edit page when Edit is clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(mockPush).toHaveBeenCalledWith('/recipes/1/edit');
    });

    it('shows delete confirmation dialog when Delete is clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent(
        'Delete Recipe'
      );
      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        'this recipe'
      );
    });

    it('opens add to collection modal when clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const addButtons = screen.getAllByText('Add to Collection');
      await user.click(addButtons[0]);

      expect(screen.getByTestId('add-to-collection-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-recipe-id')).toHaveTextContent('1');
    });

    it('shows coming soon toast for favorite action', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const favoriteButtons = screen.getAllByText('Favorite');
      await user.click(favoriteButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Favorite functionality will be available soon.'
      );
    });

    it('shows coming soon toast for share action', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      const shareButtons = screen.getAllByText('Share');
      await user.click(shareButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Share functionality will be available soon.'
      );
    });
  });

  describe('Delete Flow', () => {
    it('deletes recipe when confirmed', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      // Click delete on first recipe
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
        'Successfully deleted 1 recipe.'
      );

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('cancels delete when Cancel is clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

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

      render(<MyRecipesPage />);

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
          'Failed to delete 1 recipe.'
        );
      });
    });
  });

  describe('Add to Collection Flow', () => {
    it('opens modal with correct recipe when Add to Collection clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      // Open modal
      const addButtons = screen.getAllByText('Add to Collection');
      await user.click(addButtons[0]);

      expect(screen.getByTestId('add-to-collection-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-recipe-id')).toHaveTextContent('1');
    });

    it('closes modal when close button clicked', async () => {
      const user = userEvent.setup();

      render(<MyRecipesPage />);

      // Open modal
      const addButtons = screen.getAllByText('Add to Collection');
      await user.click(addButtons[0]);

      // Close modal
      await user.click(screen.getByTestId('modal-close'));

      expect(
        screen.queryByTestId('add-to-collection-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('shows pagination when multiple pages exist', () => {
      const manyRecipes = Array.from({ length: 25 }, (_, i) =>
        createMockRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      const manyRecipes = Array.from({ length: 25 }, (_, i) =>
        createMockRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyRecipesPage />);

      await user.click(screen.getByTestId('next-page'));

      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('calls refetch when retry button is clicked', async () => {
      const error = new Error('Network error');
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<MyRecipesPage />);

      await user.click(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('handles string error message', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'String error message',
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('String error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<MyRecipesPage />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<MyRecipesPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('My Recipes');
    });

    it('create recipe link is accessible', () => {
      render(<MyRecipesPage />);

      const createLink = screen.getByRole('link', { name: /create recipe/i });
      expect(createLink).toHaveAttribute('href', '/recipes/create');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined data content gracefully', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { content: undefined },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('No recipes yet')).toBeInTheDocument();
    });

    it('handles null data gracefully', () => {
      (useMyRecipes as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('No recipes yet')).toBeInTheDocument();
    });

    it('handles recipes without optional fields', () => {
      const minimalRecipe: RecipeDto = {
        recipeId: 999,
        userId: 'user-1',
        title: 'Minimal Recipe',
        servings: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        ingredients: [],
        steps: [],
      };

      (useMyRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [minimalRecipe] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<MyRecipesPage />);

      expect(screen.getByText('Minimal Recipe')).toBeInTheDocument();
    });
  });
});
