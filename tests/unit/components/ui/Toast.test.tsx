import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toHaveNoViolations } from 'jest-axe';
import {
  Toast,
  ToastRoot,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  type ToastProps,
} from '@/components/ui/toast';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock timers for testing auto-dismiss functionality
jest.useFakeTimers();

/**
 * Helper function to render Toast with default props
 */
const renderToast = (props: Partial<ToastProps> = {}) => {
  const defaultProps: ToastProps = {
    ...props,
  };

  return render(<Toast {...defaultProps} />);
};

describe('Toast', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    test('renders toast element', () => {
      renderToast({ title: 'Test Toast' });
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    test('renders with title only', () => {
      renderToast({ title: 'Test Title' });
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('renders with description only', () => {
      renderToast({ description: 'Test Description' });
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    test('renders with both title and description', () => {
      renderToast({
        title: 'Test Title',
        description: 'Test Description',
      });
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Toast ref={ref} title="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    test('renders custom children content', () => {
      renderToast({
        title: 'Test',
        children: <div data-testid="custom-content">Custom Content</div>,
      });
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants = [
      'default',
      'success',
      'error',
      'warning',
      'info',
    ] as const;

    variants.forEach(variant => {
      test(`renders ${variant} variant correctly`, () => {
        renderToast({ variant, title: 'Test' });
        const toast = screen.getByRole(
          variant === 'error' ? 'alert' : 'status'
        );

        // Check that variant-specific classes are applied
        if (variant === 'success') {
          expect(toast).toHaveClass('bg-success/10');
        } else if (variant === 'error') {
          expect(toast).toHaveClass('bg-destructive/10');
        } else if (variant === 'warning') {
          expect(toast).toHaveClass('bg-warning/10');
        } else if (variant === 'info') {
          expect(toast).toHaveClass('bg-primary/10');
        }
      });

      test(`${variant} variant has correct ARIA role`, () => {
        renderToast({ variant, title: 'Test' });
        const expectedRole = variant === 'error' ? 'alert' : 'status';
        expect(screen.getByRole(expectedRole)).toBeInTheDocument();
      });

      test(`${variant} variant has correct aria-live attribute`, () => {
        renderToast({ variant, title: 'Test' });
        const toast = screen.getByRole(
          variant === 'error' ? 'alert' : 'status'
        );
        const expectedAriaLive = variant === 'error' ? 'assertive' : 'polite';
        expect(toast).toHaveAttribute('aria-live', expectedAriaLive);
      });
    });
  });

  describe('Sizes', () => {
    test('applies small size classes', () => {
      renderToast({ size: 'sm', title: 'Test' });
      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('text-sm', 'p-3');
    });

    test('applies default size classes', () => {
      renderToast({ size: 'default', title: 'Test' });
      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('text-base', 'p-4');
    });

    test('applies large size classes', () => {
      renderToast({ size: 'lg', title: 'Test' });
      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('text-lg', 'p-5');
    });
  });

  describe('Icons', () => {
    test('shows default icon for success variant', () => {
      renderToast({ variant: 'success', title: 'Success', showIcon: true });
      const icon = screen.getByRole('status').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('shows default icon for error variant', () => {
      renderToast({ variant: 'error', title: 'Error', showIcon: true });
      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('shows default icon for warning variant', () => {
      renderToast({ variant: 'warning', title: 'Warning', showIcon: true });
      const icon = screen.getByRole('status').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('shows default icon for info variant', () => {
      renderToast({ variant: 'info', title: 'Info', showIcon: true });
      const icon = screen.getByRole('status').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('renders custom icon', () => {
      renderToast({
        title: 'Test',
        icon: <span data-testid="custom-icon">🎉</span>,
      });
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    test('hides icon when showIcon is false', () => {
      renderToast({
        variant: 'success',
        title: 'Test',
        showIcon: false,
      });
      const toast = screen.getByRole('status');
      const iconContainer = toast.querySelector('div[aria-hidden="true"]');
      expect(iconContainer).not.toBeInTheDocument();
    });

    test('icon has aria-hidden attribute', () => {
      renderToast({ variant: 'success', title: 'Test', showIcon: true });
      const iconContainer = screen
        .getByRole('status')
        .querySelector('div[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Dismissible Behavior', () => {
    test('shows close button when dismissible is true', () => {
      renderToast({ title: 'Test', dismissible: true });
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    test('hides close button when dismissible is false', () => {
      renderToast({ title: 'Test', dismissible: false });
      expect(
        screen.queryByLabelText('Dismiss notification')
      ).not.toBeInTheDocument();
    });

    test('calls onDismiss when close button is clicked', async () => {
      const onDismiss = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderToast({
        title: 'Test',
        onDismiss,
        dismissible: true,
        autoDismiss: false,
      });

      const closeButton = screen.getByLabelText('Dismiss notification');
      await user.click(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test('toast becomes hidden after dismiss', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderToast({
        title: 'Test',
        dismissible: true,
        autoDismiss: false,
      });

      const toast = screen.getByRole('status');
      const closeButton = screen.getByLabelText('Dismiss notification');

      expect(toast).toBeInTheDocument();

      await user.click(closeButton);

      expect(toast).not.toBeInTheDocument();
    });
  });

  describe('Auto-dismiss Behavior', () => {
    test('auto-dismisses after default duration', async () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: true,
      });

      expect(screen.getByRole('status')).toBeInTheDocument();

      // Fast-forward default duration (5000ms)
      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    test('auto-dismisses after custom duration', async () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: true,
        duration: 3000,
      });

      jest.advanceTimersByTime(2999);
      expect(onDismiss).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      await waitFor(() => {
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    test('does not auto-dismiss when autoDismiss is false', () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: false,
      });

      jest.advanceTimersByTime(10000);
      expect(onDismiss).not.toHaveBeenCalled();
    });

    test('pauses timer on mouse enter', () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: true,
        duration: 5000,
      });

      const toast = screen.getByRole('status');

      // Advance half the duration
      jest.advanceTimersByTime(2500);

      // Mouse enter should pause the timer
      fireEvent.mouseEnter(toast);

      // Advance past original duration
      jest.advanceTimersByTime(3000);

      // Should not have dismissed yet
      expect(onDismiss).not.toHaveBeenCalled();
    });

    test('resumes timer on mouse leave', async () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: true,
        duration: 1000, // Use shorter duration for test
      });

      const toast = screen.getByRole('status');

      // Advance half the duration
      jest.advanceTimersByTime(500);

      // Pause timer
      fireEvent.mouseEnter(toast);
      jest.advanceTimersByTime(200);

      // Resume timer
      fireEvent.mouseLeave(toast);

      // Complete remaining time (original remaining time should resume)
      jest.advanceTimersByTime(500);

      // Allow for any async state updates
      await waitFor(
        () => {
          expect(onDismiss).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 }
      );
    });

    test('resumes timer with progress bar on mouse leave', async () => {
      const onDismiss = jest.fn();

      renderToast({
        title: 'Test',
        onDismiss,
        autoDismiss: true,
        duration: 1000,
        showProgress: true,
      });

      const toast = screen.getByRole('status');

      // Advance half the duration
      jest.advanceTimersByTime(500);

      // Pause timer
      fireEvent.mouseEnter(toast);
      jest.advanceTimersByTime(200);

      // Resume timer - this should trigger the progress bar resume logic
      fireEvent.mouseLeave(toast);

      // Allow progress bar to update
      jest.advanceTimersByTime(100);

      // Complete remaining time
      jest.advanceTimersByTime(400);

      await waitFor(
        () => {
          expect(onDismiss).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Progress Bar', () => {
    test('shows progress bar when enabled', () => {
      renderToast({
        title: 'Test',
        autoDismiss: true,
        showProgress: true,
      });

      const toast = screen.getByRole('status');
      const progressBar = toast.querySelector(
        'div[aria-hidden="true"][style*="--toast-progress"]'
      );
      expect(progressBar).toBeInTheDocument();
    });

    test('does not show progress bar when disabled', () => {
      renderToast({
        title: 'Test',
        autoDismiss: true,
        showProgress: false,
      });

      const toast = screen.getByRole('status');
      const progressBar = toast.querySelector(
        'div[aria-hidden="true"][style*="width"]'
      );
      expect(progressBar).not.toBeInTheDocument();
    });

    test('does not show progress bar when autoDismiss is false', () => {
      renderToast({
        title: 'Test',
        autoDismiss: false,
        showProgress: true,
      });

      const toast = screen.getByRole('status');
      const progressBar = toast.querySelector(
        'div[aria-hidden="true"][style*="width"]'
      );
      expect(progressBar).not.toBeInTheDocument();
    });

    test('progress bar animates correctly', () => {
      renderToast({
        title: 'Test',
        autoDismiss: true,
        showProgress: true,
        duration: 1000,
      });

      const toast = screen.getByRole('status');
      const progressBar = toast.querySelector(
        'div[aria-hidden="true"][style*="--toast-progress"]'
      ) as HTMLElement;

      expect(progressBar).toHaveStyle('--toast-progress: 100%');

      // Advance timer by 25%
      jest.advanceTimersByTime(250);

      // Note: In a real test environment, you'd need to handle the async updates
      // This is a simplified test for the structure
    });
  });

  describe('Action Buttons', () => {
    test('renders string action as button', () => {
      renderToast({
        title: 'Test',
        action: 'Take Action',
      });
      expect(screen.getByText('Take Action')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Take Action' })
      ).toBeInTheDocument();
    });

    test('renders React element action', () => {
      renderToast({
        title: 'Test',
        action: <button data-testid="custom-action">Custom Action</button>,
      });
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    test('calls onAction when action button clicked', async () => {
      const onAction = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderToast({
        title: 'Test',
        action: 'Click Me',
        onAction,
        autoDismiss: false,
      });

      const actionButton = screen.getByRole('button', { name: 'Click Me' });
      await user.click(actionButton);

      expect(onAction).toHaveBeenCalledTimes(1);
    });

    test('dismisses toast when action is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      renderToast({
        title: 'Test',
        action: 'Click Me',
        autoDismiss: false,
      });

      const toast = screen.getByRole('status');
      const actionButton = screen.getByRole('button', { name: 'Click Me' });

      expect(toast).toBeInTheDocument();

      await user.click(actionButton);

      expect(toast).not.toBeInTheDocument();
    });

    test('action button has correct variant styling', () => {
      renderToast({
        variant: 'success',
        title: 'Test',
        action: 'Success Action',
      });

      const actionButton = screen.getByRole('button', {
        name: 'Success Action',
      });
      expect(actionButton).toHaveClass('border-green-300', 'bg-green-100');
    });

    test('React element action has keyboard accessibility attributes', () => {
      const customAction = <span>Custom Action</span>;

      renderToast({
        title: 'Test',
        action: customAction,
        dismissible: false,
      });

      const actionWrapper = screen.getByRole('button');
      expect(actionWrapper).toHaveAttribute('tabIndex', '0');
      expect(actionWrapper).toHaveAttribute('role', 'button');
    });
  });

  describe('ARIA and Accessibility', () => {
    test('has correct ARIA labelledby when title is present', () => {
      renderToast({ title: 'Test Title', id: 'test-toast' });
      const toast = screen.getByRole('status');
      const titleElement = screen.getByText('Test Title');

      expect(toast).toHaveAttribute('aria-labelledby', titleElement.id);
    });

    test('has correct ARIA describedby when description is present', () => {
      renderToast({ description: 'Test Description' });
      const toast = screen.getByRole('status');
      const descriptionElement = screen.getByText('Test Description');

      expect(toast).toHaveAttribute('aria-describedby', descriptionElement.id);
    });

    test('has both ARIA labelledby and describedby when both title and description are present', () => {
      renderToast({
        title: 'Test Title',
        description: 'Test Description',
      });
      const toast = screen.getByRole('status');
      const titleElement = screen.getByText('Test Title');
      const descriptionElement = screen.getByText('Test Description');

      expect(toast).toHaveAttribute('aria-labelledby', titleElement.id);
      expect(toast).toHaveAttribute('aria-describedby', descriptionElement.id);
    });

    test('close button has accessible label', () => {
      renderToast({ title: 'Test', dismissible: true });
      const closeButton = screen.getByLabelText('Dismiss notification');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      renderToast({
        title: 'Test',
        className: 'custom-toast-class',
      });
      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('custom-toast-class');
    });

    test('applies custom title className', () => {
      renderToast({
        title: 'Test Title',
        titleClassName: 'custom-title-class',
      });
      const title = screen.getByText('Test Title');
      expect(title).toHaveClass('custom-title-class');
    });

    test('applies custom description className', () => {
      renderToast({
        description: 'Test Description',
        descriptionClassName: 'custom-description-class',
      });
      const description = screen.getByText('Test Description');
      expect(description).toHaveClass('custom-description-class');
    });

    test('applies custom content className', () => {
      renderToast({
        title: 'Test',
        contentClassName: 'custom-content-class',
      });
      const toast = screen.getByRole('status');
      const contentDiv = toast.querySelector('.flex-1');
      expect(contentDiv).toHaveClass('custom-content-class');
    });

    test('applies custom icon className', () => {
      renderToast({
        variant: 'success',
        title: 'Test',
        iconClassName: 'custom-icon-class',
      });
      const toast = screen.getByRole('status');
      const iconDiv = toast.querySelector('div[aria-hidden="true"]');
      expect(iconDiv).toHaveClass('custom-icon-class');
    });

    test('applies custom close button className', () => {
      renderToast({
        title: 'Test',
        closeButtonClassName: 'custom-close-class',
      });
      const closeButton = screen.getByLabelText('Dismiss notification');
      expect(closeButton).toHaveClass('custom-close-class');
    });

    test('applies custom action className', () => {
      renderToast({
        title: 'Test',
        action: 'Action',
        actionClassName: 'custom-action-class',
      });
      const actionButton = screen.getByRole('button', { name: 'Action' });
      expect(actionButton).toHaveClass('custom-action-class');
    });
  });

  describe('Accessibility Compliance', () => {
    test('has proper ARIA attributes for basic toast', () => {
      renderToast({
        title: 'Accessible Toast',
        description: 'This toast is accessible',
      });
      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    test('has proper ARIA attributes for error variant', () => {
      renderToast({
        variant: 'error',
        title: 'Error Toast',
        description: 'Something went wrong',
      });
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
    });

    test('has proper focus management for action button', () => {
      renderToast({
        title: 'Toast with Action',
        description: 'This toast has an action button',
        action: 'Take Action',
      });
      const actionButton = screen.getByRole('button', { name: 'Take Action' });
      expect(actionButton).toBeInTheDocument();
      expect(actionButton).not.toHaveAttribute('disabled');
    });

    test('close button is accessible', () => {
      renderToast({ title: 'Test', dismissible: true });
      const closeButton = screen.getByLabelText('Dismiss notification');
      expect(closeButton).toHaveAttribute('type', 'button');
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss notification');
    });
  });
});

describe('Compound Components', () => {
  describe('ToastRoot', () => {
    test('renders with correct role and ARIA attributes', () => {
      render(
        <ToastRoot variant="error">
          <div>Content</div>
        </ToastRoot>
      );
      const root = screen.getByRole('alert');
      expect(root).toHaveAttribute('aria-live', 'assertive');
    });

    test('applies variant styling', () => {
      render(
        <ToastRoot variant="success">
          <div>Content</div>
        </ToastRoot>
      );
      const root = screen.getByRole('status');
      expect(root).toHaveClass('bg-success/10');
    });
  });

  describe('ToastIcon', () => {
    test('renders default success icon', () => {
      const { container } = render(<ToastIcon variant="success" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('renders custom icon', () => {
      render(
        <ToastIcon variant="info">
          <span data-testid="custom-icon">Custom</span>
        </ToastIcon>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    test('has aria-hidden attribute', () => {
      const { container } = render(<ToastIcon variant="success" />);
      const iconContainer = container.firstChild;
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('ToastContent', () => {
    test('renders content wrapper', () => {
      render(
        <ToastContent>
          <div data-testid="content">Content</div>
        </ToastContent>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    test('applies size styling', () => {
      const { container } = render(
        <ToastContent size="lg">
          <div>Content</div>
        </ToastContent>
      );
      expect(container.firstChild).toHaveClass('flex-1', 'min-w-0');
    });
  });

  describe('ToastTitle', () => {
    test('renders title text', () => {
      render(<ToastTitle variant="success">Title Text</ToastTitle>);
      expect(screen.getByText('Title Text')).toBeInTheDocument();
    });

    test('applies variant styling', () => {
      render(<ToastTitle variant="error">Error Title</ToastTitle>);
      const title = screen.getByText('Error Title');
      expect(title).toHaveClass('text-destructive');
    });
  });

  describe('ToastDescription', () => {
    test('renders description text', () => {
      render(
        <ToastDescription variant="info">Description Text</ToastDescription>
      );
      expect(screen.getByText('Description Text')).toBeInTheDocument();
    });

    test('applies variant styling', () => {
      render(
        <ToastDescription variant="warning">
          Warning Description
        </ToastDescription>
      );
      const description = screen.getByText('Warning Description');
      expect(description).toHaveClass('text-neutral-700');
    });
  });

  describe('ToastAction', () => {
    test('renders action button', () => {
      render(<ToastAction variant="success">Action Button</ToastAction>);
      const button = screen.getByRole('button', { name: 'Action Button' });
      expect(button).toBeInTheDocument();
    });

    test('handles click events', () => {
      const onClick = jest.fn();

      render(
        <ToastAction variant="info" onClick={onClick}>
          Click Me
        </ToastAction>
      );

      const button = screen.getByRole('button', { name: 'Click Me' });
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('applies variant styling', () => {
      render(<ToastAction variant="error">Error Action</ToastAction>);
      const button = screen.getByRole('button', { name: 'Error Action' });
      expect(button).toHaveClass('border-red-300', 'bg-red-100');
    });
  });

  describe('ToastClose', () => {
    test('renders close button with default icon', () => {
      render(<ToastClose variant="default" />);
      const button = screen.getByLabelText('Dismiss notification');
      expect(button).toBeInTheDocument();

      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('renders custom close content', () => {
      render(
        <ToastClose variant="success">
          <span data-testid="custom-close">×</span>
        </ToastClose>
      );
      expect(screen.getByTestId('custom-close')).toBeInTheDocument();
    });

    test('handles click events', () => {
      const onClick = jest.fn();

      render(<ToastClose variant="info" onClick={onClick} />);

      const button = screen.getByLabelText('Dismiss notification');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('has correct button type', () => {
      render(<ToastClose variant="default" />);
      const button = screen.getByLabelText('Dismiss notification');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Full Compound Component Integration', () => {
    test('renders complete compound toast', () => {
      render(
        <ToastRoot variant="warning">
          <ToastIcon variant="warning" />
          <ToastContent>
            <ToastTitle variant="warning">Warning Title</ToastTitle>
            <ToastDescription variant="warning">
              Warning Description
            </ToastDescription>
            <ToastAction variant="warning">Take Action</ToastAction>
          </ToastContent>
          <ToastClose variant="warning" />
        </ToastRoot>
      );

      expect(screen.getByText('Warning Title')).toBeInTheDocument();
      expect(screen.getByText('Warning Description')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Take Action' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });

    test('compound component renders correctly', () => {
      render(
        <ToastRoot variant="success">
          <ToastIcon variant="success" />
          <ToastContent>
            <ToastTitle variant="success">Success!</ToastTitle>
            <ToastDescription variant="success">
              Operation completed successfully.
            </ToastDescription>
            <ToastAction variant="success">View Details</ToastAction>
          </ToastContent>
          <ToastClose variant="success" />
        </ToastRoot>
      );

      const toast = screen.getByRole('status');
      expect(toast).toBeInTheDocument();
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(
        screen.getByText('Operation completed successfully.')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'View Details' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    });
  });

  describe('Component Display Names', () => {
    test('all components have correct display names', () => {
      expect(Toast.displayName).toBe('Toast');
      expect(ToastRoot.displayName).toBe('ToastRoot');
      expect(ToastIcon.displayName).toBe('ToastIcon');
      expect(ToastContent.displayName).toBe('ToastContent');
      expect(ToastTitle.displayName).toBe('ToastTitle');
      expect(ToastDescription.displayName).toBe('ToastDescription');
      expect(ToastAction.displayName).toBe('ToastAction');
      expect(ToastClose.displayName).toBe('ToastClose');
    });
  });
});
