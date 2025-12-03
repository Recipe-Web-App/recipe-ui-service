import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BulkActionToolbar } from '@/components/recipe/BulkActionToolbar';

expect.extend(toHaveNoViolations);

describe('BulkActionToolbar', () => {
  const defaultProps = {
    selectedCount: 3,
    totalCount: 10,
    onSelectAll: jest.fn(),
    onDeselectAll: jest.fn(),
    onDelete: jest.fn(),
    onAddToCollection: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the toolbar with all elements', () => {
      render(<BulkActionToolbar {...defaultProps} />);

      expect(screen.getByTestId('bulk-action-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-select-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-selection-count')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-add-to-collection')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-delete')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-cancel')).toBeInTheDocument();
    });

    it('displays correct selection count for single item', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={1} />);

      expect(screen.getByText('1 recipe selected')).toBeInTheDocument();
    });

    it('displays correct selection count for multiple items', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={5} />);

      expect(screen.getByText('5 recipes selected')).toBeInTheDocument();
    });

    it('displays "No items selected" when count is zero', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={0} />);

      expect(screen.getByText('No items selected')).toBeInTheDocument();
    });

    it('shows "Select All" when not all selected', () => {
      render(
        <BulkActionToolbar
          {...defaultProps}
          selectedCount={3}
          totalCount={10}
        />
      );

      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('shows "Deselect All" when all selected', () => {
      render(
        <BulkActionToolbar
          {...defaultProps}
          selectedCount={10}
          totalCount={10}
        />
      );

      expect(screen.getByText('Deselect All')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<BulkActionToolbar {...defaultProps} className="custom-class" />);

      const toolbar = screen.getByTestId('bulk-action-toolbar');
      expect(toolbar).toHaveClass('custom-class');
    });

    it('shows "Deleting..." when isDeleting is true', () => {
      render(<BulkActionToolbar {...defaultProps} isDeleting={true} />);

      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('disables action buttons when no items selected', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={0} />);

      expect(screen.getByTestId('bulk-add-to-collection')).toBeDisabled();
      expect(screen.getByTestId('bulk-delete')).toBeDisabled();
    });

    it('enables action buttons when items are selected', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={3} />);

      expect(screen.getByTestId('bulk-add-to-collection')).not.toBeDisabled();
      expect(screen.getByTestId('bulk-delete')).not.toBeDisabled();
    });

    it('disables delete button when isDeleting', () => {
      render(<BulkActionToolbar {...defaultProps} isDeleting={true} />);

      expect(screen.getByTestId('bulk-delete')).toBeDisabled();
    });

    it('select toggle and cancel are always enabled', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={0} />);

      expect(screen.getByTestId('bulk-select-toggle')).not.toBeDisabled();
      expect(screen.getByTestId('bulk-cancel')).not.toBeDisabled();
    });
  });

  describe('Actions', () => {
    it('calls onSelectAll when Select All is clicked', async () => {
      const user = userEvent.setup();

      render(
        <BulkActionToolbar
          {...defaultProps}
          selectedCount={3}
          totalCount={10}
        />
      );

      await user.click(screen.getByTestId('bulk-select-toggle'));

      expect(defaultProps.onSelectAll).toHaveBeenCalledTimes(1);
      expect(defaultProps.onDeselectAll).not.toHaveBeenCalled();
    });

    it('calls onDeselectAll when Deselect All is clicked', async () => {
      const user = userEvent.setup();

      render(
        <BulkActionToolbar
          {...defaultProps}
          selectedCount={10}
          totalCount={10}
        />
      );

      await user.click(screen.getByTestId('bulk-select-toggle'));

      expect(defaultProps.onDeselectAll).toHaveBeenCalledTimes(1);
      expect(defaultProps.onSelectAll).not.toHaveBeenCalled();
    });

    it('calls onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();

      render(<BulkActionToolbar {...defaultProps} />);

      await user.click(screen.getByTestId('bulk-delete'));

      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    });

    it('calls onAddToCollection when Add to Collection is clicked', async () => {
      const user = userEvent.setup();

      render(<BulkActionToolbar {...defaultProps} />);

      await user.click(screen.getByTestId('bulk-add-to-collection'));

      expect(defaultProps.onAddToCollection).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<BulkActionToolbar {...defaultProps} />);

      await user.click(screen.getByTestId('bulk-cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onDelete when button is disabled', async () => {
      const user = userEvent.setup();

      render(<BulkActionToolbar {...defaultProps} selectedCount={0} />);

      const deleteButton = screen.getByTestId('bulk-delete');
      await user.click(deleteButton);

      expect(defaultProps.onDelete).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<BulkActionToolbar {...defaultProps} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="toolbar" for the container', () => {
      render(<BulkActionToolbar {...defaultProps} />);

      const toolbar = screen.getByTestId('bulk-action-toolbar');
      expect(toolbar).toHaveAttribute('role', 'toolbar');
    });

    it('has aria-label on the toolbar', () => {
      render(<BulkActionToolbar {...defaultProps} />);

      const toolbar = screen.getByTestId('bulk-action-toolbar');
      expect(toolbar).toHaveAttribute('aria-label', 'Bulk actions toolbar');
    });

    it('has aria-live on selection count for announcements', () => {
      render(<BulkActionToolbar {...defaultProps} />);

      const count = screen.getByTestId('bulk-selection-count');
      expect(count).toHaveAttribute('aria-live', 'polite');
    });

    it('has descriptive aria-labels on all buttons', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={3} />);

      expect(
        screen.getByRole('button', { name: /select all recipes/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: /add selected recipes to collection/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete 3 selected recipes/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel selection mode/i })
      ).toBeInTheDocument();
    });

    it('has correct aria-label for single item deletion', () => {
      render(<BulkActionToolbar {...defaultProps} selectedCount={1} />);

      expect(
        screen.getByRole('button', { name: /delete 1 selected recipe$/i })
      ).toBeInTheDocument();
    });

    it('has aria-hidden on decorative icons', () => {
      render(<BulkActionToolbar {...defaultProps} />);

      const icons = screen
        .getByTestId('bulk-action-toolbar')
        .querySelectorAll('svg');
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total count', () => {
      render(
        <BulkActionToolbar {...defaultProps} selectedCount={0} totalCount={0} />
      );

      expect(screen.getByText('No items selected')).toBeInTheDocument();
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('handles selectedCount greater than totalCount gracefully', () => {
      // This shouldn't happen in practice but component should handle it
      render(
        <BulkActionToolbar
          {...defaultProps}
          selectedCount={15}
          totalCount={10}
        />
      );

      expect(screen.getByText('15 recipes selected')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<BulkActionToolbar {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'bulk-action-toolbar');
    });
  });
});
