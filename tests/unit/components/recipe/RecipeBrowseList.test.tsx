import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RecipeBrowseList } from '@/components/recipe/RecipeBrowseList';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeListItemRecipe } from '@/types/ui/recipe-list-item';

expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('@/components/ui/browse-list', () => ({
  BrowseList: React.forwardRef(
    (
      { items, renderItem, loading, error, emptyMessage, ...props }: any,
      ref: any
    ) => {
      if (loading) {
        return <div data-testid="browse-list-loading">Loading...</div>;
      }
      if (error) {
        return (
          <div data-testid="browse-list-error">
            <span>{typeof error === 'string' ? error : error.message}</span>
            {props.onRetry && (
              <button onClick={props.onRetry}>Try Again</button>
            )}
          </div>
        );
      }
      if (!items || items.length === 0) {
        return <div data-testid="browse-list-empty">{emptyMessage}</div>;
      }
      return (
        <div
          ref={ref}
          data-testid="browse-list"
          role="region"
          aria-label={props['aria-label']}
        >
          <ul data-testid="browse-list-items" role="list">
            {items.map((item: any, index: number) => (
              <li key={item.recipeId}>{renderItem(item, index)}</li>
            ))}
          </ul>
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

jest.mock('@/components/recipe/RecipeListItem', () => ({
  RecipeListItem: React.forwardRef(
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
        data-testid={`recipe-list-item-${recipe.recipeId}`}
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
  Skeleton: jest.fn(() => <div data-testid="skeleton" />),
}));

// Sample recipe data
const createMockRecipe = (
  overrides: Partial<RecipeListItemRecipe> = {}
): RecipeListItemRecipe => ({
  recipeId: 1,
  title: 'Test Recipe',
  description: 'A test recipe',
  preparationTime: 15,
  cookingTime: 30,
  difficulty: DifficultyLevel.MEDIUM,
  servings: 4,
  rating: 4.5,
  reviewCount: 10,
  isFavorite: false,
  author: {
    id: 'user-1',
    name: 'Test Chef',
    role: 'chef',
  },
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockRecipes = (count: number): RecipeListItemRecipe[] =>
  Array.from({ length: count }, (_, i) =>
    createMockRecipe({
      recipeId: i + 1,
      title: `Recipe ${i + 1}`,
    })
  );

describe('RecipeBrowseList', () => {
  describe('Rendering', () => {
    it('renders list with recipes', () => {
      const recipes = createMockRecipes(3);
      render(<RecipeBrowseList recipes={recipes} />);

      expect(screen.getByTestId('browse-list')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders correct number of recipe list items', () => {
      const recipes = createMockRecipes(5);
      render(<RecipeBrowseList recipes={recipes} />);

      const items = screen.getAllByTestId(/^recipe-list-item-/);
      expect(items).toHaveLength(5);
    });

    it('passes recipes to RecipeListItem components', () => {
      const recipes = createMockRecipes(3);
      render(<RecipeBrowseList recipes={recipes} />);

      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Recipe 2')).toBeInTheDocument();
      expect(screen.getByText('Recipe 3')).toBeInTheDocument();
    });

    it('passes itemVariant prop to RecipeListItem', () => {
      const recipes = createMockRecipes(1);
      render(<RecipeBrowseList recipes={recipes} itemVariant="compact" />);

      expect(screen.getByTestId('recipe-list-item-1')).toBeInTheDocument();
    });

    it('passes itemSize prop to RecipeListItem', () => {
      const recipes = createMockRecipes(1);
      render(<RecipeBrowseList recipes={recipes} itemSize="lg" />);

      expect(screen.getByTestId('recipe-list-item-1')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('renders loading state', () => {
      render(<RecipeBrowseList recipes={[]} loading />);

      expect(screen.getByTestId('browse-list-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('browse-list')).not.toBeInTheDocument();
    });

    it('renders empty state when no recipes', () => {
      render(<RecipeBrowseList recipes={[]} emptyMessage="No recipes found" />);

      expect(screen.getByTestId('browse-list-empty')).toBeInTheDocument();
      expect(screen.getByText('No recipes found')).toBeInTheDocument();
    });

    it('renders error state', () => {
      const error = new Error('Failed to load');
      render(<RecipeBrowseList recipes={[]} error={error} />);

      expect(screen.getByTestId('browse-list-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('renders error state with string error', () => {
      render(<RecipeBrowseList recipes={[]} error="Network error" />);

      expect(screen.getByTestId('browse-list-error')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('shows retry button in error state when onRetry is provided', () => {
      const onRetry = jest.fn();
      render(<RecipeBrowseList recipes={[]} error="Error" onRetry={onRetry} />);

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('shows pagination when totalPages > 1', () => {
      const recipes = createMockRecipes(5);
      render(
        <RecipeBrowseList
          recipes={recipes}
          currentPage={1}
          totalPages={3}
          onPageChange={jest.fn()}
        />
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('hides pagination when totalPages is 1', () => {
      const recipes = createMockRecipes(5);
      render(
        <RecipeBrowseList
          recipes={recipes}
          currentPage={1}
          totalPages={1}
          onPageChange={jest.fn()}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('hides pagination when showPagination is false', () => {
      const recipes = createMockRecipes(5);
      render(
        <RecipeBrowseList
          recipes={recipes}
          currentPage={1}
          totalPages={3}
          onPageChange={jest.fn()}
          showPagination={false}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('calls onPageChange when page changes', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();
      const recipes = createMockRecipes(5);

      render(
        <RecipeBrowseList
          recipes={recipes}
          currentPage={1}
          totalPages={3}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByText('Next Page');
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Recipe Actions', () => {
    it('calls onRecipeClick when recipe is clicked', async () => {
      const user = userEvent.setup();
      const onRecipeClick = jest.fn();
      const recipes = createMockRecipes(1);

      render(
        <RecipeBrowseList recipes={recipes} onRecipeClick={onRecipeClick} />
      );

      const recipeItem = screen.getByTestId('recipe-list-item-1');
      await user.click(recipeItem);

      expect(onRecipeClick).toHaveBeenCalledWith(recipes[0]);
    });

    it('calls onFavorite when favorite is clicked', async () => {
      const user = userEvent.setup();
      const onFavorite = jest.fn();
      const recipes = createMockRecipes(1);

      render(<RecipeBrowseList recipes={recipes} onFavorite={onFavorite} />);

      const favoriteButton = screen.getByText('Favorite');
      await user.click(favoriteButton);

      expect(onFavorite).toHaveBeenCalledWith(recipes[0]);
    });

    it('calls onShare when share is clicked', async () => {
      const user = userEvent.setup();
      const onShare = jest.fn();
      const recipes = createMockRecipes(1);

      render(<RecipeBrowseList recipes={recipes} onShare={onShare} />);

      const shareButton = screen.getByText('Share');
      await user.click(shareButton);

      expect(onShare).toHaveBeenCalledWith(recipes[0]);
    });

    it('calls onEdit when edit is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      const recipes = createMockRecipes(1);

      render(<RecipeBrowseList recipes={recipes} isOwner onEdit={onEdit} />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(recipes[0]);
    });

    it('calls onDelete when delete is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      const recipes = createMockRecipes(1);

      render(
        <RecipeBrowseList recipes={recipes} isOwner onDelete={onDelete} />
      );

      const deleteButton = screen.getByText('Delete');
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(recipes[0]);
    });
  });

  describe('Ownership', () => {
    it('passes isOwner as boolean to all items', () => {
      const recipes = createMockRecipes(3);
      render(<RecipeBrowseList recipes={recipes} isOwner />);

      const items = screen.getAllByTestId(/^recipe-list-item-/);
      items.forEach(item => {
        expect(item).toHaveAttribute('data-owner', 'true');
      });
    });

    it('determines ownership per recipe with function', () => {
      const recipes = createMockRecipes(3);
      const isOwner = (recipe: RecipeListItemRecipe) => recipe.recipeId === 2;

      render(<RecipeBrowseList recipes={recipes} isOwner={isOwner} />);

      expect(screen.getByTestId('recipe-list-item-1')).toHaveAttribute(
        'data-owner',
        'false'
      );
      expect(screen.getByTestId('recipe-list-item-2')).toHaveAttribute(
        'data-owner',
        'true'
      );
      expect(screen.getByTestId('recipe-list-item-3')).toHaveAttribute(
        'data-owner',
        'false'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label', () => {
      const recipes = createMockRecipes(2);
      render(
        <RecipeBrowseList recipes={recipes} aria-label="My recipes list" />
      );

      const region = screen.getByRole('region', { name: /my recipes list/i });
      expect(region).toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
      const recipes = createMockRecipes(2);
      const { container } = render(<RecipeBrowseList recipes={recipes} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in loading state', async () => {
      const { container } = render(<RecipeBrowseList recipes={[]} loading />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in empty state', async () => {
      const { container } = render(
        <RecipeBrowseList recipes={[]} emptyMessage="No recipes" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Configuration', () => {
    it('passes showQuickActions to items', () => {
      const recipes = createMockRecipes(1);
      render(<RecipeBrowseList recipes={recipes} showQuickActions={false} />);

      expect(screen.getByTestId('recipe-list-item-1')).toBeInTheDocument();
    });

    it('passes showAuthor to items', () => {
      const recipes = createMockRecipes(1);
      render(<RecipeBrowseList recipes={recipes} showAuthor={false} />);

      expect(screen.getByTestId('recipe-list-item-1')).toBeInTheDocument();
    });

    it('passes showRating to items', () => {
      const recipes = createMockRecipes(1);
      render(<RecipeBrowseList recipes={recipes} showRating={false} />);

      expect(screen.getByTestId('recipe-list-item-1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('uses custom empty message', () => {
      render(
        <RecipeBrowseList recipes={[]} emptyMessage="Custom empty message" />
      );

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('uses default empty message when not provided', () => {
      render(<RecipeBrowseList recipes={[]} />);

      expect(screen.getByText('No recipes found')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const recipes = createMockRecipes(1);
      const ref = React.createRef<HTMLDivElement>();

      render(<RecipeBrowseList recipes={recipes} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
