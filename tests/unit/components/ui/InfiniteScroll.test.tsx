import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  InfiniteScroll,
  InfiniteScrollItem,
  RecipeInfiniteScroll,
  SearchResultsInfiniteScroll,
  DefaultInfiniteScrollLoading,
  DefaultInfiniteScrollError,
  DefaultInfiniteScrollEmpty,
  Spinner,
} from '@/components/ui/infinite-scroll';
import type {
  InfiniteScrollProps,
  Recipe,
  SearchResult,
  InfiniteScrollError,
  LoadingState,
} from '@/types/ui/infinite-scroll';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock IntersectionObserver (minimal mock since not used in remaining tests)
(global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Chocolate Chip Cookies',
    description: 'Delicious homemade cookies with chocolate chips',
    imageUrl: '/images/cookies.jpg',
    cookTime: 25,
    difficulty: 'easy',
    rating: 4.5,
    categories: ['dessert', 'baking'],
    author: {
      name: 'Jane Doe',
      avatar: '/avatars/jane.jpg',
    },
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    title: 'Beef Stir Fry',
    description: 'Quick and easy beef stir fry with vegetables',
    imageUrl: '/images/stirfry.jpg',
    cookTime: 15,
    difficulty: 'medium',
    rating: 4.2,
    categories: ['dinner', 'quick'],
    author: {
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
    },
    createdAt: '2023-01-02',
  },
  {
    id: '3',
    title: 'Caesar Salad',
    description: 'Fresh Caesar salad with homemade dressing',
    imageUrl: '/images/salad.jpg',
    cookTime: 10,
    difficulty: 'easy',
    rating: 4.0,
    categories: ['salad', 'lunch'],
    author: {
      name: 'Alice Johnson',
      avatar: '/avatars/alice.jpg',
    },
    createdAt: '2023-01-03',
  },
];

const mockSearchResults: SearchResult[] = [
  {
    id: 'sr1',
    type: 'recipe',
    title: 'Chocolate Cake Recipe',
    description: 'Rich and moist chocolate cake',
    imageUrl: '/images/cake.jpg',
    relevanceScore: 0.95,
    recipe: mockRecipes[0],
  },
  {
    id: 'sr2',
    type: 'ingredient',
    title: 'Dark Chocolate',
    description: 'High-quality dark chocolate for baking',
    relevanceScore: 0.87,
  },
  {
    id: 'sr3',
    type: 'user',
    title: 'Chef Baker',
    description: 'Professional pastry chef',
    imageUrl: '/avatars/chef.jpg',
    relevanceScore: 0.72,
  },
];

const mockError: InfiniteScrollError = {
  message: 'Failed to load recipes',
  code: 'NETWORK_ERROR',
  retryable: true,
};

/**
 * Helper function to render InfiniteScroll with default props
 */
const renderInfiniteScroll = (
  props: Partial<InfiniteScrollProps<Recipe>> = {}
) => {
  const defaultProps: InfiniteScrollProps<Recipe> = {
    items: mockRecipes,
    renderItem: ({ item }) => (
      <article
        data-testid={`recipe-${item.id}`}
        role="article"
        aria-labelledby={`title-${item.id}`}
      >
        <h3 id={`title-${item.id}`}>{item.title}</h3>
        <p>{item.description}</p>
      </article>
    ),
    hasNextPage: false,
    loadingState: 'idle',
    ...props,
  };

  return render(<InfiniteScroll {...defaultProps} />);
};

describe('InfiniteScroll Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders items correctly', () => {
      renderInfiniteScroll();

      expect(screen.getByTestId('recipe-1')).toBeInTheDocument();
      expect(screen.getByTestId('recipe-2')).toBeInTheDocument();
      expect(screen.getByTestId('recipe-3')).toBeInTheDocument();
      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
    });

    test('applies default classes and attributes', () => {
      const { container } = renderInfiniteScroll();
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass(
        'relative',
        'w-full',
        'overflow-hidden'
      );
      expect(infiniteScroll).toHaveAttribute('role', 'feed');
      expect(infiniteScroll).toHaveAttribute(
        'aria-label',
        'Infinite scroll content'
      );
    });

    test('renders with custom className', () => {
      const { container } = renderInfiniteScroll({ className: 'custom-class' });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass('custom-class');
    });

    test('renders empty state when no items', () => {
      renderInfiniteScroll({
        items: [],
        loadingState: 'idle',
        emptyText: 'No recipes available',
      });

      expect(screen.getByText('No results')).toBeInTheDocument();
      expect(screen.getByText('No recipes available')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('shows loading indicator when loading', () => {
      renderInfiniteScroll({
        loadingState: 'loading',
        items: [],
        loadingComponent: ({ loadingState }) => (
          <div role="status" aria-live="polite">
            {loadingState === 'loading' ? 'Loading recipes...' : 'Loading...'}
          </div>
        ),
      });

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
    });

    test('sets aria-busy attribute during loading', () => {
      const { container } = renderInfiniteScroll({
        loadingState: 'loadingMore',
      });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveAttribute('aria-busy', 'true');
    });

    test('shows completion message when all items loaded', () => {
      renderInfiniteScroll({
        loadingState: 'complete',
        hasNextPage: false,
      });

      expect(
        screen.getByText('All recipes loaded (3 total)')
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays error message', () => {
      renderInfiniteScroll({ error: mockError });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to load recipes')).toBeInTheDocument();
    });

    test('displays string error', () => {
      renderInfiniteScroll({ error: 'Simple error message' });

      expect(screen.getByText('Simple error message')).toBeInTheDocument();
    });

    test('shows retry button for retryable errors', () => {
      const onRetry = jest.fn();
      renderInfiniteScroll({ error: mockError, onRetry });

      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    test('hides retry button for non-retryable errors', () => {
      const nonRetryableError: InfiniteScrollError = {
        ...mockError,
        retryable: false,
      };

      renderInfiniteScroll({ error: nonRetryableError });

      expect(
        screen.queryByRole('button', { name: /try again/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Load More Functionality', () => {});

  describe('Variants and Styling', () => {
    test('applies grid variant classes', () => {
      const { container } = renderInfiniteScroll({
        variant: 'grid',
        gridCols: 3,
      });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass(
        'grid',
        'gap-4',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3'
      );
    });

    test('applies recipe context classes', () => {
      const { container } = renderInfiniteScroll({
        recipeContext: 'recipes',
      });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass('recipe-infinite-scroll');
    });

    test('applies compact variant classes', () => {
      const { container } = renderInfiniteScroll({
        variant: 'compact',
      });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass('space-y-2');
    });

    test('applies large size classes', () => {
      const { container } = renderInfiniteScroll({
        size: 'lg',
      });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderInfiniteScroll();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper ARIA attributes', () => {
      const { container } = renderInfiniteScroll({ loadingState: 'loading' });
      const infiniteScroll = container.firstChild as HTMLElement;

      expect(infiniteScroll).toHaveAttribute('role', 'feed');
      expect(infiniteScroll).toHaveAttribute('aria-busy', 'true');
      expect(infiniteScroll).toHaveAttribute(
        'aria-label',
        'Infinite scroll content'
      );
    });

    test('loading component has proper accessibility attributes', () => {
      renderInfiniteScroll({
        loadingState: 'loading',
        items: [],
        loadingComponent: ({ loadingState }) => (
          <div role="status" aria-live="polite" aria-label="Loading recipes...">
            Loading...
          </div>
        ),
      });

      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveAttribute('aria-live', 'polite');
      expect(loadingElement).toHaveAttribute(
        'aria-label',
        'Loading recipes...'
      );
    });

    test('error component has proper accessibility attributes', () => {
      renderInfiniteScroll({ error: mockError });

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'assertive');
    });

    test('supports keyboard navigation for interactive elements', async () => {
      const user = userEvent.setup();
      const onRetry = jest.fn();

      renderInfiniteScroll({ error: mockError, onRetry });

      const retryButton = screen.getByRole('button', { name: /try again/i });

      await user.tab();
      expect(retryButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Components', () => {
    test('renders custom loading component', () => {
      const CustomLoading = () => (
        <div data-testid="custom-loading">Custom Loading...</div>
      );

      renderInfiniteScroll({
        loadingState: 'loading',
        items: [],
        loadingComponent: CustomLoading,
      });

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    test('renders custom error component', () => {
      const CustomError = ({
        error,
        onRetry,
      }: {
        error: any;
        onRetry?: () => void;
      }) => (
        <div data-testid="custom-error">
          Custom Error: {typeof error === 'string' ? error : error.message}
          {onRetry && (
            <button onClick={onRetry} data-testid="custom-retry">
              Custom Retry
            </button>
          )}
        </div>
      );

      const onRetry = jest.fn();
      renderInfiniteScroll({
        error: mockError,
        onRetry,
        errorComponent: CustomError,
      });

      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
      expect(
        screen.getByText('Custom Error: Failed to load recipes')
      ).toBeInTheDocument();

      const retryButton = screen.getByTestId('custom-retry');
      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    test('renders custom empty component', () => {
      const CustomEmpty = () => (
        <div data-testid="custom-empty">No recipes here!</div>
      );

      renderInfiniteScroll({
        items: [],
        loadingState: 'idle',
        emptyComponent: CustomEmpty,
      });

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
      expect(screen.getByText('No recipes here!')).toBeInTheDocument();
    });
  });

  describe('Performance and Metrics', () => {});

  describe('Custom Item Keys', () => {
    test('uses custom getItemKey function', () => {
      const getItemKey = jest.fn((item: Recipe) => `custom-${item.id}`);

      const { container } = renderInfiniteScroll({ getItemKey });

      expect(getItemKey).toHaveBeenCalledTimes(mockRecipes.length);

      // Check that items are rendered with custom keys
      const items = container.querySelectorAll('[data-testid^="recipe-"]');
      expect(items).toHaveLength(mockRecipes.length);
    });

    test('falls back to item.id when no getItemKey provided', () => {
      const { container } = renderInfiniteScroll();

      // Should render all items
      const items = container.querySelectorAll('[data-testid^="recipe-"]');
      expect(items).toHaveLength(mockRecipes.length);
    });

    test('uses index as fallback when no id or getItemKey', () => {
      const itemsWithoutId = [{ title: 'Item 1' }, { title: 'Item 2' }];

      const { container } = render(
        <InfiniteScroll
          items={itemsWithoutId}
          renderItem={({ item, index }) => (
            <div data-testid={`item-${index}`}>{item.title}</div>
          )}
        />
      );

      expect(screen.getByTestId('item-0')).toBeInTheDocument();
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
    });
  });
});

describe('InfiniteScrollItem Component', () => {
  test('renders with default props', () => {
    render(
      <InfiniteScrollItem>
        <div>Test content</div>
      </InfiniteScrollItem>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('applies variant classes', () => {
    const { container } = render(
      <InfiniteScrollItem variant="card" size="lg">
        <div>Card content</div>
      </InfiniteScrollItem>
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass(
      'bg-card',
      'border',
      'border-border',
      'rounded-lg'
    );
  });

  test('applies loading state', () => {
    const { container } = render(
      <InfiniteScrollItem loading={true}>
        <div>Loading content</div>
      </InfiniteScrollItem>
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass('animate-pulse', 'opacity-50');
  });

  test('sets data attributes correctly', () => {
    const { container } = render(
      <InfiniteScrollItem index={5} isFirst={true} isLast={false}>
        <div>Content</div>
      </InfiniteScrollItem>
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveAttribute('data-index', '5');
    expect(item).toHaveAttribute('data-first', 'true');
    expect(item).toHaveAttribute('data-last', 'false');
  });
});

describe('Spinner Component', () => {
  test('renders default spinner', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('inline-block', 'animate-spin');
  });

  test('renders dots variant', () => {
    render(<Spinner variant="dots" />);

    // Should render 3 dots
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });

  test('renders wave variant', () => {
    render(<Spinner variant="wave" />);

    // Should render 5 wave bars
    const bars = document.querySelectorAll('.animate-pulse');
    expect(bars).toHaveLength(5);
  });

  test('applies size classes', () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  test('applies speed classes', () => {
    const { container } = render(<Spinner speed="fast" />);
    const spinner = container.firstChild as HTMLElement;

    expect(spinner).toHaveClass('[animation-duration:0.5s]');
  });
});

describe('Default Components', () => {
  describe('DefaultInfiniteScrollLoading', () => {
    test('renders loading text', () => {
      render(<DefaultInfiniteScrollLoading text="Custom loading message" />);

      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    test('renders skeleton loading', () => {
      render(
        <DefaultInfiniteScrollLoading
          variant="skeleton"
          showSkeleton={true}
          skeletonCount={2}
        />
      );

      // Should render skeleton items
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    test('shows appropriate loading text based on state', () => {
      const { rerender } = render(
        <DefaultInfiniteScrollLoading loadingState="loading" />
      );
      expect(screen.getByText('Loading recipes...')).toBeInTheDocument();

      rerender(<DefaultInfiniteScrollLoading loadingState="loadingMore" />);
      expect(screen.getByText('Loading more recipes...')).toBeInTheDocument();

      rerender(<DefaultInfiniteScrollLoading loadingState="complete" />);
      expect(screen.getByText('All recipes loaded')).toBeInTheDocument();
    });
  });

  describe('DefaultInfiniteScrollError', () => {
    test('renders error message', () => {
      render(<DefaultInfiniteScrollError error="Test error message" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    test('renders retry button when retryable', () => {
      const onRetry = jest.fn();
      render(
        <DefaultInfiniteScrollError
          error="Retryable error"
          onRetry={onRetry}
          retryable={true}
        />
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    test('hides retry button when not retryable', () => {
      render(
        <DefaultInfiniteScrollError
          error="Non-retryable error"
          retryable={false}
        />
      );

      expect(
        screen.queryByRole('button', { name: /try again/i })
      ).not.toBeInTheDocument();
    });

    test('supports custom retry text', () => {
      const onRetry = jest.fn();
      render(
        <DefaultInfiniteScrollError
          error="Custom error"
          onRetry={onRetry}
          retryText="Retry Loading"
        />
      );

      expect(
        screen.getByRole('button', { name: /retry loading/i })
      ).toBeInTheDocument();
    });
  });

  describe('DefaultInfiniteScrollEmpty', () => {
    test('renders empty state', () => {
      render(<DefaultInfiniteScrollEmpty />);

      expect(screen.getByText('No results')).toBeInTheDocument();
      expect(screen.getByText('No recipes found')).toBeInTheDocument();
    });

    test('renders custom text', () => {
      render(<DefaultInfiniteScrollEmpty text="No search results found" />);

      expect(screen.getByText('No search results found')).toBeInTheDocument();
    });

    test('renders custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;

      render(<DefaultInfiniteScrollEmpty icon={<CustomIcon />} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    test('renders action button', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Create Recipe</button>
      );

      render(<DefaultInfiniteScrollEmpty actionButton={<ActionButton />} />);

      expect(screen.getByTestId('action-button')).toBeInTheDocument();
    });
  });
});

describe('RecipeInfiniteScroll Component', () => {
  test('renders recipe cards with default renderer', () => {
    render(
      <RecipeInfiniteScroll items={mockRecipes} recipeContext="recipes" />
    );

    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
    expect(screen.getByText('Beef Stir Fry')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
  });

  test('shows recipe metadata when enabled', () => {
    render(
      <RecipeInfiniteScroll
        items={mockRecipes}
        recipeContext="recipes"
        showAuthor={true}
        showRating={true}
        showCookTime={true}
      />
    );

    expect(screen.getByText('by Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('hides metadata when disabled', () => {
    render(
      <RecipeInfiniteScroll
        items={mockRecipes}
        recipeContext="recipes"
        showAuthor={false}
        showRating={false}
        showCookTime={false}
      />
    );

    expect(screen.queryByText('by Jane Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('25 min')).not.toBeInTheDocument();
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  test('applies card variant classes', () => {
    const { container } = render(
      <RecipeInfiniteScroll
        items={mockRecipes.slice(0, 1)}
        recipeContext="recipes"
        cardVariant="compact"
      />
    );

    const recipeCard = container.querySelector('.recipe-card');
    expect(recipeCard).toHaveClass('flex', 'flex-row', 'h-24');
  });

  test('supports custom renderItem', () => {
    const customRenderItem = ({ item }: { item: Recipe }) => (
      <div data-testid={`custom-recipe-${item.id}`}>Custom: {item.title}</div>
    );

    render(
      <RecipeInfiniteScroll
        items={mockRecipes}
        recipeContext="recipes"
        renderItem={customRenderItem}
      />
    );

    expect(screen.getByTestId('custom-recipe-1')).toBeInTheDocument();
    expect(
      screen.getByText('Custom: Chocolate Chip Cookies')
    ).toBeInTheDocument();
  });
});

describe('SearchResultsInfiniteScroll Component', () => {
  test('renders search results with default renderer', () => {
    render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults}
        recipeContext="search-results"
      />
    );

    expect(screen.getByText('Chocolate Cake Recipe')).toBeInTheDocument();
    expect(screen.getByText('Dark Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Chef Baker')).toBeInTheDocument();
  });

  test('highlights search query in results', () => {
    render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults}
        recipeContext="search-results"
        searchQuery="chocolate"
        highlightQuery={true}
      />
    );

    // Should highlight "chocolate" in the results
    const highlighted = document.querySelector('mark');
    expect(highlighted).toBeInTheDocument();
  });

  test('shows result type indicators', () => {
    render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults}
        recipeContext="search-results"
        showResultType={true}
      />
    );

    expect(screen.getByText('recipe')).toBeInTheDocument();
    expect(screen.getByText('ingredient')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  test('shows relevance scores when enabled', () => {
    render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults}
        recipeContext="search-results"
        showRelevanceScore={true}
      />
    );

    expect(screen.getByText('Relevance: 95%')).toBeInTheDocument();
    expect(screen.getByText('Relevance: 87%')).toBeInTheDocument();
  });

  test('applies result type variant classes', () => {
    const { container } = render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults.slice(0, 1)}
        recipeContext="search-results"
      />
    );

    const searchResult = container.querySelector('.search-result');
    expect(searchResult).toHaveClass('w-full', 'flex', 'items-start');
  });

  test('supports custom renderItem', () => {
    const customRenderItem = ({ item }: { item: SearchResult }) => (
      <div data-testid={`custom-result-${item.id}`}>
        Custom: {item.title} ({item.type})
      </div>
    );

    render(
      <SearchResultsInfiniteScroll
        items={mockSearchResults}
        recipeContext="search-results"
        renderItem={customRenderItem}
      />
    );

    expect(screen.getByTestId('custom-result-sr1')).toBeInTheDocument();
    expect(
      screen.getByText('Custom: Chocolate Cake Recipe (recipe)')
    ).toBeInTheDocument();
  });
});
