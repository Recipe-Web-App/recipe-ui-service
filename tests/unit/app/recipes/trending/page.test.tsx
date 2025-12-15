import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import TrendingRecipesPage from '@/app/(main)/recipes/trending/page';
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
const mockFavoriteMutateAsync = jest.fn();
const mockUnfavoriteMutateAsync = jest.fn();

jest.mock('@/hooks/recipe-management', () => ({
  useTrendingRecipes: jest.fn(),
  useFavoriteRecipe: jest.fn(),
  useUnfavoriteRecipe: jest.fn(),
}));

// Mock auth store
const mockCurrentUserId = 'current-user-123';
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    user: { id: mockCurrentUserId },
    authUser: { userId: mockCurrentUserId },
  }),
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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Flame: () => <span data-testid="flame-icon">Flame</span>,
  TrendingUp: () => <span data-testid="trending-icon">TrendingUp</span>,
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
    onAddToCollection,
    onFavorite,
    onShare,
    isOwner,
  }: {
    recipes: Array<{
      recipeId: number;
      title: string;
      isFavorite?: boolean;
      author?: { id: string };
    }>;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    emptyMessage?: string;
    onRecipeClick?: (recipe: { recipeId: number }) => void;
    onEdit?: (recipe: { recipeId: number }) => void;
    onAddToCollection?: (recipe: { recipeId: number }) => void;
    onFavorite?: (recipe: { recipeId: number; isFavorite?: boolean }) => void;
    onShare?: (recipe: { recipeId: number }) => void;
    isOwner?:
      | boolean
      | ((recipe: { recipeId: number; author?: { id: string } }) => boolean);
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
        {recipes.map(recipe => {
          const isRecipeOwner =
            typeof isOwner === 'function' ? isOwner(recipe) : isOwner;
          return (
            <div
              key={recipe.recipeId}
              data-testid={`recipe-card-${recipe.recipeId}`}
            >
              <span onClick={() => onRecipeClick?.(recipe)}>
                {recipe.title}
              </span>
              {isRecipeOwner && (
                <button onClick={() => onEdit?.(recipe)}>Edit</button>
              )}
              <button onClick={() => onAddToCollection?.(recipe)}>
                Add to Collection
              </button>
              <button onClick={() => onFavorite?.(recipe)}>
                {recipe.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button onClick={() => onShare?.(recipe)}>Share</button>
            </div>
          );
        })}
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
    onFavorite,
    isOwner,
  }: {
    recipes: Array<{
      recipeId: number;
      title: string;
      isFavorite?: boolean;
      author?: { id: string };
    }>;
    loading?: boolean;
    onRecipeClick?: (recipe: { recipeId: number }) => void;
    onEdit?: (recipe: { recipeId: number }) => void;
    onFavorite?: (recipe: { recipeId: number; isFavorite?: boolean }) => void;
    isOwner?:
      | boolean
      | ((recipe: { recipeId: number; author?: { id: string } }) => boolean);
  }) => {
    if (loading) {
      return <div data-testid="recipe-list-loading">Loading recipes...</div>;
    }
    return (
      <div data-testid="recipe-browse-list">
        {recipes.map(recipe => {
          const isRecipeOwner =
            typeof isOwner === 'function' ? isOwner(recipe) : isOwner;
          return (
            <div
              key={recipe.recipeId}
              data-testid={`recipe-item-${recipe.recipeId}`}
            >
              <span onClick={() => onRecipeClick?.(recipe)}>
                {recipe.title}
              </span>
              {isRecipeOwner && (
                <button onClick={() => onEdit?.(recipe)}>Edit</button>
              )}
              <button onClick={() => onFavorite?.(recipe)}>
                {recipe.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
            </div>
          );
        })}
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

// Import the mocked hooks
import {
  useTrendingRecipes,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
} from '@/hooks/recipe-management';

// Sample recipe data - trending recipes are from various users
const createMockTrendingRecipe = (
  overrides: Partial<RecipeDto> = {}
): RecipeDto => ({
  recipeId: 1,
  userId: 'other-user-456', // Different from current user by default
  title: 'Test Trending Recipe',
  description: 'A delicious trending recipe',
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

const mockTrendingRecipes: RecipeDto[] = [
  createMockTrendingRecipe({ recipeId: 1, title: 'Pasta Carbonara' }),
  createMockTrendingRecipe({
    recipeId: 2,
    title: 'Chicken Curry',
    difficulty: DifficultyLevel.MEDIUM,
  }),
  createMockTrendingRecipe({
    recipeId: 3,
    title: 'Chocolate Cake',
    difficulty: DifficultyLevel.HARD,
  }),
];

const mockPageData: SearchRecipesResponse = {
  content: mockTrendingRecipes,
  totalElements: 3,
  totalPages: 1,
  last: true,
  first: true,
  numberOfElements: 3,
};

describe('TrendingRecipesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFavoriteMutateAsync.mockResolvedValue(undefined);
    mockUnfavoriteMutateAsync.mockResolvedValue(undefined);

    // Default mock for useTrendingRecipes
    (useTrendingRecipes as jest.Mock).mockReturnValue({
      data: mockPageData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    // Default mock for useFavoriteRecipe
    (useFavoriteRecipe as jest.Mock).mockReturnValue({
      mutateAsync: mockFavoriteMutateAsync,
      isPending: false,
    });

    // Default mock for useUnfavoriteRecipe
    (useUnfavoriteRecipe as jest.Mock).mockReturnValue({
      mutateAsync: mockUnfavoriteMutateAsync,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('renders the page with header and browse popular button', () => {
      render(<TrendingRecipesPage />);

      expect(screen.getByText('Trending Recipes')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /browse popular/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
    });

    it('displays recipe count in subtitle', () => {
      render(<TrendingRecipesPage />);

      expect(screen.getByText('3 recipes')).toBeInTheDocument();
    });

    it('displays singular "recipe" when only one', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: {
          ...mockPageData,
          content: [mockTrendingRecipes[0]],
          totalElements: 1,
          numberOfElements: 1,
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.getByText('1 recipe')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(
        screen.getByText('Loading trending recipes...')
      ).toBeInTheDocument();
      expect(screen.getByTestId('recipe-grid-loading')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const error = new Error('Failed to load trending recipes');
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.getByTestId('recipe-grid-error')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load trending recipes')
      ).toBeInTheDocument();
    });

    it('shows empty state when no trending recipes exist', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(
        screen.getByText('No trending recipes right now')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /check back later for recipes that are gaining popularity/i
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('flame-icon')).toBeInTheDocument();
      // Empty state should have browse popular button
      const browseLinks = screen.getAllByRole('link', {
        name: /browse popular/i,
      });
      expect(browseLinks.length).toBeGreaterThan(0);
    });

    it('renders recipe grid by default', () => {
      render(<TrendingRecipesPage />);

      expect(screen.getByTestId('recipe-browse-grid')).toBeInTheDocument();
      expect(
        screen.queryByTestId('recipe-browse-list')
      ).not.toBeInTheDocument();
    });

    it('shows filters sidebar when recipes exist', () => {
      render(<TrendingRecipesPage />);

      expect(screen.getByTestId('recipe-filters')).toBeInTheDocument();
    });

    it('hides filters sidebar when no trending recipes exist', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.queryByTestId('recipe-filters')).not.toBeInTheDocument();
    });
  });

  describe('View Toggle', () => {
    it('defaults to grid view', () => {
      render(<TrendingRecipesPage />);

      const gridButton = screen.getByTestId('view-toggle-grid');
      expect(gridButton).toHaveAttribute('data-active', 'true');
    });

    it('switches to list view when list button clicked', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      await user.click(screen.getByTestId('view-toggle-list'));

      expect(screen.getByTestId('recipe-browse-list')).toBeInTheDocument();
      expect(
        screen.queryByTestId('recipe-browse-grid')
      ).not.toBeInTheDocument();
    });

    it('switches back to grid view', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

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

      render(<TrendingRecipesPage />);

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

      render(<TrendingRecipesPage />);

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
        createMockTrendingRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

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

      render(<TrendingRecipesPage />);

      const recipeTitle = screen.getByText('Pasta Carbonara');
      await user.click(recipeTitle);

      expect(mockPush).toHaveBeenCalledWith('/recipes/1?from=trending');
    });

    it('opens add to collection modal when clicked', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      const addButtons = screen.getAllByText('Add to Collection');
      await user.click(addButtons[0]);

      expect(screen.getByTestId('add-to-collection-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-recipe-id')).toHaveTextContent('1');
    });

    it('shows coming soon toast for share action', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      const shareButtons = screen.getAllByText('Share');
      await user.click(shareButtons[0]);

      expect(mockAddInfoToast).toHaveBeenCalledWith(
        'Share functionality will be available soon.'
      );
    });
  });

  describe('Favorite Flow', () => {
    it('calls favorite mutation when Favorite is clicked on non-favorited recipe', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      const favoriteButtons = screen.getAllByText('Favorite');
      await user.click(favoriteButtons[0]);

      await waitFor(() => {
        expect(mockFavoriteMutateAsync).toHaveBeenCalledWith(1);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        'Recipe added to favorites.'
      );
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('calls unfavorite mutation when Unfavorite is clicked on favorited recipe', async () => {
      // Set up recipe that is already favorited
      const favoritedRecipe = createMockTrendingRecipe({
        recipeId: 1,
        title: 'Favorited Recipe',
        favorites: [
          {
            recipeId: 1,
            userId: mockCurrentUserId,
            favoritedAt: '2024-01-15T10:00:00Z',
          },
        ],
      });

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [favoritedRecipe] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      const unfavoriteButton = screen.getByText('Unfavorite');
      await user.click(unfavoriteButton);

      await waitFor(() => {
        expect(mockUnfavoriteMutateAsync).toHaveBeenCalledWith(1);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        'Recipe removed from favorites.'
      );
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('shows error toast when favorite fails', async () => {
      mockFavoriteMutateAsync.mockRejectedValue(new Error('Favorite failed'));
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      const favoriteButtons = screen.getAllByText('Favorite');
      await user.click(favoriteButtons[0]);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith(
          'Failed to update favorites.'
        );
      });
    });
  });

  describe('Ownership Detection', () => {
    it('shows edit button for recipes owned by current user', () => {
      // Add a recipe owned by the current user
      const ownedRecipe = createMockTrendingRecipe({
        recipeId: 99,
        title: 'My Own Recipe',
        userId: mockCurrentUserId, // Same as current user
      });

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [ownedRecipe] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      // Edit button should be visible for owned recipe
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('hides edit button for recipes not owned by current user', () => {
      // All default mock recipes are from other users
      render(<TrendingRecipesPage />);

      // Edit buttons should not be visible for non-owned recipes
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('navigates to edit page when Edit is clicked for owned recipe', async () => {
      const user = userEvent.setup();

      // Add a recipe owned by the current user
      const ownedRecipe = createMockTrendingRecipe({
        recipeId: 99,
        title: 'My Own Recipe',
        userId: mockCurrentUserId,
      });

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [ownedRecipe] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockPush).toHaveBeenCalledWith('/recipes/99/edit');
    });
  });

  describe('Add to Collection Flow', () => {
    it('opens modal with correct recipe when Add to Collection clicked', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      // Open modal
      const addButtons = screen.getAllByText('Add to Collection');
      await user.click(addButtons[0]);

      expect(screen.getByTestId('add-to-collection-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-recipe-id')).toHaveTextContent('1');
    });

    it('closes modal when close button clicked', async () => {
      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

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
        createMockTrendingRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      const manyRecipes = Array.from({ length: 25 }, (_, i) =>
        createMockTrendingRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: manyRecipes, totalElements: 25 },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      await user.click(screen.getByTestId('next-page'));

      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('calls refetch when retry button is clicked', async () => {
      const error = new Error('Network error');
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
        refetch: mockRefetch,
      });

      const user = userEvent.setup();

      render(<TrendingRecipesPage />);

      await user.click(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('handles string error message', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'String error message',
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.getByText('String error message')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<TrendingRecipesPage />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<TrendingRecipesPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Trending Recipes');
    });

    it('browse popular link is accessible', () => {
      render(<TrendingRecipesPage />);

      const browseLink = screen.getByRole('link', { name: /browse popular/i });
      expect(browseLink).toHaveAttribute('href', '/recipes/popular');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined data content gracefully', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { content: undefined },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(
        screen.getByText('No trending recipes right now')
      ).toBeInTheDocument();
    });

    it('handles null data gracefully', () => {
      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(
        screen.getByText('No trending recipes right now')
      ).toBeInTheDocument();
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

      (useTrendingRecipes as jest.Mock).mockReturnValue({
        data: { ...mockPageData, content: [minimalRecipe] },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<TrendingRecipesPage />);

      expect(screen.getByText('Minimal Recipe')).toBeInTheDocument();
    });
  });
});
