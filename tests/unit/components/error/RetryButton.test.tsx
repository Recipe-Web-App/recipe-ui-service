import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { RetryButton } from '@/components/error/RetryButton';
import { RetryStrategy } from '@/types/error/retry-button';
import type {
  RetryButtonProps,
  RetryAnalyticsEvent,
} from '@/types/error/retry-button';

describe('RetryButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders with default text', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} />);

      expect(
        screen.getByRole('button', { name: /retry operation/i })
      ).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry}>Retry Request</RetryButton>);

      expect(screen.getByText('Retry Request')).toBeInTheDocument();
    });

    it('renders retry icon by default', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} />);

      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('hides retry icon when showIcon is false', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} showIcon={false} />);

      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('renders with custom aria-label', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} aria-label="Custom retry label" />);

      expect(
        screen.getByRole('button', { name: 'Custom retry label' })
      ).toBeInTheDocument();
    });
  });

  describe('Button Variants', () => {
    it('renders with default variant', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('renders with destructive variant', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} variant="destructive" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('renders with outline variant', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} variant="outline" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
    });

    it('renders with ghost variant', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} variant="ghost" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-primary/10');
    });
  });

  describe('Retry Functionality', () => {
    it('calls onRetry when clicked', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('handles async onRetry', async () => {
      const onRetry = jest.fn().mockResolvedValue(undefined);
      render(<RetryButton onRetry={onRetry} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });

    it('shows loading state during async retry', async () => {
      const onRetry = jest.fn(
        () => new Promise<void>(resolve => setTimeout(resolve, 100))
      );
      render(<RetryButton onRetry={onRetry} retryingText="Processing..." />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Processing...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('calls onBeforeRetry callback', () => {
      const onRetry = jest.fn();
      const onBeforeRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} onBeforeRetry={onBeforeRetry} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onBeforeRetry).toHaveBeenCalledWith(1);
    });

    it('calls onAfterRetry callback on success', async () => {
      const onRetry = jest.fn().mockResolvedValue(undefined);
      const onAfterRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} onAfterRetry={onAfterRetry} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAfterRetry).toHaveBeenCalledWith(
          expect.objectContaining({
            attemptNumber: 1,
            success: true,
          })
        );
      });
    });

    it('calls onAfterRetry callback on failure', async () => {
      const error = new Error('Retry failed');
      const onRetry = jest.fn().mockRejectedValue(error);
      const onAfterRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} onAfterRetry={onAfterRetry} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAfterRetry).toHaveBeenCalledWith(
          expect.objectContaining({
            attemptNumber: 1,
            success: false,
            error,
          })
        );
      });
    });
  });

  describe('Attempt Tracking', () => {
    it('increments attempt counter on failure', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(
        <RetryButton
          onRetry={onRetry}
          showAttemptCount
          maxAttempts={3}
          cooldownMs={0}
        />
      );

      // First attempt
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/\(1\/3\)/)).toBeInTheDocument();
      });

      // Second attempt
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/\(2\/3\)/)).toBeInTheDocument();
      });
    });

    it('shows attempt count when enabled', () => {
      const onRetry = jest.fn();
      render(
        <RetryButton onRetry={onRetry} showAttemptCount maxAttempts={3} />
      );

      expect(screen.getByText(/\(1\/3\)/)).toBeInTheDocument();
    });

    it('hides attempt count when disabled', () => {
      const onRetry = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          showAttemptCount={false}
          maxAttempts={3}
        />
      );

      expect(screen.queryByText(/\(1\/3\)/)).not.toBeInTheDocument();
    });

    it('respects controlled attempt number', () => {
      const onRetry = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          currentAttempt={2}
          showAttemptCount
          maxAttempts={5}
        />
      );

      expect(screen.getByText(/\(2\/5\)/)).toBeInTheDocument();
    });
  });

  describe('Max Attempts', () => {
    it('disables button when max attempts reached', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} maxAttempts={2} cooldownMs={0} />);

      const button = screen.getByRole('button');

      // First attempt
      fireEvent.click(button);
      await waitFor(() => expect(onRetry).toHaveBeenCalledTimes(1));

      // Wait for retrying state to finish
      await waitFor(() => {
        expect(screen.queryByText('Retrying...')).not.toBeInTheDocument();
      });

      // Second attempt (should work since we're now on attempt 2/2)
      fireEvent.click(button);
      await waitFor(() => expect(onRetry).toHaveBeenCalledTimes(2));

      // Now we've exceeded max attempts (attempt 3 > maxAttempts 2)
      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('shows max attempts text when limit reached', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(
        <RetryButton
          onRetry={onRetry}
          maxAttempts={1}
          maxAttemptsText="No more retries"
          cooldownMs={0}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('No more retries')).toBeInTheDocument();
      });
    });

    it('calls onMaxAttemptsReached callback', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onMaxAttemptsReached = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          maxAttempts={1}
          onMaxAttemptsReached={onMaxAttemptsReached}
          cooldownMs={0}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onMaxAttemptsReached).toHaveBeenCalled();
      });
    });
  });

  describe('Cooldown', () => {
    it('shows cooldown countdown when enabled', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={3000} showCooldown />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/in 3s/)).toBeInTheDocument();
      });
    });

    it('disables button during cooldown', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={2000} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('counts down cooldown timer', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={3000} showCooldown />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/in 3s/)).toBeInTheDocument();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/in 2s/)).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/in 1s/)).toBeInTheDocument();
    });

    it('enables button after cooldown expires', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={1000} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });

    it('calls onCooldownStart callback', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onCooldownStart = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          onCooldownStart={onCooldownStart}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onCooldownStart).toHaveBeenCalledWith(1000);
      });
    });

    it('calls onCooldownEnd callback', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onCooldownEnd = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          onCooldownEnd={onCooldownEnd}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onCooldownEnd).not.toHaveBeenCalled();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(onCooldownEnd).toHaveBeenCalled();
      });
    });

    it('uses custom cooldown text function', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const cooldownText = (seconds: number) => `Wait ${seconds} seconds`;
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={2000}
          showCooldown
          cooldownText={cooldownText}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Wait 2 seconds/)).toBeInTheDocument();
      });
    });
  });

  describe('Retry Strategies', () => {
    it('uses constant delay strategy', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onCooldownStart = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          retryStrategy={RetryStrategy.CONSTANT}
          onCooldownStart={onCooldownStart}
        />
      );

      const button = screen.getByRole('button');

      // First attempt
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(1000));

      act(() => jest.advanceTimersByTime(1000));
      onCooldownStart.mockClear();

      // Second attempt - should have same cooldown
      await waitFor(() => expect(button).not.toBeDisabled());
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(1000));
    });

    it('uses exponential backoff strategy', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onCooldownStart = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          retryStrategy={RetryStrategy.EXPONENTIAL}
          exponentialBackoff={true}
          backoffMultiplier={2}
          onCooldownStart={onCooldownStart}
        />
      );

      const button = screen.getByRole('button');

      // First attempt - 1000ms
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(1000));

      act(() => jest.advanceTimersByTime(1000));
      onCooldownStart.mockClear();

      // Second attempt - 2000ms (1000 * 2^1)
      await waitFor(() => expect(button).not.toBeDisabled());
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(2000));
    });

    it('uses linear delay strategy', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onCooldownStart = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          retryStrategy={RetryStrategy.LINEAR}
          onCooldownStart={onCooldownStart}
        />
      );

      const button = screen.getByRole('button');

      // First attempt - 1000ms (1000 * 1)
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(1000));

      act(() => jest.advanceTimersByTime(1000));
      onCooldownStart.mockClear();

      // Second attempt - 2000ms (1000 * 2)
      await waitFor(() => expect(button).not.toBeDisabled());
      fireEvent.click(button);
      await waitFor(() => expect(onCooldownStart).toHaveBeenCalledWith(2000));
    });

    it('uses immediate retry strategy (no cooldown)', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(
        <RetryButton
          onRetry={onRetry}
          retryStrategy={RetryStrategy.IMMEDIATE}
          cooldownMs={1000}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        // Button should not be disabled (no cooldown)
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Analytics', () => {
    it('emits retry-attempted event', () => {
      const onRetry = jest.fn();
      const onAnalytics = jest.fn();
      render(<RetryButton onRetry={onRetry} onAnalytics={onAnalytics} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'retry-attempted',
          attemptNumber: 1,
        })
      );
    });

    it('emits retry-success event on successful retry', async () => {
      const onRetry = jest.fn().mockResolvedValue(undefined);
      const onAnalytics = jest.fn();
      render(<RetryButton onRetry={onRetry} onAnalytics={onAnalytics} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'retry-success',
            attemptNumber: 1,
          })
        );
      });
    });

    it('emits retry-failure event on failed retry', async () => {
      const error = new Error('Retry failed');
      const onRetry = jest.fn().mockRejectedValue(error);
      const onAnalytics = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          onAnalytics={onAnalytics}
          cooldownMs={0}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'retry-failure',
            attemptNumber: 1,
            error,
          })
        );
      });
    });

    it('emits max-attempts-reached event', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onAnalytics = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          maxAttempts={1}
          onAnalytics={onAnalytics}
          cooldownMs={0}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'max-attempts-reached',
            maxAttempts: 1,
          })
        );
      });
    });

    it('emits cooldown events', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const onAnalytics = jest.fn();
      render(
        <RetryButton
          onRetry={onRetry}
          cooldownMs={1000}
          onAnalytics={onAnalytics}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'cooldown-started',
            cooldownMs: 1000,
          })
        );
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(onAnalytics).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'cooldown-ended',
          })
        );
      });
    });
  });

  describe('External State Control', () => {
    it('respects external disabled state', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} externalDisabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('respects external loading state', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} externalLoading={true} />);

      // Button should show loading spinner
      const button = screen.getByRole('button');
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Icon Position', () => {
    it('renders icon on the left by default', () => {
      const onRetry = jest.fn();
      const { container } = render(<RetryButton onRetry={onRetry} />);

      const button = container.querySelector('button');
      const icon = button?.querySelector('svg');
      const text = button?.textContent;

      expect(icon).toBeInTheDocument();
      expect(text).toContain('Try Again');
    });

    it('renders icon on the right when specified', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} iconPosition="right" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label in idle state', () => {
      const onRetry = jest.fn();
      render(<RetryButton onRetry={onRetry} maxAttempts={3} />);

      expect(
        screen.getByRole('button', { name: /retry operation.*attempt 1 of 3/i })
      ).toBeInTheDocument();
    });

    it('has proper ARIA label during retry', () => {
      const onRetry = jest.fn(
        () => new Promise<void>(resolve => setTimeout(resolve, 100))
      );
      render(<RetryButton onRetry={onRetry} maxAttempts={3} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(
        screen.getByRole('button', { name: /retrying.*attempt 1 of 3/i })
      ).toBeInTheDocument();
    });

    it('has proper ARIA label during cooldown', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={2000} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /retry available in 2 seconds/i })
        ).toBeInTheDocument();
      });
    });

    it('has proper ARIA label when max attempts reached', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} maxAttempts={1} cooldownMs={0} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole('button', {
            name: /retry failed.*maximum retry attempts.*reached/i,
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicks gracefully', async () => {
      const onRetry = jest.fn().mockResolvedValue(undefined);
      render(<RetryButton onRetry={onRetry} />);

      const button = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        // Should only call once (while loading)
        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });

    it('cleans up timer on unmount', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      const { unmount } = render(
        <RetryButton onRetry={onRetry} cooldownMs={5000} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should not throw or cause issues
    });

    it('handles zero cooldown correctly', async () => {
      const onRetry = jest.fn().mockRejectedValue(new Error('Failed'));
      render(<RetryButton onRetry={onRetry} cooldownMs={0} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        // Should be immediately available for retry
        expect(button).not.toBeDisabled();
      });
    });
  });
});
