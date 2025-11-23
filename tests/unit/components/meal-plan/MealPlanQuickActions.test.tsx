import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MealPlanQuickActions } from '@/components/meal-plan/MealPlanQuickActions';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share2-icon">Share2</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  ShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCart</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
}));

// Mock QuickActions component
jest.mock('@/components/ui/quick-actions', () => ({
  QuickActions: React.forwardRef(
    ({ actions, className, ...props }: any, ref: any) => (
      <div
        ref={ref}
        data-testid="quick-actions"
        className={className}
        {...props}
      >
        {actions.map((action: any) => (
          <button
            key={action.id}
            onClick={action.onClick}
            aria-label={action.label}
            data-testid={`quick-action-${action.id}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    )
  ),
}));

describe('MealPlanQuickActions', () => {
  const mockMealPlanId = 'meal-plan-123';

  const createMockHandlers = (
    overrides?: Partial<MealPlanQuickActionHandlers>
  ): MealPlanQuickActionHandlers => ({
    onFavorite: jest.fn(),
    onShare: jest.fn(),
    onClone: jest.fn(),
    onQuickView: jest.fn(),
    onGenerateShoppingList: jest.fn(),
    onViewCalendar: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render quick actions when handlers are provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });

    it('should not render when no handlers are provided', () => {
      const handlers: MealPlanQuickActionHandlers = {};
      const { container } = render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render with custom className', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          className="custom-class"
        />
      );

      const quickActions = screen.getByTestId('quick-actions');
      expect(quickActions).toHaveClass('custom-class');
    });
  });

  describe('Standard Actions (Available to All)', () => {
    it('should display favorite action when onFavorite handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
    });

    it('should display share action when onShare handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(screen.getByLabelText('Share')).toBeInTheDocument();
    });

    it('should display clone action when onClone handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-clone')).toBeInTheDocument();
      expect(screen.getByLabelText('Clone')).toBeInTheDocument();
    });

    it('should display quick view action when onQuickView handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-quick_view')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick View')).toBeInTheDocument();
    });

    it('should call onFavorite handler when favorite action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onFavorite).toHaveBeenCalledTimes(1);
    });

    it('should call onShare handler when share action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const shareButton = screen.getByTestId('quick-action-share');
      fireEvent.click(shareButton);

      expect(handlers.onShare).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
    });

    it('should call onClone handler when clone action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const cloneButton = screen.getByTestId('quick-action-clone');
      fireEvent.click(cloneButton);

      expect(handlers.onClone).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onClone).toHaveBeenCalledTimes(1);
    });

    it('should call onQuickView handler when quick view action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const quickViewButton = screen.getByTestId('quick-action-quick_view');
      fireEvent.click(quickViewButton);

      expect(handlers.onQuickView).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onQuickView).toHaveBeenCalledTimes(1);
    });
  });

  describe('Meal Plan Specific Actions', () => {
    it('should display generate shopping list action when handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(
        screen.getByTestId('quick-action-generate_shopping_list')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Shopping List')).toBeInTheDocument();
    });

    it('should display view calendar action when handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(
        screen.getByTestId('quick-action-view_calendar')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('View Calendar')).toBeInTheDocument();
    });

    it('should call onGenerateShoppingList handler when clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const button = screen.getByTestId('quick-action-generate_shopping_list');
      fireEvent.click(button);

      expect(handlers.onGenerateShoppingList).toHaveBeenCalledWith(
        mockMealPlanId
      );
      expect(handlers.onGenerateShoppingList).toHaveBeenCalledTimes(1);
    });

    it('should call onViewCalendar handler when clicked', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const button = screen.getByTestId('quick-action-view_calendar');
      fireEvent.click(button);

      expect(handlers.onViewCalendar).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onViewCalendar).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conditional Rendering', () => {
    it('should only render actions with provided handlers', () => {
      const handlers: MealPlanQuickActionHandlers = {
        onFavorite: jest.fn(),
        onShare: jest.fn(),
        // Other handlers undefined
      };

      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-clone')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-quick_view')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-generate_shopping_list')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-view_calendar')
      ).not.toBeInTheDocument();
    });

    it('should render all actions when all handlers are provided', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-clone')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-quick_view')).toBeInTheDocument();
      expect(
        screen.getByTestId('quick-action-generate_shopping_list')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('quick-action-view_calendar')
      ).toBeInTheDocument();
    });
  });

  describe('All Users Have Same Access', () => {
    it('should render all actions when all handlers provided (no ownership restrictions)', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      // All actions should be available to everyone
      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-clone')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-quick_view')).toBeInTheDocument();
      expect(
        screen.getByTestId('quick-action-generate_shopping_list')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('quick-action-view_calendar')
      ).toBeInTheDocument();
    });
  });

  describe('Multiple Clicks', () => {
    it('should handle multiple clicks on the same action', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);
      fireEvent.click(favoriteButton);
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledTimes(3);
      expect(handlers.onFavorite).toHaveBeenCalledWith(mockMealPlanId);
    });

    it('should handle clicks on different actions', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      const shareButton = screen.getByTestId('quick-action-share');
      const cloneButton = screen.getByTestId('quick-action-clone');

      fireEvent.click(favoriteButton);
      fireEvent.click(shareButton);
      fireEvent.click(cloneButton);
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledTimes(2);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
      expect(handlers.onClone).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing handlers gracefully', () => {
      const handlers: MealPlanQuickActionHandlers = {
        onFavorite: jest.fn(),
        // Other handlers undefined
      };

      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-share')
      ).not.toBeInTheDocument();
    });

    it('should work with empty mealPlanId', () => {
      const handlers = createMockHandlers();
      render(<MealPlanQuickActions mealPlanId="" handlers={handlers} />);

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith('');
    });

    it('should work with UUID mealPlanId', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const handlers = createMockHandlers();
      render(<MealPlanQuickActions mealPlanId={uuid} handlers={handlers} />);

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith(uuid);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all standard actions', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
      expect(screen.getByLabelText('Share')).toBeInTheDocument();
      expect(screen.getByLabelText('Clone')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick View')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for meal-plan-specific actions', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(screen.getByLabelText('Shopping List')).toBeInTheDocument();
      expect(screen.getByLabelText('View Calendar')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');

      // Tab to focus the button
      favoriteButton.focus();
      expect(favoriteButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(handlers.onFavorite).toHaveBeenCalledWith(mockMealPlanId);
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to QuickActions component', () => {
      const handlers = createMockHandlers();
      const ref = React.createRef<HTMLDivElement>();

      render(
        <MealPlanQuickActions
          ref={ref}
          mealPlanId={mockMealPlanId}
          handlers={handlers}
        />
      );

      expect(ref.current).not.toBeNull();
    });

    it('should forward additional props to QuickActions', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanQuickActions
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          data-testid="custom-test-id"
        />
      );

      // The custom test-id should be on the QuickActions div
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });
});
