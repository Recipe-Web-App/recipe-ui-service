import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { ErrorPage } from '@/components/error/ErrorPage';
import {
  PageErrorType,
  HttpStatusCode,
  RecoveryActionType,
  type PageErrorMetadata,
  type RecoveryAction,
} from '@/types/error/page-errors';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ErrorPage statusCode={404} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders with statusCode prop', () => {
      render(<ErrorPage statusCode={HttpStatusCode.NOT_FOUND} />);

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it('renders with errorType prop', () => {
      render(<ErrorPage errorType={PageErrorType.UNAUTHORIZED} />);

      expect(screen.getByText('401')).toBeInTheDocument();
      expect(screen.getByText(/unauthorized access/i)).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
      render(
        <ErrorPage
          statusCode={500}
          title="Custom Error Title"
          description="Custom error description"
        />
      );

      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ErrorPage statusCode={404} className="custom-class" />);

      const container = screen.getByRole('alert');
      expect(container).toHaveClass('custom-class');
    });

    it('applies custom test id', () => {
      render(<ErrorPage statusCode={404} data-testid="custom-error" />);

      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });
  });

  describe('HTTP Status Codes', () => {
    it.each([
      [400, '400', 'Bad Request'],
      [401, '401', 'Unauthorized Access'],
      [403, '403', 'Access Forbidden'],
      [404, '404', 'Page Not Found'],
      [408, '408', 'Request Timeout'],
      [410, '410', 'Page Gone'],
      [500, '500', 'Server Error'],
      [503, '503', 'Service Unavailable'],
    ])(
      'renders correctly for status code %i',
      (statusCode, expectedCode, expectedText) => {
        render(<ErrorPage statusCode={statusCode} />);

        expect(screen.getByText(expectedCode)).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(expectedText, 'i'))
        ).toBeInTheDocument();
      }
    );
  });

  describe('Error Types', () => {
    it.each([
      [PageErrorType.NOT_FOUND, '404'],
      [PageErrorType.UNAUTHORIZED, '401'],
      [PageErrorType.FORBIDDEN, '403'],
      [PageErrorType.SERVER_ERROR, '500'],
      [PageErrorType.SERVICE_UNAVAILABLE, '503'],
      [PageErrorType.MAINTENANCE, '503'],
      [PageErrorType.TIMEOUT, '408'],
      [PageErrorType.GONE, '410'],
      [PageErrorType.BAD_REQUEST, '400'],
    ])('renders correctly for error type %s', (errorType, expectedCode) => {
      render(<ErrorPage errorType={errorType} />);

      expect(screen.getByText(expectedCode)).toBeInTheDocument();
    });
  });

  describe('Recovery Actions', () => {
    it('renders default recovery actions', () => {
      render(<ErrorPage statusCode={404} homeUrl="/" />);

      expect(
        screen.getByRole('button', { name: /go home/i })
      ).toBeInTheDocument();
    });

    it('handles Go Home action click', () => {
      render(<ErrorPage statusCode={404} homeUrl="/home" />);

      const homeButton = screen.getByRole('button', { name: /go home/i });
      fireEvent.click(homeButton);

      expect(mockPush).toHaveBeenCalledWith('/home');
    });

    it('renders Login action for unauthorized errors', () => {
      render(<ErrorPage statusCode={401} loginUrl="/auth/login" />);

      const loginButton = screen.getByRole('button', { name: /sign in/i });
      expect(loginButton).toBeInTheDocument();

      fireEvent.click(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('renders custom recovery actions', () => {
      const customAction: RecoveryAction = {
        type: RecoveryActionType.RETRY,
        label: 'Custom Retry',
        url: '/retry',
        isPrimary: false,
      };

      render(<ErrorPage statusCode={500} recoveryActions={[customAction]} />);

      expect(
        screen.getByRole('button', { name: 'Custom Retry' })
      ).toBeInTheDocument();
    });

    it('handles custom action with handler', () => {
      const handler = jest.fn();
      const customAction: RecoveryAction = {
        type: RecoveryActionType.RETRY,
        label: 'Custom Action',
        handler,
        isPrimary: true,
      };

      render(<ErrorPage statusCode={500} recoveryActions={[customAction]} />);

      const button = screen.getByRole('button', { name: 'Custom Action' });
      fireEvent.click(button);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders Contact Support action when contactEmail is provided', () => {
      render(<ErrorPage statusCode={500} contactEmail="support@example.com" />);

      expect(
        screen.getByRole('button', { name: /contact support/i })
      ).toBeInTheDocument();
    });

    it('renders View Status action when statusPageUrl is provided', () => {
      render(
        <ErrorPage
          statusCode={503}
          statusPageUrl="https://status.example.com"
        />
      );

      expect(
        screen.getByRole('button', { name: /view status/i })
      ).toBeInTheDocument();
    });
  });

  describe('Maintenance Mode', () => {
    it('displays maintenance message', () => {
      render(
        <ErrorPage
          errorType={PageErrorType.MAINTENANCE}
          maintenanceMessage="We are performing scheduled maintenance"
        />
      );

      expect(
        screen.getByText('We are performing scheduled maintenance')
      ).toBeInTheDocument();
    });

    it('displays estimated recovery time', () => {
      const recoveryTime = new Date('2025-01-01T10:00:00Z');

      render(
        <ErrorPage
          errorType={PageErrorType.MAINTENANCE}
          maintenanceMessage="Maintenance in progress"
          estimatedRecoveryTime={recoveryTime}
        />
      );

      expect(screen.getByText(/expected to be back by/i)).toBeInTheDocument();
    });

    it('does not display maintenance message for non-maintenance errors', () => {
      render(
        <ErrorPage
          statusCode={404}
          maintenanceMessage="This should not appear"
        />
      );

      expect(
        screen.queryByText('This should not appear')
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Details', () => {
    it('does not show details by default', () => {
      render(<ErrorPage statusCode={500} errorDetails="Stack trace here" />);

      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
    });

    it('shows details when showDetails is true', () => {
      render(
        <ErrorPage
          statusCode={500}
          showDetails={true}
          errorDetails="Stack trace here"
        />
      );

      expect(screen.getByText('Error Details')).toBeInTheDocument();
    });

    it('toggles details expansion', () => {
      render(
        <ErrorPage
          statusCode={500}
          showDetails={true}
          errorDetails="Stack trace here"
        />
      );

      const detailsButton = screen.getByRole('button', {
        name: /error details/i,
      });

      // Initially collapsed
      expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Stack trace here')).not.toBeInTheDocument();

      // Expand
      fireEvent.click(detailsButton);
      expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Stack trace here')).toBeInTheDocument();

      // Collapse
      fireEvent.click(detailsButton);
      expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Stack trace here')).not.toBeInTheDocument();
    });

    it('does not show details section when errorDetails is not provided', () => {
      render(<ErrorPage statusCode={500} showDetails={true} />);

      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('calls onError with metadata', async () => {
      const onError = jest.fn();

      render(<ErrorPage statusCode={404} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledTimes(1);
      });

      const callArg = onError.mock.calls[0][0] as PageErrorMetadata;
      expect(callArg.errorType).toBe(PageErrorType.NOT_FOUND);
      expect(callArg.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    });

    it('does not call onError when not provided', () => {
      const { rerender } = render(<ErrorPage statusCode={404} />);

      // Should not throw
      rerender(<ErrorPage statusCode={500} />);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<ErrorPage statusCode={404} />);

      const container = screen.getByRole('alert');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('has accessible recovery actions group', () => {
      render(<ErrorPage statusCode={404} />);

      const actionsGroup = screen.getByRole('group', {
        name: /recovery actions/i,
      });
      expect(actionsGroup).toBeInTheDocument();
    });

    it('has accessible button labels', () => {
      render(<ErrorPage statusCode={404} homeUrl="/" />);

      const homeButton = screen.getByRole('button', { name: /go home/i });
      expect(homeButton).toHaveAttribute('aria-label');
    });

    it('has proper aria-expanded on details toggle', () => {
      render(
        <ErrorPage statusCode={500} showDetails={true} errorDetails="Details" />
      );

      const detailsButton = screen.getByRole('button', {
        name: /error details/i,
      });
      expect(detailsButton).toHaveAttribute('aria-expanded');
      expect(detailsButton).toHaveAttribute('aria-controls');
    });
  });

  describe('Icon Rendering', () => {
    it('renders icon container for error type', () => {
      const { container } = render(<ErrorPage statusCode={404} />);

      // Icon should be present (we can't easily test which specific icon without snapshot testing)
      const iconContainer = container.querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles unknown status codes gracefully', () => {
      render(<ErrorPage statusCode={999} />);

      // Should still render without crashing
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles empty recovery actions array', () => {
      render(<ErrorPage statusCode={404} recoveryActions={[]} />);

      // Should not render actions group when empty
      expect(
        screen.queryByRole('group', { name: /recovery actions/i })
      ).not.toBeInTheDocument();
    });

    it('prefers custom title over generated title', () => {
      render(<ErrorPage statusCode={404} title="Custom 404 Title" />);

      expect(screen.getByText('Custom 404 Title')).toBeInTheDocument();
      expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
    });

    it('prefers custom description over generated description', () => {
      render(<ErrorPage statusCode={404} description="Custom description" />);

      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });
  });

  describe('URL Navigation', () => {
    it('navigates to homeUrl when Go Home is clicked', () => {
      render(<ErrorPage statusCode={404} homeUrl="/dashboard" />);

      const homeButton = screen.getByRole('button', { name: /go home/i });
      fireEvent.click(homeButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('navigates to loginUrl for unauthorized errors', () => {
      render(<ErrorPage statusCode={401} loginUrl="/auth/signin" />);

      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });

    it('uses default homeUrl when not provided', () => {
      render(<ErrorPage statusCode={404} />);

      const homeButton = screen.getByRole('button', { name: /go home/i });
      fireEvent.click(homeButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
