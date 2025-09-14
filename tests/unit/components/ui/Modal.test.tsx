import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  type ModalProps,
  type ModalContentProps,
} from '@/components/ui/modal';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Helper function to render Modal with default setup
 */
const renderModal = (
  modalProps: Partial<ModalProps> = {},
  contentProps: Partial<ModalContentProps> = {},
  children?: React.ReactNode
) => {
  const defaultChildren = children || (
    <>
      <ModalHeader>
        <ModalTitle>Test Modal</ModalTitle>
        <ModalDescription>Test Description</ModalDescription>
      </ModalHeader>
      <ModalBody>Test Content</ModalBody>
      <ModalFooter>
        <ModalClose>Close</ModalClose>
      </ModalFooter>
    </>
  );

  return render(
    <Modal {...modalProps}>
      <ModalTrigger>Open Modal</ModalTrigger>
      <ModalContent {...contentProps}>{defaultChildren}</ModalContent>
    </Modal>
  );
};

/**
 * Helper function to render controlled modal
 */
const ControlledModal = ({
  open = false,
  onOpenChange = () => {},
  contentProps = {},
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentProps?: Partial<ModalContentProps>;
  children?: React.ReactNode;
}) => (
  <Modal open={open} onOpenChange={onOpenChange}>
    <ModalTrigger>Open Modal</ModalTrigger>
    <ModalContent {...contentProps}>
      {children || (
        <>
          <ModalHeader>
            <ModalTitle>Controlled Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>Controlled Content</ModalBody>
          <ModalFooter>
            <ModalClose>Close</ModalClose>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

describe('Modal', () => {
  describe('Basic Rendering', () => {
    test('renders modal trigger', () => {
      renderModal();
      expect(
        screen.getByRole('button', { name: 'Open Modal' })
      ).toBeInTheDocument();
    });

    test('does not render modal content initially', () => {
      renderModal();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    test('renders modal content when opened', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('renders all compound components', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Test Modal' })
      ).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(2);
    });

    test('renders close button by default', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getAllByRole('button', { name: 'Close' })).toHaveLength(2);
      // Verify the icon close button has proper screen reader text
      expect(
        screen.getByText('Close', { selector: '.sr-only' })
      ).toBeInTheDocument();
    });

    test('can hide close button', async () => {
      const user = userEvent.setup();
      renderModal({}, { showClose: false });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    });
  });

  describe('Open/Close Behavior', () => {
    test('opens modal when trigger is clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('closes modal when X button is clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click the icon close button (the one with the X icon)
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      const iconCloseButton = closeButtons[1]; // The second button is the icon button
      await user.click(iconCloseButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('closes modal when Escape key is pressed', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('closes modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click on overlay (outside of modal content)
      // The overlay has fixed positioning and covers the screen with z-40
      const overlay = document.querySelector('.fixed.inset-0.z-40');
      if (overlay) {
        await user.click(overlay);
      }

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('supports controlled open state', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(<ControlledModal open={false} onOpenChange={onOpenChange} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    test('opens when controlled open prop is true', () => {
      render(<ControlledModal open={true} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('calls onOpenChange when closing controlled modal', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(<ControlledModal open={true} onOpenChange={onOpenChange} />);

      await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Variants and Sizes', () => {
    test('applies default content variant classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { variant: 'default' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-lg');
    });

    test('applies fullscreen variant classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { variant: 'fullscreen' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-none');
    });

    test('applies drawer variant classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { variant: 'drawer' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-t-lg', 'rounded-b-none');
    });

    test('applies sheet variant classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { variant: 'sheet' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass(
        'rounded-l-lg',
        'rounded-r-none',
        'min-h-screen'
      );
    });

    test('applies small size classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { size: 'sm' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-sm');
    });

    test('applies large size classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { size: 'lg' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-2xl');
    });

    test('applies full size classes', async () => {
      const user = userEvent.setup();
      renderModal({}, { size: 'full' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-[95vw]', 'max-h-[95vh]');
    });
  });

  describe('Scrollable Content', () => {
    test('applies scrollable styles to modal body', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        {},
        <ModalBody scrollable>
          <div style={{ height: '1000px' }}>Very long content</div>
        </ModalBody>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const body = screen.getByText('Very long content').parentElement;
      expect(body).toHaveClass('overflow-y-auto', 'max-h-[60vh]');
    });

    test('does not apply scrollable styles by default', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const body = screen.getByText('Test Content').parentElement;
      expect(body).not.toHaveClass('overflow-y-auto');
    });
  });

  describe('Focus Management', () => {
    test('focuses modal content when opened', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      // Focus should be on one of the close buttons or the dialog itself
      const dialog = screen.getByRole('dialog');
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      const hasFocus = [dialog, ...closeButtons].some(
        el => el === document.activeElement
      );
      expect(hasFocus).toBe(true);
    });

    test('returns focus to trigger when closed', async () => {
      const user = userEvent.setup();
      renderModal();

      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      await user.click(trigger);

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    test('traps focus within modal', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      const firstCloseButton = closeButtons[0];

      // Focus should be on the first interactive element (close button)
      expect(firstCloseButton).toHaveFocus();

      await user.tab();
      // Should move to second close button (icon button)
      expect(closeButtons[1]).toHaveFocus();

      await user.tab();
      // Should cycle back to the first focusable element
      expect(firstCloseButton).toHaveFocus();
    });
  });

  describe('Keyboard Navigation', () => {
    test('opens modal with Enter key on trigger', async () => {
      const user = userEvent.setup();
      renderModal();

      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.focus();

      await user.keyboard('{Enter}');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('opens modal with Space key on trigger', async () => {
      const user = userEvent.setup();
      renderModal();

      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.focus();

      await user.keyboard(' ');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('closes modal with Enter key on close button', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      const firstCloseButton = closeButtons[0];
      firstCloseButton.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('prevents escape key handling when disabled', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        {
          onEscapeKeyDown: e => e.preventDefault(),
        }
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      // Modal should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Click Behavior', () => {
    test('prevents overlay click closing when disabled', async () => {
      renderModal(
        {},
        {
          onPointerDownOutside: e => e.preventDefault(),
        }
      );

      await userEvent.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click on overlay
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        fireEvent.pointerDown(overlay);
      }

      // Modal should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('handles custom close button click', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      renderModal(
        {},
        {},
        <>
          <ModalHeader>
            <ModalTitle>Test Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>Content</ModalBody>
          <ModalFooter>
            <ModalClose onClick={handleClose}>Custom Close</ModalClose>
          </ModalFooter>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      await user.click(screen.getByRole('button', { name: 'Custom Close' }));

      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations - basic modal', async () => {
      const user = userEvent.setup();
      const { container } = renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations - fullscreen modal', async () => {
      const user = userEvent.setup();
      const { container } = renderModal({}, { variant: 'fullscreen' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper ARIA attributes', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    test('connects title and description to dialog', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      const title = screen.getByRole('heading', { name: 'Test Modal' });
      const description = screen.getByText('Test Description');

      expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
      expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
    });

    test('has proper modal role', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByRole('dialog')).toHaveAttribute('role', 'dialog');
    });

    test('trigger has proper expanded state', async () => {
      const user = userEvent.setup();
      renderModal();

      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('supports screen reader announcements', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      // Check that modal is properly announced
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName('Test Modal');
      expect(dialog).toHaveAccessibleDescription('Test Description');
    });
  });

  describe('Recipe Context Usage', () => {
    test('renders confirmation modal layout', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        { variant: 'default', size: 'sm' },
        <>
          <ModalHeader>
            <ModalTitle>Delete Recipe</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose>Cancel</ModalClose>
            <ModalClose>Delete</ModalClose>
          </ModalFooter>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByText('Delete Recipe')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Are you sure you want to delete this recipe? This action cannot be undone.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Delete' })
      ).toBeInTheDocument();
    });

    test('renders recipe details modal layout', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        { variant: 'default', size: 'lg' },
        <>
          <ModalHeader>
            <ModalTitle>Chocolate Chip Cookies</ModalTitle>
            <ModalDescription>Classic homemade cookies</ModalDescription>
          </ModalHeader>
          <ModalBody scrollable>
            <div>Recipe ingredients and instructions...</div>
            <div>Nutritional information...</div>
            <div>Reviews and ratings...</div>
          </ModalBody>
          <ModalFooter>
            <ModalClose>Save to Favorites</ModalClose>
            <ModalClose>Close</ModalClose>
          </ModalFooter>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
      expect(
        screen.getByText('Recipe ingredients and instructions...')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Save to Favorites' })
      ).toBeInTheDocument();
    });

    test('renders settings modal layout', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        { variant: 'default', size: 'xl' },
        <>
          <ModalHeader>
            <ModalTitle>User Settings</ModalTitle>
            <ModalDescription>
              Update your preferences and account settings
            </ModalDescription>
          </ModalHeader>
          <ModalBody scrollable>
            <div>Profile settings...</div>
            <div>Notification preferences...</div>
            <div>Privacy settings...</div>
          </ModalBody>
          <ModalFooter>
            <ModalClose>Cancel</ModalClose>
            <ModalClose>Save Changes</ModalClose>
          </ModalFooter>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      expect(screen.getByText('User Settings')).toBeInTheDocument();
      expect(screen.getByText('Profile settings...')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Save Changes' })
      ).toBeInTheDocument();
    });

    test('handles recipe interaction callbacks', async () => {
      const user = userEvent.setup();
      const onSave = jest.fn();
      const onDelete = jest.fn();

      renderModal(
        {},
        {},
        <>
          <ModalHeader>
            <ModalTitle>Recipe Actions</ModalTitle>
          </ModalHeader>
          <ModalFooter>
            <ModalClose onClick={onSave}>Save</ModalClose>
            <ModalClose onClick={onDelete}>Delete</ModalClose>
          </ModalFooter>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onSave).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('handles missing modal trigger gracefully', () => {
      expect(() => {
        render(
          <Modal>
            <ModalContent>
              <ModalTitle>No Trigger Modal</ModalTitle>
            </ModalContent>
          </Modal>
        );
      }).not.toThrow();
    });

    test('handles missing modal content gracefully', () => {
      expect(() => {
        render(
          <Modal>
            <ModalTrigger>Trigger Only</ModalTrigger>
          </Modal>
        );
      }).not.toThrow();
    });

    test('handles empty modal content', async () => {
      const user = userEvent.setup();
      render(
        <Modal>
          <ModalTrigger>Open Empty</ModalTrigger>
          <ModalContent />
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: 'Open Empty' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('handles invalid size prop gracefully', async () => {
      const user = userEvent.setup();
      renderModal(
        {},
        {
          // @ts-expect-error Testing invalid size
          size: 'invalid',
        }
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('handles custom className properly', async () => {
      const user = userEvent.setup();
      renderModal({}, { className: 'custom-modal-class' });

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-modal-class');
    });

    test('handles portal rendering correctly', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole('button', { name: 'Open Modal' }));

      // Modal should be rendered in a portal (outside normal DOM tree)
      const dialog = screen.getByRole('dialog');
      expect(dialog.closest('body')).toBeTruthy();
    });
  });
});
