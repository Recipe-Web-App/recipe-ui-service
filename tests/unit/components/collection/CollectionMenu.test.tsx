import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionMenu } from '@/components/collection/CollectionMenu';
import type { CollectionMenuActionHandlers } from '@/types/collection/menu';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <div data-testid="more-vertical-icon">MoreVertical</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  FolderOpen: () => <div data-testid="folder-open-icon">FolderOpen</div>,
  Share2: () => <div data-testid="share2-icon">Share2</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash2</div>,
  Flag: () => <div data-testid="flag-icon">Flag</div>,
}));

describe('CollectionMenu', () => {
  const mockCollectionId = 123;

  const createMockHandlers = (
    overrides?: Partial<CollectionMenuActionHandlers>
  ): CollectionMenuActionHandlers => ({
    onClick: jest.fn(),
    onEdit: jest.fn(),
    onManageRecipes: jest.fn(),
    onManageCollaborators: jest.fn(),
    onShare: jest.fn(),
    onDuplicate: jest.fn(),
    onDelete: jest.fn(),
    onReport: jest.fn(),
    ...overrides,
  });

  describe('Rendering', () => {
    it('should render the menu trigger button', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      expect(triggerButton).toBeInTheDocument();
      expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument();
    });

    it('should not render when no handlers are provided', () => {
      const handlers: CollectionMenuActionHandlers = {};
      const { container } = render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render with custom className', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          className="custom-class"
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      expect(triggerButton).toHaveClass('custom-class');
    });
  });

  describe('Owner Actions', () => {
    it('should display owner menu actions when isOwner is true', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Edit Collection')).toBeInTheDocument();
        expect(screen.getByText('Manage Recipes')).toBeInTheDocument();
        expect(screen.getByText('Manage Collaborators')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Delete Collection')).toBeInTheDocument();
      });
    });

    it('should call onEdit handler when Edit is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const editMenuItem = await screen.findByText('Edit Collection');
      await user.click(editMenuItem);

      expect(handlers.onEdit).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onManageCollaborators handler when Manage Collaborators is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const manageCollaboratorsMenuItem = await screen.findByText(
        'Manage Collaborators'
      );
      await user.click(manageCollaboratorsMenuItem);

      expect(handlers.onManageCollaborators).toHaveBeenCalledWith(
        mockCollectionId
      );
      expect(handlers.onManageCollaborators).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete handler when Delete is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const deleteMenuItem = await screen.findByText('Delete Collection');
      await user.click(deleteMenuItem);

      expect(handlers.onDelete).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Collaborator Actions', () => {
    it('should display collaborator menu actions when isCollaborator is true', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isCollaborator={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Manage Recipes')).toBeInTheDocument();
        expect(screen.getByText('Copy to My Collections')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
      });

      // Should NOT show owner-only actions
      expect(screen.queryByText('Edit Collection')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Manage Collaborators')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Collection')).not.toBeInTheDocument();
    });

    it('should call onManageRecipes handler for collaborator', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isCollaborator={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const manageRecipesMenuItem = await screen.findByText('Manage Recipes');
      await user.click(manageRecipesMenuItem);

      expect(handlers.onManageRecipes).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onManageRecipes).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Owner/Non-Collaborator Actions', () => {
    it('should display public menu actions for non-owner/non-collaborator', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={false}
          isCollaborator={false}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Copy to My Collections')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Report Collection')).toBeInTheDocument();
      });

      // Should NOT show owner/collaborator actions
      expect(screen.queryByText('Edit Collection')).not.toBeInTheDocument();
      expect(screen.queryByText('Manage Recipes')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Manage Collaborators')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Collection')).not.toBeInTheDocument();
    });

    it('should call onReport handler when Report is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={false}
          isCollaborator={false}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const reportMenuItem = await screen.findByText('Report Collection');
      await user.click(reportMenuItem);

      expect(handlers.onReport).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onReport).toHaveBeenCalledTimes(1);
    });
  });

  describe('Common Actions', () => {
    it('should call onClick handler when View Details is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const viewDetailsMenuItem = await screen.findByText('View Details');
      await user.click(viewDetailsMenuItem);

      expect(handlers.onClick).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onShare handler when Share is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const shareMenuItem = await screen.findByText('Share');
      await user.click(shareMenuItem);

      expect(handlers.onShare).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onShare).toHaveBeenCalledTimes(1);
    });

    it('should call onDuplicate handler when Copy to My Collections is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const duplicateMenuItem = await screen.findByText(
        'Copy to My Collections'
      );
      await user.click(duplicateMenuItem);

      expect(handlers.onDuplicate).toHaveBeenCalledWith(mockCollectionId);
      expect(handlers.onDuplicate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interactions', () => {
    it('should close menu after action is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const viewDetailsMenuItem = await screen.findByText('View Details');
      await user.click(viewDetailsMenuItem);

      // Menu should close
      await waitFor(() => {
        expect(screen.queryByText('View Details')).not.toBeInTheDocument();
      });
    });

    it('should stop event propagation when trigger is clicked', () => {
      const handlers = createMockHandlers();
      const onCardClick = jest.fn();

      const { container } = render(
        <div onClick={onCardClick}>
          <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
        </div>
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      fireEvent.click(triggerButton);

      // Parent onClick should NOT be called
      expect(onCardClick).not.toHaveBeenCalled();
    });

    it('should stop event propagation when menu item is clicked', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();
      const onCardClick = jest.fn();

      render(
        <div onClick={onCardClick}>
          <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
        </div>
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      const viewDetailsMenuItem = await screen.findByText('View Details');
      fireEvent.click(viewDetailsMenuItem);

      // Parent onClick should NOT be called
      expect(onCardClick).not.toHaveBeenCalled();
      // But handler should be called
      expect(handlers.onClick).toHaveBeenCalledWith(mockCollectionId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional handlers gracefully', async () => {
      const user = userEvent.setup();
      const handlers: CollectionMenuActionHandlers = {
        onClick: jest.fn(),
        // Other handlers are undefined
      };

      render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          isOwner={true}
        />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      await user.click(triggerButton);

      // Should only show View Details since other handlers are missing
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.queryByText('Edit Collection')).not.toBeInTheDocument();
      });
    });

    it('should render with different button sizes', () => {
      const handlers = createMockHandlers();
      const { rerender } = render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          size="sm"
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          size="lg"
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with different button variants', () => {
      const handlers = createMockHandlers();
      const { rerender } = render(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          variant="default"
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(
        <CollectionMenu
          collectionId={mockCollectionId}
          handlers={handlers}
          variant="outline"
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label for trigger button', () => {
      const handlers = createMockHandlers();
      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });
      expect(triggerButton).toHaveAccessibleName();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const handlers = createMockHandlers();

      render(
        <CollectionMenu collectionId={mockCollectionId} handlers={handlers} />
      );

      const triggerButton = screen.getByRole('button', {
        name: /collection menu/i,
      });

      // Focus the trigger button
      triggerButton.focus();
      expect(triggerButton).toHaveFocus();

      // Open menu with Enter key
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
    });
  });
});
