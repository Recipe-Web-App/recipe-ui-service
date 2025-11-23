/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthView } from '@/components/meal-plan/MonthView';
import type { MealPlanCalendarData } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('MonthView', () => {
  // Sample data for testing
  const testMonth = new Date('2024-01-15T12:00:00'); // January 2024
  const emptyData: MealPlanCalendarData = {
    startDate: new Date('2024-01-01T12:00:00'),
    endDate: new Date('2024-01-31T12:00:00'),
    slots: [],
  };

  const dataWithRecipes: MealPlanCalendarData = {
    startDate: new Date('2024-01-01T12:00:00'),
    endDate: new Date('2024-01-31T12:00:00'),
    slots: [
      {
        date: new Date('2024-01-15T12:00:00'),
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 1,
            recipeName: 'Pancakes',
          },
        ],
      },
      {
        date: new Date('2024-01-15T12:00:00'),
        mealType: 'lunch',
        recipes: [
          {
            recipeId: 2,
            recipeName: 'Chicken Salad',
          },
        ],
      },
      {
        date: new Date('2024-01-16T12:00:00'),
        mealType: 'dinner',
        recipes: [
          {
            recipeId: 3,
            recipeName: 'Spaghetti',
          },
          {
            recipeId: 4,
            recipeName: 'Garlic Bread',
          },
        ],
      },
    ],
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MonthView
          data={emptyData}
          month={testMonth}
          className="custom-month-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-month-class');
    });
  });

  describe('Month Header', () => {
    it('displays month and year', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('displays correct month for different dates', () => {
      const december = new Date('2023-12-01T12:00:00');
      render(<MonthView data={emptyData} month={december} />);

      expect(screen.getByText('December 2023')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('has proper role for grid', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has aria-label for grid', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-label', 'Calendar for January 2024');
    });

    it('renders weekday headers', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
    });

    it('renders day cells', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      expect(dayCells.length).toBeGreaterThan(28); // At least 4 weeks
    });
  });

  describe('Day Cells', () => {
    it('displays day numbers', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      // Check some day numbers exist (use getAllByText since months can have duplicate days from adjacent months)
      expect(screen.getAllByText('15')[0]).toBeInTheDocument();
      expect(screen.getAllByText('31')[0]).toBeInTheDocument();
    });

    it('shows recipe count for days with recipes', () => {
      render(<MonthView data={dataWithRecipes} month={testMonth} />);

      // Jan 15 and Jan 16 both have 2 recipes
      const recipeCounts = screen.getAllByText('2 recipes');
      expect(recipeCounts.length).toBeGreaterThan(0);
    });

    it('shows singular "recipe" for single recipe', () => {
      const singleRecipeData: MealPlanCalendarData = {
        startDate: new Date('2024-01-01T12:00:00'),
        endDate: new Date('2024-01-31T12:00:00'),
        slots: [
          {
            date: new Date('2024-01-15T12:00:00'),
            mealType: 'breakfast',
            recipes: [
              {
                recipeId: 1,
                recipeName: 'Pancakes',
              },
            ],
          },
        ],
      };

      render(<MonthView data={singleRecipeData} month={testMonth} />);

      expect(screen.getByText('1 recipe')).toBeInTheDocument();
    });

    it('does not show recipe count for empty days', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      expect(screen.queryByText(/recipe/)).not.toBeInTheDocument();
    });
  });

  describe('Meal Indicators', () => {
    it('displays meal type icons for days with recipes', () => {
      const { container } = render(
        <MonthView data={dataWithRecipes} month={testMonth} />
      );

      // Check that SVG icons are present (Lucide icons render as SVGs)
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('does not display indicators for empty days', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      // Only navigation icons should be present
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      // Should only have icons in navigation (if any)
      expect(icons.length).toBeLessThan(10);
    });
  });

  describe('Navigation Controls', () => {
    it('renders previous month button when onPreviousMonth is provided', () => {
      const handlePreviousMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onPreviousMonth={handlePreviousMonth}
        />
      );

      const prevButton = screen.getByLabelText('Previous month');
      expect(prevButton).toBeInTheDocument();
    });

    it('renders next month button when onNextMonth is provided', () => {
      const handleNextMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onNextMonth={handleNextMonth}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      expect(nextButton).toBeInTheDocument();
    });

    it('calls onPreviousMonth when previous button is clicked', () => {
      const handlePreviousMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onPreviousMonth={handlePreviousMonth}
        />
      );

      const prevButton = screen.getByLabelText('Previous month');
      fireEvent.click(prevButton);

      expect(handlePreviousMonth).toHaveBeenCalledTimes(1);
    });

    it('calls onNextMonth when next button is clicked', () => {
      const handleNextMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onNextMonth={handleNextMonth}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);

      expect(handleNextMonth).toHaveBeenCalledTimes(1);
    });

    it('does not render navigation controls when callbacks not provided', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      expect(screen.queryByLabelText('Previous month')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next month')).not.toBeInTheDocument();
    });

    it('renders both navigation buttons when both callbacks provided', () => {
      const handlePreviousMonth = jest.fn();
      const handleNextMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      );

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });
  });

  describe('Day Click Interactions', () => {
    it('calls onDayClick when day is clicked', () => {
      const handleDayClick = jest.fn();

      const { container } = render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onDayClick={handleDayClick}
        />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      expect(dayCells.length).toBeGreaterThan(0);

      fireEvent.click(dayCells[0]);
      expect(handleDayClick).toHaveBeenCalledTimes(1);
    });

    it('calls onDayClick with keyboard activation', () => {
      const handleDayClick = jest.fn();

      const { container } = render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onDayClick={handleDayClick}
        />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      expect(dayCells.length).toBeGreaterThan(0);

      // Test Enter key
      fireEvent.keyDown(dayCells[0], { key: 'Enter', code: 'Enter' });
      expect(handleDayClick).toHaveBeenCalledTimes(1);

      handleDayClick.mockClear();

      // Test Space key
      fireEvent.keyDown(dayCells[0], { key: ' ', code: 'Space' });
      expect(handleDayClick).toHaveBeenCalledTimes(1);
    });

    it('does not make day cells interactive when onDayClick not provided', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      expect(dayCells.length).toBeGreaterThan(0);

      // Should not have tabIndex when not clickable
      expect(dayCells[0]).not.toHaveAttribute('tabindex', '0');
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} size="sm" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} size="default" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} size="lg" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Mode Handling', () => {
    it('renders in view mode by default', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in edit mode when specified', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} mode="edit" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on navigation buttons', () => {
      const handlePreviousMonth = jest.fn();
      const handleNextMonth = jest.fn();

      render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      );

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('has aria-hidden on navigation icons', () => {
      const handlePreviousMonth = jest.fn();
      const handleNextMonth = jest.fn();

      const { container } = render(
        <MonthView
          data={emptyData}
          month={testMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('has aria-label on day cells with recipe information', () => {
      const { container } = render(
        <MonthView data={dataWithRecipes} month={testMonth} />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      expect(dayCells[0]).toHaveAttribute('aria-label');
    });

    it('has role for weekday headers', () => {
      render(<MonthView data={emptyData} month={testMonth} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7);
    });
  });

  describe('Data Handling', () => {
    it('handles empty data', () => {
      const { container } = render(
        <MonthView data={emptyData} month={testMonth} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles data with recipes on different days', () => {
      render(<MonthView data={dataWithRecipes} month={testMonth} />);

      // Should show recipe counts
      const recipeCounts = screen.getAllByText(/recipe/);
      expect(recipeCounts.length).toBeGreaterThan(0);
    });

    it('handles data with multiple recipes on same day', () => {
      render(<MonthView data={dataWithRecipes} month={testMonth} />);

      // Jan 15 and Jan 16 both have 2 recipes
      const recipeCounts = screen.getAllByText('2 recipes');
      expect(recipeCounts.length).toBeGreaterThan(0);
    });
  });

  describe('Month Transitions', () => {
    it('handles different months correctly', () => {
      const { rerender } = render(
        <MonthView data={emptyData} month={new Date('2024-01-01T12:00:00')} />
      );

      expect(screen.getByText('January 2024')).toBeInTheDocument();

      rerender(
        <MonthView data={emptyData} month={new Date('2024-02-01T12:00:00')} />
      );

      expect(screen.getByText('February 2024')).toBeInTheDocument();
    });
  });

  describe('Custom Meal Types', () => {
    it('renders with custom meal types', () => {
      render(
        <MonthView
          data={dataWithRecipes}
          month={testMonth}
          mealTypes={['breakfast', 'dinner']}
        />
      );

      // Should still show recipe indicators for breakfast and dinner
      expect(screen.getByText('1 recipe')).toBeInTheDocument();
    });

    it('handles empty meal types array', () => {
      render(
        <MonthView data={dataWithRecipes} month={testMonth} mealTypes={[]} />
      );

      // Should not show any recipe counts
      expect(screen.queryByText(/recipe/)).not.toBeInTheDocument();
    });
  });
});
