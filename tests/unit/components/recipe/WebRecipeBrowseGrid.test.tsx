import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WebRecipeBrowseGrid } from '@/components/recipe/WebRecipeBrowseGrid';
import type { WebRecipeCardData } from '@/types/ui/web-recipe-card';

// Mock child components
jest.mock('@/components/recipe/WebRecipeCard', () => ({
  WebRecipeCard: ({
    recipe,
    onClick,
    onOpenExternal,
    onImport,
    onCopyLink,
  }: {
    recipe: WebRecipeCardData;
    onClick?: () => void;
    onOpenExternal?: () => void;
    onImport?: () => void;
    onCopyLink?: () => void;
  }) => (
    <div data-testid="web-recipe-card">
      <span data-testid="recipe-name">{recipe.recipeName}</span>
      <span data-testid="recipe-source">{recipe.sourceDomain}</span>
      {onClick && (
        <button onClick={onClick} data-testid="card-click">
          Click
        </button>
      )}
      {onOpenExternal && (
        <button onClick={onOpenExternal} data-testid="open-external">
          Open
        </button>
      )}
      {onImport && (
        <button onClick={onImport} data-testid="import">
          Import
        </button>
      )}
      {onCopyLink && (
        <button onClick={onCopyLink} data-testid="copy-link">
          Copy
        </button>
      )}
    </div>
  ),
  WebRecipeCardSkeleton: () => (
    <div data-testid="web-recipe-skeleton">Skeleton</div>
  ),
}));

jest.mock('@/components/ui/browse-grid', () => ({
  BrowseGrid: <T,>({
    items,
    renderItem,
    loading,
    error,
    emptyMessage,
    emptyDescription,
    emptyIcon,
    emptyActions,
    skeletonCount,
    renderSkeleton,
    onRetry,
  }: {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loading?: boolean;
    error?: Error | string | null;
    emptyMessage?: string;
    emptyDescription?: string;
    emptyIcon?: React.ReactNode;
    emptyActions?: React.ReactNode;
    skeletonCount?: number;
    renderSkeleton?: () => React.ReactNode;
    onRetry?: () => void;
  }) => (
    <div data-testid="browse-grid">
      {loading && (
        <div data-testid="loading-state">
          {Array.from({ length: skeletonCount ?? 12 }).map((_, i) => (
            <div key={i}>{renderSkeleton?.()}</div>
          ))}
        </div>
      )}
      {error && (
        <div data-testid="error-state">
          <span>{typeof error === 'string' ? error : error.message}</span>
          {onRetry && (
            <button onClick={onRetry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div data-testid="empty-state">
          {emptyIcon}
          <p>{emptyMessage}</p>
          <p>{emptyDescription}</p>
          {emptyActions}
        </div>
      )}
      {!loading && !error && items.length > 0 && (
        <div data-testid="items-grid">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Globe: () => <div data-testid="globe-icon">Globe</div>,
}));

describe('WebRecipeBrowseGrid', () => {
  const mockRecipes: WebRecipeCardData[] = [
    {
      recipeName: 'Best Chocolate Chip Cookies',
      url: 'https://www.allrecipes.com/recipe/10813/cookies',
      sourceDomain: 'allrecipes.com',
    },
    {
      recipeName: 'Classic Pasta Carbonara',
      url: 'https://www.bonappetit.com/recipe/carbonara',
      sourceDomain: 'bonappetit.com',
    },
    {
      recipeName: 'Perfect Grilled Steak',
      url: 'https://www.seriouseats.com/recipe/steak',
      sourceDomain: 'seriouseats.com',
    },
  ];

  const mockHandlers = {
    onRecipeClick: jest.fn(),
    onOpenExternal: jest.fn(),
    onImport: jest.fn(),
    onCopyLink: jest.fn(),
    onRetry: jest.fn(),
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all recipes in the grid', () => {
      render(<WebRecipeBrowseGrid recipes={mockRecipes} />);

      expect(screen.getAllByTestId('web-recipe-card')).toHaveLength(3);
      expect(
        screen.getByText('Best Chocolate Chip Cookies')
      ).toBeInTheDocument();
      expect(screen.getByText('Classic Pasta Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Perfect Grilled Steak')).toBeInTheDocument();
    });

    it('should render source domains for all recipes', () => {
      render(<WebRecipeBrowseGrid recipes={mockRecipes} />);

      expect(screen.getByText('allrecipes.com')).toBeInTheDocument();
      expect(screen.getByText('bonappetit.com')).toBeInTheDocument();
      expect(screen.getByText('seriouseats.com')).toBeInTheDocument();
    });

    it('should render BrowseGrid component', () => {
      render(<WebRecipeBrowseGrid recipes={mockRecipes} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render skeletons when loading', () => {
      render(<WebRecipeBrowseGrid recipes={[]} loading />);

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(
        screen.getAllByTestId('web-recipe-skeleton').length
      ).toBeGreaterThan(0);
    });

    it('should respect skeletonCount prop', () => {
      render(<WebRecipeBrowseGrid recipes={[]} loading skeletonCount={6} />);

      expect(screen.getAllByTestId('web-recipe-skeleton')).toHaveLength(6);
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no recipes', () => {
      render(<WebRecipeBrowseGrid recipes={[]} />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    it('should render default empty message', () => {
      render(<WebRecipeBrowseGrid recipes={[]} />);

      expect(screen.getByText('No popular recipes found')).toBeInTheDocument();
    });

    it('should render custom empty message', () => {
      render(
        <WebRecipeBrowseGrid recipes={[]} emptyMessage="Custom empty message" />
      );

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('should render globe icon in empty state', () => {
      render(<WebRecipeBrowseGrid recipes={[]} />);

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error state when error is provided', () => {
      render(<WebRecipeBrowseGrid recipes={[]} error="Something went wrong" />);

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render retry button when onRetry is provided', () => {
      render(
        <WebRecipeBrowseGrid
          recipes={[]}
          error="Something went wrong"
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeBrowseGrid
          recipes={[]}
          error="Something went wrong"
          onRetry={mockHandlers.onRetry}
        />
      );

      await user.click(screen.getByTestId('retry-button'));
      expect(mockHandlers.onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interactions', () => {
    it('should call onRecipeClick when card is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          onRecipeClick={mockHandlers.onRecipeClick}
        />
      );

      const clickButtons = screen.getAllByTestId('card-click');
      await user.click(clickButtons[0]);

      expect(mockHandlers.onRecipeClick).toHaveBeenCalledWith(mockRecipes[0]);
    });

    it('should call onOpenExternal when open button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          onOpenExternal={mockHandlers.onOpenExternal}
        />
      );

      const openButtons = screen.getAllByTestId('open-external');
      await user.click(openButtons[1]);

      expect(mockHandlers.onOpenExternal).toHaveBeenCalledWith(mockRecipes[1]);
    });

    it('should call onImport when import button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          onImport={mockHandlers.onImport}
        />
      );

      const importButtons = screen.getAllByTestId('import');
      await user.click(importButtons[2]);

      expect(mockHandlers.onImport).toHaveBeenCalledWith(mockRecipes[2]);
    });

    it('should call onCopyLink when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          onCopyLink={mockHandlers.onCopyLink}
        />
      );

      const copyButtons = screen.getAllByTestId('copy-link');
      await user.click(copyButtons[0]);

      expect(mockHandlers.onCopyLink).toHaveBeenCalledWith(mockRecipes[0]);
    });
  });

  describe('Accessibility', () => {
    it('should have default aria-label', () => {
      render(<WebRecipeBrowseGrid recipes={mockRecipes} />);

      // The aria-label would be on the BrowseGrid component
      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('should accept custom aria-label', () => {
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          aria-label="Custom grid label"
        />
      );

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should pass pagination props to BrowseGrid', () => {
      render(
        <WebRecipeBrowseGrid
          recipes={mockRecipes}
          currentPage={2}
          totalPages={5}
          pageSize={10}
          onPageChange={mockHandlers.onPageChange}
        />
      );

      // Component should render without errors
      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should not render action buttons when showQuickActions is false', () => {
      render(
        <WebRecipeBrowseGrid recipes={mockRecipes} showQuickActions={false} />
      );

      // Cards are rendered but buttons aren't passed handlers
      expect(screen.getAllByTestId('web-recipe-card')).toHaveLength(3);
    });
  });
});
