/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeekView } from '@/components/meal-plan/WeekView';
import type { MealPlanCalendarData } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('WeekView', () => {
  // Sample data for testing
  const startDate = new Date('2024-01-15T12:00:00'); // Monday
  const emptyData: MealPlanCalendarData = {
    startDate,
    endDate: new Date('2024-01-21T12:00:00'),
    slots: [],
  };

  const dataWithRecipes: MealPlanCalendarData = {
    startDate,
    endDate: new Date('2024-01-21T12:00:00'),
    slots: [
      {
        date: new Date('2024-01-15T12:00:00'), // Monday
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 1,
            recipeName: 'Pancakes',
          },
        ],
      },
      {
        date: new Date('2024-01-16T12:00:00'), // Tuesday
        mealType: 'lunch',
        recipes: [
          {
            recipeId: 2,
            recipeName: 'Chicken Salad',
          },
        ],
      },
      {
        date: new Date('2024-01-17T12:00:00'), // Wednesday
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

  describe('Grid Layout', () => {
    it('renders 7-day grid when showWeekends is true', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} showWeekends />
      );

      const dayColumns = container.querySelectorAll('[role="gridcell"]');
      expect(dayColumns).toHaveLength(7);
    });

    it('renders 5-day grid when showWeekends is false', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} showWeekends={false} />
      );

      const dayColumns = container.querySelectorAll('[role="gridcell"]');
      expect(dayColumns).toHaveLength(5);
    });

    it('has proper role for grid', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has aria-label for grid', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-label', 'Week calendar');
    });
  });

  describe('Day Headers', () => {
    it('displays day of week labels', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    it('displays day numbers', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      // Check for day numbers (15-21)
      expect(screen.getByText('15')).toBeInTheDocument(); // Monday
      expect(screen.getByText('16')).toBeInTheDocument(); // Tuesday
      expect(screen.getByText('21')).toBeInTheDocument(); // Sunday
    });

    it('does not display weekend days when showWeekends is false', () => {
      render(
        <WeekView data={emptyData} startDate={startDate} showWeekends={false} />
      );

      expect(screen.queryByText('Sat')).not.toBeInTheDocument();
      expect(screen.queryByText('Sun')).not.toBeInTheDocument();
    });
  });

  describe('Week Range Display', () => {
    it('displays week date range in header', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      // The formatDateRange function should create a range like "January 15-21, 2024"
      const dateRangeElement = screen.getByText(/January/);
      expect(dateRangeElement).toBeInTheDocument();
    });
  });

  describe('Meal Slots', () => {
    it('renders meal slots for all default meal types', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      // Default meal types: breakfast, lunch, dinner, snack
      // 7 days × 4 meal types = 28 slots
      const breakfastLabels = screen.getAllByText('Breakfast');
      const lunchLabels = screen.getAllByText('Lunch');
      const dinnerLabels = screen.getAllByText('Dinner');
      const snackLabels = screen.getAllByText('Snack');

      expect(breakfastLabels).toHaveLength(7);
      expect(lunchLabels).toHaveLength(7);
      expect(dinnerLabels).toHaveLength(7);
      expect(snackLabels).toHaveLength(7);
    });

    it('renders only specified meal types when provided', () => {
      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          mealTypes={['breakfast', 'lunch']}
        />
      );

      const breakfastLabels = screen.getAllByText('Breakfast');
      const lunchLabels = screen.getAllByText('Lunch');

      expect(breakfastLabels).toHaveLength(7);
      expect(lunchLabels).toHaveLength(7);
      expect(screen.queryByText('Dinner')).not.toBeInTheDocument();
      expect(screen.queryByText('Snack')).not.toBeInTheDocument();
    });

    it('displays recipes in correct slots', () => {
      render(<WeekView data={dataWithRecipes} startDate={startDate} />);

      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    });

    it('shows empty slots when no recipes assigned', () => {
      render(<WeekView data={emptyData} startDate={startDate} mode="view" />);

      // Empty slots show "No recipe"
      const emptySlots = screen.getAllByText('No recipe');
      expect(emptySlots.length).toBeGreaterThan(0);
    });

    it('shows "Add recipe" in empty slots when in edit mode', () => {
      render(<WeekView data={emptyData} startDate={startDate} mode="edit" />);

      const addRecipeButtons = screen.getAllByText('Add recipe');
      expect(addRecipeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Controls', () => {
    it('renders previous week button when onPreviousWeek is provided', () => {
      const handlePreviousWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onPreviousWeek={handlePreviousWeek}
        />
      );

      const prevButton = screen.getByLabelText('Previous week');
      expect(prevButton).toBeInTheDocument();
    });

    it('renders next week button when onNextWeek is provided', () => {
      const handleNextWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onNextWeek={handleNextWeek}
        />
      );

      const nextButton = screen.getByLabelText('Next week');
      expect(nextButton).toBeInTheDocument();
    });

    it('calls onPreviousWeek when previous button is clicked', () => {
      const handlePreviousWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onPreviousWeek={handlePreviousWeek}
        />
      );

      const prevButton = screen.getByLabelText('Previous week');
      fireEvent.click(prevButton);

      expect(handlePreviousWeek).toHaveBeenCalledTimes(1);
    });

    it('calls onNextWeek when next button is clicked', () => {
      const handleNextWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onNextWeek={handleNextWeek}
        />
      );

      const nextButton = screen.getByLabelText('Next week');
      fireEvent.click(nextButton);

      expect(handleNextWeek).toHaveBeenCalledTimes(1);
    });

    it('does not render navigation controls when callbacks not provided', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      expect(screen.queryByLabelText('Previous week')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next week')).not.toBeInTheDocument();
    });

    it('renders both navigation buttons when both callbacks provided', () => {
      const handlePreviousWeek = jest.fn();
      const handleNextWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />
      );

      expect(screen.getByLabelText('Previous week')).toBeInTheDocument();
      expect(screen.getByLabelText('Next week')).toBeInTheDocument();
    });
  });

  describe('Meal Slot Interactions', () => {
    it('calls onAddRecipe when empty slot is clicked in edit mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          mode="edit"
          onAddRecipe={handleAddRecipe}
        />
      );

      // Get all empty slots (they show "Add recipe" text)
      const addRecipeTexts = screen.getAllByText('Add recipe');
      expect(addRecipeTexts.length).toBeGreaterThan(0);

      // Click the first empty slot's container (the button role div)
      const firstSlot = addRecipeTexts[0].closest('[role="button"]');
      expect(firstSlot).toBeInTheDocument();

      if (firstSlot) {
        fireEvent.click(firstSlot);

        expect(handleAddRecipe).toHaveBeenCalled();
        const callArg = handleAddRecipe.mock.calls[0][0];
        expect(callArg).toHaveProperty('date');
        expect(callArg).toHaveProperty('mealType');
        expect(callArg).toHaveProperty('recipes');
      }
    });

    it('calls onMealSlotClick when slot is clicked', () => {
      const handleMealSlotClick = jest.fn();

      render(
        <WeekView
          data={dataWithRecipes}
          startDate={startDate}
          mode="view"
          onMealSlotClick={handleMealSlotClick}
        />
      );

      const slotWithRecipe = screen
        .getByText('Pancakes')
        .closest('[role="article"]');
      if (slotWithRecipe) {
        fireEvent.click(slotWithRecipe);
        expect(handleMealSlotClick).toHaveBeenCalled();
      }
    });

    it('calls onRemoveRecipe when remove button is clicked in edit mode', () => {
      const handleRemoveRecipe = jest.fn();

      render(
        <WeekView
          data={dataWithRecipes}
          startDate={startDate}
          mode="edit"
          onRemoveRecipe={handleRemoveRecipe}
        />
      );

      const removeButton = screen.getByLabelText('Remove Pancakes');
      fireEvent.click(removeButton);

      expect(handleRemoveRecipe).toHaveBeenCalled();
    });

    it('calls onViewRecipe when view button is clicked', () => {
      const handleViewRecipe = jest.fn();

      render(
        <WeekView
          data={dataWithRecipes}
          startDate={startDate}
          mode="view"
          onViewRecipe={handleViewRecipe}
        />
      );

      const viewButton = screen.getByLabelText('View Pancakes');
      fireEvent.click(viewButton);

      expect(handleViewRecipe).toHaveBeenCalledWith(1);
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} size="sm" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} size="default" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} size="lg" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          className="custom-week-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-week-class');
    });
  });

  describe('Mode Handling', () => {
    it('renders in view mode by default', () => {
      render(<WeekView data={emptyData} startDate={startDate} />);

      // View mode shows "No recipe" instead of "Add recipe"
      expect(screen.getAllByText('No recipe').length).toBeGreaterThan(0);
    });

    it('renders in edit mode when specified', () => {
      render(<WeekView data={emptyData} startDate={startDate} mode="edit" />);

      // Edit mode shows "Add recipe"
      expect(screen.getAllByText('Add recipe').length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on navigation buttons', () => {
      const handlePreviousWeek = jest.fn();
      const handleNextWeek = jest.fn();

      render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />
      );

      expect(screen.getByLabelText('Previous week')).toBeInTheDocument();
      expect(screen.getByLabelText('Next week')).toBeInTheDocument();
    });

    it('has aria-hidden on navigation icons', () => {
      const handlePreviousWeek = jest.fn();
      const handleNextWeek = jest.fn();

      const { container } = render(
        <WeekView
          data={emptyData}
          startDate={startDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Handling', () => {
    it('handles data with no slots', () => {
      const { container } = render(
        <WeekView data={emptyData} startDate={startDate} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles data with multiple recipes in same slot', () => {
      render(<WeekView data={dataWithRecipes} startDate={startDate} />);

      // Wednesday dinner has 2 recipes
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    });

    it('handles data with recipes on different days', () => {
      render(<WeekView data={dataWithRecipes} startDate={startDate} />);

      // Recipes on different days
      expect(screen.getByText('Pancakes')).toBeInTheDocument(); // Monday
      expect(screen.getByText('Chicken Salad')).toBeInTheDocument(); // Tuesday
      expect(screen.getByText('Spaghetti')).toBeInTheDocument(); // Wednesday
    });
  });
});
