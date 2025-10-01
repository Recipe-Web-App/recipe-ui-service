'use client';

/**
 * RetryButton Component
 *
 * A specialized button component for retry operations that wraps the base Button
 * component and adds retry-specific functionality including attempt tracking,
 * cooldown periods, and exponential backoff.
 *
 * Features:
 * - Automatic retry attempt tracking
 * - Configurable cooldown periods with countdown display
 * - Exponential backoff support
 * - Max attempts enforcement
 * - Loading and disabled states
 * - Analytics event emission
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RetryButton onRetry={handleRetry} />
 *
 * // With cooldown and attempt tracking
 * <RetryButton
 *   onRetry={handleRetry}
 *   maxAttempts={3}
 *   cooldownMs={2000}
 *   showAttemptCount
 *   showCooldown
 * />
 *
 * // With exponential backoff
 * <RetryButton
 *   onRetry={handleRetry}
 *   exponentialBackoff
 *   backoffMultiplier={2}
 *   cooldownMs={1000}
 * />
 * ```
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  retryIconVariants,
  cooldownTextVariants,
} from '@/lib/ui/retry-button-variants';
import type {
  RetryButtonProps,
  RetryAttempt,
  RetryAnalyticsEvent,
} from '@/types/error/retry-button';
import {
  DEFAULT_RETRY_CONFIG,
  RetryStrategy,
} from '@/types/error/retry-button';

export const RetryButton = React.forwardRef<
  HTMLButtonElement,
  RetryButtonProps
>(
  (
    {
      // Core retry props
      onRetry,

      // Retry configuration
      maxAttempts = DEFAULT_RETRY_CONFIG.maxAttempts,
      currentAttempt: controlledAttempt,
      cooldownMs = DEFAULT_RETRY_CONFIG.cooldownMs,
      exponentialBackoff = false,
      backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
      retryStrategy = DEFAULT_RETRY_CONFIG.retryStrategy,

      // Display options
      showAttemptCount = DEFAULT_RETRY_CONFIG.showAttemptCount,
      showCooldown = DEFAULT_RETRY_CONFIG.showCooldown,
      showIcon = DEFAULT_RETRY_CONFIG.showIcon,
      iconPosition = DEFAULT_RETRY_CONFIG.iconPosition,

      // Content customization
      children = 'Try Again',
      retryingText = 'Retrying...',
      cooldownText,
      maxAttemptsText = 'Max Retries Reached',

      // State control
      externalDisabled = false,
      externalLoading = false,

      // Callbacks
      onMaxAttemptsReached,
      onCooldownStart,
      onCooldownEnd,
      onBeforeRetry,
      onAfterRetry,
      onAnalytics,

      // Accessibility
      'aria-label': ariaLabel,
      'data-testid': testId = 'retry-button',

      // Button props to forward
      variant = 'default',
      size = 'default',
      className,
      ...buttonProps
    },
    ref
  ) => {
    // ========== State Management ==========
    const [internalAttempt, setInternalAttempt] = React.useState(1);
    const [isRetrying, setIsRetrying] = React.useState(false);
    const [cooldownRemaining, setCooldownRemaining] = React.useState(0);
    const [, setAttemptHistory] = React.useState<RetryAttempt[]>([]);

    const cooldownTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const attemptStartTimeRef = React.useRef<number>(0);

    // Use controlled or internal attempt number
    const attemptNumber = controlledAttempt ?? internalAttempt;

    // Calculate max attempts reached
    const maxAttemptsReached = attemptNumber > maxAttempts;

    // Determine if button should be disabled
    const isDisabled =
      externalDisabled || maxAttemptsReached || cooldownRemaining > 0;

    // Determine if button should show loading
    const isLoading = externalLoading || isRetrying;

    // ========== Cooldown Calculation ==========
    const calculateCooldown = React.useCallback(
      (attemptNum: number): number => {
        if (!cooldownMs) return 0;

        switch (retryStrategy) {
          case RetryStrategy.EXPONENTIAL:
            if (exponentialBackoff) {
              return Math.min(
                cooldownMs * Math.pow(backoffMultiplier, attemptNum - 1),
                30000 // Max 30 seconds
              );
            }
            return cooldownMs;

          case RetryStrategy.LINEAR:
            return cooldownMs * attemptNum;

          case RetryStrategy.IMMEDIATE:
            return 0;

          case RetryStrategy.CONSTANT:
          default:
            return cooldownMs;
        }
      },
      [cooldownMs, exponentialBackoff, backoffMultiplier, retryStrategy]
    );

    // ========== Cooldown Timer ==========
    const startCooldown = React.useCallback(
      (durationMs: number) => {
        if (durationMs <= 0) return;

        setCooldownRemaining(Math.ceil(durationMs / 1000));

        // Emit cooldown start event
        if (onCooldownStart) {
          onCooldownStart(durationMs);
        }

        if (onAnalytics) {
          const event: RetryAnalyticsEvent = {
            type: 'cooldown-started',
            attemptNumber,
            maxAttempts,
            cooldownMs: durationMs,
            timestamp: Date.now(),
          };
          onAnalytics(event);
        }

        // Countdown timer
        let remaining = durationMs;
        cooldownTimerRef.current = setInterval(() => {
          remaining -= 1000;

          if (remaining <= 0) {
            setCooldownRemaining(0);
            if (cooldownTimerRef.current) {
              clearInterval(cooldownTimerRef.current);
              cooldownTimerRef.current = null;
            }

            // Emit cooldown end event
            if (onCooldownEnd) {
              onCooldownEnd();
            }

            if (onAnalytics) {
              const event: RetryAnalyticsEvent = {
                type: 'cooldown-ended',
                attemptNumber,
                maxAttempts,
                timestamp: Date.now(),
              };
              onAnalytics(event);
            }
          } else {
            setCooldownRemaining(Math.ceil(remaining / 1000));
          }
        }, 1000);
      },
      [attemptNumber, maxAttempts, onCooldownStart, onCooldownEnd, onAnalytics]
    );

    // Cleanup cooldown timer on unmount
    React.useEffect(() => {
      return () => {
        if (cooldownTimerRef.current) {
          clearInterval(cooldownTimerRef.current);
        }
      };
    }, []);

    // ========== Retry Handler ==========
    const handleRetry = React.useCallback(async () => {
      // Prevent retry if conditions aren't met
      if (isRetrying || maxAttemptsReached || cooldownRemaining > 0) {
        return;
      }

      attemptStartTimeRef.current = Date.now();
      setIsRetrying(true);

      // Emit before retry callback
      if (onBeforeRetry) {
        onBeforeRetry(attemptNumber);
      }

      if (onAnalytics) {
        const event: RetryAnalyticsEvent = {
          type: 'retry-attempted',
          attemptNumber,
          maxAttempts,
          timestamp: Date.now(),
        };
        onAnalytics(event);
      }

      try {
        await onRetry();

        // Success
        const durationMs = Date.now() - attemptStartTimeRef.current;
        const attempt: RetryAttempt = {
          attemptNumber,
          timestamp: Date.now(),
          success: true,
          durationMs,
        };

        setAttemptHistory(prev => [...prev, attempt]);

        if (onAfterRetry) {
          onAfterRetry(attempt);
        }

        if (onAnalytics) {
          const event: RetryAnalyticsEvent = {
            type: 'retry-success',
            attemptNumber,
            maxAttempts,
            timestamp: Date.now(),
            metadata: { durationMs },
          };
          onAnalytics(event);
        }
      } catch (error) {
        // Failure
        const durationMs = Date.now() - attemptStartTimeRef.current;
        const attempt: RetryAttempt = {
          attemptNumber,
          timestamp: Date.now(),
          success: false,
          error: error as Error,
          durationMs,
        };

        setAttemptHistory(prev => [...prev, attempt]);

        if (onAfterRetry) {
          onAfterRetry(attempt);
        }

        if (onAnalytics) {
          const event: RetryAnalyticsEvent = {
            type: 'retry-failure',
            attemptNumber,
            maxAttempts,
            error: error as Error,
            timestamp: Date.now(),
            metadata: { durationMs },
          };
          onAnalytics(event);
        }

        // Calculate cooldown before incrementing (use current attempt for calculation)
        const cooldown = calculateCooldown(attemptNumber);

        // Increment attempt counter (only for uncontrolled)
        if (controlledAttempt === undefined) {
          setInternalAttempt(prev => prev + 1);
        }

        // Check if max attempts will be reached
        const nextAttempt = controlledAttempt ?? internalAttempt + 1;
        if (nextAttempt > maxAttempts) {
          if (onMaxAttemptsReached) {
            onMaxAttemptsReached();
          }

          if (onAnalytics) {
            const maxEvent: RetryAnalyticsEvent = {
              type: 'max-attempts-reached',
              attemptNumber: nextAttempt,
              maxAttempts,
              timestamp: Date.now(),
            };
            onAnalytics(maxEvent);
          }
        } else {
          // Start cooldown for next retry
          if (cooldown > 0) {
            startCooldown(cooldown);
          }
        }
      } finally {
        setIsRetrying(false);
      }
    }, [
      isRetrying,
      maxAttemptsReached,
      cooldownRemaining,
      attemptNumber,
      maxAttempts,
      onRetry,
      onBeforeRetry,
      onAfterRetry,
      onAnalytics,
      onMaxAttemptsReached,
      controlledAttempt,
      internalAttempt,
      calculateCooldown,
      startCooldown,
    ]);

    // ========== Icon State ==========
    const iconState = maxAttemptsReached
      ? 'disabled'
      : isRetrying
        ? 'retrying'
        : cooldownRemaining > 0
          ? 'cooldown'
          : 'idle';

    // ========== Button Content ==========
    const renderContent = () => {
      let text: React.ReactNode = children;

      // Override text based on state
      if (isRetrying) {
        text = retryingText;
      } else if (maxAttemptsReached) {
        text = maxAttemptsText;
      }

      // Add attempt count if enabled
      if (showAttemptCount && !maxAttemptsReached) {
        text = (
          <>
            {text}{' '}
            <span className="opacity-70">
              ({attemptNumber}/{maxAttempts})
            </span>
          </>
        );
      }

      // Add cooldown countdown if enabled
      if (showCooldown && cooldownRemaining > 0) {
        const countdownText = cooldownText
          ? cooldownText(cooldownRemaining)
          : `in ${cooldownRemaining}s`;

        text = (
          <>
            {text}{' '}
            <span className={cn(cooldownTextVariants({ emphasis: 'high' }))}>
              {countdownText}
            </span>
          </>
        );
      }

      return text;
    };

    // ========== Icon Rendering ==========
    const icon = showIcon ? (
      <RefreshCw
        className={cn(retryIconVariants({ state: iconState }))}
        aria-hidden="true"
      />
    ) : null;

    // ========== Accessibility ==========
    const getAriaLabel = () => {
      if (ariaLabel) return ariaLabel;

      if (maxAttemptsReached) {
        return `Retry failed: Maximum retry attempts (${maxAttempts}) reached`;
      }

      if (cooldownRemaining > 0) {
        return `Retry available in ${cooldownRemaining} seconds`;
      }

      if (isRetrying) {
        return `Retrying... Attempt ${attemptNumber} of ${maxAttempts}`;
      }

      return `Retry operation. Attempt ${attemptNumber} of ${maxAttempts}`;
    };

    // ========== Render ==========
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        disabled={isDisabled}
        loading={isLoading}
        onClick={handleRetry}
        aria-label={getAriaLabel()}
        data-testid={testId}
        {...buttonProps}
      >
        {iconPosition === 'left' && icon}
        {renderContent()}
        {iconPosition === 'right' && icon}
      </Button>
    );
  }
);

RetryButton.displayName = 'RetryButton';

export type { RetryButtonProps };
