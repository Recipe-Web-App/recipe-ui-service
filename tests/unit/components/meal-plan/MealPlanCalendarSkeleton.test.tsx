/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MealPlanCalendarSkeleton } from '@/components/meal-plan/MealPlanCalendarSkeleton';

describe('MealPlanCalendarSkeleton', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <MealPlanCalendarSkeleton className="custom-skeleton-class" />
      );

      expect(container.firstChild).toHaveClass('custom-skeleton-class');
    });
  });

  describe('Skeleton Elements', () => {
    it('renders header skeleton', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders view switcher skeletons', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);

      // 4 view switcher buttons + navigation + grid cells
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(4);
    });

    it('renders navigation skeletons', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);

      // Should have navigation skeleton elements
      const navigationArea = container.querySelector(
        '.flex.items-center.justify-between'
      );
      expect(navigationArea).toBeInTheDocument();
    });

    it('renders grid skeleton with 7 day columns', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);

      const grid = container.querySelector('.grid.grid-cols-7');
      expect(grid).toBeInTheDocument();

      const dayColumns = grid?.children;
      expect(dayColumns).toHaveLength(7);
    });

    it('renders meal slot skeletons for each day', () => {
      const { container } = render(<MealPlanCalendarSkeleton />);

      // Each day should have 4 meal slots (breakfast, lunch, dinner, snack)
      // We should have day headers + meal slots
      const skeletons = container.querySelectorAll('.animate-pulse');
      // 4 view buttons + 1 date range + 2 navigation + 7 day headers + (7 days × 4 meals × skeleton elements)
      expect(skeletons.length).toBeGreaterThan(20);
    });
  });

  describe('Size Variants', () => {
    it('renders with sm size', () => {
      const { container } = render(<MealPlanCalendarSkeleton size="sm" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default size', () => {
      const { container } = render(<MealPlanCalendarSkeleton size="default" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      const { container } = render(<MealPlanCalendarSkeleton size="lg" />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
