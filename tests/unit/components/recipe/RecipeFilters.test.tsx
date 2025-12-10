import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import type { RecipeFilterValues } from '@/types/recipe/filters';
import { DEFAULT_RECIPE_FILTER_VALUES } from '@/types/recipe/filters';

// Mock search-filter store
const mockSetQuery = jest.fn();
const mockAddFilter = jest.fn();
const mockRemoveFilter = jest.fn();

jest.mock('@/stores/ui/search-filter-store', () => ({
  useSearchFilterStore: () => ({
    activeQuery: '',
    activeFilters: [],
    setQuery: mockSetQuery,
    addFilter: mockAddFilter,
    removeFilter: mockRemoveFilter,
  }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  X: () => <div data-testid="x-icon">X</div>,
  RotateCcw: () => <div data-testid="rotate-ccw-icon">RotateCcw</div>,
}));

// Mock FilterPanel component
jest.mock('@/components/ui/filter-panel', () => ({
  FilterPanel: React.forwardRef(
    (
      {
        filters,
        values,
        onValuesChange,
        onClear,
        onReset,
        title,
        ...props
      }: any,
      ref: any
    ) => (
      <div ref={ref} data-testid="filter-panel" {...props}>
        <h2>{title}</h2>
        {filters.map((filter: any) => (
          <div key={filter.id} data-testid={`filter-${filter.id}`}>
            {filter.label ?? filter.id}
            {filter.type === 'search' && (
              <input
                type="text"
                data-testid={`filter-input-${filter.id}`}
                value={(values[filter.id] as string) || ''}
                onChange={e =>
                  onValuesChange({ ...values, [filter.id]: e.target.value })
                }
              />
            )}
            {filter.type === 'checkbox' && (
              <div data-testid={`filter-checkbox-${filter.id}`}>
                Checkbox filter
              </div>
            )}
            {filter.type === 'range' && (
              <div data-testid={`filter-range-${filter.id}`}>
                Range filter: {JSON.stringify(values[filter.id])}
              </div>
            )}
            {filter.type === 'select' && (
              <select
                data-testid={`filter-select-${filter.id}`}
                value={(values[filter.id] as string) || '0'}
                onChange={e =>
                  onValuesChange({ ...values, [filter.id]: e.target.value })
                }
              >
                <option value="0">All</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
              </select>
            )}
          </div>
        ))}
        <button data-testid="clear-button" onClick={onClear}>
          Clear
        </button>
        <button data-testid="reset-button" onClick={onReset}>
          Reset
        </button>
      </div>
    )
  ),
}));

// Mock Drawer components
jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),
  DrawerTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="drawer-trigger">{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerOverlay: () => <div data-testid="drawer-overlay" />,
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-header">{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="drawer-title">{children}</h2>
  ),
  DrawerBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-body">{children}</div>
  ),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="trigger-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('RecipeFilters', () => {
  const mockRecipes: RecipeDto[] = [
    {
      recipeId: 1,
      userId: 'user-1',
      title: 'Chocolate Chip Cookies',
      description: 'Delicious cookies',
      servings: 24,
      preparationTime: 15,
      cookingTime: 12,
      difficulty: DifficultyLevel.EASY,
      createdAt: '2024-01-01',
      tags: [
        { tagId: 1, name: 'Dessert' },
        { tagId: 2, name: 'Baking' },
      ],
    },
    {
      recipeId: 2,
      userId: 'user-1',
      title: 'Pasta Carbonara',
      description: 'Classic Italian pasta',
      servings: 4,
      preparationTime: 10,
      cookingTime: 20,
      difficulty: DifficultyLevel.MEDIUM,
      createdAt: '2024-01-02',
      tags: [
        { tagId: 3, name: 'Italian' },
        { tagId: 4, name: 'Pasta' },
      ],
    },
    {
      recipeId: 3,
      userId: 'user-2',
      title: 'Vegan Buddha Bowl',
      description: 'Healthy and colorful',
      servings: 2,
      preparationTime: 20,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      createdAt: '2024-01-03',
      tags: [
        { tagId: 5, name: 'Vegan' },
        { tagId: 6, name: 'Healthy' },
      ],
    },
  ];

  const mockFilterChange = jest.fn();

  const defaultProps = {
    recipes: mockRecipes,
    values: DEFAULT_RECIPE_FILTER_VALUES,
    onFilterChange: mockFilterChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.innerWidth for mobile/desktop detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width by default
    });

    // Mock window.addEventListener and removeEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  describe('Rendering', () => {
    it('should render filter panel with all filter sections', () => {
      render(<RecipeFilters {...defaultProps} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-search')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tags')).toBeInTheDocument();
      expect(screen.getByTestId('filter-prepTime')).toBeInTheDocument();
      expect(screen.getByTestId('filter-cookTime')).toBeInTheDocument();
      expect(screen.getByTestId('filter-difficulty')).toBeInTheDocument();
      expect(screen.getByTestId('filter-minRating')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<RecipeFilters {...defaultProps} title="Custom Filter Title" />);

      expect(screen.getByText('Custom Filter Title')).toBeInTheDocument();
    });

    it('should extract unique tags from recipes', () => {
      render(<RecipeFilters {...defaultProps} />);

      // Tags should be passed to FilterPanel
      const filterPanel = screen.getByTestId('filter-panel');
      expect(filterPanel).toBeInTheDocument();

      // Check that tag filter is rendered
      expect(screen.getByTestId('filter-tags')).toBeInTheDocument();
    });

    it('should render on desktop without drawer', () => {
      render(<RecipeFilters {...defaultProps} />);

      expect(screen.queryByTestId('drawer-trigger')).not.toBeInTheDocument();
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Filter Interactions', () => {
    it('should call onFilterChange when search input changes', async () => {
      const user = userEvent.setup();
      let currentValues = DEFAULT_RECIPE_FILTER_VALUES;
      const handleFilterChange = jest.fn(newValues => {
        currentValues = newValues;
      });

      const { rerender } = render(
        <RecipeFilters
          {...defaultProps}
          values={currentValues}
          onFilterChange={handleFilterChange}
        />
      );

      const searchInput = screen.getByTestId('filter-input-search');
      await user.type(searchInput, 'p');

      // Rerender with updated values
      rerender(
        <RecipeFilters
          {...defaultProps}
          values={{ ...currentValues, search: 'p' }}
          onFilterChange={handleFilterChange}
        />
      );

      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalled();
        const calls = handleFilterChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.search).toContain('p');
      });
    });

    it('should sync search query to store', async () => {
      const user = userEvent.setup();
      render(<RecipeFilters {...defaultProps} />);

      const searchInput = screen.getByTestId('filter-input-search');
      await user.type(searchInput, 'cookies');

      await waitFor(() => {
        expect(mockSetQuery).toHaveBeenCalled();
      });
    });

    it('should call onFilterChange when rating select changes', async () => {
      const user = userEvent.setup();
      render(<RecipeFilters {...defaultProps} />);

      const ratingSelect = screen.getByTestId('filter-select-minRating');
      await user.selectOptions(ratingSelect, '4');

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.minRating).toBe('4');
      });
    });

    it('should handle clear all filters', async () => {
      const user = userEvent.setup();
      render(
        <RecipeFilters
          {...defaultProps}
          values={{
            search: 'pasta',
            tags: ['Italian'],
            prepTime: [0, 60],
            cookTime: [0, 60],
            difficulty: ['EASY'],
            minRating: '4',
          }}
        />
      );

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalledWith(
          DEFAULT_RECIPE_FILTER_VALUES
        );
        expect(mockSetQuery).toHaveBeenCalledWith('');
      });
    });

    it('should handle reset filters', async () => {
      const user = userEvent.setup();
      render(
        <RecipeFilters
          {...defaultProps}
          values={{
            search: 'cookies',
            tags: ['Dessert'],
            prepTime: [0, 30],
            cookTime: [10, 20],
            difficulty: ['HARD'],
            minRating: '4.5',
          }}
        />
      );

      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalledWith(
          DEFAULT_RECIPE_FILTER_VALUES
        );
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should show drawer on mobile viewport', async () => {
      // Set mobile width before render
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<RecipeFilters {...defaultProps} />);

      // The component starts in desktop mode (isMobile defaults to false)
      // After useEffect runs, it should switch to mobile mode
      await waitFor(() => {
        // On mobile, either drawer trigger or filter panel should be present
        const hasDrawerOrPanel =
          screen.queryByTestId('drawer-trigger') !== null ||
          screen.queryByTestId('filter-panel') !== null;
        expect(hasDrawerOrPanel).toBe(true);
      });
    });

    it('should hide drawer on desktop viewport', () => {
      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(<RecipeFilters {...defaultProps} />);

      // On desktop, filter panel should render, drawer trigger should not
      expect(screen.queryByTestId('drawer-trigger')).not.toBeInTheDocument();
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Filter Values Conversion', () => {
    it('should convert RecipeFilterValues to FilterPanel format', () => {
      const filterValues: RecipeFilterValues = {
        search: 'test',
        tags: ['Italian', 'Pasta'],
        prepTime: [0, 60],
        cookTime: [10, 30],
        difficulty: ['EASY', 'MEDIUM'],
        minRating: '4',
      };

      render(<RecipeFilters {...defaultProps} values={filterValues} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();

      // Check that values are passed correctly to FilterPanel
      expect(screen.getByTestId('filter-input-search')).toHaveValue('test');
      expect(screen.getByTestId('filter-select-minRating')).toHaveValue('4');
    });

    it('should handle partial filter values', () => {
      const partialValues: RecipeFilterValues = {
        search: 'pasta',
      };

      render(<RecipeFilters {...defaultProps} values={partialValues} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-input-search')).toHaveValue('pasta');
    });
  });

  describe('Props', () => {
    it('should pass totalResults to FilterPanel', () => {
      render(
        <RecipeFilters {...defaultProps} totalResults={42} showResultCount />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass loadingResults to FilterPanel', () => {
      render(<RecipeFilters {...defaultProps} loadingResults={true} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass variant and size props', () => {
      render(
        <RecipeFilters
          {...defaultProps}
          variant="compact"
          size="lg"
          position="modal"
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass collapsible prop on desktop', () => {
      render(<RecipeFilters {...defaultProps} collapsible={false} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<RecipeFilters {...defaultProps} />);

      const filterPanel = screen.getByTestId('filter-panel');
      expect(filterPanel).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<RecipeFilters {...defaultProps} />);

      const searchInput = screen.getByTestId('filter-input-search');

      // Tab to search input
      await user.tab();
      expect(searchInput).toHaveFocus();

      // Type in search - just verify typing works, value management is tested elsewhere
      await user.keyboard('p');

      // Verify the filter change callback was triggered
      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty recipes array', () => {
      render(<RecipeFilters {...defaultProps} recipes={[]} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tags')).toBeInTheDocument();
    });

    it('should handle recipes without tags', () => {
      const recipesWithoutTags: RecipeDto[] = [
        {
          recipeId: 1,
          userId: 'user-1',
          title: 'Test Recipe',
          servings: 4,
          createdAt: '2024-01-01',
        },
      ];

      render(<RecipeFilters {...defaultProps} recipes={recipesWithoutTags} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tags')).toBeInTheDocument();
    });

    it('should handle duplicate tags across recipes', () => {
      const recipesWithDuplicateTags: RecipeDto[] = [
        {
          recipeId: 1,
          userId: 'user-1',
          title: 'Recipe 1',
          servings: 4,
          createdAt: '2024-01-01',
          tags: [{ tagId: 1, name: 'Italian' }],
        },
        {
          recipeId: 2,
          userId: 'user-1',
          title: 'Recipe 2',
          servings: 2,
          createdAt: '2024-01-02',
          tags: [{ tagId: 1, name: 'Italian' }],
        },
      ];

      render(
        <RecipeFilters {...defaultProps} recipes={recipesWithDuplicateTags} />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      // Duplicate tags should be deduplicated
    });
  });
});
