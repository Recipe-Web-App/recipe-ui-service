/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MealPlanCalendarEmpty } from '@/components/meal-plan/MealPlanCalendarEmpty';

describe('MealPlanCalendarEmpty', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<MealPlanCalendarEmpty />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default title and description', () => {
      render(<MealPlanCalendarEmpty />);

      expect(screen.getByText('No meal plan yet')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Start planning your meals for the week by creating your first meal plan.'
        )
      ).toBeInTheDocument();
    });

    it('renders with custom title and description', () => {
      render(
        <MealPlanCalendarEmpty
          title="Custom Title"
          description="Custom description text"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MealPlanCalendarEmpty className="custom-empty-class" />
      );

      expect(container.firstChild).toHaveClass('custom-empty-class');
    });
  });

  describe('Icon', () => {
    it('renders calendar icon', () => {
      const { container } = render(<MealPlanCalendarEmpty />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Create Plan Button', () => {
    it('renders create plan button when onCreatePlan is provided', () => {
      const handleCreatePlan = jest.fn();

      render(<MealPlanCalendarEmpty onCreatePlan={handleCreatePlan} />);

      expect(screen.getByText('Create Meal Plan')).toBeInTheDocument();
    });

    it('does not render create plan button when onCreatePlan is not provided', () => {
      render(<MealPlanCalendarEmpty />);

      expect(screen.queryByText('Create Meal Plan')).not.toBeInTheDocument();
    });

    it('calls onCreatePlan when button is clicked', () => {
      const handleCreatePlan = jest.fn();

      render(<MealPlanCalendarEmpty onCreatePlan={handleCreatePlan} />);

      const button = screen.getByText('Create Meal Plan');
      fireEvent.click(button);

      expect(handleCreatePlan).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<MealPlanCalendarEmpty />);

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });
});
