'use client';

/**
 * ErrorAlert Component
 *
 * A specialized component for displaying inline error messages from various sources
 * including form validation, API errors, service errors, and custom messages.
 *
 * Features:
 * - Multiple error source support (Zod, Service, Component, Page, Custom)
 * - Visual variants (inline, banner, toast, card)
 * - Severity levels (error, warning, info)
 * - Auto-dismiss functionality
 * - Recovery actions (retry, dismiss, clear)
 * - Accessibility support (ARIA, keyboard navigation)
 * - Multiple error display with collapsible lists
 *
 * @example
 * ```tsx
 * // Form validation errors
 * <ErrorAlert zodError={formErrors} variant="inline" />
 *
 * // API/Service errors
 * <ErrorAlert serviceError={error} onRetry={refetch} />
 *
 * // Custom error message
 * <ErrorAlert error="Something went wrong" severity="error" />
 * ```
 */

import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  XCircle as XCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  errorAlertVariants,
  errorAlertToastPositionVariants,
  errorAlertIconVariants,
  errorAlertTitleVariants,
  errorAlertDescriptionVariants,
  errorAlertContentVariants,
  errorAlertCloseVariants,
  errorAlertActionsVariants,
  errorAlertActionButtonVariants,
  errorAlertListVariants,
  errorAlertItemVariants,
  errorAlertFieldLabelVariants,
  errorAlertCollapseToggleVariants,
  errorAlertHintVariants,
} from '@/lib/ui/error-alert-variants';
import {
  normalizeError,
  formatError,
  getRecoveryHint,
} from '@/lib/error/error-alert-utils';
import type {
  ErrorAlertProps,
  ErrorAlertSeverity,
  ErrorAlertRecoveryAction,
  ErrorAlertAnalyticsEvent,
} from '@/types/error/error-alert';

/**
 * Severity to icon mapping
 */
const SEVERITY_ICONS: Record<
  ErrorAlertSeverity,
  React.ComponentType<{ className?: string }>
> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * ErrorAlert component
 */
export const ErrorAlert = React.forwardRef<HTMLDivElement, ErrorAlertProps>(
  (
    {
      // Error sources
      error,
      zodError,
      validationErrors,
      serviceError,
      componentError,
      pageError,

      // Configuration
      config,
      variant = config?.variant ?? 'inline',
      severity: severityProp,
      size = config?.size ?? 'md',

      // Display customization
      title: customTitle,
      description: customDescription,
      recoveryActions: customRecoveryActions,
      hint: customHint,

      // Auto-dismiss
      autoDismiss = config?.autoDismiss ?? false,

      // Callbacks
      onDismiss,
      onRetry,
      onClear,
      onAction,
      onAnalytics,

      // Styling
      className,
      showIcon = config?.showIcon ?? true,
      showClose = config?.showClose ?? true,
      collapsible = config?.collapsible ?? false,
      maxErrors = config?.maxErrors ?? 5,

      // Accessibility
      'aria-label': ariaLabel,
      'data-testid': testId = 'error-alert',
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const autoDismissTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Normalize error from various sources
    const normalizedError = React.useMemo(
      () =>
        normalizeError({
          error,
          zodError,
          validationErrors,
          serviceError,
          componentError,
          pageError,
        }),
      [
        error,
        zodError,
        validationErrors,
        serviceError,
        componentError,
        pageError,
      ]
    );

    // Determine severity
    const severity =
      severityProp ??
      normalizedError?.severity ??
      ('error' as ErrorAlertSeverity);

    // Format error for display
    const formattedError = React.useMemo(() => {
      if (!normalizedError) return null;
      return formatError(normalizedError, {
        maxMessageLength: 500,
      });
    }, [normalizedError]);

    // Get recovery hint
    const hint = React.useMemo(() => {
      if (customHint) return customHint;
      if (!normalizedError) return undefined;
      return getRecoveryHint(normalizedError);
    }, [customHint, normalizedError]);

    // Determine display content
    const displayTitle = customTitle ?? formattedError?.title ?? 'Error';
    const displayDescription =
      customDescription ?? formattedError?.message ?? '';

    // Get icon component
    // eslint-disable-next-line security/detect-object-injection
    const IconComponent = SEVERITY_ICONS[severity];

    // Handle auto-dismiss
    React.useEffect(() => {
      if (autoDismiss && typeof autoDismiss === 'number') {
        autoDismissTimerRef.current = setTimeout(() => {
          handleDismiss();
        }, autoDismiss);
      }

      return () => {
        if (autoDismissTimerRef.current) {
          clearTimeout(autoDismissTimerRef.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoDismiss]);

    // Send analytics event
    React.useEffect(() => {
      if (normalizedError && onAnalytics) {
        const event: ErrorAlertAnalyticsEvent = {
          type: 'displayed',
          errorSource: normalizedError.source,
          severity: normalizedError.severity,
          errorFingerprint: normalizedError.fingerprint,
          timestamp: Date.now(),
        };
        onAnalytics(event);
      }
    }, [normalizedError, onAnalytics]);

    // Handle dismiss
    const handleDismiss = React.useCallback(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
      if (normalizedError && onAnalytics) {
        const event: ErrorAlertAnalyticsEvent = {
          type: 'dismissed',
          errorSource: normalizedError.source,
          severity: normalizedError.severity,
          errorFingerprint: normalizedError.fingerprint,
          timestamp: Date.now(),
        };
        onAnalytics(event);
      }
    }, [onDismiss, normalizedError, onAnalytics]);

    // Handle retry
    const handleRetry = React.useCallback(() => {
      if (onRetry) {
        onRetry();
      }
      if (normalizedError && onAnalytics) {
        const event: ErrorAlertAnalyticsEvent = {
          type: 'retry',
          errorSource: normalizedError.source,
          severity: normalizedError.severity,
          errorFingerprint: normalizedError.fingerprint,
          timestamp: Date.now(),
        };
        onAnalytics(event);
      }
    }, [onRetry, normalizedError, onAnalytics]);

    // Handle clear
    const handleClear = React.useCallback(() => {
      if (onClear) {
        onClear();
      }
      handleDismiss();
    }, [onClear, handleDismiss]);

    // Handle recovery action
    const handleAction = React.useCallback(
      (action: ErrorAlertRecoveryAction) => {
        action.handler();
        if (onAction) {
          onAction(action);
        }
        if (normalizedError && onAnalytics) {
          const event: ErrorAlertAnalyticsEvent = {
            type: 'action',
            errorSource: normalizedError.source,
            severity: normalizedError.severity,
            errorFingerprint: normalizedError.fingerprint,
            timestamp: Date.now(),
            metadata: { actionType: action.type, actionLabel: action.label },
          };
          onAnalytics(event);
        }
      },
      [onAction, normalizedError, onAnalytics]
    );

    // Toggle expansion
    const toggleExpansion = React.useCallback(() => {
      setIsExpanded(prev => !prev);
    }, []);

    // Don't render if no error or not visible
    if (!normalizedError || !isVisible) {
      return null;
    }

    // Determine if we should show multiple errors
    const errors = normalizedError.errors ?? [];
    const hasMultipleErrors = errors.length > 0;
    const visibleErrors = isExpanded ? errors : errors.slice(0, maxErrors);

    // Default recovery actions
    const defaultRecoveryActions: ErrorAlertRecoveryAction[] = [];

    if (normalizedError.retryable && onRetry) {
      defaultRecoveryActions.push({
        type: 'retry',
        label: 'Try Again',
        handler: handleRetry,
        icon: RefreshCw,
        variant: 'primary',
      });
    }

    if (onClear) {
      defaultRecoveryActions.push({
        type: 'clear',
        label: 'Clear',
        handler: handleClear,
        icon: XCircleIcon,
        variant: 'secondary',
      });
    }

    const recoveryActions =
      customRecoveryActions ??
      (config?.showRecoveryActions !== false ? defaultRecoveryActions : []);

    // Determine position classes for toast variant
    const positionClasses =
      variant === 'toast'
        ? errorAlertToastPositionVariants({
            position: config?.position ?? 'bottom-right',
          })
        : '';

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        aria-label={ariaLabel ?? `${severity} alert: ${displayTitle}`}
        data-testid={testId}
        className={cn(
          errorAlertVariants({ variant, severity, size }),
          positionClasses,
          className
        )}
      >
        <div className={cn(errorAlertContentVariants({ withIcon: showIcon }))}>
          {/* Icon */}
          {showIcon && (
            <div className={cn(errorAlertIconVariants({ severity, size }))}>
              <IconComponent aria-hidden="true" />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(errorAlertTitleVariants({ severity, size }))}>
                {displayTitle}
              </h3>

              {/* Close button */}
              {showClose && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className={cn(errorAlertCloseVariants({ severity, size }))}
                  aria-label="Dismiss alert"
                >
                  <X aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Description */}
            {displayDescription && !hasMultipleErrors && (
              <p
                className={cn(
                  errorAlertDescriptionVariants({ severity, size })
                )}
              >
                {displayDescription}
              </p>
            )}

            {/* Multiple errors list */}
            {hasMultipleErrors && (
              <div className={cn(errorAlertListVariants({ size }))}>
                {visibleErrors.map((err, index) => (
                  <div
                    key={`${err.field}-${index}`}
                    className={cn(errorAlertItemVariants({ severity, size }))}
                  >
                    <div className="flex-1">
                      {err.field && (
                        <span
                          className={cn(
                            errorAlertFieldLabelVariants({ severity, size })
                          )}
                        >
                          {err.field}:{' '}
                        </span>
                      )}
                      <span>{err.message}</span>
                    </div>
                  </div>
                ))}

                {/* Show more/less toggle */}
                {collapsible && errors.length > maxErrors && (
                  <button
                    type="button"
                    onClick={toggleExpansion}
                    className={cn(
                      errorAlertCollapseToggleVariants({ severity, size })
                    )}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        Show {errors.length - maxErrors} more{' '}
                        {errors.length - maxErrors === 1 ? 'error' : 'errors'}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Hint */}
            {hint && (
              <p className={cn(errorAlertHintVariants({ severity, size }))}>
                {hint}
              </p>
            )}

            {/* Recovery actions */}
            {recoveryActions.length > 0 && (
              <div className={cn(errorAlertActionsVariants({ size }))}>
                {recoveryActions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAction(action)}
                      disabled={action.disabled}
                      className={cn(
                        errorAlertActionButtonVariants({
                          severity,
                          variant: action.variant ?? 'primary',
                          size,
                        })
                      )}
                      aria-label={action.label}
                    >
                      {ActionIcon && <ActionIcon aria-hidden="true" />}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';
