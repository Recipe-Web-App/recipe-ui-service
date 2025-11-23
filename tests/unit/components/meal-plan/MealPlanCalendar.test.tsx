/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MealPlanCalendar } from '@/components/meal-plan/MealPlanCalendar';
import type { MealPlanCalendarData } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('MealPlanCalendar', () => {
  const testDate = new Date('2024-01-15T12:00:00');
  const emptyData: MealPlanCalendarData = {
    startDate: testDate,
    endDate: new Date('2024-01-21T12:00:00'),
    slots: [],
  };

  const dataWithRecipes: MealPlanCalendarData = {
    startDate: testDate,
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
    ],
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<MealPlanCalendar value={emptyData} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MealPlanCalendar value={emptyData} className="custom-calendar-class" />
      );

      expect(container.firstChild).toHaveClass('custom-calendar-class');
    });
  });

  describe('View Switching', () => {
    it('renders week view by default', () => {
      render(<MealPlanCalendar value={emptyData} />);

      const weekButton = screen.getByLabelText('Week view');
      expect(weekButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('switches to day view when day button clicked', () => {
      render(<MealPlanCalendar value={emptyData} />);

      const dayButton = screen.getByLabelText('Day view');
      fireEvent.click(dayButton);

      expect(dayButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('switches to month view when month button clicked', () => {
      render(<MealPlanCalendar value={emptyData} />);

      const monthButton = screen.getByLabelText('Month view');
      fireEvent.click(monthButton);

      expect(monthButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('switches to meal view when meal button clicked', () => {
      render(<MealPlanCalendar value={emptyData} />);

      const mealButton = screen.getByLabelText('Meal view');
      fireEvent.click(mealButton);

      expect(mealButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows meal type selector in meal view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="meal" />);

      expect(screen.getByLabelText('Breakfast view')).toBeInTheDocument();
      expect(screen.getByLabelText('Lunch view')).toBeInTheDocument();
      expect(screen.getByLabelText('Dinner view')).toBeInTheDocument();
      expect(screen.getByLabelText('Snack view')).toBeInTheDocument();
    });

    it('does not show meal type selector in other views', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="week" />);

      expect(screen.queryByLabelText('Breakfast view')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('has previous and next week buttons in week view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="week" />);

      expect(screen.getByLabelText('Previous week')).toBeInTheDocument();
      expect(screen.getByLabelText('Next week')).toBeInTheDocument();
    });

    it('has previous and next day buttons in day view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="day" />);

      expect(screen.getByLabelText('Previous day')).toBeInTheDocument();
      expect(screen.getByLabelText('Next day')).toBeInTheDocument();
    });

    it('has previous and next month buttons in month view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="month" />);

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('navigates to previous week', () => {
      const handleDateChange = jest.fn();
      render(
        <MealPlanCalendar
          value={emptyData}
          defaultView="week"
          onCurrentDateChange={handleDateChange}
        />
      );

      const prevButton = screen.getByLabelText('Previous week');
      fireEvent.click(prevButton);

      expect(handleDateChange).toHaveBeenCalled();
    });

    it('navigates to next week', () => {
      const handleDateChange = jest.fn();
      render(
        <MealPlanCalendar
          value={emptyData}
          defaultView="week"
          onCurrentDateChange={handleDateChange}
        />
      );

      const nextButton = screen.getByLabelText('Next week');
      fireEvent.click(nextButton);

      expect(handleDateChange).toHaveBeenCalled();
    });
  });

  describe('Controlled Current Date', () => {
    it('uses controlled currentDate when provided', () => {
      const controlledDate = new Date('2024-02-01T12:00:00');
      render(
        <MealPlanCalendar
          value={emptyData}
          currentDate={controlledDate}
          defaultView="month"
        />
      );

      expect(screen.getByText('February 2024')).toBeInTheDocument();
    });

    it('calls onCurrentDateChange when navigating', () => {
      const controlledDate = new Date('2024-02-01T12:00:00');
      const handleDateChange = jest.fn();

      render(
        <MealPlanCalendar
          value={emptyData}
          currentDate={controlledDate}
          onCurrentDateChange={handleDateChange}
          defaultView="day"
        />
      );

      const nextButton = screen.getByLabelText('Next day');
      fireEvent.click(nextButton);

      expect(handleDateChange).toHaveBeenCalled();
    });
  });

  describe('Recipe Management', () => {
    it('calls onChange when adding recipe in edit mode', () => {
      const handleChange = jest.fn();

      render(
        <MealPlanCalendar
          value={emptyData}
          onChange={handleChange}
          mode="edit"
          defaultView="week"
        />
      );

      const addRecipeTexts = screen.getAllByText('Add recipe');
      const firstSlot = addRecipeTexts[0].closest('[role="button"]');

      if (firstSlot) {
        fireEvent.click(firstSlot);
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('calls onChange when removing recipe in edit mode', () => {
      const handleChange = jest.fn();

      render(
        <MealPlanCalendar
          value={dataWithRecipes}
          onChange={handleChange}
          mode="edit"
          currentDate={testDate}
          defaultView="week"
        />
      );

      const removeButton = screen.getByLabelText('Remove Pancakes');
      fireEvent.click(removeButton);

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onViewRecipe when view button clicked', () => {
      const handleViewRecipe = jest.fn();

      render(
        <MealPlanCalendar
          value={dataWithRecipes}
          onViewRecipe={handleViewRecipe}
          currentDate={testDate}
          defaultView="week"
        />
      );

      const viewButton = screen.getByLabelText('View Pancakes');
      fireEvent.click(viewButton);

      expect(handleViewRecipe).toHaveBeenCalledWith(1);
    });
  });

  describe('Meal Type Switching', () => {
    it('switches meal types in meal view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="meal" />);

      const lunchButton = screen.getByLabelText('Lunch view');
      fireEvent.click(lunchButton);

      expect(lunchButton).toHaveAttribute('aria-pressed', 'true');
      // Should find Lunch text (appears in button and MealView header)
      expect(screen.getAllByText('Lunch').length).toBeGreaterThan(0);
    });

    it('shows selected meal type in meal view', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="meal" />);

      // Default is breakfast - appears in button and MealView header
      expect(screen.getAllByText('Breakfast').length).toBeGreaterThan(0);
    });
  });

  describe('Month View Day Click', () => {
    it('switches to day view when day is clicked in month view', () => {
      const { container } = render(
        <MealPlanCalendar value={emptyData} defaultView="month" />
      );

      const dayCells = container.querySelectorAll('[role="gridcell"]');
      if (dayCells.length > 0) {
        fireEvent.click(dayCells[0]);

        // Should switch to day view
        const dayButton = screen.getByLabelText('Day view');
        expect(dayButton).toHaveAttribute('aria-pressed', 'true');
      }
    });
  });

  describe('Mode Handling', () => {
    it('renders in view mode by default', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="week" />);

      // View mode shows "No recipe" instead of "Add recipe"
      expect(screen.getAllByText('No recipe').length).toBeGreaterThan(0);
    });

    it('renders in edit mode when specified', () => {
      render(
        <MealPlanCalendar value={emptyData} mode="edit" defaultView="week" />
      );

      // Edit mode shows "Add recipe"
      expect(screen.getAllByText('Add recipe').length).toBeGreaterThan(0);
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(
        <MealPlanCalendar value={emptyData} size="sm" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <MealPlanCalendar value={emptyData} size="default" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <MealPlanCalendar value={emptyData} size="lg" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-pressed on view switcher buttons', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="week" />);

      const weekButton = screen.getByLabelText('Week view');
      const dayButton = screen.getByLabelText('Day view');

      expect(weekButton).toHaveAttribute('aria-pressed', 'true');
      expect(dayButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('has aria-hidden on icons', () => {
      const { container } = render(<MealPlanCalendar value={emptyData} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('showWeekends Prop', () => {
    it('shows weekends by default', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="week" />);

      const dayCells = screen.getAllByRole('gridcell');
      expect(dayCells).toHaveLength(7);
    });

    it('hides weekends when showWeekends is false', () => {
      render(
        <MealPlanCalendar
          value={emptyData}
          showWeekends={false}
          defaultView="week"
        />
      );

      const dayCells = screen.getAllByRole('gridcell');
      expect(dayCells).toHaveLength(5);
    });
  });

  describe('Custom Meal Types', () => {
    it('renders custom meal types', () => {
      render(
        <MealPlanCalendar
          value={emptyData}
          mealTypes={['breakfast', 'dinner']}
          defaultView="week"
        />
      );

      expect(screen.getAllByText('Breakfast').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dinner').length).toBeGreaterThan(0);
      expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
    });
  });

  describe('onMealSlotClick', () => {
    it('calls onMealSlotClick when slot is clicked', () => {
      const handleSlotClick = jest.fn();

      render(
        <MealPlanCalendar
          value={dataWithRecipes}
          onMealSlotClick={handleSlotClick}
          currentDate={testDate}
          defaultView="week"
        />
      );

      const slot = screen.getByText('Pancakes').closest('[role="article"]');
      if (slot) {
        fireEvent.click(slot);
        expect(handleSlotClick).toHaveBeenCalled();
      }
    });
  });

  describe('Default View', () => {
    it('uses week as default view when not specified', () => {
      render(<MealPlanCalendar value={emptyData} />);

      const weekButton = screen.getByLabelText('Week view');
      expect(weekButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('uses specified defaultView', () => {
      render(<MealPlanCalendar value={emptyData} defaultView="day" />);

      const dayButton = screen.getByLabelText('Day view');
      expect(dayButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
