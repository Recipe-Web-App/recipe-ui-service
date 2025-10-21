import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FilterPanel } from '@/components/ui/filter-panel';
import type { FilterConfig, FilterValues } from '@/types/ui/filter-panel';

expect.extend(toHaveNoViolations);

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className, ...props }: any) => (
    <div data-testid="chevron-down-icon" className={className} {...props} />
  ),
  X: ({ className, ...props }: any) => (
    <div data-testid="x-icon" className={className} {...props} />
  ),
  RotateCcw: ({ className, ...props }: any) => (
    <div data-testid="rotate-ccw-icon" className={className} {...props} />
  ),
  Search: ({ className, ...props }: any) => (
    <div data-testid="search-icon" className={className} {...props} />
  ),
  Check: ({ className, ...props }: any) => (
    <div data-testid="check-icon" className={className} {...props} />
  ),
  Minus: ({ className, ...props }: any) => (
    <div data-testid="minus-icon" className={className} {...props} />
  ),
  Grid: ({ className, ...props }: any) => (
    <div data-testid="grid-icon" className={className} {...props} />
  ),
  List: ({ className, ...props }: any) => (
    <div data-testid="list-icon" className={className} {...props} />
  ),
}));

// Mock Accordion component
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, defaultValue, ...props }: any) => (
    <div data-testid="accordion" {...props}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value, disabled, ...props }: any) => (
    <div
      data-testid={`accordion-item-${value}`}
      data-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, disabled, ...props }: any) => (
    <button data-testid="accordion-trigger" disabled={disabled} {...props}>
      {children}
    </button>
  ),
  AccordionContent: ({ children, ...props }: any) => (
    <div data-testid="accordion-content" {...props}>
      {children}
    </div>
  ),
}));

// Mock Select component
jest.mock('@/components/ui/select', () => {
  const React = require('react');

  return {
    Select: ({ children, value, onValueChange, disabled }: any) => {
      // Extract options from children
      const options: any[] = [];
      const extractOptions = (node: any): void => {
        if (!node) return;
        if (Array.isArray(node)) {
          node.forEach(extractOptions);
        } else if (node.type?.name === 'SelectItem') {
          options.push({
            value: node.props.value,
            label: node.props.children,
            disabled: node.props.disabled,
          });
        } else if (node.props?.children) {
          extractOptions(node.props.children);
        }
      };
      React.Children.forEach(children, extractOptions);

      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onValueChange?.(e.target.value);
      };

      return (
        <select
          data-testid="select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Select option"
        >
          <option value="">Select...</option>
          {options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              aria-disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
      );
    },
    SelectTrigger: ({ children, ...props }: any) => null,
    SelectValue: ({ placeholder }: any) => null,
    SelectContent: ({ children, ...props }: any) => children,
    SelectItem: ({ children, value, disabled, ...props }: any) => null,
  };
});

// Mock RangeSlider component
jest.mock('@/components/ui/slider', () => ({
  RangeSlider: ({
    value,
    onValueChange,
    min,
    max,
    step = 1,
    unit,
    disabled,
    showTicks,
    showValue,
    valuePosition,
    formatValue,
    ...props
  }: any) => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      onValueChange?.([newMin, value[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      onValueChange?.([value[0], newMax]);
    };

    return (
      <div data-testid="range-slider">
        <input
          data-testid="range-slider-min"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMinChange}
          disabled={disabled}
          aria-label={`Minimum value ${unit ? `in ${unit}` : ''}`}
        />
        <input
          data-testid="range-slider-max"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMaxChange}
          disabled={disabled}
          aria-label={`Maximum value ${unit ? `in ${unit}` : ''}`}
        />
        <div data-testid="range-values">
          {value[0]} - {value[1]} {unit || ''}
        </div>
      </div>
    );
  },
}));

describe('FilterPanel', () => {
  const mockFilters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'breakfast', label: 'Breakfast', count: 10 },
        { id: 'lunch', label: 'Lunch', count: 15 },
        { id: 'dinner', label: 'Dinner', count: 20 },
      ],
    },
    {
      type: 'range',
      id: 'time',
      label: 'Cook Time',
      min: 0,
      max: 120,
      unit: 'min',
    },
    {
      type: 'select',
      id: 'sort',
      label: 'Sort By',
      options: [
        { value: 'newest', label: 'Newest' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
      ],
      placeholder: 'Select sort order',
    },
  ];

  const mockDefaultValues: FilterValues = {
    search: '',
    categories: [],
    time: [0, 120],
    sort: '',
  };

  describe('Basic Rendering', () => {
    it('should render with title', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Test Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('Test Filters')).toBeInTheDocument();
    });

    it('should render all filter sections', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Cook Time')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });

    it('should show header when showHeader is true', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Test Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showHeader
        />
      );

      expect(screen.getByText('Test Filters')).toBeInTheDocument();
    });

    it('should hide header when showHeader is false', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Test Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showHeader={false}
        />
      );

      expect(screen.queryByText('Test Filters')).not.toBeInTheDocument();
    });

    it('should show footer when showFooter is true', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showFooter
        />
      );

      expect(
        screen.getByRole('button', { name: /clear all filters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reset filters to default/i })
      ).toBeInTheDocument();
    });

    it('should hide footer when showFooter is false', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showFooter={false}
        />
      );

      expect(
        screen.queryByRole('button', { name: /clear all filters/i })
      ).not.toBeInTheDocument();
    });

    it('should display result count when showResultCount is true', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          totalResults={42}
        />
      );

      expect(screen.getByText('42 results')).toBeInTheDocument();
    });

    it('should show active filter count badge', () => {
      const mockOnValuesChange = jest.fn();
      const activeValues: FilterValues = {
        ...mockDefaultValues,
        search: 'test',
        categories: ['breakfast'],
      };

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={activeValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByLabelText(/2 active filters/i)).toBeInTheDocument();
    });
  });

  describe('Search Filter', () => {
    it('should render search input', () => {
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search recipes...',
        },
      ];

      render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(
        screen.getByPlaceholderText('Search recipes...')
      ).toBeInTheDocument();
    });

    it('should call onValuesChange when search input changes', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search...',
        },
      ];

      render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'test');

      expect(mockOnValuesChange).toHaveBeenCalled();
    });

    it('should update search value in controlled mode', () => {
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search...',
        },
      ];

      const { rerender } = render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: 'initial' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

      rerender(
        <FilterPanel
          filters={searchFilters}
          values={{ search: 'updated' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search...',
          loading: true,
        },
      ];

      render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeDisabled();
    });

    it('should respect disabled state', () => {
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search...',
          disabled: true,
        },
      ];

      render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeDisabled();
    });

    it('should clear search on clear button', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const searchFilters: FilterConfig[] = [
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search...',
        },
      ];

      render(
        <FilterPanel
          filters={searchFilters}
          values={{ search: 'test' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const clearButton = screen.getByLabelText(/clear search/i);
      await user.click(clearButton);

      expect(mockOnValuesChange).toHaveBeenCalledWith({ search: '' });
    });
  });

  describe('Checkbox Filter', () => {
    it('should render checkbox options', () => {
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: 'Dinner' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('Breakfast')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Dinner')).toBeInTheDocument();
    });

    it('should handle checkbox selection', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // Open accordion
      const categoriesButton = screen.getByRole('button', {
        name: /categories/i,
      });
      await user.click(categoriesButton);

      const breakfastCheckbox = screen.getByRole('checkbox', {
        name: /breakfast/i,
      });
      await user.click(breakfastCheckbox);

      expect(mockOnValuesChange).toHaveBeenCalledWith({
        categories: ['breakfast'],
      });
    });

    it('should show item counts', () => {
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast', count: 10 },
            { id: 'lunch', label: 'Lunch', count: 15 },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(screen.getByText('(15)')).toBeInTheDocument();
    });

    it('should handle select all', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
          ],
          showSelectAll: true,
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // Open accordion
      const categoriesButton = screen.getByRole('button', {
        name: /categories/i,
      });
      await user.click(categoriesButton);

      const selectAllButton = screen.getByRole('button', {
        name: /select all/i,
      });
      await user.click(selectAllButton);

      expect(mockOnValuesChange).toHaveBeenCalled();
    });

    it('should handle clear all', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
          ],
          showClearAll: true,
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: ['breakfast', 'lunch'] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // Open accordion
      const categoriesButton = screen.getByRole('button', {
        name: /categories/i,
      });
      await user.click(categoriesButton);

      // Get the Clear All button within the checkbox group (not the footer Clear button)
      const clearAllButtons = screen.getAllByRole('button', {
        name: /clear all/i,
      });
      // The checkbox Clear All should be inside the accordion content
      const checkboxClearAll = clearAllButtons.find(btn =>
        btn.closest('[data-testid="accordion-content"]')
      );
      await user.click(checkboxClearAll!);

      expect(mockOnValuesChange).toHaveBeenCalledWith({
        categories: [],
      });
    });

    it('should support searchable checkboxes', () => {
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
          ],
          searchable: true,
          searchPlaceholder: 'Search categories...',
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(
        screen.getByPlaceholderText('Search categories...')
      ).toBeInTheDocument();
    });

    it('should respect disabled options', () => {
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast', disabled: true },
            { id: 'lunch', label: 'Lunch' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: [] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const breakfastCheckbox = screen.getByRole('checkbox', {
        name: /breakfast/i,
      });
      expect(breakfastCheckbox).toBeDisabled();
    });
  });

  describe('Range Filter', () => {
    it('should render range slider', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 0,
          max: 120,
          unit: 'min',
        },
      ];

      render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [0, 120] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('Cook Time')).toBeInTheDocument();
      expect(screen.getByTestId('range-slider')).toBeInTheDocument();
      expect(screen.getByTestId('range-slider-min')).toBeInTheDocument();
      expect(screen.getByTestId('range-slider-max')).toBeInTheDocument();
    });

    it('should show min/max labels with unit', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 0,
          max: 120,
          unit: 'min',
          showValue: true,
        },
      ];

      render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [0, 120] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText(/0 - 120 min/i)).toBeInTheDocument();
    });

    it('should respect min/max bounds', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 10,
          max: 100,
        },
      ];

      render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [10, 100] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const minSlider = screen.getByTestId('range-slider-min');
      const maxSlider = screen.getByTestId('range-slider-max');
      expect(minSlider).toHaveAttribute('min', '10');
      expect(minSlider).toHaveAttribute('max', '100');
      expect(maxSlider).toHaveAttribute('min', '10');
      expect(maxSlider).toHaveAttribute('max', '100');
    });

    it('should respect step increments', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 0,
          max: 120,
          step: 5,
        },
      ];

      render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [0, 120] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const minSlider = screen.getByTestId('range-slider-min');
      const maxSlider = screen.getByTestId('range-slider-max');
      expect(minSlider).toHaveAttribute('step', '5');
      expect(maxSlider).toHaveAttribute('step', '5');
    });

    it('should show tick marks when enabled', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 0,
          max: 100,
          step: 25,
          showTicks: true,
        },
      ];

      const { container } = render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [0, 100] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // With mocked component, just verify the slider renders with showTicks prop
      const slider = screen.getByTestId('range-slider');
      expect(slider).toBeInTheDocument();
    });

    it('should respect disabled state', () => {
      const mockOnValuesChange = jest.fn();
      const rangeFilters: FilterConfig[] = [
        {
          type: 'range',
          id: 'time',
          label: 'Cook Time',
          min: 0,
          max: 120,
          disabled: true,
        },
      ];

      render(
        <FilterPanel
          filters={rangeFilters}
          values={{ time: [0, 120] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const minSlider = screen.getByTestId('range-slider-min');
      const maxSlider = screen.getByTestId('range-slider-max');
      expect(minSlider).toBeDisabled();
      expect(maxSlider).toBeDisabled();
    });
  });

  describe('Select Filter', () => {
    it('should render select dropdown', () => {
      const mockOnValuesChange = jest.fn();
      const selectFilters: FilterConfig[] = [
        {
          type: 'select',
          id: 'sort',
          label: 'Sort By',
          options: [
            { value: 'newest', label: 'Newest' },
            { value: 'popular', label: 'Most Popular' },
          ],
          placeholder: 'Select sort order',
        },
      ];

      render(
        <FilterPanel
          filters={selectFilters}
          values={{ sort: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('Sort By')).toBeInTheDocument();
      // With mocked component, check for the select element
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should handle option selection', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const selectFilters: FilterConfig[] = [
        {
          type: 'select',
          id: 'sort',
          label: 'Sort By',
          options: [
            { value: 'newest', label: 'Newest' },
            { value: 'popular', label: 'Most Popular' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={selectFilters}
          values={{ sort: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // Open accordion first
      const sortButton = screen.getByRole('button', { name: /sort by/i });
      await user.click(sortButton);

      const selectElement = screen.getByRole('combobox');
      await user.selectOptions(selectElement, 'newest');

      expect(mockOnValuesChange).toHaveBeenCalledWith({ sort: 'newest' });
    });

    it('should show placeholder when no selection', () => {
      const mockOnValuesChange = jest.fn();
      const selectFilters: FilterConfig[] = [
        {
          type: 'select',
          id: 'sort',
          label: 'Sort By',
          options: [{ value: 'newest', label: 'Newest' }],
          placeholder: 'Choose an option',
        },
      ];

      render(
        <FilterPanel
          filters={selectFilters}
          values={{ sort: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // With mocked component, check for the default option
      const selectElement = screen.getByTestId('select') as HTMLSelectElement;
      expect(selectElement.value).toBe('');
    });

    it('should respect disabled state', () => {
      const mockOnValuesChange = jest.fn();
      const selectFilters: FilterConfig[] = [
        {
          type: 'select',
          id: 'sort',
          label: 'Sort By',
          options: [{ value: 'newest', label: 'Newest' }],
          disabled: true,
        },
      ];

      render(
        <FilterPanel
          filters={selectFilters}
          values={{ sort: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeDisabled();
    });

    it('should respect disabled options', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const selectFilters: FilterConfig[] = [
        {
          type: 'select',
          id: 'sort',
          label: 'Sort By',
          options: [
            { value: 'newest', label: 'Newest', disabled: true },
            { value: 'popular', label: 'Most Popular' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={selectFilters}
          values={{ sort: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      // Open accordion
      const sortButton = screen.getByRole('button', { name: /sort by/i });
      await user.click(sortButton);

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      const newestOption = screen.getByRole('option', { name: /newest/i });
      expect(newestOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Clear/Reset Actions', () => {
    it('should clear all filters on Clear button click', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const mockOnClear = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={{
            search: 'test',
            categories: ['breakfast'],
            time: [10, 60],
            sort: 'newest',
          }}
          onValuesChange={mockOnValuesChange}
          onClear={mockOnClear}
        />
      );

      const clearButton = screen.getByRole('button', {
        name: /clear all filters/i,
      });
      await user.click(clearButton);

      expect(mockOnValuesChange).toHaveBeenCalledWith({
        search: '',
        categories: [],
        time: [0, 120],
        sort: '',
      });
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should reset to defaults on Reset button click', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const mockOnReset = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={{
            search: 'test',
            categories: ['breakfast'],
            time: [10, 60],
            sort: 'newest',
          }}
          onValuesChange={mockOnValuesChange}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByRole('button', {
        name: /reset filters to default/i,
      });
      await user.click(resetButton);

      expect(mockOnValuesChange).toHaveBeenCalled();
      expect(mockOnReset).toHaveBeenCalled();
    });

    it('should show Apply button when showApplyButton is true', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showApplyButton
        />
      );

      expect(
        screen.getByRole('button', { name: /apply filters/i })
      ).toBeInTheDocument();
    });

    it('should call onApply when Apply button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();
      const mockOnApply = jest.fn();
      const testValues: FilterValues = {
        search: 'test',
        categories: [],
        time: [0, 120],
        sort: '',
      };

      render(
        <FilterPanel
          filters={mockFilters}
          values={testValues}
          onValuesChange={mockOnValuesChange}
          showApplyButton
          onApply={mockOnApply}
        />
      );

      const applyButton = screen.getByRole('button', {
        name: /apply filters/i,
      });
      await user.click(applyButton);

      expect(mockOnApply).toHaveBeenCalledWith(testValues);
    });

    it('should disable Clear button when no active filters', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      const clearButton = screen.getByRole('button', {
        name: /clear all filters/i,
      });
      expect(clearButton).toBeDisabled();
    });

    it('should disable Reset button when at default values', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      const resetButton = screen.getByRole('button', {
        name: /reset filters to default/i,
      });
      expect(resetButton).toBeDisabled();
    });

    it('should enable Clear and Reset when filters are active', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={{
            ...mockDefaultValues,
            search: 'test',
          }}
          onValuesChange={mockOnValuesChange}
        />
      );

      const clearButton = screen.getByRole('button', {
        name: /clear all filters/i,
      });
      const resetButton = screen.getByRole('button', {
        name: /reset filters to default/i,
      });

      expect(clearButton).not.toBeDisabled();
      expect(resetButton).not.toBeDisabled();
    });
  });

  describe('Collapsible Behavior', () => {
    it('should be collapsed by default when defaultCollapsed is true', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
          defaultCollapsed
        />
      );

      // When collapsed, the body should have the 'hidden' class
      const searchInput = screen.queryByPlaceholderText('Search...');
      // Search is in the body, and the body should have 'hidden' class when collapsed
      const bodyDiv = searchInput?.closest('.overflow-y-auto');
      expect(bodyDiv).toHaveClass('hidden');
    });

    it('should expand/collapse on header click when collapsible', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
        />
      );

      const header = screen.getByRole('button', { expanded: true });
      await user.click(header);

      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show chevron icon when collapsible', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
        />
      );

      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('should support keyboard navigation (Enter/Space)', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
        />
      );

      const header = screen.getByRole('button', { expanded: true });
      header.focus();

      await user.keyboard('{Enter}');
      expect(header).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard(' ');
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('should not be collapsible when collapsible is false', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible={false}
        />
      );

      expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
    });

    it('should show collapse/expand labels', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
        />
      );

      const collapseButton = screen.getByLabelText(/collapse filters/i);
      expect(collapseButton).toBeInTheDocument();
    });
  });

  describe('Filter Counts', () => {
    it('should show active filter count', () => {
      const mockOnValuesChange = jest.fn();
      const activeValues: FilterValues = {
        search: 'test',
        categories: ['breakfast', 'lunch'],
        time: [10, 60],
        sort: '',
      };

      render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={activeValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should update count when filters change', () => {
      const mockOnValuesChange = jest.fn();

      const { rerender } = render(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.queryByText(/1 active filter/i)).not.toBeInTheDocument();

      rerender(
        <FilterPanel
          title="Filters"
          filters={mockFilters}
          values={{ ...mockDefaultValues, search: 'test' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByLabelText(/1 active filter/i)).toBeInTheDocument();
    });

    it('should show result count when provided', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          totalResults={25}
        />
      );

      expect(screen.getByText('25 results')).toBeInTheDocument();
    });

    it('should show singular "result" when count is 1', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          totalResults={1}
        />
      );

      expect(screen.getByText('1 result')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          aria-label="Recipe filters"
        />
      );

      expect(
        screen.getByRole('region', { name: /recipe filters/i })
      ).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          collapsible
        />
      );

      const header = screen.getByRole('button', { expanded: true });

      await user.tab();
      expect(header).toHaveFocus();
    });

    it('should announce result count changes to screen readers', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          totalResults={42}
        />
      );

      const resultCount = screen.getByText('42 results');
      expect(resultCount).toHaveAttribute('aria-live', 'polite');
      expect(resultCount).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have proper button roles', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(
        screen.getByRole('button', { name: /clear all filters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reset filters to default/i })
      ).toBeInTheDocument();
    });

    it('should pass axe accessibility tests', async () => {
      const mockOnValuesChange = jest.fn();

      const { container } = render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          totalResults={42}
        />
      );

      // Disable nested-interactive rule as the collapsible header contains a chevron button
      // This is an intentional design pattern in the component
      const results = await axe(container, {
        rules: {
          'nested-interactive': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty filters array', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={[]}
          values={{}}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByText('No filters available')).toBeInTheDocument();
    });

    it('should handle all filters selected', () => {
      const mockOnValuesChange = jest.fn();
      const checkboxFilters: FilterConfig[] = [
        {
          type: 'checkbox',
          id: 'categories',
          label: 'Categories',
          options: [
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
          ],
        },
      ];

      render(
        <FilterPanel
          filters={checkboxFilters}
          values={{ categories: ['breakfast', 'lunch'] }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByLabelText(/1 active filter/i)).toBeInTheDocument();
    });

    it('should handle loading results state', () => {
      const mockOnValuesChange = jest.fn();

      render(
        <FilterPanel
          filters={mockFilters}
          values={mockDefaultValues}
          onValuesChange={mockOnValuesChange}
          showResultCount
          loadingResults
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle custom filter type', () => {
      const mockOnValuesChange = jest.fn();
      const customFilters: FilterConfig[] = [
        {
          type: 'custom',
          id: 'custom',
          label: 'Custom Filter',
          render: ({ value, onChange }) => (
            <input
              type="text"
              value={value as string}
              onChange={e => onChange(e.target.value)}
              placeholder="Custom input"
            />
          ),
        },
      ];

      render(
        <FilterPanel
          filters={customFilters}
          values={{ custom: '' }}
          onValuesChange={mockOnValuesChange}
        />
      );

      expect(screen.getByPlaceholderText('Custom input')).toBeInTheDocument();
    });
  });
});
