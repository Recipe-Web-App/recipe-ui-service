/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MealSlot, MealSlotSkeleton } from '@/components/meal-plan/MealSlot';
import type { MealSlot as MealSlotType } from '@/types/ui/meal-plan-calendar';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('MealSlot', () => {
  describe('Empty State', () => {
    const emptySlot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [],
    };

    it('renders empty state in view mode', () => {
      render(<MealSlot slot={emptySlot} mode="view" />);

      expect(screen.getByText('No recipe')).toBeInTheDocument();
    });

    it('renders empty state in edit mode with add prompt', () => {
      render(<MealSlot slot={emptySlot} mode="edit" />);

      expect(screen.getByText('Add recipe')).toBeInTheDocument();
    });

    it('calls onAddRecipe when empty slot is clicked in edit mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <MealSlot slot={emptySlot} mode="edit" onAddRecipe={handleAddRecipe} />
      );

      const slotElement = screen.getByRole('button');
      fireEvent.click(slotElement);

      expect(handleAddRecipe).toHaveBeenCalledWith(emptySlot);
    });

    it('calls onAddRecipe when empty slot is activated with keyboard in edit mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <MealSlot slot={emptySlot} mode="edit" onAddRecipe={handleAddRecipe} />
      );

      const slotElement = screen.getByRole('button');

      // Test Enter key
      fireEvent.keyDown(slotElement, { key: 'Enter', code: 'Enter' });
      expect(handleAddRecipe).toHaveBeenCalledWith(emptySlot);

      handleAddRecipe.mockClear();

      // Test Space key
      fireEvent.keyDown(slotElement, { key: ' ', code: 'Space' });
      expect(handleAddRecipe).toHaveBeenCalledWith(emptySlot);
    });

    it('calls onSlotClick when empty slot is clicked if provided', () => {
      const handleSlotClick = jest.fn();

      render(
        <MealSlot slot={emptySlot} mode="edit" onSlotClick={handleSlotClick} />
      );

      const slotElement = screen.getByRole('button');
      fireEvent.click(slotElement);

      expect(handleSlotClick).toHaveBeenCalledWith(emptySlot);
    });

    it('does not call onAddRecipe in view mode', () => {
      const handleAddRecipe = jest.fn();

      render(
        <MealSlot slot={emptySlot} mode="view" onAddRecipe={handleAddRecipe} />
      );

      const slotElement = screen.getByRole('article');
      fireEvent.click(slotElement);

      expect(handleAddRecipe).not.toHaveBeenCalled();
    });
  });

  describe('Single Recipe', () => {
    const slotWithRecipe: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'lunch',
      recipes: [
        {
          recipeId: 1,
          recipeName: 'Chicken Salad',
          recipeImage: '/images/chicken-salad.jpg',
          prepTime: 15,
          cookTime: 0,
        },
      ],
    };

    it('renders recipe name', () => {
      render(<MealSlot slot={slotWithRecipe} mode="view" />);

      expect(screen.getByText('Chicken Salad')).toBeInTheDocument();
    });

    it('renders recipe image when provided', () => {
      const { getByAltText } = render(
        <MealSlot slot={slotWithRecipe} mode="view" />
      );

      const image = getByAltText('Chicken Salad');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/chicken-salad.jpg');
    });

    it('shows view button in view mode', () => {
      const handleViewRecipe = jest.fn();

      render(
        <MealSlot
          slot={slotWithRecipe}
          mode="view"
          onViewRecipe={handleViewRecipe}
        />
      );

      const viewButton = screen.getByLabelText('View Chicken Salad');
      expect(viewButton).toBeInTheDocument();

      fireEvent.click(viewButton);
      expect(handleViewRecipe).toHaveBeenCalledWith(1);
    });

    it('shows view and remove buttons in edit mode', () => {
      const handleViewRecipe = jest.fn();
      const handleRemoveRecipe = jest.fn();

      render(
        <MealSlot
          slot={slotWithRecipe}
          mode="edit"
          onViewRecipe={handleViewRecipe}
          onRemoveRecipe={handleRemoveRecipe}
        />
      );

      const viewButton = screen.getByLabelText('View Chicken Salad');
      const removeButton = screen.getByLabelText('Remove Chicken Salad');

      expect(viewButton).toBeInTheDocument();
      expect(removeButton).toBeInTheDocument();

      fireEvent.click(removeButton);
      expect(handleRemoveRecipe).toHaveBeenCalledWith(slotWithRecipe, 1);
    });

    it('prevents slot click when clicking action buttons', () => {
      const handleSlotClick = jest.fn();
      const handleViewRecipe = jest.fn();

      render(
        <MealSlot
          slot={slotWithRecipe}
          mode="view"
          onSlotClick={handleSlotClick}
          onViewRecipe={handleViewRecipe}
        />
      );

      const viewButton = screen.getByLabelText('View Chicken Salad');
      fireEvent.click(viewButton);

      expect(handleViewRecipe).toHaveBeenCalled();
      expect(handleSlotClick).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Recipes', () => {
    const slotWithMultipleRecipes: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'dinner',
      recipes: [
        {
          recipeId: 1,
          recipeName: 'Grilled Chicken',
          recipeImage: '/images/chicken.jpg',
        },
        {
          recipeId: 2,
          recipeName: 'Caesar Salad',
          recipeImage: '/images/salad.jpg',
        },
        {
          recipeId: 3,
          recipeName: 'Garlic Bread',
        },
      ],
    };

    it('renders all recipes', () => {
      render(<MealSlot slot={slotWithMultipleRecipes} mode="view" />);

      expect(screen.getByText('Grilled Chicken')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    });

    it('renders recipes with and without images', () => {
      const { getByAltText, queryByAltText } = render(
        <MealSlot slot={slotWithMultipleRecipes} mode="view" />
      );

      expect(getByAltText('Grilled Chicken')).toBeInTheDocument();
      expect(getByAltText('Caesar Salad')).toBeInTheDocument();
      expect(queryByAltText('Garlic Bread')).not.toBeInTheDocument();
    });

    it('allows removing individual recipes in edit mode', () => {
      const handleRemoveRecipe = jest.fn();

      render(
        <MealSlot
          slot={slotWithMultipleRecipes}
          mode="edit"
          onRemoveRecipe={handleRemoveRecipe}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove/);
      expect(removeButtons).toHaveLength(3);

      fireEvent.click(removeButtons[1]); // Remove Caesar Salad
      expect(handleRemoveRecipe).toHaveBeenCalledWith(
        slotWithMultipleRecipes,
        2
      );
    });
  });

  describe('Meal Type Display', () => {
    const breakfastSlot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [],
    };

    const lunchSlot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'lunch',
      recipes: [],
    };

    const dinnerSlot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'dinner',
      recipes: [],
    };

    const snackSlot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'snack',
      recipes: [],
    };

    it('shows meal type when showMealType is true', () => {
      render(<MealSlot slot={breakfastSlot} mode="view" showMealType />);

      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    it('does not show meal type when showMealType is false', () => {
      render(
        <MealSlot slot={breakfastSlot} mode="view" showMealType={false} />
      );

      expect(screen.queryByText('Breakfast')).not.toBeInTheDocument();
    });

    it('displays correct icon and label for breakfast', () => {
      render(<MealSlot slot={breakfastSlot} mode="view" showMealType />);

      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    it('displays correct icon and label for lunch', () => {
      render(<MealSlot slot={lunchSlot} mode="view" showMealType />);

      expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    it('displays correct icon and label for dinner', () => {
      render(<MealSlot slot={dinnerSlot} mode="view" showMealType />);

      expect(screen.getByText('Dinner')).toBeInTheDocument();
    });

    it('displays correct icon and label for snack', () => {
      render(<MealSlot slot={snackSlot} mode="view" showMealType />);

      expect(screen.getByText('Snack')).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    const slot: MealSlotType = {
      date: new Date('2024-01-15T12:00:00'),
      mealType: 'lunch',
      recipes: [],
    };

    it('shows date when showDate is true', () => {
      render(<MealSlot slot={slot} mode="view" showDate />);

      // Date format depends on locale, just check some part of the date is shown
      const dateText = slot.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      expect(screen.getByText(dateText)).toBeInTheDocument();
    });

    it('does not show date when showDate is false', () => {
      render(<MealSlot slot={slot} mode="view" showDate={false} />);

      const dateText = slot.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      expect(screen.queryByText(dateText)).not.toBeInTheDocument();
    });

    it('shows both meal type and date when both are enabled', () => {
      render(<MealSlot slot={slot} mode="view" showMealType showDate />);

      expect(screen.getByText('Lunch')).toBeInTheDocument();

      const dateText = slot.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      expect(screen.getByText(dateText)).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    const slot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [],
    };

    it('renders with sm size', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" size="sm" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" size="default" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" size="lg" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    const slot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [
        {
          recipeId: 1,
          recipeName: 'Pancakes',
        },
      ],
    };

    it('has proper role in view mode', () => {
      render(<MealSlot slot={slot} mode="view" />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('has proper role in edit mode with empty slot', () => {
      const emptySlot = { ...slot, recipes: [] };

      render(<MealSlot slot={emptySlot} mode="edit" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has aria-label with slot information', () => {
      render(<MealSlot slot={slot} mode="view" />);

      const slotElement = screen.getByRole('article');
      expect(slotElement).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Breakfast')
      );
      expect(slotElement).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Pancakes')
      );
    });

    it('has aria-hidden on icons', () => {
      render(<MealSlot slot={slot} mode="view" showMealType />);

      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('has proper aria-label on action buttons', () => {
      const handleViewRecipe = jest.fn();
      const handleRemoveRecipe = jest.fn();

      render(
        <MealSlot
          slot={slot}
          mode="edit"
          onViewRecipe={handleViewRecipe}
          onRemoveRecipe={handleRemoveRecipe}
        />
      );

      expect(screen.getByLabelText('View Pancakes')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove Pancakes')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    const slot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [],
    };

    it('renders skeleton when isLoading is true', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" isLoading />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not render skeleton when isLoading is false', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" isLoading={false} />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    const slot: MealSlotType = {
      date: new Date('2024-01-15'),
      mealType: 'breakfast',
      recipes: [],
    };

    it('applies custom className', () => {
      const { container } = render(
        <MealSlot slot={slot} mode="view" className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});

describe('MealSlotSkeleton', () => {
  it('renders skeleton with default props', () => {
    const { container } = render(<MealSlotSkeleton />);

    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders skeleton with meal type when showMealType is true', () => {
    const { container } = render(<MealSlotSkeleton showMealType />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(1); // Header + content
  });

  it('renders skeleton with date when showDate is true', () => {
    const { container } = render(<MealSlotSkeleton showDate />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(1); // Header + content
  });

  it('renders skeleton with both meal type and date', () => {
    const { container } = render(<MealSlotSkeleton showMealType showDate />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(2); // Both header items + content
  });

  it('renders skeleton with sm size', () => {
    const { container } = render(<MealSlotSkeleton size="sm" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders skeleton with default size', () => {
    const { container } = render(<MealSlotSkeleton size="default" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders skeleton with lg size', () => {
    const { container } = render(<MealSlotSkeleton size="lg" />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
