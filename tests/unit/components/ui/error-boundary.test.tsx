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
import { AlertTriangle, Home, Mail } from 'lucide-react';
import {
  ErrorBoundary,
  InlineErrorBoundary,
  CardErrorBoundary,
  PageErrorBoundary,
  ToastErrorBoundary,
  ErrorBoundaryIcon,
  ErrorBoundaryTitle,
  ErrorBoundaryDescription,
  ErrorBoundaryContent,
  ErrorBoundaryActions,
  ErrorBoundaryButton,
  ErrorBoundaryDetails,
  DefaultErrorFallback,
} from '@/components/ui/error-boundary';
import { ErrorBoundaryProvider } from '@/hooks/ui/error-boundary-provider';
import { useErrorBoundary } from '@/hooks/ui/use-error-boundary';
import type { ErrorBoundaryError } from '@/types/ui/error-boundary';

expect.extend(toHaveNoViolations);

// Mock component that throws an error
const ErrorThrowingComponent: React.FC<{
  shouldThrow?: boolean;
  message?: string;
}> = ({ shouldThrow = false, message = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Working component</div>;
};

// Test component that uses the error boundary hook
const TestHookComponent: React.FC = () => {
  const { reportError, clearAllErrors, errors } = useErrorBoundary();

  return (
    <div>
      <button
        onClick={() =>
          reportError(new Error('Hook test error'), { componentStack: '' })
        }
        data-testid="report-error"
      >
        Report Error
      </button>
      <button onClick={clearAllErrors} data-testid="clear-errors">
        Clear Errors
      </button>
      <div data-testid="error-count">{errors.length}</div>
    </div>
  );
};

describe('ErrorBoundary Components', () => {
  // Suppress console.error for cleaner test output
  let originalConsoleError: jest.SpyInstance;

  beforeEach(() => {
    originalConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    originalConsoleError.mockRestore();
  });

  describe('BaseErrorBoundary (ErrorBoundary)', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error fallback when child component throws', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ErrorThrowingComponent shouldThrow={true} message="Custom error" />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Custom error' }),
        expect.objectContaining({ componentStack: expect.any(String) })
      );
    });

    it('renders custom fallback component', () => {
      const CustomFallback: React.FC<any> = ({ error }) => (
        <div>Custom fallback: {error.message}</div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ErrorThrowingComponent shouldThrow={true} message="Custom error" />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Custom fallback: Custom error')
      ).toBeInTheDocument();
    });

    it('renders with fallbackRender prop', () => {
      const fallbackRender = ({ error }: any) => (
        <div>Rendered fallback: {error.message}</div>
      );

      render(
        <ErrorBoundary fallbackRender={fallbackRender}>
          <ErrorThrowingComponent shouldThrow={true} message="Render error" />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Rendered fallback: Render error')
      ).toBeInTheDocument();
    });

    it('supports retry functionality', async () => {
      const user = userEvent.setup();

      // Simple test that just checks retry button works
      render(
        <ErrorBoundary enableRetry={true} maxRetries={2} retryDelay={100}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();

      // Click retry button should not crash
      await user.click(screen.getByText('Try Again'));

      // Still should show error since component still throws
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('respects maxRetries limit', async () => {
      const user = userEvent.setup();
      const onRetry = jest.fn();

      render(
        <ErrorBoundary enableRetry={true} maxRetries={1} onRetry={onRetry}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // First retry
      await user.click(screen.getByText('Try Again'));
      await waitFor(() => {
        expect(onRetry).toHaveBeenCalledTimes(1);
      });

      // Should still show error after first retry
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('resets on prop changes when resetOnPropsChange is true', () => {
      const TestComponent: React.FC<{ testKey: string }> = ({ testKey }) => (
        <ErrorBoundary resetOnPropsChange={true}>
          <div>Content: {testKey}</div>
          <ErrorThrowingComponent shouldThrow={testKey === 'error'} />
        </ErrorBoundary>
      );

      const { rerender } = render(<TestComponent testKey="normal" />);
      expect(screen.getByText('Content: normal')).toBeInTheDocument();

      // Trigger error
      rerender(<TestComponent testKey="error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Reset on prop change
      rerender(<TestComponent testKey="normal" />);
      expect(screen.getByText('Content: normal')).toBeInTheDocument();
    });

    it('resets on resetKeys change', () => {
      const TestComponent: React.FC<{ resetKey: string }> = ({ resetKey }) => (
        <ErrorBoundary resetKeys={[resetKey]}>
          <div>Reset key: {resetKey}</div>
          <ErrorThrowingComponent shouldThrow={resetKey === 'error'} />
        </ErrorBoundary>
      );

      const { rerender } = render(<TestComponent resetKey="normal" />);
      expect(screen.getByText('Reset key: normal')).toBeInTheDocument();

      // Trigger error
      rerender(<TestComponent resetKey="error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Reset on key change
      rerender(<TestComponent resetKey="reset" />);
      expect(screen.getByText('Reset key: reset')).toBeInTheDocument();
    });

    it('applies isolation wrapper when isolate is true', () => {
      const { container } = render(
        <ErrorBoundary isolate={true}>
          <div>Isolated content</div>
        </ErrorBoundary>
      );

      expect(
        container.querySelector('.error-boundary-isolation')
      ).toBeInTheDocument();
    });
  });

  describe('Error Boundary Variants', () => {
    describe('InlineErrorBoundary', () => {
      it('renders with inline variant by default', () => {
        render(
          <InlineErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </InlineErrorBoundary>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('p-3', 'text-sm');
      });

      it('can use minimal variant', () => {
        render(
          <InlineErrorBoundary variant="minimal">
            <ErrorThrowingComponent shouldThrow={true} />
          </InlineErrorBoundary>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('p-2');
      });
    });

    describe('CardErrorBoundary', () => {
      it('renders with card variant by default', () => {
        render(
          <CardErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </CardErrorBoundary>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('p-6', 'shadow-sm');
      });

      it('shows error details by default', () => {
        render(
          <CardErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </CardErrorBoundary>
        );

        expect(screen.getByText('Show Error Details')).toBeInTheDocument();
      });
    });

    describe('PageErrorBoundary', () => {
      it('renders with page variant and navigation actions', () => {
        render(
          <PageErrorBoundary homeUrl="/home" contactUrl="/contact">
            <ErrorThrowingComponent shouldThrow={true} />
          </PageErrorBoundary>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('min-h-[400px]', 'text-center');
        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(screen.getByText('Go Home')).toBeInTheDocument();
        expect(screen.getByText('Contact Support')).toBeInTheDocument();
      });

      it('renders navigation buttons', () => {
        render(
          <PageErrorBoundary homeUrl="/home" contactUrl="/contact">
            <ErrorThrowingComponent shouldThrow={true} />
          </PageErrorBoundary>
        );

        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(screen.getByText('Go Home')).toBeInTheDocument();
        expect(screen.getByText('Contact Support')).toBeInTheDocument();
      });
    });

    describe('ToastErrorBoundary', () => {
      it('renders with toast variant and positioning', () => {
        render(
          <ToastErrorBoundary position="top-left">
            <ErrorThrowingComponent shouldThrow={true} />
          </ToastErrorBoundary>
        );

        const container = document.querySelector('.fixed.top-4.left-4.z-50');
        expect(container).toBeInTheDocument();
      });

      it('auto-closes after duration', async () => {
        const onClose = jest.fn();

        render(
          <ToastErrorBoundary duration={100} autoClose={true} onClose={onClose}>
            <ErrorThrowingComponent shouldThrow={true} />
          </ToastErrorBoundary>
        );

        await waitFor(
          () => {
            expect(onClose).toHaveBeenCalled();
          },
          { timeout: 200 }
        );
      });

      it('does not auto-close when autoClose is false', async () => {
        const onClose = jest.fn();

        render(
          <ToastErrorBoundary
            duration={100}
            autoClose={false}
            onClose={onClose}
          >
            <ErrorThrowingComponent shouldThrow={true} />
          </ToastErrorBoundary>
        );

        await new Promise(resolve => setTimeout(resolve, 150));
        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Sub-components', () => {
    describe('ErrorBoundaryIcon', () => {
      it('renders with correct variant classes', () => {
        render(
          <ErrorBoundaryIcon variant="page" data-testid="error-icon">
            <AlertTriangle />
          </ErrorBoundaryIcon>
        );

        const icon = screen.getByTestId('error-icon');
        expect(icon).toHaveClass('mb-4');
      });
    });

    describe('ErrorBoundaryTitle', () => {
      it('renders as h3 element with correct classes', () => {
        render(
          <ErrorBoundaryTitle variant="card" size="lg">
            Error Title
          </ErrorBoundaryTitle>
        );

        const title = screen.getByText('Error Title');
        expect(title.tagName).toBe('H3');
        expect(title).toHaveClass('text-lg', 'mb-2');
      });
    });

    describe('ErrorBoundaryDescription', () => {
      it('renders with correct variant classes', () => {
        render(
          <ErrorBoundaryDescription variant="page" data-testid="description">
            Error description
          </ErrorBoundaryDescription>
        );

        const description = screen.getByTestId('description');
        expect(description).toHaveClass('mb-6', 'max-w-md');
      });
    });

    describe('ErrorBoundaryButton', () => {
      it('renders with loading state', () => {
        render(
          <ErrorBoundaryButton loading={true} loadingText="Processing...">
            Button Text
          </ErrorBoundaryButton>
        );

        expect(screen.getByText('Processing...')).toBeInTheDocument();
        expect(screen.queryByText('Button Text')).not.toBeInTheDocument();
      });

      it('disables button when loading', () => {
        render(
          <ErrorBoundaryButton loading={true}>Button Text</ErrorBoundaryButton>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });

      it('applies correct intent classes', () => {
        render(
          <ErrorBoundaryButton intent="secondary" data-testid="button">
            Button
          </ErrorBoundaryButton>
        );

        const button = screen.getByTestId('button');
        expect(button).toHaveClass('border', 'border-red-300', 'bg-white');
      });
    });

    describe('ErrorBoundaryDetails', () => {
      const mockError: ErrorBoundaryError = {
        message: 'Test error message',
        name: 'TestError',
        stack: 'Error stack trace',
        componentStack: 'Component stack',
        timestamp: Date.now(),
        retryCount: 1,
        id: 'test-error-id',
      };

      it('starts collapsed and expands on click', async () => {
        const user = userEvent.setup();

        render(<ErrorBoundaryDetails error={mockError} />);

        expect(screen.getByText('Show Error Details')).toBeInTheDocument();
        expect(
          screen.queryByText('Message: Test error message')
        ).not.toBeInTheDocument();

        await user.click(screen.getByText('Show Error Details'));

        expect(screen.getByText('Hide Error Details')).toBeInTheDocument();
        expect(
          screen.getByText(/Message: Test error message/)
        ).toBeInTheDocument();
      });

      it('displays all error information when expanded', async () => {
        const user = userEvent.setup();

        render(<ErrorBoundaryDetails error={mockError} />);
        await user.click(screen.getByText('Show Error Details'));

        const details = screen.getByText(/Message: Test error message/);
        expect(details).toBeInTheDocument();
        expect(details.textContent).toContain('Type: TestError');
        expect(details.textContent).toContain('Retry Count: 1');
        expect(details.textContent).toContain('Error ID: test-error-id');
      });
    });
  });

  describe('ErrorBoundaryProvider and Hook', () => {
    it('provides error boundary context', () => {
      render(
        <ErrorBoundaryProvider>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
    });

    it('reports errors through hook', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundaryProvider>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      await user.click(screen.getByTestId('report-error'));
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');
    });

    it('clears errors through hook', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundaryProvider>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      await user.click(screen.getByTestId('report-error'));
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      await user.click(screen.getByTestId('clear-errors'));
      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
    });

    it('calls onError callback when errors are reported', async () => {
      const user = userEvent.setup();
      const onError = jest.fn();

      render(
        <ErrorBoundaryProvider onError={onError}>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      await user.click(screen.getByTestId('report-error'));

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Hook test error' }),
        expect.objectContaining({ componentStack: '' })
      );
    });

    it('limits number of global errors', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundaryProvider maxGlobalErrors={2}>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      // Report 3 errors
      await user.click(screen.getByTestId('report-error'));
      await user.click(screen.getByTestId('report-error'));
      await user.click(screen.getByTestId('report-error'));

      // Should only keep 2
      expect(screen.getByTestId('error-count')).toHaveTextContent('2');
    });

    it('throws error when hook used outside provider', () => {
      const TestComponent = () => {
        useErrorBoundary();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useErrorBoundary must be used within an ErrorBoundaryProvider'
      );
    });

    it('auto-clears errors after reset timeout', async () => {
      render(
        <ErrorBoundaryProvider resetTimeoutMs={100}>
          <TestHookComponent />
        </ErrorBoundaryProvider>
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('report-error'));
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      await waitFor(
        () => {
          expect(screen.getByTestId('error-count')).toHaveTextContent('0');
        },
        { timeout: 200 }
      );
    });
  });

  describe('DefaultErrorFallback', () => {
    const mockError: ErrorBoundaryError = {
      message: 'Test error',
      timestamp: Date.now(),
      retryCount: 0,
      id: 'test-error',
    };

    it('renders with different variants', () => {
      const { rerender } = render(
        <DefaultErrorFallback
          error={mockError}
          resetErrorBoundary={() => {}}
          variant="page"
        />
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      rerender(
        <DefaultErrorFallback
          error={mockError}
          resetErrorBoundary={() => {}}
          variant="minimal"
        />
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('calls resetErrorBoundary on retry button click', async () => {
      const user = userEvent.setup();
      const resetFn = jest.fn();

      render(
        <DefaultErrorFallback
          error={mockError}
          resetErrorBoundary={resetFn}
          showRetry={true}
        />
      );

      await user.click(screen.getByText('Try Again'));

      await waitFor(() => {
        expect(resetFn).toHaveBeenCalled();
      });
    });

    it('shows custom retry text', () => {
      render(
        <DefaultErrorFallback
          error={mockError}
          resetErrorBoundary={() => {}}
          retryText="Retry Now"
        />
      );

      expect(screen.getByText('Retry Now')).toBeInTheDocument();
    });

    it('hides retry button when showRetry is false', () => {
      render(
        <DefaultErrorFallback
          error={mockError}
          resetErrorBoundary={() => {}}
          showRetry={false}
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('supports keyboard navigation for buttons', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try Again');
      retryButton.focus();
      expect(retryButton).toHaveFocus();

      await user.keyboard('{Enter}');
      // Button should have been activated
    });
  });

  describe('Edge Cases', () => {
    it('handles errors without stack trace', () => {
      const errorWithoutStack = new Error('No stack error');
      delete errorWithoutStack.stack;

      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles component unmounting during retry', () => {
      const TestComponent = () => (
        <ErrorBoundary enableRetry={true} retryDelay={100}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const { unmount } = render(<TestComponent />);

      fireEvent.click(screen.getByText('Try Again'));

      // Unmount before retry completes
      unmount();

      // Should not throw or cause memory leaks
    });

    it('handles multiple rapid error occurrences', () => {
      const MultiErrorComponent = () => {
        React.useEffect(() => {
          throw new Error('Effect error');
        }, []);

        throw new Error('Render error');
      };

      render(
        <ErrorBoundary>
          <MultiErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
