import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MealPlanMenu } from '@/components/meal-plan/MealPlanMenu';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <div data-testid="more-vertical-icon">MoreVertical</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Share2: () => <div data-testid="share2-icon">Share2</div>,
  ShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCart</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash2</div>,
}));

describe('MealPlanMenu', () => {
  const mockMealPlanId = 'meal-plan-123';

  const createMockHandlers = (
    overrides?: Partial<MealPlanMenuActionHandlers>
  ): MealPlanMenuActionHandlers => ({
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDuplicate: jest.fn(),
    onShare: jest.fn(),
    onGenerateShoppingList: jest.fn(),
    onDelete: jest.fn(),
    ...overrides,
  });

  describe('Rendering', () => {
    it('should render the menu trigger button', () => {
      const handlers = createMockHandlers();
      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      expect(triggerButton).toBeInTheDocument();
      expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument();
    });

    it('should not render when no handlers are provided', () => {
      const handlers: MealPlanMenuActionHandlers = {};
      const { container } = render(
        <MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render with custom className', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          className="custom-class"
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      expect(triggerButton).toHaveClass('custom-class');
    });
  });

  describe('Owner Actions', () => {
    it('should display owner menu actions when isOwner is true', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Edit Meal Plan')).toBeInTheDocument();
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Generate Shopping List')).toBeInTheDocument();
        expect(screen.getByText('Delete Meal Plan')).toBeInTheDocument();
      });
    });

    it('should call onView handler when View Details is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const viewMenuItem = await screen.findByText('View Details');
      await user.click(viewMenuItem);

      expect(handlers.onView).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onView).toHaveBeenCalledTimes(1);
    });

    it('should call onEdit handler when Edit is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const editMenuItem = await screen.findByText('Edit Meal Plan');
      await user.click(editMenuItem);

      expect(handlers.onEdit).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete handler when Delete is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const deleteMenuItem = await screen.findByText('Delete Meal Plan');
      await user.click(deleteMenuItem);

      expect(handlers.onDelete).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Owner Actions', () => {
    it('should display public menu actions for non-owners', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={false}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Generate Shopping List')).toBeInTheDocument();
      });

      // Should NOT show owner-only actions
      expect(screen.queryByText('Edit Meal Plan')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Meal Plan')).not.toBeInTheDocument();
    });

    it('should call onDuplicate handler for non-owner', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={false}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const duplicateMenuItem = await screen.findByText('Duplicate');
      await user.click(duplicateMenuItem);

      expect(handlers.onDuplicate).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onDuplicate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Common Actions (All Users)', () => {
    it('should call onShare handler when Share is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const shareMenuItem = await screen.findByText('Share');
      await user.click(shareMenuItem);

      expect(handlers.onShare).toHaveBeenCalledWith(mockMealPlanId);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
    });

    it('should call onGenerateShoppingList handler when Generate Shopping List is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const generateShoppingListMenuItem = await screen.findByText(
        'Generate Shopping List'
      );
      await user.click(generateShoppingListMenuItem);

      expect(handlers.onGenerateShoppingList).toHaveBeenCalledWith(
        mockMealPlanId
      );
      expect(handlers.onGenerateShoppingList).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conditional Rendering', () => {
    it('should only render menu items with provided handlers', async () => {
      const user = userEvent.setup();
      const handlers: MealPlanMenuActionHandlers = {
        onView: jest.fn(),
        onShare: jest.fn(),
        // Other handlers undefined
      };

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
      });

      expect(screen.queryByText('Edit Meal Plan')).not.toBeInTheDocument();
      expect(screen.queryByText('Duplicate')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Generate Shopping List')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Meal Plan')).not.toBeInTheDocument();
    });
  });

  describe('Menu Open/Close State', () => {
    it('should close menu after clicking an action', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });

      // Open menu
      await user.click(triggerButton);
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });

      // Click an action
      const viewMenuItem = screen.getByText('View Details');
      await user.click(viewMenuItem);

      // Menu should close
      await waitFor(() => {
        expect(screen.queryByText('View Details')).not.toBeInTheDocument();
      });
    });
  });

  describe('Click Event Propagation', () => {
    it('should stop propagation when clicking trigger button', () => {
      const handlers = createMockHandlers();
      const parentClickHandler = jest.fn();

      const { container } = render(
        <div onClick={parentClickHandler}>
          <MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />
        </div>
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      fireEvent.click(triggerButton);

      // Parent click handler should NOT be called due to stopPropagation
      expect(parentClickHandler).not.toHaveBeenCalled();
    });

    it('should stop propagation when clicking menu items', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();
      const parentClickHandler = jest.fn();

      render(
        <div onClick={parentClickHandler}>
          <MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />
        </div>
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const viewMenuItem = await screen.findByText('View Details');
      fireEvent.click(viewMenuItem);

      // Parent click handler should NOT be called due to stopPropagation
      expect(parentClickHandler).not.toHaveBeenCalled();
      // Handler should still be called
      expect(handlers.onView).toHaveBeenCalledWith(mockMealPlanId);
    });
  });

  describe('Edge Cases', () => {
    it('should work with empty mealPlanId', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId="" handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const viewMenuItem = await screen.findByText('View Details');
      await user.click(viewMenuItem);

      expect(handlers.onView).toHaveBeenCalledWith('');
    });

    it('should work with UUID mealPlanId', async () => {
      const user = userEvent.setup();
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId={uuid} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const viewMenuItem = await screen.findByText('View Details');
      await user.click(viewMenuItem);

      expect(handlers.onView).toHaveBeenCalledWith(uuid);
    });
  });

  describe('Destructive Action Styling', () => {
    it('should apply destructive styling to delete action', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      await user.click(triggerButton);

      const deleteMenuItem = await screen.findByText('Delete Meal Plan');
      // Check for destructive styling classes
      const menuItem = deleteMenuItem.closest('[role="menuitem"]');
      expect(menuItem).toHaveClass('text-destructive');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const handlers = createMockHandlers();
      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      expect(triggerButton).toHaveAttribute('aria-label', 'Meal plan menu');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(<MealPlanMenu mealPlanId={mockMealPlanId} handlers={handlers} />);

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });

      // Tab to focus the button
      triggerButton.focus();
      expect(triggerButton).toHaveFocus();

      // Press Enter to open menu
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to Button component', () => {
      const handlers = createMockHandlers();
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <MealPlanMenu
          ref={ref}
          mealPlanId={mockMealPlanId}
          handlers={handlers}
        />
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should accept custom size prop', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          size="sm"
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      expect(triggerButton).toBeInTheDocument();
    });

    it('should accept custom variant prop', () => {
      const handlers = createMockHandlers();
      render(
        <MealPlanMenu
          mealPlanId={mockMealPlanId}
          handlers={handlers}
          variant="outline"
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /meal plan menu/i,
      });
      expect(triggerButton).toBeInTheDocument();
    });
  });
});
