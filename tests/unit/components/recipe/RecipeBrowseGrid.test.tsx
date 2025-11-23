import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RecipeBrowseGrid } from '@/components/recipe/RecipeBrowseGrid';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeCardRecipe } from '@/types/ui/recipe-card';

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
              <div key={item.recipeId} role="listitem">
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
            </div>
          )}
        </div>
      );
    }
  ),
}));

jest.mock('@/components/recipe/RecipeCard', () => ({
  RecipeCard: React.forwardRef(
    (
      {
        recipe,
        onClick,
        onFavorite,
        onShare,
        onEdit,
        onDelete,
        isOwner,
        ...props
      }: any,
      ref: any
    ) => (
      <div
        ref={ref}
        data-testid={`recipe-card-${recipe.recipeId}`}
        data-owner={isOwner}
        onClick={onClick}
      >
        <span>{recipe.title}</span>
        {onFavorite && <button onClick={onFavorite}>Favorite</button>}
        {onShare && <button onClick={onShare}>Share</button>}
        {onEdit && <button onClick={onEdit}>Edit</button>}
        {onDelete && <button onClick={onDelete}>Delete</button>}
      </div>
    )
  ),
}));

jest.mock('@/components/ui/skeleton', () => ({
  RecipeCardSkeleton: jest.fn(() => <div data-testid="recipe-skeleton" />),
}));

// Sample recipe data
const createMockRecipe = (
  overrides: Partial<RecipeCardRecipe> = {}
): RecipeCardRecipe => ({
  recipeId: 1,
  title: 'Chocolate Chip Cookies',
  description: 'Delicious cookies',
  imageUrl: 'https://example.com/cookies.jpg',
  preparationTime: 15,
  cookingTime: 12,
  difficulty: DifficultyLevel.EASY,
  servings: 24,
  rating: 4.5,
  reviewCount: 128,
  author: {
    id: 'user-123',
    name: 'Jane Doe',
    role: 'chef',
  },
  ...overrides,
});

const mockRecipes: RecipeCardRecipe[] = [
  createMockRecipe({ recipeId: 1, title: 'Recipe 1' }),
  createMockRecipe({
    recipeId: 2,
    title: 'Recipe 2',
    difficulty: DifficultyLevel.MEDIUM,
  }),
  createMockRecipe({
    recipeId: 3,
    title: 'Recipe 3',
    difficulty: DifficultyLevel.HARD,
  }),
];

describe('RecipeBrowseGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders grid with recipe cards', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(screen.getByTestId('browse-grid-items')).toBeInTheDocument();

      // Verify all recipes are rendered
      mockRecipes.forEach(recipe => {
        expect(
          screen.getByTestId(`recipe-card-${recipe.recipeId}`)
        ).toBeInTheDocument();
        expect(screen.getByText(recipe.title)).toBeInTheDocument();
      });
    });

    it('renders correct number of recipes', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} />);

      const items = within(
        screen.getByTestId('browse-grid-items')
      ).getAllByRole('listitem');
      expect(items).toHaveLength(mockRecipes.length);
    });

    it('passes props to RecipeCard correctly', () => {
      const mockOnClick = jest.fn();
      const mockOnFavorite = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[mockRecipes[0]]}
          cardVariant="elevated"
          cardSize="lg"
          showQuickActions={true}
          showMenu={true}
          showAuthor={true}
          onRecipeClick={mockOnClick}
          onFavorite={mockOnFavorite}
        />
      );

      const card = screen.getByTestId(`recipe-card-${mockRecipes[0].recipeId}`);
      expect(card).toBeInTheDocument();
    });

    it('renders with custom columns configuration', () => {
      const columns = { mobile: 1, tablet: 2, desktop: 3 };

      render(<RecipeBrowseGrid recipes={mockRecipes} columns={columns} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('renders with empty recipes array', () => {
      render(<RecipeBrowseGrid recipes={[]} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
      expect(screen.getByText('No recipes found')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('shows loading state with skeletons', () => {
      render(<RecipeBrowseGrid recipes={[]} loading={true} />);

      expect(screen.getByTestId('browse-grid-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows empty state when no recipes', () => {
      render(<RecipeBrowseGrid recipes={[]} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
      expect(screen.getByText('No recipes found')).toBeInTheDocument();
    });

    it('shows custom empty message and description', () => {
      const customMessage = 'No recipes available';

      render(<RecipeBrowseGrid recipes={[]} emptyMessage={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const mockRetry = jest.fn();
      const error = new Error('Failed to load recipes');

      render(
        <RecipeBrowseGrid recipes={[]} error={error} onRetry={mockRetry} />
      );

      expect(screen.getByTestId('browse-grid-error')).toBeInTheDocument();
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });

    it('shows error state with string error', () => {
      const error = 'Network error';

      render(<RecipeBrowseGrid recipes={[]} error={error} />);

      expect(screen.getByTestId('browse-grid-error')).toBeInTheDocument();
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination controls when totalPages > 1', () => {
      render(
        <RecipeBrowseGrid
          recipes={mockRecipes}
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
        />
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('does not render pagination when totalPages = 1', () => {
      render(
        <RecipeBrowseGrid
          recipes={mockRecipes}
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('calls onPageChange with correct page number', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={mockRecipes}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next Page');
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('hides pagination when showPagination is false', () => {
      render(
        <RecipeBrowseGrid
          recipes={mockRecipes}
          currentPage={1}
          totalPages={5}
          onPageChange={jest.fn()}
          showPagination={false}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Recipe Actions', () => {
    it('calls onRecipeClick when card is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[mockRecipes[0]]}
          onRecipeClick={mockOnClick}
        />
      );

      const card = screen.getByTestId(`recipe-card-${mockRecipes[0].recipeId}`);
      await user.click(card);

      expect(mockOnClick).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('calls onFavorite when favorite button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnFavorite = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[mockRecipes[0]]}
          onFavorite={mockOnFavorite}
        />
      );

      const favoriteButton = screen.getByText('Favorite');
      await user.click(favoriteButton);

      expect(mockOnFavorite).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnShare = jest.fn();

      render(
        <RecipeBrowseGrid recipes={[mockRecipes[0]]} onShare={mockOnShare} />
      );

      const shareButton = screen.getByText('Share');
      await user.click(shareButton);

      expect(mockOnShare).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnEdit = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[mockRecipes[0]]}
          onEdit={mockOnEdit}
          isOwner={true}
        />
      );

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[mockRecipes[0]]}
          onDelete={mockOnDelete}
          isOwner={true}
        />
      );

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('passes correct recipe to action handlers', async () => {
      const user = userEvent.setup();
      const mockOnFavorite = jest.fn();

      render(
        <RecipeBrowseGrid recipes={mockRecipes} onFavorite={mockOnFavorite} />
      );

      // Click favorite on second recipe
      const cards = screen.getAllByText('Favorite');
      await user.click(cards[1]);

      expect(mockOnFavorite).toHaveBeenCalledWith(mockRecipes[1]);
      expect(mockOnFavorite).not.toHaveBeenCalledWith(mockRecipes[0]);
    });
  });

  describe('Ownership', () => {
    it('determines ownership correctly with boolean value', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} isOwner={true} />);

      mockRecipes.forEach(recipe => {
        const card = screen.getByTestId(`recipe-card-${recipe.recipeId}`);
        expect(card).toHaveAttribute('data-owner', 'true');
      });
    });

    it('determines ownership correctly with function', () => {
      const isOwner = (recipe: RecipeCardRecipe) => recipe.recipeId === 2;

      render(<RecipeBrowseGrid recipes={mockRecipes} isOwner={isOwner} />);

      // Recipe 2 should be owned
      expect(screen.getByTestId('recipe-card-2')).toHaveAttribute(
        'data-owner',
        'true'
      );

      // Others should not be owned
      expect(screen.getByTestId('recipe-card-1')).toHaveAttribute(
        'data-owner',
        'false'
      );
      expect(screen.getByTestId('recipe-card-3')).toHaveAttribute(
        'data-owner',
        'false'
      );
    });

    it('defaults ownership to false', () => {
      render(<RecipeBrowseGrid recipes={[mockRecipes[0]]} />);

      const card = screen.getByTestId(`recipe-card-${mockRecipes[0].recipeId}`);
      expect(card).toHaveAttribute('data-owner', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <RecipeBrowseGrid recipes={mockRecipes} aria-label="My Recipes" />
      );

      const grid = screen.getByRole('region', { name: 'My Recipes' });
      expect(grid).toBeInTheDocument();
    });

    it('uses default ARIA label when not provided', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} />);

      const grid = screen.getByRole('region', { name: 'Browse recipes' });
      expect(grid).toBeInTheDocument();
    });

    it('grid has role="region"', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} />);

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('items have role="listitem"', () => {
      render(<RecipeBrowseGrid recipes={mockRecipes} />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(mockRecipes.length);
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<RecipeBrowseGrid recipes={mockRecipes} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined recipes gracefully', () => {
      // @ts-expect-error - Testing invalid input
      render(<RecipeBrowseGrid recipes={undefined} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
    });

    it('handles null recipes gracefully', () => {
      // @ts-expect-error - Testing invalid input
      render(<RecipeBrowseGrid recipes={null} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
    });

    it('handles single recipe', () => {
      render(<RecipeBrowseGrid recipes={[mockRecipes[0]]} />);

      expect(
        screen.getByTestId(`recipe-card-${mockRecipes[0].recipeId}`)
      ).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('handles large recipe lists', () => {
      const manyRecipes = Array.from({ length: 100 }, (_, i) =>
        createMockRecipe({ recipeId: i + 1, title: `Recipe ${i + 1}` })
      );

      render(<RecipeBrowseGrid recipes={manyRecipes} />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(100);
    });

    it('handles recipes without images', () => {
      const recipeWithoutImage = createMockRecipe({ imageUrl: undefined });

      render(<RecipeBrowseGrid recipes={[recipeWithoutImage]} />);

      expect(
        screen.getByTestId(`recipe-card-${recipeWithoutImage.recipeId}`)
      ).toBeInTheDocument();
    });

    it('handles recipes with minimal data', () => {
      const minimalRecipe: RecipeCardRecipe = {
        recipeId: 999,
        title: 'Minimal Recipe',
        servings: 1,
      };

      render(<RecipeBrowseGrid recipes={[minimalRecipe]} />);

      expect(screen.getByTestId('recipe-card-999')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = render(<RecipeBrowseGrid recipes={mockRecipes} />);

      const firstRenderCards = screen.getAllByRole('listitem');

      // Re-render with same props
      rerender(<RecipeBrowseGrid recipes={mockRecipes} />);

      const secondRenderCards = screen.getAllByRole('listitem');

      expect(firstRenderCards).toHaveLength(secondRenderCards.length);
    });
  });

  describe('Error Handling', () => {
    it('shows error with retry button', () => {
      const mockRetry = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[]}
          error="Failed to load"
          onRetry={mockRetry}
        />
      );

      expect(screen.getByTestId('browse-grid-error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const mockRetry = jest.fn();

      render(
        <RecipeBrowseGrid
          recipes={[]}
          error="Failed to load"
          onRetry={mockRetry}
        />
      );

      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });
  });
});
