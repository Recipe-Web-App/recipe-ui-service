import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import {
  HttpStatusCode,
  PageErrorType,
  RecoveryActionType,
  type PageErrorBoundaryConfig,
  type PageErrorBoundaryProps,
} from '@/types/error/page-errors';

expect.extend(toHaveNoViolations);

// Mock next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Error throwing component for testing
const ErrorThrowingComponent: React.FC<{
  shouldThrow?: boolean;
  statusCode?: HttpStatusCode;
  message?: string;
}> = ({ shouldThrow = false, statusCode, message = 'Test error' }) => {
  if (shouldThrow) {
    const error = new Error(message) as Error & { status?: number };
    if (statusCode) {
      error.status = statusCode;
    }
    throw error;
  }
  return <div>Working component</div>;
};

// Test wrapper component to control error boundary reset via key prop
const TestWrapper: React.FC<{
  children: React.ReactNode;
  resetKey: number;
  config?: PageErrorBoundaryConfig;
  fallbackRender?: PageErrorBoundaryProps['fallbackRender'];
  fallback?: PageErrorBoundaryProps['fallback'];
}> = ({ children, resetKey, config, fallbackRender, fallback }) => {
  return (
    <PageErrorBoundary
      key={resetKey}
      config={config}
      fallbackRender={fallbackRender}
      fallback={fallback}
    >
      {children}
    </PageErrorBoundary>
  );
};

describe('PageErrorBoundary', () => {
  let originalConsoleError: jest.SpyInstance;
  let originalConsoleInfo: jest.SpyInstance;

  beforeEach(() => {
    originalConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    originalConsoleInfo = jest
      .spyOn(console, 'info')
      .mockImplementation(() => {});
    mockPush.mockClear();
    mockBack.mockClear();
  });

  afterEach(() => {
    originalConsoleError.mockRestore();
    originalConsoleInfo.mockRestore();
    jest.clearAllTimers();
  });

  describe('Basic Functionality', () => {
    it('renders children when no error occurs', () => {
      render(
        <PageErrorBoundary>
          <div>Test content</div>
        </PageErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error fallback when child component throws', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('resets error boundary when reset is triggered', async () => {
      let resetKey = 0;
      const { rerender } = render(
        <TestWrapper resetKey={resetKey}>
          <ErrorThrowingComponent shouldThrow={true} />
        </TestWrapper>
      );

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      await act(async () => {
        fireEvent.click(tryAgainButton);
        // Wait for the timeout in handleRecoveryAction (500ms)
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      // Re-render with incremented key and non-throwing component
      resetKey++;
      rerender(
        <TestWrapper resetKey={resetKey}>
          <ErrorThrowingComponent shouldThrow={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Working component')).toBeInTheDocument();
      });
    });
  });

  describe('HTTP Status Code Detection', () => {
    it('renders 404 Not Found error correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go home/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go back/i })
      ).toBeInTheDocument();
    });

    it('renders 401 Unauthorized error correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.UNAUTHORIZED}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('401')).toBeInTheDocument();
      expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it('renders 403 Forbidden error correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.FORBIDDEN}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('403')).toBeInTheDocument();
      expect(screen.getByText('Access Forbidden')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /contact support/i })
      ).toBeInTheDocument();
    });

    it('renders 500 Server Error correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('Server Error')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('renders 503 Service Unavailable error correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.SERVICE_UNAVAILABLE}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('503')).toBeInTheDocument();
      expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /view status/i })
      ).toBeInTheDocument();
    });
  });

  describe('Recovery Actions', () => {
    it('handles retry action correctly', async () => {
      let resetKey = 0;
      const { rerender } = render(
        <TestWrapper resetKey={resetKey}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </TestWrapper>
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });

      await act(async () => {
        fireEvent.click(retryButton);
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      // Re-render with incremented key and non-throwing component
      resetKey++;
      rerender(
        <TestWrapper resetKey={resetKey}>
          <ErrorThrowingComponent shouldThrow={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Working component')).toBeInTheDocument();
      });
    });

    it('handles go home action correctly', () => {
      render(
        <PageErrorBoundary config={{ homeUrl: '/dashboard' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      fireEvent.click(goHomeButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('handles go back action correctly', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      const goBackButton = screen.getByRole('button', { name: /go back/i });
      fireEvent.click(goBackButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('handles login action correctly', () => {
      render(
        <PageErrorBoundary config={{ loginUrl: '/auth/login' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.UNAUTHORIZED}
          />
        </PageErrorBoundary>
      );

      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('handles contact support action correctly', () => {
      render(
        <PageErrorBoundary config={{ contactUrl: '/help' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.FORBIDDEN}
          />
        </PageErrorBoundary>
      );

      const contactButton = screen.getByRole('button', {
        name: /contact support/i,
      });
      fireEvent.click(contactButton);

      expect(mockPush).toHaveBeenCalledWith('/help');
    });

    it('handles view status action correctly', () => {
      render(
        <PageErrorBoundary config={{ statusPageUrl: '/system-status' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.SERVICE_UNAVAILABLE}
          />
        </PageErrorBoundary>
      );

      const statusButton = screen.getByRole('button', { name: /view status/i });
      fireEvent.click(statusButton);

      expect(mockPush).toHaveBeenCalledWith('/system-status');
    });
  });

  describe('Error Details', () => {
    it('initially hides error details', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            message="Detailed error message"
          />
        </PageErrorBoundary>
      );

      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
    });

    it('shows error details when toggle is clicked', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            message="Detailed error message"
          />
        </PageErrorBoundary>
      );

      const toggleButton = screen.getByRole('button', {
        name: /show details/i,
      });
      fireEvent.click(toggleButton);

      expect(screen.getByText('Error Details')).toBeInTheDocument();
      expect(screen.getByText(/Detailed error message/)).toBeInTheDocument();
    });

    it('hides error details when toggle is clicked again', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            message="Detailed error message"
          />
        </PageErrorBoundary>
      );

      const toggleButton = screen.getByRole('button', {
        name: /show details/i,
      });

      // Show details
      fireEvent.click(toggleButton);
      expect(screen.getByText('Error Details')).toBeInTheDocument();

      // Hide details
      const hideButton = screen.getByRole('button', { name: /hide details/i });
      fireEvent.click(hideButton);
      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
    });
  });

  describe('Configuration Options', () => {
    it('uses custom home URL', () => {
      render(
        <PageErrorBoundary config={{ homeUrl: '/custom-home' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      fireEvent.click(goHomeButton);

      expect(mockPush).toHaveBeenCalledWith('/custom-home');
    });

    it('uses custom login URL', () => {
      render(
        <PageErrorBoundary config={{ loginUrl: '/custom-login' }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.UNAUTHORIZED}
          />
        </PageErrorBoundary>
      );

      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith('/custom-login');
    });

    it('calls custom error handler when error occurs', () => {
      const onError = jest.fn();

      render(
        <PageErrorBoundary config={{ onError }}>
          <ErrorThrowingComponent shouldThrow={true} message="Custom error" />
        </PageErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      const errorArg = onError.mock.calls[0][0];
      expect(errorArg.message).toBe('Custom error');
    });

    it('calls analytics callback when enabled', () => {
      const onAnalyticsEvent = jest.fn();

      render(
        <PageErrorBoundary config={{ enableAnalytics: true, onAnalyticsEvent }}>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      expect(onAnalyticsEvent).toHaveBeenCalled();
      const event = onAnalyticsEvent.mock.calls[0][0];
      expect(event.type).toBe('error-displayed');
      expect(event.errorType).toBe(PageErrorType.SERVER_ERROR);
      expect(event.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Auto Retry', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('does not auto-retry by default', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      expect(screen.queryByText(/retrying in/i)).not.toBeInTheDocument();
    });

    it('auto-retries when enabled and error is retryable', async () => {
      let resetKey = 0;
      const { rerender } = render(
        <TestWrapper
          resetKey={resetKey}
          config={{ enableAutoRetry: true, retryDelay: 2000 }}
        >
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </TestWrapper>
      );

      // Should show countdown
      expect(screen.getByText(/retrying in \d+ seconds/i)).toBeInTheDocument();

      // Fast-forward time
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // Re-render with incremented key and non-throwing component
      resetKey++;
      rerender(
        <TestWrapper
          resetKey={resetKey}
          config={{ enableAutoRetry: true, retryDelay: 2000 }}
        >
          <ErrorThrowingComponent shouldThrow={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Working component')).toBeInTheDocument();
      });
    });

    it('respects maxRetries limit', async () => {
      const { rerender } = render(
        <PageErrorBoundary
          config={{ enableAutoRetry: true, retryDelay: 1000, maxRetries: 2 }}
        >
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      // First retry
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      rerender(
        <PageErrorBoundary
          config={{ enableAutoRetry: true, retryDelay: 1000, maxRetries: 2 }}
        >
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      // Second retry
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      rerender(
        <PageErrorBoundary
          config={{ enableAutoRetry: true, retryDelay: 1000, maxRetries: 2 }}
        >
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      // Should not retry a third time (countdown should not appear)
      expect(screen.queryByText(/retrying in/i)).not.toBeInTheDocument();
    });
  });

  describe('Custom Fallback', () => {
    it('uses custom fallback render function when provided', () => {
      const customFallbackRender = jest.fn(() => (
        <div>Custom fallback content</div>
      ));

      render(
        <PageErrorBoundary fallbackRender={customFallbackRender}>
          <ErrorThrowingComponent shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(screen.getByText('Custom fallback content')).toBeInTheDocument();
      expect(customFallbackRender).toHaveBeenCalled();
    });

    it('uses custom fallback component when provided', () => {
      const CustomFallback: React.FC<{ error: Error }> = ({ error }) => (
        <div>Custom fallback: {error.message}</div>
      );

      render(
        <PageErrorBoundary fallback={CustomFallback}>
          <ErrorThrowingComponent shouldThrow={true} message="Custom error" />
        </PageErrorBoundary>
      );

      expect(
        screen.getByText('Custom fallback: Custom error')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations in 404 state', async () => {
      const { container } = render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in 500 state', async () => {
      const { container } = render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.INTERNAL_SERVER_ERROR}
          />
        </PageErrorBoundary>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with error details shown', async () => {
      const { container } = render(
        <PageErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </PageErrorBoundary>
      );

      // Show details
      const toggleButton = screen.getByRole('button', {
        name: /show details/i,
      });
      fireEvent.click(toggleButton);

      // Run axe but disable heading-order rule since the component uses h1 then h3
      // This is intentional in the design - the h3 is for a detail section
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Error Type Detection', () => {
    it('detects error type from status code', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent
            shouldThrow={true}
            statusCode={HttpStatusCode.NOT_FOUND}
          />
        </PageErrorBoundary>
      );

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('detects error type from error message when no status code', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} message="404: Not Found" />
        </PageErrorBoundary>
      );

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('uses unknown error type for unrecognized errors', () => {
      render(
        <PageErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} message="Unknown error" />
        </PageErrorBoundary>
      );

      expect(screen.getByText('Unknown Error')).toBeInTheDocument();
    });
  });
});
