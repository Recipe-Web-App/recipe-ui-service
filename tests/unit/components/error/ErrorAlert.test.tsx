import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { ErrorAlert } from '@/components/error/ErrorAlert';
import { z, ZodError } from 'zod';
import type {
  ErrorAlertProps,
  ErrorAlertRecoveryAction,
} from '@/types/error/error-alert';
import {
  ServiceType,
  ErrorSeverity,
  type ServiceErrorMetadata,
} from '@/types/error/service-errors';
import {
  ComponentErrorType,
  ComponentErrorSeverity,
  type ComponentErrorMetadata,
} from '@/types/error/component-errors';
import {
  PageErrorType,
  PageErrorSeverity,
  RecoveryActionType,
  HttpStatusCode,
  type PageErrorMetadata,
} from '@/types/error/page-errors';
import { ErrorAlertSeverity } from '@/types/error/error-alert';

// Helper to create a Zod error
function createZodError(issues: Array<{ path: string[]; message: string }>) {
  const zodIssues = issues.map(issue => ({
    code: 'custom' as const,
    path: issue.path,
    message: issue.message,
  }));

  return new ZodError(zodIssues);
}

describe('ErrorAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders with generic error string', () => {
      render(<ErrorAlert error="Something went wrong" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders with Error object', () => {
      const error = new Error('Test error message');
      render(<ErrorAlert error={error} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('renders with custom title and description', () => {
      render(
        <ErrorAlert
          error="Error"
          title="Custom Title"
          description="Custom description"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ErrorAlert error="Error" className="custom-class" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-class');
    });

    it('applies custom test id', () => {
      render(<ErrorAlert error="Error" data-testid="custom-alert" />);

      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });

    it('does not render when no error is provided', () => {
      const { container } = render(<ErrorAlert />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Variants', () => {
    it.each([
      ['inline', 'inline'],
      ['banner', 'banner'],
      ['toast', 'toast'],
      ['card', 'card'],
    ] as const)('renders with %s variant', (variantName, _variant) => {
      render(<ErrorAlert error="Error" variant={variantName} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Severity Levels', () => {
    it.each([
      ['error', ErrorAlertSeverity.ERROR],
      ['warning', ErrorAlertSeverity.WARNING],
      ['info', ErrorAlertSeverity.INFO],
    ] as const)('renders with %s severity', (severityName, severity) => {
      render(<ErrorAlert error="Test" severity={severity} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('auto-detects severity from error type', () => {
      render(<ErrorAlert error="Network error: connection failed" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Error Source Handling', () => {
    describe('Zod Validation Errors', () => {
      it('renders single Zod error', () => {
        const zodError = createZodError([
          { path: ['email'], message: 'Invalid email format' },
        ]);

        render(<ErrorAlert zodError={zodError} />);

        expect(screen.getByText('Validation Error')).toBeInTheDocument();
        expect(screen.getByText(/Invalid email format/)).toBeInTheDocument();
      });

      it('renders multiple Zod errors', () => {
        const zodError = createZodError([
          { path: ['email'], message: 'Invalid email format' },
          { path: ['password'], message: 'Password too short' },
          { path: ['name'], message: 'Name is required' },
        ]);

        render(<ErrorAlert zodError={zodError} />);

        expect(screen.getByText('Validation Error')).toBeInTheDocument();
        // Component shows individual errors, not a summary message
        expect(screen.getByText(/Invalid email format/)).toBeInTheDocument();
        expect(screen.getByText(/Password too short/)).toBeInTheDocument();
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      });

      it('displays field names for Zod errors', () => {
        const zodError = createZodError([
          { path: ['title'], message: 'Title is required' },
        ]);

        render(<ErrorAlert zodError={zodError} />);

        expect(screen.getByText(/title:/i)).toBeInTheDocument();
      });
    });

    describe('Validation Errors Array', () => {
      it('renders validation errors array', () => {
        const validationErrors = [
          { field: 'username', message: 'Username is required' },
          { field: 'email', message: 'Invalid email' },
        ];

        render(<ErrorAlert validationErrors={validationErrors} />);

        expect(screen.getByText('Validation Error')).toBeInTheDocument();
        expect(screen.getByText(/Username is required/)).toBeInTheDocument();
        expect(screen.getByText(/Invalid email/)).toBeInTheDocument();
      });
    });

    describe('Service Errors', () => {
      it('renders service error', () => {
        const serviceError: ServiceErrorMetadata = {
          serviceType: ServiceType.AUTH,
          serviceName: 'Auth Service',
          endpoint: '/api/login',
          statusCode: 500,
          timestamp: Date.now(),
          retryable: true,
          severity: ErrorSeverity.ERROR,
        };

        render(<ErrorAlert serviceError={serviceError} />);

        expect(screen.getByText('Auth Service Error')).toBeInTheDocument();
      });

      it('shows retry action for retryable service errors', () => {
        const serviceError: ServiceErrorMetadata = {
          serviceType: ServiceType.RECIPE_MANAGEMENT,
          serviceName: 'Recipe Service',
          timestamp: Date.now(),
          retryable: true,
          severity: ErrorSeverity.ERROR,
        };

        const onRetry = jest.fn();
        render(<ErrorAlert serviceError={serviceError} onRetry={onRetry} />);

        const retryButton = screen.getByRole('button', { name: /try again/i });
        expect(retryButton).toBeInTheDocument();

        fireEvent.click(retryButton);
        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });

    describe('Component Errors', () => {
      it('renders component error', () => {
        const componentError: ComponentErrorMetadata = {
          errorType: ComponentErrorType.RENDER_ERROR,
          severity: ComponentErrorSeverity.ERROR,
          componentName: 'RecipeCard',
          componentDisplayName: 'Recipe Card',
          message: 'Failed to render component',
          timestamp: Date.now(),
          fingerprint: 'test-fingerprint',
          retryable: false,
          retryCount: 0,
        };

        render(<ErrorAlert componentError={componentError} />);

        expect(
          screen.getByText(/Component Error: Recipe Card/)
        ).toBeInTheDocument();
        expect(
          screen.getByText('Failed to render component')
        ).toBeInTheDocument();
      });
    });

    describe('Page Errors', () => {
      it('renders page error', () => {
        const pageError: PageErrorMetadata = {
          errorType: PageErrorType.NOT_FOUND,
          statusCode: HttpStatusCode.NOT_FOUND,
          severity: PageErrorSeverity.ERROR,
          title: 'Page Not Found',
          description: 'The page you are looking for does not exist',
          recoveryActions: [RecoveryActionType.GO_HOME],
          seoTitle: '404 - Not Found',
          seoDescription: 'Page not found',
          retryable: false,
          timestamp: Date.now(),
        };

        render(<ErrorAlert pageError={pageError} />);

        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
        expect(
          screen.getByText('The page you are looking for does not exist')
        ).toBeInTheDocument();
      });
    });

    describe('Network Errors', () => {
      it('detects and renders network errors', () => {
        render(<ErrorAlert error="Network error: Failed to fetch" />);

        expect(screen.getByText('Network Error')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Errors Display', () => {
    it('displays multiple validation errors as a list', () => {
      const validationErrors = [
        { field: 'title', message: 'Title is required' },
        { field: 'servings', message: 'Servings must be positive' },
        { field: 'prepTime', message: 'Prep time is required' },
      ];

      render(<ErrorAlert validationErrors={validationErrors} />);

      expect(screen.getByText(/Title is required/)).toBeInTheDocument();
      expect(screen.getByText(/Servings must be positive/)).toBeInTheDocument();
      expect(screen.getByText(/Prep time is required/)).toBeInTheDocument();
    });

    it('respects maxErrors limit', () => {
      const validationErrors = Array.from({ length: 10 }, (_, i) => ({
        field: `field${i}`,
        message: `Error ${i}`,
      }));

      render(<ErrorAlert validationErrors={validationErrors} maxErrors={3} />);

      // Only first 3 errors should be visible
      expect(screen.getByText(/Error 0/)).toBeInTheDocument();
      expect(screen.getByText(/Error 1/)).toBeInTheDocument();
      expect(screen.getByText(/Error 2/)).toBeInTheDocument();
      expect(screen.queryByText(/Error 3/)).not.toBeInTheDocument();
    });

    it('shows collapse toggle when errors exceed maxErrors', () => {
      const validationErrors = Array.from({ length: 10 }, (_, i) => ({
        field: `field${i}`,
        message: `Error ${i}`,
      }));

      render(
        <ErrorAlert
          validationErrors={validationErrors}
          maxErrors={5}
          collapsible
        />
      );

      const toggleButton = screen.getByRole('button', {
        name: /show 5 more errors/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it('expands error list when toggle is clicked', () => {
      const validationErrors = Array.from({ length: 8 }, (_, i) => ({
        field: `field${i}`,
        message: `Error ${i}`,
      }));

      render(
        <ErrorAlert
          validationErrors={validationErrors}
          maxErrors={3}
          collapsible
        />
      );

      // Initially only 3 errors visible
      expect(screen.queryByText(/Error 7/)).not.toBeInTheDocument();

      // Click to expand
      const toggleButton = screen.getByRole('button', {
        name: /show 5 more errors/i,
      });
      fireEvent.click(toggleButton);

      // All errors should now be visible
      expect(screen.getByText(/Error 7/)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /show less/i })
      ).toBeInTheDocument();
    });
  });

  describe('Auto-Dismiss', () => {
    it('auto-dismisses after timeout', () => {
      const onDismiss = jest.fn();

      render(
        <ErrorAlert error="Test" autoDismiss={3000} onDismiss={onDismiss} />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-dismiss when autoDismiss is false', () => {
      const onDismiss = jest.fn();

      render(
        <ErrorAlert error="Test" autoDismiss={false} onDismiss={onDismiss} />
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onDismiss).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('clears timer on unmount', () => {
      const { unmount } = render(
        <ErrorAlert error="Test" autoDismiss={3000} />
      );

      unmount();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should not throw or cause issues
    });
  });

  describe('Recovery Actions', () => {
    it('renders custom recovery actions', () => {
      const customAction: ErrorAlertRecoveryAction = {
        type: 'custom',
        label: 'Custom Action',
        handler: jest.fn(),
      };

      render(<ErrorAlert error="Test" recoveryActions={[customAction]} />);

      expect(
        screen.getByRole('button', { name: 'Custom Action' })
      ).toBeInTheDocument();
    });

    it('handles retry action click', () => {
      const onRetry = jest.fn();

      // Network errors are retryable by default
      render(
        <ErrorAlert
          error="Network error: connection failed"
          onRetry={onRetry}
        />
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('handles clear action click', () => {
      const onClear = jest.fn();

      render(<ErrorAlert error="Test" onClear={onClear} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('handles dismiss action via close button', () => {
      const onDismiss = jest.fn();

      render(<ErrorAlert error="Test" onDismiss={onDismiss} />);

      const closeButton = screen.getByRole('button', {
        name: /dismiss alert/i,
      });
      fireEvent.click(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onAction when recovery action is executed', () => {
      const onAction = jest.fn();
      const customAction: ErrorAlertRecoveryAction = {
        type: 'custom',
        label: 'Test Action',
        handler: jest.fn(),
      };

      render(
        <ErrorAlert
          error="Test"
          recoveryActions={[customAction]}
          onAction={onAction}
        />
      );

      const actionButton = screen.getByRole('button', { name: 'Test Action' });
      fireEvent.click(actionButton);

      expect(onAction).toHaveBeenCalledWith(customAction);
    });

    it('renders recovery action with icon', () => {
      const MockIcon = () => <svg data-testid="mock-icon" />;
      const customAction: ErrorAlertRecoveryAction = {
        type: 'custom',
        label: 'With Icon',
        handler: jest.fn(),
        icon: MockIcon,
      };

      render(<ErrorAlert error="Test" recoveryActions={[customAction]} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('disables recovery action when disabled prop is true', () => {
      const customAction: ErrorAlertRecoveryAction = {
        type: 'custom',
        label: 'Disabled Action',
        handler: jest.fn(),
        disabled: true,
      };

      render(<ErrorAlert error="Test" recoveryActions={[customAction]} />);

      const button = screen.getByRole('button', { name: 'Disabled Action' });
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<ErrorAlert error="Test" />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('has aria-live region', () => {
      render(<ErrorAlert error="Test" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('has accessible close button', () => {
      render(<ErrorAlert error="Test" />);

      const closeButton = screen.getByRole('button', {
        name: /dismiss alert/i,
      });
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('has aria-expanded on collapse toggle', () => {
      const validationErrors = Array.from({ length: 10 }, (_, i) => ({
        field: `field${i}`,
        message: `Error ${i}`,
      }));

      render(
        <ErrorAlert
          validationErrors={validationErrors}
          maxErrors={3}
          collapsible
        />
      );

      // 10 total - 3 visible = 7 more errors
      const toggleButton = screen.getByRole('button', {
        name: /show 7 more errors/i,
      });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('uses custom aria-label when provided', () => {
      render(<ErrorAlert error="Test" aria-label="Custom alert message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Custom alert message');
    });
  });

  describe('Hints and Recovery Suggestions', () => {
    it('displays custom hint', () => {
      render(<ErrorAlert error="Test" hint="Try refreshing the page" />);

      expect(screen.getByText('Try refreshing the page')).toBeInTheDocument();
    });

    it('auto-generates hint for validation errors', () => {
      const zodError = createZodError([
        { path: ['email'], message: 'Invalid' },
      ]);

      render(<ErrorAlert zodError={zodError} />);

      expect(
        screen.getByText(/correct the highlighted fields/i)
      ).toBeInTheDocument();
    });

    it('auto-generates hint for network errors', () => {
      render(<ErrorAlert error="Network error: connection failed" />);

      expect(
        screen.getByText(/check your internet connection/i)
      ).toBeInTheDocument();
    });
  });

  describe('Analytics', () => {
    it('calls onAnalytics when error is displayed', () => {
      const onAnalytics = jest.fn();

      render(<ErrorAlert error="Test" onAnalytics={onAnalytics} />);

      expect(onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'displayed',
          errorSource: expect.any(String),
          severity: expect.any(String),
        })
      );
    });

    it('calls onAnalytics when error is dismissed', () => {
      const onAnalytics = jest.fn();

      render(<ErrorAlert error="Test" onAnalytics={onAnalytics} />);

      const closeButton = screen.getByRole('button', {
        name: /dismiss alert/i,
      });
      fireEvent.click(closeButton);

      expect(onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dismissed',
        })
      );
    });

    it('calls onAnalytics when retry action is executed', () => {
      const onAnalytics = jest.fn();
      const onRetry = jest.fn();

      // Network errors are retryable by default
      render(
        <ErrorAlert
          error="Network error: connection failed"
          onRetry={onRetry}
          onAnalytics={onAnalytics}
        />
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      expect(onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry',
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles null error gracefully', () => {
      const { container } = render(<ErrorAlert error={null} />);

      expect(container.firstChild).toBeNull();
    });

    it('handles undefined error gracefully', () => {
      const { container } = render(<ErrorAlert error={undefined} />);

      expect(container.firstChild).toBeNull();
    });

    it('handles empty validation errors array', () => {
      const { container } = render(<ErrorAlert validationErrors={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      render(<ErrorAlert error={longMessage} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles rapid error changes', () => {
      const { rerender } = render(<ErrorAlert error="Error 1" />);

      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(<ErrorAlert error="Error 2" />);

      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
  });

  describe('Icon Display', () => {
    it('shows icon by default', () => {
      render(<ErrorAlert error="Test" />);

      const alert = screen.getByRole('alert');
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      render(<ErrorAlert error="Test" showIcon={false} />);

      const alert = screen.getByRole('alert');
      // Check that the error icon (not the close button X) is not present
      // The close button will still have an X icon
      const iconContainer = alert.querySelector('.flex-shrink-0');
      expect(iconContainer).not.toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('shows close button by default', () => {
      render(<ErrorAlert error="Test" />);

      expect(
        screen.getByRole('button', { name: /dismiss alert/i })
      ).toBeInTheDocument();
    });

    it('hides close button when showClose is false', () => {
      render(<ErrorAlert error="Test" showClose={false} />);

      expect(
        screen.queryByRole('button', { name: /dismiss alert/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it.each(['sm', 'md', 'lg'] as const)('renders with %s size', size => {
      render(<ErrorAlert error="Test" size={size} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
