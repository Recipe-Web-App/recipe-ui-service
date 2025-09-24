import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertActions,
  AlertButton,
  AlertClose,
  BaseAlert,
  RecipeAlert,
  ToastAlert,
  BannerAlert,
  InlineAlert,
  AlertProvider,
  useAlert,
} from '@/components/ui/alert';

expect.extend(toHaveNoViolations);

describe('Alert Components', () => {
  describe('Alert (Base)', () => {
    it('renders with default props', () => {
      render(<Alert>Test alert content</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Test alert content');
    });

    it('applies variant classes correctly', () => {
      render(
        <Alert variant="success" data-testid="success-alert">
          Success content
        </Alert>
      );
      const alert = screen.getByTestId('success-alert');
      expect(alert).toHaveClass(
        'bg-green-50',
        'text-green-900',
        'border-green-200'
      );
    });

    it('applies size classes correctly', () => {
      render(
        <Alert size="lg" data-testid="large-alert">
          Large alert
        </Alert>
      );
      const alert = screen.getByTestId('large-alert');
      expect(alert).toHaveClass('px-6', 'py-4', 'text-base');
    });

    it('accepts custom className', () => {
      render(
        <Alert className="custom-class" data-testid="custom-alert">
          Custom alert
        </Alert>
      );
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveClass('custom-class');
    });
  });

  describe('AlertTitle', () => {
    it('renders as h5 element', () => {
      render(<AlertTitle>Alert Title</AlertTitle>);
      const title = screen.getByText('Alert Title');
      expect(title.tagName).toBe('H5');
    });

    it('applies variant classes correctly', () => {
      render(
        <AlertTitle variant="destructive" data-testid="destructive-title">
          Error Title
        </AlertTitle>
      );
      const title = screen.getByTestId('destructive-title');
      expect(title).toHaveClass('text-red-900');
    });

    it('applies size classes correctly', () => {
      render(
        <AlertTitle size="lg" data-testid="large-title">
          Large Title
        </AlertTitle>
      );
      const title = screen.getByTestId('large-title');
      expect(title).toHaveClass('text-base');
    });
  });

  describe('AlertDescription', () => {
    it('renders description content', () => {
      render(
        <AlertDescription>This is the alert description</AlertDescription>
      );
      expect(
        screen.getByText('This is the alert description')
      ).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(
        <AlertDescription variant="warning" data-testid="warning-description">
          Warning description
        </AlertDescription>
      );
      const description = screen.getByTestId('warning-description');
      expect(description).toHaveClass('text-yellow-800');
    });
  });

  describe('AlertIcon', () => {
    it('renders with icon content', () => {
      render(
        <AlertIcon>
          <Info data-testid="info-icon" />
        </AlertIcon>
      );
      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(
        <AlertIcon variant="success" data-testid="success-icon">
          <CheckCircle />
        </AlertIcon>
      );
      const iconContainer = screen.getByTestId('success-icon');
      expect(iconContainer).toHaveClass('text-green-600');
    });

    it('applies size classes correctly', () => {
      render(
        <AlertIcon size="lg" data-testid="large-icon">
          <Info />
        </AlertIcon>
      );
      const iconContainer = screen.getByTestId('large-icon');
      expect(iconContainer).toHaveClass('h-6', 'w-6');
    });
  });

  describe('AlertActions', () => {
    it('renders action buttons', () => {
      render(
        <AlertActions>
          <button>Action 1</button>
          <button>Action 2</button>
        </AlertActions>
      );
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('applies layout classes correctly', () => {
      render(
        <AlertActions layout="vertical" data-testid="vertical-actions">
          <button>Action</button>
        </AlertActions>
      );
      const actions = screen.getByTestId('vertical-actions');
      expect(actions).toHaveClass('flex-col', 'items-start');
    });
  });

  describe('AlertButton', () => {
    it('renders as button element', () => {
      render(<AlertButton>Click me</AlertButton>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
    });

    it('applies intent classes correctly', () => {
      render(
        <AlertButton intent="destructive" data-testid="destructive-button">
          Delete
        </AlertButton>
      );
      const button = screen.getByTestId('destructive-button');
      expect(button).toHaveClass(
        'bg-red-600',
        'text-white',
        'hover:bg-red-700'
      );
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<AlertButton onClick={handleClick}>Click me</AlertButton>);
      const button = screen.getByRole('button', { name: 'Click me' });

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports disabled state', () => {
      render(<AlertButton disabled>Disabled button</AlertButton>);
      const button = screen.getByRole('button', { name: 'Disabled button' });
      expect(button).toBeDisabled();
    });
  });

  describe('AlertClose', () => {
    it('renders close button with X icon', () => {
      render(<AlertClose />);
      const button = screen.getByRole('button', { name: 'Close alert' });
      expect(button).toBeInTheDocument();
    });

    it('calls onClose when clicked', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(<AlertClose onClose={handleClose} />);
      const button = screen.getByRole('button', { name: 'Close alert' });

      await user.click(button);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes correctly', () => {
      render(
        <AlertClose variant="success" data-testid="success-close">
          <span>Close</span>
        </AlertClose>
      );
      const button = screen.getByTestId('success-close');
      expect(button).toHaveClass('text-green-500', 'hover:text-green-700');
    });
  });

  describe('BaseAlert', () => {
    it('renders complete alert with all parts', () => {
      render(
        <BaseAlert
          variant="info"
          title="Test Title"
          description="Test description"
          icon={<Info data-testid="alert-icon" />}
          dismissible
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Close alert' })
      ).toBeInTheDocument();
    });

    it('renders without optional elements', () => {
      render(
        <BaseAlert variant="default">
          <div>Custom content</div>
        </BaseAlert>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders with actions', () => {
      render(
        <BaseAlert
          variant="warning"
          title="Action Alert"
          actions={
            <>
              <AlertButton intent="secondary">Cancel</AlertButton>
              <AlertButton intent="primary">Confirm</AlertButton>
            </>
          }
        />
      );

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument();
    });

    it('handles dismiss functionality', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(
        <BaseAlert
          variant="info"
          title="Dismissible Alert"
          dismissible
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      await user.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('RecipeAlert', () => {
    it('renders recipe-saved alert with default content', () => {
      render(<RecipeAlert type="recipe-saved" />);

      expect(screen.getByText('Recipe Saved')).toBeInTheDocument();
      expect(
        screen.getByText('Your recipe has been saved successfully.')
      ).toBeInTheDocument();
      expect(screen.getByText('💾')).toBeInTheDocument();
    });

    it('renders with recipe name', () => {
      render(
        <RecipeAlert
          type="recipe-published"
          recipeName="Chocolate Chip Cookies"
        />
      );

      expect(
        screen.getByText('Recipe Published "Chocolate Chip Cookies"')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Your recipe "Chocolate Chip Cookies" is now public and searchable.'
        )
      ).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <RecipeAlert
          type="recipe-error"
          title="Custom Error Title"
          description="Custom error description"
        />
      );

      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error description')).toBeInTheDocument();
    });

    it('applies recipe-specific styling', () => {
      render(<RecipeAlert type="recipe-saved" data-testid="recipe-alert" />);

      const alert = screen.getByTestId('recipe-alert');
      expect(alert).toHaveClass(
        'border-l-green-500',
        'bg-green-50',
        'text-green-900'
      );
    });

    it('supports all recipe alert types', () => {
      const types = [
        'recipe-saved',
        'recipe-published',
        'recipe-shared',
        'recipe-imported',
        'recipe-error',
        'cooking-tip',
        'nutritional-info',
        'seasonal-suggestion',
      ] as const;

      types.forEach(type => {
        const { unmount } = render(<RecipeAlert type={type} />);
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
        unmount();
      });
    });
  });

  describe('ToastAlert', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('renders toast alert with positioning', () => {
      render(
        <ToastAlert
          variant="success"
          position="top-right"
          title="Toast Notification"
          data-testid="toast-alert"
        />
      );

      const toast = screen.getByTestId('toast-alert');
      expect(toast).toHaveClass('fixed', 'z-50');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('auto-closes after duration', async () => {
      const handleClose = jest.fn();

      render(
        <ToastAlert
          variant="info"
          title="Auto-close Toast"
          duration={1000}
          autoClose={true}
          onClose={handleClose}
        />
      );

      expect(handleClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not auto-close when autoClose is false', () => {
      const handleClose = jest.fn();

      render(
        <ToastAlert
          variant="info"
          title="Manual Toast"
          duration={1000}
          autoClose={false}
          onClose={handleClose}
        />
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('supports different positioning', () => {
      const { rerender } = render(
        <ToastAlert
          variant="default"
          position="bottom-left"
          title="Positioned Toast"
          data-testid="positioned-toast"
        />
      );

      let toast = screen.getByTestId('positioned-toast');
      expect(toast).toHaveClass('fixed', 'z-50');

      rerender(
        <ToastAlert
          variant="default"
          position="top-center"
          title="Positioned Toast"
          data-testid="positioned-toast"
        />
      );

      toast = screen.getByTestId('positioned-toast');
      expect(toast).toHaveClass('fixed', 'z-50');
    });
  });

  describe('BannerAlert', () => {
    it('renders banner alert with full width styling', () => {
      render(
        <BannerAlert
          variant="warning"
          title="System Banner"
          description="Important system announcement"
          data-testid="banner-alert"
        />
      );

      const banner = screen.getByTestId('banner-alert');
      expect(banner).toHaveClass('w-full', 'border-y');
    });

    it('renders with dismissible functionality', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(
        <BannerAlert
          variant="info"
          title="Dismissible Banner"
          dismissible={true}
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      await user.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('can be non-dismissible', () => {
      render(
        <BannerAlert
          variant="maintenance"
          title="Non-dismissible Banner"
          dismissible={false}
        />
      );

      expect(
        screen.queryByRole('button', { name: 'Close alert' })
      ).not.toBeInTheDocument();
    });

    it('applies position classes correctly', () => {
      render(
        <BannerAlert
          variant="default"
          position="top"
          title="Top Banner"
          data-testid="top-banner"
        />
      );

      const banner = screen.getByTestId('top-banner');
      expect(banner).toHaveClass('w-full', 'border-y');
    });
  });

  describe('InlineAlert', () => {
    it('renders compact inline alert', () => {
      render(
        <InlineAlert
          variant="warning"
          title="Inline Warning"
          description="Warning message"
          icon={<AlertTriangle data-testid="warning-icon" />}
          data-testid="inline-alert"
        />
      );

      const alert = screen.getByTestId('inline-alert');
      expect(alert).toHaveClass('inline-flex', 'items-center', 'gap-2');
      expect(screen.getByText('Inline Warning')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    });

    it('renders with description only', () => {
      render(
        <InlineAlert variant="info" description="Info description only" />
      );

      expect(screen.getByText('Info description only')).toBeInTheDocument();
    });

    it('renders title and description together', () => {
      render(
        <InlineAlert
          variant="success"
          title="Success"
          description="Operation completed"
        />
      );

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });
  });

  describe('AlertProvider', () => {
    const TestComponent = () => {
      const {
        showAlert,
        showToast,
        showBanner,
        hideAlert,
        clearAlerts,
        alerts,
      } = useAlert();

      return (
        <div>
          <button
            onClick={() =>
              showAlert({
                variant: 'success',
                title: 'Test Alert',
                description: 'Provider alert test',
              })
            }
          >
            Show Alert
          </button>
          <button
            onClick={() =>
              showToast({
                variant: 'info',
                title: 'Test Toast',
                description: 'Provider toast test',
              })
            }
          >
            Show Toast
          </button>
          <button
            onClick={() =>
              showBanner({
                variant: 'warning',
                title: 'Test Banner',
                description: 'Provider banner test',
              })
            }
          >
            Show Banner
          </button>
          <button onClick={() => hideAlert(alerts[0]?.id)}>Hide First</button>
          <button onClick={clearAlerts}>Clear All</button>
          <div data-testid="alert-count">{alerts.length}</div>
        </div>
      );
    };

    it('provides alert context to children', async () => {
      const user = userEvent.setup();

      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>
      );

      const showButton = screen.getByText('Show Alert');
      await user.click(showButton);

      expect(screen.getByText('Test Alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-count')).toHaveTextContent('1');
    });

    it('manages multiple alert types', async () => {
      const user = userEvent.setup();

      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>
      );

      await user.click(screen.getByText('Show Alert'));
      await user.click(screen.getByText('Show Toast'));
      await user.click(screen.getByText('Show Banner'));

      expect(screen.getByTestId('alert-count')).toHaveTextContent('3');
    });

    it('respects maxAlerts limit', async () => {
      const user = userEvent.setup();

      render(
        <AlertProvider maxAlerts={2}>
          <TestComponent />
        </AlertProvider>
      );

      await user.click(screen.getByText('Show Alert'));
      await user.click(screen.getByText('Show Toast'));
      await user.click(screen.getByText('Show Banner'));

      expect(screen.getByTestId('alert-count')).toHaveTextContent('2');
    });

    it('can hide individual alerts', async () => {
      const user = userEvent.setup();

      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>
      );

      await user.click(screen.getByText('Show Alert'));
      await user.click(screen.getByText('Show Toast'));
      expect(screen.getByTestId('alert-count')).toHaveTextContent('2');

      await user.click(screen.getByText('Hide First'));
      expect(screen.getByTestId('alert-count')).toHaveTextContent('1');
    });

    it('can clear all alerts', async () => {
      const user = userEvent.setup();

      render(
        <AlertProvider>
          <TestComponent />
        </AlertProvider>
      );

      await user.click(screen.getByText('Show Alert'));
      await user.click(screen.getByText('Show Toast'));
      expect(screen.getByTestId('alert-count')).toHaveTextContent('2');

      await user.click(screen.getByText('Clear All'));
      expect(screen.getByTestId('alert-count')).toHaveTextContent('0');
    });

    it('throws error when used outside provider', () => {
      const TestComponentOutside = () => {
        useAlert();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => render(<TestComponentOutside />)).toThrow(
        'useAlert must be used within an AlertProvider'
      );

      console.error = originalError;
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - BaseAlert', async () => {
      const { container } = render(
        <BaseAlert
          variant="info"
          title="Accessible Alert"
          description="This alert follows accessibility guidelines"
          icon={<Info />}
          dismissible
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - RecipeAlert', async () => {
      const { container } = render(
        <RecipeAlert type="recipe-saved" recipeName="Test Recipe" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - ToastAlert', async () => {
      const { container } = render(
        <ToastAlert
          variant="success"
          title="Toast Alert"
          description="Accessible toast notification"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      render(
        <BaseAlert
          variant="warning"
          title="ARIA Test"
          description="Testing ARIA attributes"
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('role', 'alert');
    });

    it('has screen reader friendly close button', () => {
      render(
        <BaseAlert variant="info" title="Dismissible Alert" dismissible />
      );

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      expect(closeButton).toBeInTheDocument();
    });

    it('toast has aria-live attribute', () => {
      render(
        <ToastAlert
          variant="info"
          title="Live Region Test"
          data-testid="live-toast"
        />
      );

      const toast = screen.getByTestId('live-toast');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Integration', () => {
    it('works with complex alert scenarios', async () => {
      const user = userEvent.setup();
      const handleAction = jest.fn();

      render(
        <BaseAlert
          variant="warning"
          title="Complex Alert"
          description="This alert has multiple interactive elements"
          icon={<AlertTriangle />}
          dismissible
          onClose={handleAction}
          actions={
            <>
              <AlertButton intent="secondary" onClick={handleAction}>
                Cancel
              </AlertButton>
              <AlertButton intent="primary" onClick={handleAction}>
                Confirm
              </AlertButton>
            </>
          }
        />
      );

      // Test action buttons
      await user.click(screen.getByText('Cancel'));
      expect(handleAction).toHaveBeenCalledTimes(1);

      await user.click(screen.getByText('Confirm'));
      expect(handleAction).toHaveBeenCalledTimes(2);

      // Test close button
      await user.click(screen.getByRole('button', { name: 'Close alert' }));
      expect(handleAction).toHaveBeenCalledTimes(3);
    });

    it('maintains state across re-renders', () => {
      const { rerender } = render(
        <BaseAlert
          variant="info"
          title="Original Title"
          description="Original description"
        />
      );

      expect(screen.getByText('Original Title')).toBeInTheDocument();

      rerender(
        <BaseAlert
          variant="success"
          title="Updated Title"
          description="Updated description"
        />
      );

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
    });

    it('handles rapid state changes in provider', async () => {
      const user = userEvent.setup();

      const RapidChangeComponent = () => {
        const { showAlert, clearAlerts, alerts } = useAlert();

        const showMultiple = () => {
          for (let i = 0; i < 3; i++) {
            showAlert({
              variant: 'info',
              title: `Alert ${i + 1}`,
              description: `Description ${i + 1}`,
            });
          }
        };

        return (
          <div>
            <button onClick={showMultiple}>Show Multiple</button>
            <button onClick={clearAlerts}>Clear</button>
            <div data-testid="count">{alerts.length}</div>
          </div>
        );
      };

      render(
        <AlertProvider maxAlerts={5}>
          <RapidChangeComponent />
        </AlertProvider>
      );

      await user.click(screen.getByText('Show Multiple'));
      expect(screen.getByTestId('count')).toHaveTextContent('3');

      await user.click(screen.getByText('Clear'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
});
