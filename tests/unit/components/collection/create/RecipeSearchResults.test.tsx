import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  RecipeSearchResults,
  type RecipeSearchResult,
} from '@/components/collection/create/RecipeSearchResults';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Helper function to create test recipe results
function createTestRecipe(
  overrides: Partial<RecipeSearchResult> = {}
): RecipeSearchResult {
  return {
    recipeId: Math.floor(Math.random() * 1000),
    title: 'Test Recipe',
    description: 'A test recipe description',
    imageUrl: 'https://example.com/image.jpg',
    ...overrides,
  };
}

describe('RecipeSearchResults', () => {
  const mockOnAddRecipe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeletons when loading', () => {
      render(
        <RecipeSearchResults
          results={[]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          isLoading={true}
        />
      );

      const loadingContainer = screen.getByLabelText('Loading search results');
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Error State', () => {
    it('should render error message', () => {
      render(
        <RecipeSearchResults
          results={[]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          error="Failed to search recipes"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to search recipes')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should render prompt when no search query', () => {
      render(
        <RecipeSearchResults
          results={[]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery=""
        />
      );

      expect(
        screen.getByText('Search for recipes to add to your collection')
      ).toBeInTheDocument();
    });

    it('should render no results message when search has no results', () => {
      render(
        <RecipeSearchResults
          results={[]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="chocolate cake"
        />
      );

      expect(
        screen.getByText('No recipes found for "chocolate cake"')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Try a different search term')
      ).toBeInTheDocument();
    });
  });

  describe('Results Display', () => {
    it('should render a single result', () => {
      const recipe = createTestRecipe({
        recipeId: 1,
        title: 'Chocolate Cake',
        description: 'A delicious chocolate cake',
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="chocolate"
        />
      );

      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
      expect(
        screen.getByText('A delicious chocolate cake')
      ).toBeInTheDocument();
    });

    it('should render multiple results', () => {
      const recipes = [
        createTestRecipe({ recipeId: 1, title: 'Recipe 1' }),
        createTestRecipe({ recipeId: 2, title: 'Recipe 2' }),
        createTestRecipe({ recipeId: 3, title: 'Recipe 3' }),
      ];

      render(
        <RecipeSearchResults
          results={recipes}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Recipe 2')).toBeInTheDocument();
      expect(screen.getByText('Recipe 3')).toBeInTheDocument();
    });

    it('should render recipe image when available', () => {
      const recipe = createTestRecipe({
        title: 'Recipe with Image',
        imageUrl: 'https://example.com/cake.jpg',
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      const img = screen.getByRole('img', { name: 'Recipe with Image' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/cake.jpg');
    });

    it('should render placeholder when no image', () => {
      const recipe = createTestRecipe({
        title: 'Recipe without Image',
        imageUrl: undefined,
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      expect(screen.getByText('No img')).toBeInTheDocument();
    });

    it('should render recipe without description', () => {
      const recipe = createTestRecipe({
        title: 'Simple Recipe',
        description: undefined,
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      expect(screen.getByText('Simple Recipe')).toBeInTheDocument();
    });
  });

  describe('Add Functionality', () => {
    it('should call onAddRecipe when add button is clicked', async () => {
      const user = userEvent.setup();
      const recipe = createTestRecipe({
        recipeId: 123,
        title: 'Test Recipe',
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="test"
        />
      );

      const addButton = screen.getByRole('button', { name: 'Add Test Recipe' });
      await user.click(addButton);

      expect(mockOnAddRecipe).toHaveBeenCalledWith(recipe);
      expect(mockOnAddRecipe).toHaveBeenCalledTimes(1);
    });

    it('should show Added state for selected recipes', () => {
      const recipe = createTestRecipe({
        recipeId: 123,
        title: 'Selected Recipe',
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set([123])}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="test"
        />
      );

      const addButton = screen.getByRole('button', {
        name: 'Selected Recipe already added',
      });
      expect(addButton).toBeDisabled();
      expect(screen.getByText('Added')).toBeInTheDocument();
    });

    it('should not call onAddRecipe for already selected recipes', async () => {
      const user = userEvent.setup();
      const recipe = createTestRecipe({
        recipeId: 123,
        title: 'Selected Recipe',
      });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set([123])}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="test"
        />
      );

      const addButton = screen.getByRole('button', {
        name: 'Selected Recipe already added',
      });
      await user.click(addButton);

      expect(mockOnAddRecipe).not.toHaveBeenCalled();
    });
  });

  describe('Mixed Selected State', () => {
    it('should correctly show selected and unselected states', () => {
      const recipes = [
        createTestRecipe({ recipeId: 1, title: 'Selected Recipe' }),
        createTestRecipe({ recipeId: 2, title: 'Unselected Recipe' }),
      ];

      render(
        <RecipeSearchResults
          results={recipes}
          selectedRecipeIds={new Set([1])}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      // First recipe should be marked as added
      expect(
        screen.getByRole('button', { name: 'Selected Recipe already added' })
      ).toBeDisabled();

      // Second recipe should have add button enabled
      expect(
        screen.getByRole('button', { name: 'Add Unselected Recipe' })
      ).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper list role and label', () => {
      const recipes = [createTestRecipe()];

      render(
        <RecipeSearchResults
          results={recipes}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      expect(
        screen.getByRole('list', { name: 'Recipe search results' })
      ).toBeInTheDocument();
    });

    it('should have listitems for each result', () => {
      const recipes = [
        createTestRecipe({ recipeId: 1 }),
        createTestRecipe({ recipeId: 2 }),
      ];

      render(
        <RecipeSearchResults
          results={recipes}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });

    it('should have descriptive aria-labels for add buttons', () => {
      const recipe = createTestRecipe({ title: 'My Recipe' });

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
        />
      );

      expect(
        screen.getByRole('button', { name: 'Add My Recipe' })
      ).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const recipe = createTestRecipe();

      render(
        <RecipeSearchResults
          results={[recipe]}
          selectedRecipeIds={new Set()}
          onAddRecipe={mockOnAddRecipe}
          searchQuery="recipe"
          className="custom-class"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-class');
    });
  });
});
