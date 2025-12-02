/**
 * RetryButton types and interfaces
 *
 * This module defines types for the RetryButton component, which wraps
 * the base Button component and adds retry-specific functionality.
 */

import type { ButtonProps } from '@/types/ui/button';

/**
 * Retry attempt record
 */
export interface RetryAttempt {
  /** Attempt number (1-indexed) */
  attemptNumber: number;

  /** Timestamp when attempt was made */
  timestamp: number;

  /** Whether the attempt was successful */
  success: boolean;

  /** Error that occurred during attempt (if any) */
  error?: Error;

  /** Duration of the attempt in milliseconds */
  durationMs?: number;
}

/**
 * Cooldown configuration for retry delays
 */
export interface RetryCooldownConfig {
  /** Base delay in milliseconds */
  baseDelayMs: number;

  /** Maximum delay in milliseconds (cap for exponential backoff) */
  maxDelayMs: number;

  /** Multiplier for exponential backoff (default: 2) */
  multiplier: number;
}

/**
 * Retry strategy types
 */
export enum RetryStrategy {
  /** Constant delay between retries */
  CONSTANT = 'constant',

  /** Exponential backoff with multiplier */
  EXPONENTIAL = 'exponential',

  /** Linear increase in delay */
  LINEAR = 'linear',

  /** No delay between retries */
  IMMEDIATE = 'immediate',
}

/**
 * Retry analytics event
 */
export interface RetryAnalyticsEvent {
  /** Event type */
  type:
    | 'retry-attempted'
    | 'retry-success'
    | 'retry-failure'
    | 'max-attempts-reached'
    | 'cooldown-started'
    | 'cooldown-ended';

  /** Attempt number when event occurred */
  attemptNumber: number;

  /** Total attempts allowed */
  maxAttempts: number;

  /** Cooldown duration (if applicable) */
  cooldownMs?: number;

  /** Error that triggered retry (if applicable) */
  error?: Error;

  /** Timestamp when event occurred */
  timestamp: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * RetryButton component props
 *
 * Extends ButtonProps but removes conflicting props that are managed internally
 */
export interface RetryButtonProps extends Omit<
  ButtonProps,
  'loading' | 'disabled' | 'onClick'
> {
  // ========== Core Retry Props ==========
  /** Callback to execute on retry */
  onRetry: () => void | Promise<void>;

  // ========== Retry Configuration ==========
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;

  /** Current attempt number (for controlled component) */
  currentAttempt?: number;

  /** Cooldown period in milliseconds between retries */
  cooldownMs?: number;

  /** Use exponential backoff for cooldown (default: false) */
  exponentialBackoff?: boolean;

  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;

  /** Retry strategy to use */
  retryStrategy?: RetryStrategy;

  /** Custom cooldown configuration */
  cooldownConfig?: RetryCooldownConfig;

  // ========== Display Options ==========
  /** Show attempt count in button text (e.g., "Try Again (2/3)") */
  showAttemptCount?: boolean;

  /** Show cooldown countdown in button text */
  showCooldown?: boolean;

  /** Show retry icon (RefreshCw) */
  showIcon?: boolean;

  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';

  // ========== Content Customization ==========
  /** Button text (default: "Try Again") */
  children?: React.ReactNode;

  /** Text to show while retrying (default: "Retrying...") */
  retryingText?: string;

  /** Custom cooldown text function */
  cooldownText?: (secondsRemaining: number) => string;

  /** Text when max attempts reached (default: "Max Retries Reached") */
  maxAttemptsText?: string;

  // ========== State Control ==========
  /** Externally controlled disabled state (in addition to internal state) */
  externalDisabled?: boolean;

  /** Externally controlled loading state (in addition to internal state) */
  externalLoading?: boolean;

  // ========== Callbacks ==========
  /** Called when max attempts is reached */
  onMaxAttemptsReached?: () => void;

  /** Called when cooldown starts */
  onCooldownStart?: (cooldownMs: number) => void;

  /** Called when cooldown ends */
  onCooldownEnd?: () => void;

  /** Called before retry attempt */
  onBeforeRetry?: (attemptNumber: number) => void;

  /** Called after retry attempt */
  onAfterRetry?: (attempt: RetryAttempt) => void;

  /** Analytics callback */
  onAnalytics?: (event: RetryAnalyticsEvent) => void;

  // ========== Accessibility ==========
  /** Custom ARIA label (falls back to dynamic label based on state) */
  'aria-label'?: string;

  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * RetryButton state
 */
export interface RetryButtonState {
  /** Current attempt number */
  currentAttempt: number;

  /** Whether retry is in progress */
  isRetrying: boolean;

  /** Remaining cooldown time in milliseconds */
  cooldownRemaining: number;

  /** Whether max attempts has been reached */
  maxAttemptsReached: boolean;

  /** History of retry attempts */
  attemptHistory: RetryAttempt[];

  /** Last error encountered */
  lastError?: Error;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  cooldownMs: 1000,
  backoffMultiplier: 2,
  retryStrategy: RetryStrategy.CONSTANT,
  showIcon: true,
  showAttemptCount: false,
  showCooldown: false,
  iconPosition: 'left' as const,
} as const;

/**
 * Default cooldown configuration
 */
export const DEFAULT_COOLDOWN_CONFIG: RetryCooldownConfig = {
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  multiplier: 2,
} as const;
