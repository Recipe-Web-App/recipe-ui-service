/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayView } from '@/components/meal-plan/DayView';
import type { MealPlanCalendarData } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('DayView', () => {
  // Sample data for testing
  const testDate = new Date('2024-01-15T12:00:00'); // Monday
  const emptyData: MealPlanCalendarData = {
    startDate: testDate,
    endDate: testDate,
    slots: [],
  };

  const dataWithRecipes: MealPlanCalendarData = {
    startDate: testDate,
    endDate: testDate,
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
        date: new Date('2024-01-15T12:00:00'),
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
        <DayView data={emptyData} date={testDate} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <DayView
          data={emptyData}
          date={testDate}
          className="custom-day-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-day-class');
    });
  });

  describe('Day Header', () => {
    it('displays date in header', () => {
      render(<DayView data={emptyData} date={testDate} />);

      // The formatFullDate function should create something like "Monday, January 15, 2024"
      const dateElement = screen.getByText(/January 15, 2024/);
      expect(dateElement).toBeInTheDocument();
    });

    it('displays "Today" indicator when date is today', () => {
      const today = new Date();
      const todayData: MealPlanCalendarData = {
        startDate: today,
        endDate: today,
        slots: [],
      };

      render(<DayView data={todayData} date={today} />);

      expect(screen.getByText('(Today)')).toBeInTheDocument();
    });

    it('does not display "Today" indicator for past dates', () => {
      render(<DayView data={emptyData} date={testDate} />);

      expect(screen.queryByText('(Today)')).not.toBeInTheDocument();
    });
  });

  describe('Meal Slots', () => {
    it('renders all default meal types', () => {
      render(<DayView data={emptyData} date={testDate} />);

      // Default meal types: breakfast, lunch, dinner, snack
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Dinner')).toBeInTheDocument();
      expect(screen.getByText('Snack')).toBeInTheDocument();
    });

    it('renders only specified meal types when provided', () => {
      render(
        <DayView
          data={emptyData}
          date={testDate}
          mealTypes={['breakfast', 'dinner']}
        />
      );

      expect(screen.getByText('Breakfast')).toBeInTheDocument();
      expect(screen.getByText('Dinner')).toBeInTheDocument();
      expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
      expect(screen.queryByText('Snack')).not.toBeInTheDocument();
    });

    it('displays recipes in correct slots', () => {
      render(<DayView data={dataWithRecipes} date={testDate} />);

      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    });

    it('shows empty slots when no recipes assigned', () => {
      render(<DayView data={emptyData} date={testDate} mode="view" />);

      // Empty slots show "No recipe"
      const emptySlots = screen.getAllByText('No recipe');
      expect(emptySlots.length).toBeGreaterThan(0);
    });

    it('shows "Add recipe" in empty slots when in edit mode', () => {
      render(<DayView data={emptyData} date={testDate} mode="edit" />);

      const addRecipeButtons = screen.getAllByText('Add recipe');
      expect(addRecipeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Controls', () => {
    it('renders previous day button when onPreviousDay is provided', () => {
      const handlePreviousDay = jest.fn();

      render(
        <DayView
          data={emptyData}
          date={testDate}
          onPreviousDay={handlePreviousDay}
        />
      );

      const prevButton = screen.getByLabelText('Previous day');
      expect(prevButton).toBeInTheDocument();
    });

    it('renders next day button when onNextDay is provided', () => {
      const handleNextDay = jest.fn();

      render(
        <DayView data={emptyData} date={testDate} onNextDay={handleNextDay} />
      );

      const nextButton = screen.getByLabelText('Next day');
      expect(nextButton).toBeInTheDocument();
    });

    it('calls onPreviousDay when previous button is clicked', () => {
      const handlePreviousDay = jest.fn();

      render(
        <DayView
          data={emptyData}
          date={testDate}
          onPreviousDay={handlePreviousDay}
        />
      );

      const prevButton = screen.getByLabelText('Previous day');
      fireEvent.click(prevButton);

      expect(handlePreviousDay).toHaveBeenCalledTimes(1);
    });

    it('calls onNextDay when next button is clicked', () => {
      const handleNextDay = jest.fn();

      render(
        <DayView data={emptyData} date={testDate} onNextDay={handleNextDay} />
      );

      const nextButton = screen.getByLabelText('Next day');
      fireEvent.click(nextButton);

      expect(handleNextDay).toHaveBeenCalledTimes(1);
    });

    it('does not render navigation controls when callbacks not provided', () => {
      render(<DayView data={emptyData} date={testDate} />);

      expect(screen.queryByLabelText('Previous day')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next day')).not.toBeInTheDocument();
    });

    it('renders both navigation buttons when both callbacks provided', () => {
      const handlePreviousDay = jest.fn();
      const handleNextDay = jest.fn();

      render(
        <DayView
          data={emptyData}
          date={testDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
        />
      );

      expect(screen.getByLabelText('Previous day')).toBeInTheDocument();
      expect(screen.getByLabelText('Next day')).toBeInTheDocument();
    });
  });

  describe('Meal Slot Interactions', () => {
    it('calls onAddRecipe when empty slot is clicked in edit mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <DayView
          data={emptyData}
          date={testDate}
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
        <DayView
          data={dataWithRecipes}
          date={testDate}
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
        <DayView
          data={dataWithRecipes}
          date={testDate}
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
        <DayView
          data={dataWithRecipes}
          date={testDate}
          mode="view"
          onViewRecipe={handleViewRecipe}
        />
      );

      const viewButton = screen.getByLabelText('View Pancakes');
      fireEvent.click(viewButton);

      expect(handleViewRecipe).toHaveBeenCalledWith(1);
    });
  });

  describe('Mode Handling', () => {
    it('renders in view mode by default', () => {
      render(<DayView data={emptyData} date={testDate} />);

      // View mode shows "No recipe" instead of "Add recipe"
      expect(screen.getAllByText('No recipe').length).toBeGreaterThan(0);
    });

    it('renders in edit mode when specified', () => {
      render(<DayView data={emptyData} date={testDate} mode="edit" />);

      // Edit mode shows "Add recipe"
      expect(screen.getAllByText('Add recipe').length).toBeGreaterThan(0);
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(
        <DayView data={emptyData} date={testDate} size="sm" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <DayView data={emptyData} date={testDate} size="default" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <DayView data={emptyData} date={testDate} size="lg" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on navigation buttons', () => {
      const handlePreviousDay = jest.fn();
      const handleNextDay = jest.fn();

      render(
        <DayView
          data={emptyData}
          date={testDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
        />
      );

      expect(screen.getByLabelText('Previous day')).toBeInTheDocument();
      expect(screen.getByLabelText('Next day')).toBeInTheDocument();
    });

    it('has aria-hidden on navigation icons', () => {
      const handlePreviousDay = jest.fn();
      const handleNextDay = jest.fn();

      const { container } = render(
        <DayView
          data={emptyData}
          date={testDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
        />
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('has proper role for day content', () => {
      render(<DayView data={emptyData} date={testDate} />);

      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('has aria-label for day content', () => {
      render(<DayView data={emptyData} date={testDate} />);

      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Meal plan for')
      );
    });
  });

  describe('Data Handling', () => {
    it('handles data with no slots', () => {
      const { container } = render(
        <DayView data={emptyData} date={testDate} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles data with multiple recipes in same slot', () => {
      render(<DayView data={dataWithRecipes} date={testDate} />);

      // Dinner has 2 recipes
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    });

    it('handles data with recipes in different meal types', () => {
      render(<DayView data={dataWithRecipes} date={testDate} />);

      // Recipes in different meal types
      expect(screen.getByText('Pancakes')).toBeInTheDocument(); // Breakfast
      expect(screen.getByText('Chicken Salad')).toBeInTheDocument(); // Lunch
      expect(screen.getByText('Spaghetti')).toBeInTheDocument(); // Dinner
    });
  });

  describe('Date Handling', () => {
    it('displays correct date for past date', () => {
      const pastDate = new Date('2024-01-01T12:00:00');
      const pastData: MealPlanCalendarData = {
        startDate: pastDate,
        endDate: pastDate,
        slots: [],
      };

      render(<DayView data={pastData} date={pastDate} />);

      expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();
      expect(screen.queryByText('(Today)')).not.toBeInTheDocument();
    });

    it('displays correct date for future date', () => {
      const futureDate = new Date('2025-12-31T12:00:00');
      const futureData: MealPlanCalendarData = {
        startDate: futureDate,
        endDate: futureDate,
        slots: [],
      };

      render(<DayView data={futureData} date={futureDate} />);

      expect(screen.getByText(/December 31, 2025/)).toBeInTheDocument();
      expect(screen.queryByText('(Today)')).not.toBeInTheDocument();
    });
  });
});
