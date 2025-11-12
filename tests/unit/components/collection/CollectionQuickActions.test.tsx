import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionQuickActions } from '@/components/collection/CollectionQuickActions';
import type { CollectionQuickActionHandlers } from '@/types/collection/quick-actions';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share2-icon">Share2</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
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

describe('CollectionQuickActions', () => {
  const mockCollectionId = 123;

  const createMockHandlers = (
    overrides?: Partial<CollectionQuickActionHandlers>
  ): CollectionQuickActionHandlers => ({
    onFavorite: jest.fn(),
    onShare: jest.fn(),
    onAddRecipes: jest.fn(),
    onQuickView: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render quick actions when handlers are provided', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });

    it('should not render when no handlers are provided', () => {
      const handlers: CollectionQuickActionHandlers = {};
      const { container } = render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render with custom className', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          className="custom-class"
        />
      );

      const quickActions = screen.getByTestId('quick-actions');
      expect(quickActions).toHaveClass('custom-class');
    });
  });

  describe('Actions for All Users', () => {
    it('should display favorite action when onFavorite handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
    });

    it('should display share action when onShare handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(screen.getByLabelText('Share')).toBeInTheDocument();
    });

    it('should display quick view action when onQuickView handler is provided', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-action-quick_view')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick View')).toBeInTheDocument();
    });

    it('should call onFavorite handler when favorite action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onFavorite).toHaveBeenCalledTimes(1);
    });

    it('should call onShare handler when share action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const shareButton = screen.getByTestId('quick-action-share');
      fireEvent.click(shareButton);

      expect(handlers.onShare).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
    });

    it('should call onQuickView handler when quick view action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const quickViewButton = screen.getByTestId('quick-action-quick_view');
      fireEvent.click(quickViewButton);

      expect(handlers.onQuickView).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onQuickView).toHaveBeenCalledTimes(1);
    });
  });

  describe('Owner/Collaborator Actions', () => {
    it('should display add recipes action for owner', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      expect(
        screen.getByTestId('quick-action-add_recipes')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Add Recipes')).toBeInTheDocument();
    });

    it('should display add recipes action for collaborator', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isCollaborator={true}
        />
      );

      expect(
        screen.getByTestId('quick-action-add_recipes')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Add Recipes')).toBeInTheDocument();
    });

    it('should NOT display add recipes action for non-owner/non-collaborator', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={false}
          isCollaborator={false}
        />
      );

      expect(
        screen.queryByTestId('quick-action-add_recipes')
      ).not.toBeInTheDocument();
    });

    it('should call onAddRecipes handler when add recipes action is clicked', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const addRecipesButton = screen.getByTestId('quick-action-add_recipes');
      fireEvent.click(addRecipesButton);

      expect(handlers.onAddRecipes).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onAddRecipes).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conditional Rendering', () => {
    it('should only render actions with provided handlers', () => {
      const handlers: CollectionQuickActionHandlers = {
        onFavorite: jest.fn(),
        onShare: jest.fn(),
        // onAddRecipes and onQuickView are undefined
      };

      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-add_recipes')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-quick_view')
      ).not.toBeInTheDocument();
    });

    it('should render all actions when all handlers are provided', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-share')).toBeInTheDocument();
      expect(
        screen.getByTestId('quick-action-add_recipes')
      ).toBeInTheDocument();
      expect(screen.getByTestId('quick-action-quick_view')).toBeInTheDocument();
    });
  });

  describe('Multiple Clicks', () => {
    it('should handle multiple clicks on the same action', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);
      fireEvent.click(favoriteButton);
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledTimes(3);
      expect(handlers.onFavorite).toHaveBeenCalledWith(mockCollectionId);
    });

    it('should handle clicks on different actions', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      const shareButton = screen.getByTestId('quick-action-share');

      fireEvent.click(favoriteButton);
      fireEvent.click(shareButton);
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledTimes(2);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing handlers gracefully', () => {
      const handlers: CollectionQuickActionHandlers = {
        onFavorite: jest.fn(),
        // Other handlers undefined
      };

      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(screen.getByTestId('quick-action-favorite')).toBeInTheDocument();
      expect(
        screen.queryByTestId('quick-action-share')
      ).not.toBeInTheDocument();
    });

    it('should work with collectionId of 0', () => {
      const handlers = createMockHandlers();
      render(<CollectionQuickActions collectionId={0} handlers={handlers} />);

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith(0);
    });

    it('should work with negative collectionId', () => {
      const handlers = createMockHandlers();
      render(<CollectionQuickActions collectionId={-1} handlers={handlers} />);

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(handlers.onFavorite).toHaveBeenCalledWith(-1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all actions', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
      expect(screen.getByLabelText('Share')).toBeInTheDocument();
      expect(screen.getByLabelText('Add Recipes')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick View')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');

      // Tab to focus the button
      favoriteButton.focus();
      expect(favoriteButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(handlers.onFavorite).toHaveBeenCalledWith(mockCollectionId);
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to QuickActions component', () => {
      const handlers = createMockHandlers();
      const ref = React.createRef<HTMLDivElement>();

      render(
        <CollectionQuickActions
          ref={ref}
          collectionId={mockCollectionId}
          handlers={handlers}
        />
      );

      expect(ref.current).not.toBeNull();
    });

    it('should forward additional props to QuickActions', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionQuickActions
          collectionId={mockCollectionId}
          handlers={handlers}
          data-testid="custom-test-id"
        />
      );

      // The custom test-id should be on the QuickActions div
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });
});
