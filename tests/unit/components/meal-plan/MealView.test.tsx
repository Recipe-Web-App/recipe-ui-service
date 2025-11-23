/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MealView } from '@/components/meal-plan/MealView';
import type { MealPlanCalendarData } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('MealView', () => {
  // Sample data for testing
  const testStartDate = new Date('2024-01-15T12:00:00'); // Monday
  const emptyData: MealPlanCalendarData = {
    startDate: testStartDate,
    endDate: new Date('2024-01-21T12:00:00'),
    slots: [],
  };

  const dataWithRecipes: MealPlanCalendarData = {
    startDate: testStartDate,
    endDate: new Date('2024-01-21T12:00:00'),
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
        date: new Date('2024-01-16T12:00:00'),
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 2,
            recipeName: 'French Toast',
          },
        ],
      },
      {
        date: new Date('2024-01-17T12:00:00'),
        mealType: 'breakfast',
        recipes: [
          {
            recipeId: 3,
            recipeName: 'Oatmeal',
          },
          {
            recipeId: 4,
            recipeName: 'Fruit Bowl',
          },
        ],
      },
    ],
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          className="custom-meal-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-meal-class');
    });
  });

  describe('Meal Type Header', () => {
    it('displays breakfast label', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    it('displays lunch label', () => {
      render(
        <MealView data={emptyData} startDate={testStartDate} mealType="lunch" />
      );

      expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    it('displays dinner label', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="dinner"
        />
      );

      expect(screen.getByText('Dinner')).toBeInTheDocument();
    });

    it('displays snack label', () => {
      render(
        <MealView data={emptyData} startDate={testStartDate} mealType="snack" />
      );

      expect(screen.getByText('Snack')).toBeInTheDocument();
    });

    it('displays meal type icon', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Day Cards', () => {
    it('renders default number of days (7)', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(7);
    });

    it('renders custom number of days', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={5}
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(5);
    });

    it('renders 14 days when specified', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={14}
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(14);
    });
  });

  describe('Date Display', () => {
    it('displays dates in medium format', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      // Dates should be in format like "Mon, Jan 15" (use getAllByText since multiple days)
      expect(screen.getAllByText(/Mon/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Jan/)[0]).toBeInTheDocument();
    });

    it('displays "Today" indicator for current date', () => {
      const today = new Date();
      const todayData: MealPlanCalendarData = {
        startDate: today,
        endDate: today,
        slots: [],
      };

      render(
        <MealView
          data={todayData}
          startDate={today}
          mealType="breakfast"
          days={1}
        />
      );

      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('does not display "Today" for past dates', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      expect(screen.queryByText('Today')).not.toBeInTheDocument();
    });
  });

  describe('Meal Slots', () => {
    it('renders meal slots for all days', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={3}
        />
      );

      // Each day should have a meal slot with "No recipe" text
      const emptySlots = screen.getAllByText('No recipe');
      expect(emptySlots.length).toBeGreaterThan(0);
    });

    it('displays recipes for specific meal type', () => {
      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          days={7}
        />
      );

      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.getByText('French Toast')).toBeInTheDocument();
      expect(screen.getByText('Oatmeal')).toBeInTheDocument();
      expect(screen.getByText('Fruit Bowl')).toBeInTheDocument();
    });

    it('only shows recipes for selected meal type', () => {
      const mixedData: MealPlanCalendarData = {
        startDate: testStartDate,
        endDate: new Date('2024-01-21T12:00:00'),
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
                recipeName: 'Sandwich',
              },
            ],
          },
        ],
      };

      render(
        <MealView
          data={mixedData}
          startDate={testStartDate}
          mealType="breakfast"
          days={7}
        />
      );

      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.queryByText('Sandwich')).not.toBeInTheDocument();
    });

    it('shows empty slots in view mode', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          mode="view"
          days={3}
        />
      );

      const emptySlots = screen.getAllByText('No recipe');
      expect(emptySlots.length).toBeGreaterThan(0);
    });

    it('shows "Add recipe" in empty slots when in edit mode', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          mode="edit"
          days={3}
        />
      );

      const addRecipeButtons = screen.getAllByText('Add recipe');
      expect(addRecipeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('calls onMealSlotClick when slot is clicked', () => {
      const handleMealSlotClick = jest.fn();

      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          mode="view"
          onMealSlotClick={handleMealSlotClick}
          days={3}
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

    it('calls onAddRecipe when empty slot is clicked in edit mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          mode="edit"
          onAddRecipe={handleAddRecipe}
          days={3}
        />
      );

      const addRecipeTexts = screen.getAllByText('Add recipe');
      const firstSlot = addRecipeTexts[0].closest('[role="button"]');

      if (firstSlot) {
        fireEvent.click(firstSlot);
        expect(handleAddRecipe).toHaveBeenCalled();
      }
    });

    it('calls onRemoveRecipe when remove button is clicked in edit mode', () => {
      const handleRemoveRecipe = jest.fn();

      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          mode="edit"
          onRemoveRecipe={handleRemoveRecipe}
          days={7}
        />
      );

      const removeButton = screen.getByLabelText('Remove Pancakes');
      fireEvent.click(removeButton);

      expect(handleRemoveRecipe).toHaveBeenCalled();
    });

    it('calls onViewRecipe when view button is clicked', () => {
      const handleViewRecipe = jest.fn();

      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          mode="view"
          onViewRecipe={handleViewRecipe}
          days={7}
        />
      );

      const viewButton = screen.getByLabelText('View Pancakes');
      fireEvent.click(viewButton);

      expect(handleViewRecipe).toHaveBeenCalledWith(1);
    });
  });

  describe('Mode Handling', () => {
    it('renders in view mode by default', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={3}
        />
      );

      expect(screen.getAllByText('No recipe').length).toBeGreaterThan(0);
    });

    it('renders in edit mode when specified', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          mode="edit"
          days={3}
        />
      );

      expect(screen.getAllByText('Add recipe').length).toBeGreaterThan(0);
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          size="sm"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          size="default"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          size="lg"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper role for container', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has aria-label for container', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Breakfast meals');
    });

    it('has proper role for day cards', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={3}
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(3);
    });

    it('has aria-hidden on icons', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Handling', () => {
    it('handles empty data', () => {
      const { container } = render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles data with recipes on different days', () => {
      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          days={7}
        />
      );

      expect(screen.getByText('Pancakes')).toBeInTheDocument();
      expect(screen.getByText('French Toast')).toBeInTheDocument();
      expect(screen.getByText('Oatmeal')).toBeInTheDocument();
    });

    it('handles data with multiple recipes on same day', () => {
      render(
        <MealView
          data={dataWithRecipes}
          startDate={testStartDate}
          mealType="breakfast"
          days={7}
        />
      );

      // Jan 17 has 2 breakfast recipes
      expect(screen.getByText('Oatmeal')).toBeInTheDocument();
      expect(screen.getByText('Fruit Bowl')).toBeInTheDocument();
    });
  });

  describe('Date Range', () => {
    it('handles single day', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={1}
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(1);
    });

    it('handles large date range', () => {
      render(
        <MealView
          data={emptyData}
          startDate={testStartDate}
          mealType="breakfast"
          days={30}
        />
      );

      const dayCards = screen.getAllByRole('listitem');
      expect(dayCards).toHaveLength(30);
    });
  });
});
