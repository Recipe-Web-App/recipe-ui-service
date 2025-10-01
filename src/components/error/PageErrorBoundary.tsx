'use client';

/**
 * PageErrorBoundary Component
 *
 * A specialized error boundary for handling full-page errors with HTTP status awareness,
 * SEO optimization, and intelligent recovery strategies.
 *
 * Features:
 * - HTTP status code detection (404, 403, 500, 503, etc.)
 * - SEO-friendly error pages with proper meta tags
 * - Context-aware recovery actions
 * - Analytics/monitoring integration
 * - Responsive design with dark mode support
 *
 * @example
 * ```tsx
 * <PageErrorBoundary config={{ homeUrl: '/', enableSeo: true }}>
 *   <YourPageContent />
 * </PageErrorBoundary>
 * ```
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  ArrowLeft,
  RefreshCw,
  RotateCw,
  LogIn,
  Mail,
  Activity,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ServerCrash,
  WifiOff,
  Construction,
  Clock,
  FileX,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  pageErrorBoundaryVariants,
  pageErrorContentVariants,
  pageErrorStatusCodeVariants,
  pageErrorTitleVariants,
  pageErrorDescriptionVariants,
  pageErrorIconVariants,
  pageErrorActionsVariants,
  pageErrorButtonVariants,
  pageErrorDetailsVariants,
  pageErrorDetailsTitleVariants,
  pageErrorDetailsTextVariants,
  retryCountdownVariants,
} from '@/lib/ui/page-error-boundary-variants';
import {
  generatePageErrorMetadata,
  getRecoveryActions,
  formatErrorDetails,
  getErrorPageTitle,
  shouldTrackError,
} from '@/lib/error/page-error-utils';
import {
  PageErrorType,
  RecoveryActionType,
  HttpStatusCode,
  DEFAULT_PAGE_ERROR_CONFIG,
  type PageErrorBoundaryProps,
  type PageErrorBoundaryConfig,
  type PageErrorMetadata,
  type RecoveryAction,
  type PageErrorAnalyticsEvent,
} from '@/types/error/page-errors';

/**
 * Error icon mapping
 */
const ERROR_TYPE_ICONS: Record<PageErrorType, React.ComponentType> = {
  [PageErrorType.NOT_FOUND]: FileX,
  [PageErrorType.UNAUTHORIZED]: ShieldAlert,
  [PageErrorType.FORBIDDEN]: XCircle,
  [PageErrorType.SERVER_ERROR]: ServerCrash,
  [PageErrorType.SERVICE_UNAVAILABLE]: WifiOff,
  [PageErrorType.MAINTENANCE]: Construction,
  [PageErrorType.TIMEOUT]: Clock,
  [PageErrorType.GONE]: FileX,
  [PageErrorType.BAD_REQUEST]: AlertCircle,
  [PageErrorType.UNKNOWN]: AlertTriangle,
};

/**
 * Recovery action icon mapping
 */
const RECOVERY_ACTION_ICON_MAP: Record<
  RecoveryActionType,
  React.ComponentType
> = {
  [RecoveryActionType.GO_HOME]: Home,
  [RecoveryActionType.GO_BACK]: ArrowLeft,
  [RecoveryActionType.RETRY]: RefreshCw,
  [RecoveryActionType.REFRESH]: RotateCw,
  [RecoveryActionType.LOGIN]: LogIn,
  [RecoveryActionType.CONTACT_SUPPORT]: Mail,
  [RecoveryActionType.VIEW_STATUS]: Activity,
};

/**
 * Page error boundary state
 */
interface PageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorMetadata: PageErrorMetadata | null;
  retryCount: number;
  isRetrying: boolean;
  showDetails: boolean;
  retryCountdown: number;
}

/**
 * Default error fallback component
 */
const DefaultPageErrorFallback: React.FC<{
  error: Error;
  metadata: PageErrorMetadata;
  recoveryActions: RecoveryAction[];
  resetErrorBoundary: () => void;
  config: Required<
    Omit<
      PageErrorBoundaryConfig,
      | 'customRecoveryActions'
      | 'customTemplates'
      | 'onAnalyticsEvent'
      | 'onError'
    >
  >;
  state: PageErrorBoundaryState;
  onToggleDetails: () => void;
}> = ({
  error,
  metadata,
  recoveryActions,
  resetErrorBoundary,
  state,
  onToggleDetails,
}) => {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRecoveryAction = React.useCallback(
    (action: RecoveryAction) => {
      switch (action.type) {
        case RecoveryActionType.RETRY:
          setIsRetrying(true);
          setTimeout(() => {
            setIsRetrying(false);
            resetErrorBoundary();
          }, 500);
          break;

        case RecoveryActionType.REFRESH:
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
          break;

        case RecoveryActionType.GO_BACK:
          router.back();
          break;

        case RecoveryActionType.GO_HOME:
        case RecoveryActionType.LOGIN:
        case RecoveryActionType.CONTACT_SUPPORT:
        case RecoveryActionType.VIEW_STATUS:
          if (action.url) {
            router.push(action.url);
          }
          break;

        default:
          if (action.handler) {
            action.handler();
          }
      }
    },
    [resetErrorBoundary, router]
  );

  const getActionIcon = (actionType: RecoveryActionType): React.ReactNode => {
    // eslint-disable-next-line security/detect-object-injection
    const IconComponent = RECOVERY_ACTION_ICON_MAP[
      actionType
    ] as React.ComponentType<{ className?: string }>;
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div
      className={cn(
        pageErrorBoundaryVariants({ errorType: metadata.errorType })
      )}
    >
      <div className={cn(pageErrorContentVariants({ animated: true }))}>
        {/* Status Code */}
        <div
          className={cn(
            pageErrorStatusCodeVariants({
              errorType: metadata.errorType,
              size: 'md',
            })
          )}
          aria-hidden="true"
        >
          {metadata.statusCode}
        </div>

        {/* Icon */}
        <div
          className={cn(
            pageErrorIconVariants({ errorType: metadata.errorType, size: 'md' })
          )}
        >
          {(() => {
            const IconComponent = ERROR_TYPE_ICONS[
              metadata.errorType
            ] as React.ComponentType<{ className?: string }>;
            return <IconComponent className="h-full w-full" />;
          })()}
        </div>

        {/* Title */}
        <h1
          className={cn(
            pageErrorTitleVariants({
              errorType: metadata.errorType,
              size: 'md',
            })
          )}
        >
          {metadata.title}
        </h1>

        {/* Description */}
        <p
          className={cn(
            pageErrorDescriptionVariants({
              errorType: metadata.errorType,
              size: 'md',
            })
          )}
        >
          {metadata.description}
        </p>

        {/* Retry Countdown */}
        {state.retryCountdown > 0 && (
          <div
            className={cn(
              retryCountdownVariants({ errorType: metadata.errorType })
            )}
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Retrying in {state.retryCountdown} seconds...</span>
          </div>
        )}

        {/* Recovery Actions */}
        <div className={cn(pageErrorActionsVariants({ layout: 'horizontal' }))}>
          {recoveryActions.map(action => (
            <button
              key={action.type}
              onClick={() => handleRecoveryAction(action)}
              disabled={action.disabled ?? isRetrying}
              className={cn(
                pageErrorButtonVariants({
                  intent: action.isPrimary ? 'primary' : 'secondary',
                  size: 'md',
                })
              )}
            >
              {getActionIcon(action.type)}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Error Details Toggle */}
        <button
          onClick={onToggleDetails}
          className={cn(
            pageErrorButtonVariants({
              intent: 'ghost',
              size: 'sm',
            })
          )}
        >
          {state.showDetails ? 'Hide' : 'Show'} Details
        </button>

        {/* Error Details */}
        {state.showDetails && (
          <div
            className={cn(
              pageErrorDetailsVariants({ errorType: metadata.errorType })
            )}
          >
            <h3
              className={cn(
                pageErrorDetailsTitleVariants({
                  errorType: metadata.errorType,
                })
              )}
            >
              Error Details
            </h3>
            <pre
              className={cn(
                pageErrorDetailsTextVariants({
                  errorType: metadata.errorType,
                }),
                'break-words whitespace-pre-wrap'
              )}
            >
              {formatErrorDetails(error)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Page error boundary class component
 */
class PageErrorBoundaryClass extends React.Component<
  PageErrorBoundaryProps & { children: React.ReactNode },
  PageErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private countdownIntervalId: NodeJS.Timeout | null = null;

  constructor(props: PageErrorBoundaryProps & { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorMetadata: null,
      retryCount: 0,
      isRetrying: false,
      showDetails: false,
      retryCountdown: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<PageErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const config = { ...DEFAULT_PAGE_ERROR_CONFIG, ...this.props.config };

    // Generate error metadata
    const metadata = generatePageErrorMetadata(error, {
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
    });

    this.setState({ errorMetadata: metadata });

    // Call custom error handler
    if (config.onError) {
      config.onError(error, errorInfo);
    }

    // Track error in analytics
    if (config.enableAnalytics && shouldTrackError(metadata.errorType)) {
      this.trackAnalyticsEvent({
        type: 'error-displayed',
        errorType: metadata.errorType,
        statusCode: metadata.statusCode,
        timestamp: Date.now(),
      });
    }

    // Update document title for SEO
    if (config.enableSeo && typeof document !== 'undefined') {
      document.title = getErrorPageTitle(metadata.errorType);
    }

    // Auto retry if enabled and error is retryable
    if (
      config.enableAutoRetry &&
      metadata.retryable &&
      this.state.retryCount < config.maxRetries
    ) {
      this.scheduleRetry(config.retryDelay);
    }
  }

  componentWillUnmount(): void {
    this.clearRetryTimeout();
    this.clearCountdownInterval();
  }

  private scheduleRetry(delay: number): void {
    this.setState({
      isRetrying: true,
      retryCountdown: Math.ceil(delay / 1000),
    });

    // Start countdown
    this.countdownIntervalId = setInterval(() => {
      this.setState(prevState => {
        const newCountdown = prevState.retryCountdown - 1;
        if (newCountdown <= 0) {
          this.clearCountdownInterval();
        }
        return { retryCountdown: Math.max(0, newCountdown) };
      });
    }, 1000);

    // Schedule retry
    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1,
      }));

      // Track retry attempt
      this.trackAnalyticsEvent({
        type: 'error-retry',
        errorType: this.state.errorMetadata?.errorType ?? PageErrorType.UNKNOWN,
        statusCode:
          this.state.errorMetadata?.statusCode ??
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        retryCount: this.state.retryCount + 1,
        timestamp: Date.now(),
      });

      this.resetErrorBoundary();
    }, delay);
  }

  private clearRetryTimeout(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  private clearCountdownInterval(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  private resetErrorBoundary = (): void => {
    this.clearRetryTimeout();
    this.clearCountdownInterval();

    this.setState({
      hasError: false,
      error: null,
      errorMetadata: null,
      isRetrying: false,
      retryCountdown: 0,
    });

    // Track resolution
    if (this.state.errorMetadata) {
      this.trackAnalyticsEvent({
        type: 'error-resolved',
        errorType: this.state.errorMetadata.errorType,
        statusCode: this.state.errorMetadata.statusCode,
        retryCount: this.state.retryCount,
        timestamp: Date.now(),
      });
    }
  };

  private toggleDetails = (): void => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  private trackAnalyticsEvent(event: PageErrorAnalyticsEvent): void {
    const config = { ...DEFAULT_PAGE_ERROR_CONFIG, ...this.props.config };

    if (config.onAnalyticsEvent) {
      config.onAnalyticsEvent(event);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.info('[PageErrorBoundary] Analytics Event:', event);
    }
  }

  render(): React.ReactNode {
    const { hasError, error, errorMetadata } = this.state;

    if (hasError && error) {
      const config = { ...DEFAULT_PAGE_ERROR_CONFIG, ...this.props.config };

      // Use temporary metadata if not yet set
      const effectiveMetadata: PageErrorMetadata =
        errorMetadata ?? generatePageErrorMetadata(error);

      // Generate recovery actions
      const recoveryActions = getRecoveryActions(effectiveMetadata.errorType, {
        homeUrl: config.homeUrl,
        loginUrl: config.loginUrl,
        contactUrl: config.contactUrl,
        statusPageUrl: config.statusPageUrl,
      });

      // Use custom template if provided

      const CustomTemplate =
        config.customTemplates?.[effectiveMetadata.errorType];
      if (CustomTemplate) {
        return (
          <CustomTemplate
            error={error}
            metadata={effectiveMetadata}
            recoveryActions={recoveryActions}
            resetErrorBoundary={this.resetErrorBoundary}
            className={this.props.className}
          />
        );
      }

      // Use custom fallback render if provided
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error,
          metadata: effectiveMetadata,
          recoveryActions,
          resetErrorBoundary: this.resetErrorBoundary,
          className: this.props.className,
        });
      }

      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={error}
            metadata={effectiveMetadata}
            recoveryActions={recoveryActions}
            resetErrorBoundary={this.resetErrorBoundary}
            className={this.props.className}
          />
        );
      }

      // Use default fallback
      return (
        <DefaultPageErrorFallback
          error={error}
          metadata={effectiveMetadata}
          recoveryActions={recoveryActions}
          resetErrorBoundary={this.resetErrorBoundary}
          config={config}
          state={this.state}
          onToggleDetails={this.toggleDetails}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Page error boundary component
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = props => {
  return <PageErrorBoundaryClass {...props} />;
};

PageErrorBoundary.displayName = 'PageErrorBoundary';

export default PageErrorBoundary;
