/**
 * ComponentErrorBoundary - Component-level error protection
 *
 * Wraps individual components to prevent cascading failures and provide
 * graceful degradation with component-specific recovery strategies.
 */

'use client';

import React from 'react';
import {
  ComponentErrorSeverity,
  FallbackMode,
  DEFAULT_COMPONENT_ERROR_CONFIG,
  type ComponentErrorBoundaryProps,
  type ComponentErrorBoundaryState,
  type ComponentErrorBoundaryConfig,
  type ComponentErrorMetadata,
  type ComponentErrorFallbackProps,
  type ComponentErrorAnalyticsEvent,
} from '@/types/error/component-errors';
import {
  extractComponentName,
  createComponentErrorMetadata,
  validateComponentProps,
  sanitizePropsForLogging,
  formatComponentError,
  getUserFriendlyErrorMessage,
  shouldLogError,
  areDuplicateErrors,
  calculateRetryDelay,
} from '@/lib/error/component-error-utils';
import {
  componentErrorBoundaryVariants,
  componentErrorSkeletonVariants,
  componentErrorPlaceholderVariants,
  componentErrorPlaceholderIconVariants,
  componentErrorPlaceholderTitleVariants,
  componentErrorPlaceholderDescriptionVariants,
  componentErrorMinimalVariants,
  componentErrorDetailedVariants,
  componentErrorHeaderVariants,
  componentErrorTitleVariants,
  componentErrorDescriptionVariants,
  componentErrorBadgeVariants,
  componentErrorActionsVariants,
  componentErrorButtonVariants,
  componentErrorDetailsVariants,
  componentErrorDetailsTitleVariants,
  componentErrorDetailsTextVariants,
  componentErrorIconVariants,
} from '@/lib/ui/component-error-boundary-variants';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/**
 * ComponentErrorBoundary Class Component
 */
class ComponentErrorBoundaryClass extends React.Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private countdownIntervalId: NodeJS.Timeout | null = null;

  constructor(props: ComponentErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorMetadata: null,
      retryCount: 0,
      isRetrying: false,
      retryCountdown: 0,
      lastErrorFingerprint: null,
    };
  }

  /**
   * Get merged configuration with defaults
   */
  private getConfig(): Required<
    Omit<
      ComponentErrorBoundaryConfig,
      | 'validateProps'
      | 'onError'
      | 'onAnalyticsEvent'
      | 'onReset'
      | 'fallbackComponent'
      | 'fallbackRender'
    >
  > {
    const {
      config,
      componentName,
      fallbackMode: fallbackModeProp,
      isolate: isolateProp,
    } = this.props;

    return {
      ...DEFAULT_COMPONENT_ERROR_CONFIG,
      ...config,
      componentName: componentName ?? config?.componentName ?? 'Component',
      componentDisplayName: config?.componentDisplayName ?? '',
      fallbackMode:
        fallbackModeProp ??
        config?.fallbackMode ??
        DEFAULT_COMPONENT_ERROR_CONFIG.fallbackMode,
      isolate:
        isolateProp ??
        config?.isolate ??
        DEFAULT_COMPONENT_ERROR_CONFIG.isolate,
      skeletonConfig: config?.skeletonConfig ?? {},
      placeholderConfig: config?.placeholderConfig ?? {},
    };
  }

  /**
   * React error boundary lifecycle method
   */
  static getDerivedStateFromError(
    error: Error
  ): Partial<ComponentErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * React error boundary lifecycle method
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const config = this.getConfig();
    const { onError } = this.props;

    // Extract component name from stack
    const componentStack = errorInfo.componentStack ?? undefined;
    const componentName = extractComponentName(
      componentStack,
      config.componentName
    );

    // Create error metadata
    const metadata = createComponentErrorMetadata(
      error,
      componentName,
      componentStack,
      this.capturePropsSnapshot(),
      this.state.retryCount
    );

    // Check for duplicate errors
    const isDuplicate =
      this.state.lastErrorFingerprint &&
      areDuplicateErrors(metadata.fingerprint, this.state.lastErrorFingerprint);

    // Update state with metadata
    this.setState({
      errorMetadata: metadata,
      lastErrorFingerprint: metadata.fingerprint,
    });

    // Log error if enabled and not duplicate
    if (
      config.enableLogging &&
      shouldLogError(metadata.errorType, metadata.severity) &&
      !isDuplicate
    ) {
      this.logError(error, metadata);
    }

    // Track error in analytics
    if (config.enableAnalytics && !isDuplicate) {
      this.trackAnalyticsEvent({
        type: 'component-error-displayed',
        componentName: metadata.componentName,
        errorType: metadata.errorType,
        severity: metadata.severity,
        fallbackMode: config.fallbackMode,
        timestamp: Date.now(),
      });
    }

    // Call custom error handler
    if (onError) {
      onError(error, metadata);
    }

    // Attempt automatic retry if enabled
    if (
      config.enableAutoRetry &&
      metadata.retryable &&
      this.state.retryCount < config.maxRetries
    ) {
      this.scheduleRetry();
    }
  }

  /**
   * Component unmount cleanup
   */
  componentWillUnmount(): void {
    this.clearRetryTimeout();
    this.clearCountdownInterval();
  }

  /**
   * Capture props snapshot for debugging
   */
  private capturePropsSnapshot(): Record<string, unknown> {
    // Extract only the props we want to log (exclude React-specific and function props)
    const excludeKeys = new Set([
      'children',
      'config',
      'componentName',
      'fallbackMode',
      'isolate',
      'fallback',
      'fallbackRender',
      'onError',
      'className',
    ]);

    const propsToLog = Object.entries(this.props).reduce<
      Record<string, unknown>
    >((acc, [key, value]) => {
      if (!excludeKeys.has(key)) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});

    return sanitizePropsForLogging(propsToLog);
  }

  /**
   * Log error to console
   */
  private logError(error: Error, metadata: ComponentErrorMetadata): void {
    const config = this.getConfig();
    const formatted = formatComponentError(error, true);

    console.error(
      '[ComponentErrorBoundary] Error in component:',
      metadata.componentName,
      '\n',
      formatted,
      '\n',
      'Metadata:',
      {
        type: metadata.errorType,
        severity: metadata.severity,
        retryable: metadata.retryable,
        retryCount: metadata.retryCount,
        fingerprint: metadata.fingerprint,
        fallbackMode: config.fallbackMode,
      },
      '\n',
      'Component Stack:',
      metadata.componentStack,
      '\n',
      'Props Snapshot:',
      metadata.propsSnapshot
    );
  }

  /**
   * Track analytics event
   */
  private trackAnalyticsEvent(event: ComponentErrorAnalyticsEvent): void {
    const { config } = this.props;

    if (config?.onAnalyticsEvent) {
      config.onAnalyticsEvent(event);
    }
  }

  /**
   * Reset error boundary state
   */
  private resetErrorBoundary = (): void => {
    const { config } = this.props;
    const { errorMetadata } = this.state;

    this.clearRetryTimeout();
    this.clearCountdownInterval();

    this.setState({
      hasError: false,
      error: null,
      errorMetadata: null,
      retryCount: 0,
      isRetrying: false,
      retryCountdown: 0,
    });

    // Track reset event
    if (errorMetadata && config?.enableAnalytics) {
      this.trackAnalyticsEvent({
        type: 'component-error-reset',
        componentName: errorMetadata.componentName,
        errorType: errorMetadata.errorType,
        severity: errorMetadata.severity,
        fallbackMode:
          config.fallbackMode ?? DEFAULT_COMPONENT_ERROR_CONFIG.fallbackMode,
        retryCount: this.state.retryCount,
        timestamp: Date.now(),
      });
    }

    // Call custom reset handler
    if (config?.onReset) {
      config.onReset();
    }
  };

  /**
   * Retry rendering the component
   */
  private retry = (): void => {
    const config = this.getConfig();
    const { errorMetadata } = this.state;

    if (this.state.retryCount >= config.maxRetries) {
      console.warn(
        `[ComponentErrorBoundary] Max retries (${config.maxRetries}) reached for ${config.componentName}`
      );
      return;
    }

    // Track retry event
    if (errorMetadata && config.enableAnalytics) {
      this.trackAnalyticsEvent({
        type: 'component-error-retry',
        componentName: errorMetadata.componentName,
        errorType: errorMetadata.errorType,
        severity: errorMetadata.severity,
        fallbackMode: config.fallbackMode,
        retryCount: this.state.retryCount + 1,
        timestamp: Date.now(),
      });
    }

    this.setState(
      {
        retryCount: this.state.retryCount + 1,
        isRetrying: true,
      },
      () => {
        // Reset error boundary after a brief delay
        setTimeout(() => {
          this.resetErrorBoundary();
        }, 100);
      }
    );
  };

  /**
   * Schedule automatic retry with exponential backoff
   */
  private scheduleRetry(): void {
    const config = this.getConfig();
    const delay = calculateRetryDelay(config.retryDelay, this.state.retryCount);

    this.setState({
      retryCountdown: Math.ceil(delay / 1000),
    });

    // Start countdown
    this.countdownIntervalId = setInterval(() => {
      this.setState(prevState => {
        const newCountdown = prevState.retryCountdown - 1;
        if (newCountdown <= 0) {
          this.clearCountdownInterval();
        }
        return { retryCountdown: newCountdown };
      });
    }, 1000);

    // Schedule retry
    this.retryTimeoutId = setTimeout(() => {
      this.retry();
    }, delay);
  }

  /**
   * Clear retry timeout
   */
  private clearRetryTimeout(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  /**
   * Clear countdown interval
   */
  private clearCountdownInterval(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  /**
   * Render fallback UI
   */
  private renderFallback(): React.ReactNode {
    const { fallback, fallbackRender, className } = this.props;
    const { error, errorMetadata, isRetrying } = this.state;
    const config = this.getConfig();

    if (!error || !errorMetadata) {
      return null;
    }

    const fallbackProps: ComponentErrorFallbackProps = {
      error,
      metadata: errorMetadata,
      fallbackMode: config.fallbackMode,
      resetErrorBoundary: this.resetErrorBoundary,
      retry: this.retry,
      config,
      isRetrying,
      className,
    };

    // Use custom fallback component
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...fallbackProps} />;
    }

    // Use custom fallback render function
    if (fallbackRender) {
      return fallbackRender(fallbackProps);
    }

    // Use default fallback
    return <DefaultComponentErrorFallback {...fallbackProps} />;
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { hasError } = this.state;
    const config = this.getConfig();

    // Validate props if validator provided
    if (config && this.props.config?.validateProps) {
      const validation = validateComponentProps(
        this.props,
        this.props.config.validateProps
      );

      if (!validation.valid) {
        console.warn(
          '[ComponentErrorBoundary] Props validation failed for component:',
          config.componentName,
          validation.message
        );
      }
    }

    if (hasError) {
      return this.renderFallback();
    }

    return children;
  }
}

/**
 * Default Component Error Fallback
 */
const DefaultComponentErrorFallback: React.FC<ComponentErrorFallbackProps> = ({
  error,
  metadata,
  fallbackMode,
  resetErrorBoundary,
  retry,
  config,
  isRetrying,
  className,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  // Hidden mode
  if (fallbackMode === FallbackMode.HIDDEN) {
    return null;
  }

  // Skeleton mode
  if (fallbackMode === FallbackMode.SKELETON) {
    return (
      <ComponentErrorSkeleton
        variant={config.skeletonConfig?.variant}
        animation={config.skeletonConfig?.animation}
        height={config.skeletonConfig?.height}
        width={config.skeletonConfig?.width}
        className={className}
      />
    );
  }

  // Placeholder mode
  if (fallbackMode === FallbackMode.PLACEHOLDER) {
    return (
      <ComponentErrorPlaceholder
        icon={config.placeholderConfig?.icon}
        title={
          config.placeholderConfig?.title ??
          getUserFriendlyErrorMessage(
            metadata.errorType,
            metadata.componentName
          )
        }
        description={config.placeholderConfig?.description}
        showRetry={config.placeholderConfig?.showRetry ?? metadata.retryable}
        onRetry={retry}
        isRetrying={isRetrying}
        className={className}
      />
    );
  }

  // Minimal mode
  if (fallbackMode === FallbackMode.MINIMAL) {
    return (
      <ComponentErrorMinimal
        metadata={metadata}
        onRetry={retry}
        isRetrying={isRetrying}
        retryable={
          metadata.retryable && config.maxRetries > metadata.retryCount
        }
        className={className}
      />
    );
  }

  // Detailed mode
  return (
    <ComponentErrorDetailed
      error={error}
      metadata={metadata}
      onRetry={retry}
      onReset={resetErrorBoundary}
      isRetrying={isRetrying}
      retryable={metadata.retryable && config.maxRetries > metadata.retryCount}
      showDetails={showDetails}
      onToggleDetails={() => setShowDetails(!showDetails)}
      className={className}
    />
  );
};

/**
 * Skeleton Fallback
 */
interface ComponentErrorSkeletonProps {
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  height?: string;
  width?: string;
  className?: string;
}

const ComponentErrorSkeleton: React.FC<ComponentErrorSkeletonProps> = ({
  variant = 'rectangular',
  animation = 'pulse',
  height = '80px',
  width = '100%',
  className,
}) => {
  return (
    <div
      className={cn(
        componentErrorSkeletonVariants({ variant, animation }),
        height && `[height:${height}]`,
        width && `[width:${width}]`,
        className
      )}
      aria-label="Loading..."
    />
  );
};

/**
 * Placeholder Fallback
 */
interface ComponentErrorPlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  showRetry?: boolean;
  onRetry: () => void;
  isRetrying: boolean;
  className?: string;
}

const ComponentErrorPlaceholder: React.FC<ComponentErrorPlaceholderProps> = ({
  icon,
  title,
  description,
  showRetry = false,
  onRetry,
  isRetrying,
  className,
}) => {
  return (
    <div
      className={cn(
        componentErrorPlaceholderVariants({ size: 'md' }),
        className
      )}
    >
      {icon && (
        <div className={componentErrorPlaceholderIconVariants({ size: 'md' })}>
          {icon}
        </div>
      )}
      <div className={componentErrorPlaceholderTitleVariants({ size: 'md' })}>
        {title}
      </div>
      {description && (
        <div
          className={componentErrorPlaceholderDescriptionVariants({
            size: 'md',
          })}
        >
          {description}
        </div>
      )}
      {showRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className={componentErrorButtonVariants({
            intent: 'secondary',
            size: 'sm',
          })}
          aria-label="Retry"
        >
          <RefreshCw className={cn('h-3 w-3', isRetrying && 'animate-spin')} />
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
      )}
    </div>
  );
};

/**
 * Minimal Fallback
 */
interface ComponentErrorMinimalProps {
  metadata: ComponentErrorMetadata;
  onRetry: () => void;
  isRetrying: boolean;
  retryable: boolean;
  className?: string;
}

const ComponentErrorMinimal: React.FC<ComponentErrorMinimalProps> = ({
  metadata,
  onRetry,
  isRetrying,
  retryable,
  className,
}) => {
  const Icon = getSeverityIcon(metadata.severity);

  return (
    <div
      className={cn(
        componentErrorBoundaryVariants({
          fallbackMode: FallbackMode.MINIMAL,
          severity: metadata.severity,
        }),
        className
      )}
    >
      <div
        className={componentErrorMinimalVariants({
          severity: metadata.severity,
        })}
      >
        <Icon
          className={componentErrorIconVariants({
            severity: metadata.severity,
            size: 'sm',
          })}
        />
        <span>
          {getUserFriendlyErrorMessage(
            metadata.errorType,
            metadata.componentName
          )}
        </span>
        {retryable && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className={componentErrorButtonVariants({
              intent: 'ghost',
              size: 'sm',
            })}
            aria-label="Retry"
          >
            <RefreshCw
              className={cn('h-3 w-3', isRetrying && 'animate-spin')}
            />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Detailed Fallback
 */
interface ComponentErrorDetailedProps {
  error: Error;
  metadata: ComponentErrorMetadata;
  onRetry: () => void;
  onReset: () => void;
  isRetrying: boolean;
  retryable: boolean;
  showDetails: boolean;
  onToggleDetails: () => void;
  className?: string;
}

const ComponentErrorDetailed: React.FC<ComponentErrorDetailedProps> = ({
  error,
  metadata,
  onRetry,
  onReset,
  isRetrying,
  retryable,
  showDetails,
  onToggleDetails,
  className,
}) => {
  const Icon = getSeverityIcon(metadata.severity);

  return (
    <div
      className={cn(
        componentErrorBoundaryVariants({
          fallbackMode: FallbackMode.DETAILED,
          severity: metadata.severity,
        }),
        className
      )}
    >
      <div
        className={componentErrorDetailedVariants({
          severity: metadata.severity,
        })}
      >
        {/* Header */}
        <div
          className={componentErrorHeaderVariants({
            severity: metadata.severity,
          })}
        >
          <div className="flex items-center gap-2">
            <Icon
              className={componentErrorIconVariants({
                severity: metadata.severity,
                size: 'md',
              })}
            />
            <h3
              className={componentErrorTitleVariants({
                severity: metadata.severity,
                size: 'md',
              })}
            >
              {getUserFriendlyErrorMessage(
                metadata.errorType,
                metadata.componentName
              )}
            </h3>
          </div>
          <div
            className={componentErrorBadgeVariants({
              severity: metadata.severity,
            })}
          >
            {metadata.severity}
          </div>
        </div>

        {/* Description */}
        <p
          className={componentErrorDescriptionVariants({
            severity: metadata.severity,
            size: 'sm',
          })}
        >
          {error.message}
        </p>

        {/* Actions */}
        <div
          className={componentErrorActionsVariants({
            layout: 'horizontal',
            size: 'sm',
          })}
        >
          {retryable && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className={componentErrorButtonVariants({
                intent: 'primary',
                size: 'sm',
              })}
              aria-label="Retry"
            >
              <RefreshCw
                className={cn('h-3 w-3', isRetrying && 'animate-spin')}
              />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          )}
          <button
            onClick={onReset}
            className={componentErrorButtonVariants({
              intent: 'secondary',
              size: 'sm',
            })}
            aria-label="Reset"
          >
            Reset
          </button>
          <button
            onClick={onToggleDetails}
            className={componentErrorButtonVariants({
              intent: 'ghost',
              size: 'sm',
            })}
            aria-label={showDetails ? 'Hide details' : 'Show details'}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Show Details
              </>
            )}
          </button>
        </div>

        {/* Details Panel */}
        {showDetails && (
          <div
            className={componentErrorDetailsVariants({
              severity: metadata.severity,
            })}
          >
            <div
              className={componentErrorDetailsTitleVariants({
                severity: metadata.severity,
              })}
            >
              Error Details
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Type:
                </div>
                <div
                  className={componentErrorDetailsTextVariants({
                    severity: metadata.severity,
                  })}
                >
                  {metadata.errorType}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Component:
                </div>
                <div
                  className={componentErrorDetailsTextVariants({
                    severity: metadata.severity,
                  })}
                >
                  {metadata.componentName}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Message:
                </div>
                <div
                  className={componentErrorDetailsTextVariants({
                    severity: metadata.severity,
                  })}
                >
                  {error.message}
                </div>
              </div>
              {metadata.stack && (
                <div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Stack:
                  </div>
                  <pre
                    className={cn(
                      componentErrorDetailsTextVariants({
                        severity: metadata.severity,
                      }),
                      'break-words whitespace-pre-wrap'
                    )}
                  >
                    {metadata.stack}
                  </pre>
                </div>
              )}
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Fingerprint:
                </div>
                <div
                  className={componentErrorDetailsTextVariants({
                    severity: metadata.severity,
                  })}
                >
                  {metadata.fingerprint}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Get icon for severity level
 */
const getSeverityIcon = (severity: ComponentErrorSeverity) => {
  switch (severity) {
    case ComponentErrorSeverity.CRITICAL:
      return XCircle;
    case ComponentErrorSeverity.ERROR:
      return AlertCircle;
    case ComponentErrorSeverity.WARNING:
      return AlertTriangle;
    case ComponentErrorSeverity.INFO:
      return Info;
    default:
      return AlertCircle;
  }
};

/**
 * Main ComponentErrorBoundary export
 */
export const ComponentErrorBoundary: React.FC<
  ComponentErrorBoundaryProps
> = props => {
  return <ComponentErrorBoundaryClass {...props} />;
};
