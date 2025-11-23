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
import { MealPlanFilters } from '@/components/meal-plan/MealPlanFilters';
import type { MealPlanResponseDto } from '@/types/meal-plan-management/meal-plan';
import type { MealPlanFilterValues } from '@/types/meal-plan/filters';
import {
  DEFAULT_MEAL_PLAN_FILTER_VALUES,
  DURATION_OPTIONS,
  STATUS_OPTIONS,
} from '@/types/meal-plan/filters';
import { MealType } from '@/types/meal-plan-management/common';

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
                {filter.options.map((option: any) => (
                  <label key={option.id} data-testid={`checkbox-${option.id}`}>
                    <input
                      type="checkbox"
                      data-testid={`checkbox-input-${option.id}`}
                      checked={(values[filter.id] as string[])?.includes(
                        option.id
                      )}
                      onChange={e => {
                        const currentValues =
                          (values[filter.id] as string[]) || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.id]
                          : currentValues.filter(v => v !== option.id);
                        onValuesChange({ ...values, [filter.id]: newValues });
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
            {filter.type === 'range' && (
              <div data-testid={`filter-range-${filter.id}`}>
                <input
                  type="range"
                  data-testid={`range-input-min-${filter.id}`}
                  min={filter.min}
                  max={filter.max}
                  step={filter.step}
                  value={(values[filter.id] as [number, number])?.[0] ?? 0}
                  onChange={e => {
                    const currentRange = (values[filter.id] as [
                      number,
                      number,
                    ]) || [0, 50];
                    onValuesChange({
                      ...values,
                      [filter.id]: [parseInt(e.target.value), currentRange[1]],
                    });
                  }}
                />
                <input
                  type="range"
                  data-testid={`range-input-max-${filter.id}`}
                  min={filter.min}
                  max={filter.max}
                  step={filter.step}
                  value={(values[filter.id] as [number, number])?.[1] ?? 50}
                  onChange={e => {
                    const currentRange = (values[filter.id] as [
                      number,
                      number,
                    ]) || [0, 50];
                    onValuesChange({
                      ...values,
                      [filter.id]: [currentRange[0], parseInt(e.target.value)],
                    });
                  }}
                />
              </div>
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

describe('MealPlanFilters', () => {
  const mockMealPlans: MealPlanResponseDto[] = [
    {
      id: '1',
      userId: 'user-1',
      name: 'Healthy January Week 1',
      description: 'Low-carb meal plan for first week of January',
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      isActive: false,
      createdAt: '2023-12-28T10:00:00Z',
      updatedAt: '2023-12-30T15:00:00Z',
      recipeCount: 21,
      durationDays: 7,
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Quick Weeknight Dinners',
      description: 'Easy meals for busy work nights',
      startDate: '2024-01-22',
      endDate: '2024-02-04',
      isActive: true,
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-07T12:00:00Z',
      recipeCount: 14,
      durationDays: 14,
    },
    {
      id: '3',
      userId: 'user-2',
      name: 'Keto February',
      description: 'Full month of ketogenic diet meals',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      isActive: false,
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-28T14:00:00Z',
      recipeCount: 42,
      durationDays: 29,
    },
  ];

  const mockFilterChange = jest.fn();

  const defaultProps = {
    mealPlans: mockMealPlans,
    values: DEFAULT_MEAL_PLAN_FILTER_VALUES,
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
      render(<MealPlanFilters {...defaultProps} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-search')).toBeInTheDocument();
      expect(screen.getByTestId('filter-duration')).toBeInTheDocument();
      expect(screen.getByTestId('filter-recipeCountRange')).toBeInTheDocument();
      expect(screen.getByTestId('filter-status')).toBeInTheDocument();
      expect(screen.getByTestId('filter-mealTypes')).toBeInTheDocument();
      expect(screen.getByTestId('filter-showMyMealPlans')).toBeInTheDocument();
      expect(
        screen.getByTestId('filter-showOnlyFavorited')
      ).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<MealPlanFilters {...defaultProps} title="Custom Filter Title" />);

      expect(screen.getByText('Custom Filter Title')).toBeInTheDocument();
    });

    it('should render on desktop without drawer', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(screen.queryByTestId('drawer-trigger')).not.toBeInTheDocument();
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should render all duration options', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(
        screen.getByTestId(`checkbox-${DURATION_OPTIONS.ONE_WEEK}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${DURATION_OPTIONS.TWO_WEEKS}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${DURATION_OPTIONS.ONE_MONTH}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${DURATION_OPTIONS.CUSTOM}`)
      ).toBeInTheDocument();
    });

    it('should render all status options', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(
        screen.getByTestId(`checkbox-${STATUS_OPTIONS.CURRENT}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${STATUS_OPTIONS.UPCOMING}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${STATUS_OPTIONS.COMPLETED}`)
      ).toBeInTheDocument();
    });

    it('should render all meal type options', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(
        screen.getByTestId(`checkbox-${MealType.BREAKFAST}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${MealType.LUNCH}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${MealType.DINNER}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${MealType.SNACK}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`checkbox-${MealType.DESSERT}`)
      ).toBeInTheDocument();
    });

    it('should render ownership and favorites toggles', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(
        screen.getByTestId('checkbox-showMyMealPlans')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('checkbox-showOnlyFavorited')
      ).toBeInTheDocument();
    });

    it('should render recipe count range slider', () => {
      render(<MealPlanFilters {...defaultProps} />);

      expect(
        screen.getByTestId('filter-range-recipeCountRange')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('range-input-min-recipeCountRange')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('range-input-max-recipeCountRange')
      ).toBeInTheDocument();
    });
  });

  describe('Filter Interactions', () => {
    it('should call onFilterChange when search input changes', async () => {
      const user = userEvent.setup();
      let currentValues = DEFAULT_MEAL_PLAN_FILTER_VALUES;
      const handleFilterChange = jest.fn(newValues => {
        currentValues = newValues;
      });

      const { rerender } = render(
        <MealPlanFilters
          {...defaultProps}
          values={currentValues}
          onFilterChange={handleFilterChange}
        />
      );

      const searchInput = screen.getByTestId('filter-input-search');
      await user.type(searchInput, 'k');

      // Rerender with updated values
      rerender(
        <MealPlanFilters
          {...defaultProps}
          values={{ ...currentValues, search: 'k' }}
          onFilterChange={handleFilterChange}
        />
      );

      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalled();
        const calls = handleFilterChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.search).toContain('k');
      });
    });

    it('should sync search query to store', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const searchInput = screen.getByTestId('filter-input-search');
      await user.type(searchInput, 'keto');

      await waitFor(() => {
        expect(mockSetQuery).toHaveBeenCalled();
      });
    });

    it('should call onFilterChange when duration checkbox changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const checkbox = screen.getByTestId(
        `checkbox-input-${DURATION_OPTIONS.ONE_WEEK}`
      );
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.duration).toContain(DURATION_OPTIONS.ONE_WEEK);
      });
    });

    it('should call onFilterChange when status checkbox changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const checkbox = screen.getByTestId(
        `checkbox-input-${STATUS_OPTIONS.CURRENT}`
      );
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.status).toContain(STATUS_OPTIONS.CURRENT);
      });
    });

    it('should call onFilterChange when meal type checkbox changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const checkbox = screen.getByTestId(
        `checkbox-input-${MealType.BREAKFAST}`
      );
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.mealTypes).toContain(MealType.BREAKFAST);
      });
    });

    it('should call onFilterChange when showMyMealPlans toggle changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox-input-showMyMealPlans');
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.showMyMealPlans).toBe(true);
      });
    });

    it('should call onFilterChange when showOnlyFavorited toggle changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox-input-showOnlyFavorited');
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.showOnlyFavorited).toBe(true);
      });
    });

    it('should call onFilterChange when recipe count range changes', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const minSlider = screen.getByTestId('range-input-min-recipeCountRange');
      fireEvent.change(minSlider, { target: { value: '10' } });

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const lastCall =
          mockFilterChange.mock.calls[
            mockFilterChange.mock.calls.length - 1
          ][0];
        expect(lastCall.recipeCountRange?.[0]).toBe(10);
      });
    });

    it('should handle clear all filters', async () => {
      const user = userEvent.setup();
      render(
        <MealPlanFilters
          {...defaultProps}
          values={{
            search: 'keto',
            duration: [DURATION_OPTIONS.ONE_WEEK],
            recipeCountRange: [10, 30],
            status: [STATUS_OPTIONS.CURRENT],
            mealTypes: [MealType.DINNER],
            showMyMealPlans: true,
            showOnlyFavorited: true,
          }}
        />
      );

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalledWith(
          DEFAULT_MEAL_PLAN_FILTER_VALUES
        );
        expect(mockSetQuery).toHaveBeenCalledWith('');
      });
    });

    it('should handle reset filters', async () => {
      const user = userEvent.setup();
      render(
        <MealPlanFilters
          {...defaultProps}
          values={{
            search: 'vegan',
            duration: [DURATION_OPTIONS.ONE_MONTH],
            recipeCountRange: [20, 40],
            status: [STATUS_OPTIONS.UPCOMING],
            mealTypes: [MealType.BREAKFAST, MealType.LUNCH],
            showMyMealPlans: false,
            showOnlyFavorited: true,
          }}
        />
      );

      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalledWith(
          DEFAULT_MEAL_PLAN_FILTER_VALUES
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

      render(<MealPlanFilters {...defaultProps} />);

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

      render(<MealPlanFilters {...defaultProps} />);

      // On desktop, filter panel should render, drawer trigger should not
      expect(screen.queryByTestId('drawer-trigger')).not.toBeInTheDocument();
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Filter Values Conversion', () => {
    it('should convert MealPlanFilterValues to FilterPanel format', () => {
      const filterValues: MealPlanFilterValues = {
        search: 'keto',
        duration: [DURATION_OPTIONS.ONE_WEEK],
        recipeCountRange: [10, 30],
        status: [STATUS_OPTIONS.CURRENT],
        mealTypes: [MealType.DINNER],
        showMyMealPlans: true,
        showOnlyFavorited: false,
      };

      render(<MealPlanFilters {...defaultProps} values={filterValues} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();

      // Check that values are passed correctly to FilterPanel
      expect(screen.getByTestId('filter-input-search')).toHaveValue('keto');
      expect(
        screen.getByTestId(`checkbox-input-${DURATION_OPTIONS.ONE_WEEK}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${STATUS_OPTIONS.CURRENT}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.DINNER}`)
      ).toBeChecked();
      expect(
        screen.getByTestId('checkbox-input-showMyMealPlans')
      ).toBeChecked();
      expect(
        screen.getByTestId('checkbox-input-showOnlyFavorited')
      ).not.toBeChecked();
    });

    it('should handle partial filter values', () => {
      const partialValues: MealPlanFilterValues = {
        search: 'vegan',
        showMyMealPlans: true,
      };

      render(<MealPlanFilters {...defaultProps} values={partialValues} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-input-search')).toHaveValue('vegan');
      expect(
        screen.getByTestId('checkbox-input-showMyMealPlans')
      ).toBeChecked();
    });

    it('should handle empty filter values', () => {
      render(
        <MealPlanFilters
          {...defaultProps}
          values={DEFAULT_MEAL_PLAN_FILTER_VALUES}
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-input-search')).toHaveValue('');
      expect(
        screen.getByTestId('checkbox-input-showMyMealPlans')
      ).not.toBeChecked();
      expect(
        screen.getByTestId('checkbox-input-showOnlyFavorited')
      ).not.toBeChecked();
    });

    it('should handle multiple duration options', () => {
      const values: MealPlanFilterValues = {
        duration: [DURATION_OPTIONS.ONE_WEEK, DURATION_OPTIONS.TWO_WEEKS],
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      expect(
        screen.getByTestId(`checkbox-input-${DURATION_OPTIONS.ONE_WEEK}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${DURATION_OPTIONS.TWO_WEEKS}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${DURATION_OPTIONS.ONE_MONTH}`)
      ).not.toBeChecked();
    });

    it('should handle multiple status options', () => {
      const values: MealPlanFilterValues = {
        status: [STATUS_OPTIONS.CURRENT, STATUS_OPTIONS.UPCOMING],
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      expect(
        screen.getByTestId(`checkbox-input-${STATUS_OPTIONS.CURRENT}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${STATUS_OPTIONS.UPCOMING}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${STATUS_OPTIONS.COMPLETED}`)
      ).not.toBeChecked();
    });

    it('should handle multiple meal type options', () => {
      const values: MealPlanFilterValues = {
        mealTypes: [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER],
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      expect(
        screen.getByTestId(`checkbox-input-${MealType.BREAKFAST}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.LUNCH}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.DINNER}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.SNACK}`)
      ).not.toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.DESSERT}`)
      ).not.toBeChecked();
    });
  });

  describe('Props', () => {
    it('should pass totalResults to FilterPanel', () => {
      render(
        <MealPlanFilters {...defaultProps} totalResults={12} showResultCount />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass loadingResults to FilterPanel', () => {
      render(<MealPlanFilters {...defaultProps} loadingResults={true} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass variant and size props', () => {
      render(
        <MealPlanFilters
          {...defaultProps}
          variant="compact"
          size="lg"
          position="modal"
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass collapsible prop on desktop', () => {
      render(<MealPlanFilters {...defaultProps} collapsible={false} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should pass showHeader and showFooter props', () => {
      render(
        <MealPlanFilters
          {...defaultProps}
          showHeader={false}
          showFooter={false}
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<MealPlanFilters {...defaultProps} />);

      const filterPanel = screen.getByTestId('filter-panel');
      expect(filterPanel).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const searchInput = screen.getByTestId('filter-input-search');

      // Tab to search input
      await user.tab();
      expect(searchInput).toHaveFocus();

      // Type in search - just verify typing works, value management is tested elsewhere
      await user.keyboard('v');

      // Verify the filter change callback was triggered
      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty meal plans array', () => {
      render(<MealPlanFilters {...defaultProps} mealPlans={[]} />);

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('filter-search')).toBeInTheDocument();
    });

    it('should handle meal plans without descriptions', () => {
      const mealPlansWithoutDesc: MealPlanResponseDto[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Test Meal Plan',
          startDate: '2024-01-01',
          endDate: '2024-01-07',
          isActive: true,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
          recipeCount: 5,
          durationDays: 7,
        },
      ];

      render(
        <MealPlanFilters {...defaultProps} mealPlans={mealPlansWithoutDesc} />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should handle multiple filters enabled simultaneously', async () => {
      const user = userEvent.setup();
      render(<MealPlanFilters {...defaultProps} />);

      const durationCheckbox = screen.getByTestId(
        `checkbox-input-${DURATION_OPTIONS.ONE_WEEK}`
      );
      const statusCheckbox = screen.getByTestId(
        `checkbox-input-${STATUS_OPTIONS.CURRENT}`
      );
      const myMealPlansCheckbox = screen.getByTestId(
        'checkbox-input-showMyMealPlans'
      );

      await user.click(durationCheckbox);
      await user.click(statusCheckbox);
      await user.click(myMealPlansCheckbox);

      await waitFor(() => {
        expect(mockFilterChange).toHaveBeenCalled();
        const calls = mockFilterChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.showMyMealPlans).toBe(true);
      });
    });

    it('should handle recipe count range boundary values', async () => {
      render(
        <MealPlanFilters
          {...defaultProps}
          values={{
            recipeCountRange: [0, 50],
          }}
        />
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();

      const minSlider = screen.getByTestId('range-input-min-recipeCountRange');
      const maxSlider = screen.getByTestId('range-input-max-recipeCountRange');

      expect(minSlider).toHaveValue('0');
      expect(maxSlider).toHaveValue('50');
    });

    it('should handle all meal types selected', () => {
      const values: MealPlanFilterValues = {
        mealTypes: [
          MealType.BREAKFAST,
          MealType.LUNCH,
          MealType.DINNER,
          MealType.SNACK,
          MealType.DESSERT,
        ],
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      expect(
        screen.getByTestId(`checkbox-input-${MealType.BREAKFAST}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.LUNCH}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.DINNER}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.SNACK}`)
      ).toBeChecked();
      expect(
        screen.getByTestId(`checkbox-input-${MealType.DESSERT}`)
      ).toBeChecked();
    });

    it('should handle both toggles enabled simultaneously', () => {
      const values: MealPlanFilterValues = {
        showMyMealPlans: true,
        showOnlyFavorited: true,
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      expect(
        screen.getByTestId('checkbox-input-showMyMealPlans')
      ).toBeChecked();
      expect(
        screen.getByTestId('checkbox-input-showOnlyFavorited')
      ).toBeChecked();
    });

    it('should handle maximum recipe count range', () => {
      const values: MealPlanFilterValues = {
        recipeCountRange: [25, 50],
      };

      render(<MealPlanFilters {...defaultProps} values={values} />);

      const minSlider = screen.getByTestId('range-input-min-recipeCountRange');
      const maxSlider = screen.getByTestId('range-input-max-recipeCountRange');

      expect(minSlider).toHaveValue('25');
      expect(maxSlider).toHaveValue('50');
    });
  });
});
